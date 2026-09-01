/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_AUDIT,
  DEMO_CIRCLE,
  DEMO_HEROES,
  DEMO_INCIDENTS,
  DEMO_ORGS,
  DEMO_SERVICES,
  DEMO_TASKS,
  DEMO_TOP,
  DEMO_TX,
  DEMO_USER,
  DEMO_WALLET,
} from "../data/demoData";
import { getHealth, postSignal, postSos, toBackendCategory, toBackendUrgency } from "../services/api";
import { buildIncident, DEMO_FIGHT_TEXT, DEMO_TRIAGE_SUMMARY, sleep, stamp } from "../services/demoService";
import { getOfflineQueue, markQueueSynced, markQueueSyncing, queueOfflineSignal } from "../services/offlineQueue";
import { localTriage } from "../services/triage";
import type {
  ApiMode,
  AuditEvent,
  CommunityOrganization,
  CreditTransaction,
  CreditWallet,
  DemoPhase,
  Hero,
  HeroTask,
  Incident,
  LeaderboardEntry,
  OfflineSignal,
  SafetyCircleMember,
  ServiceProvider,
  ServiceRequest,
  SosKind,
  TaskStatus,
  ToastItem,
  UserProfile,
  ViewId,
} from "../types/fnn";
import { uid } from "../utils/formatters";
import { loadJson, saveJson } from "../utils/storage";

const VIEWS: ViewId[] = [
  "dashboard",
  "signals",
  "spider",
  "heroes",
  "map",
  "sos",
  "community",
  "services",
  "credits",
  "top5",
  "privacy-challenge",
  "disaster",
];

function parseView(): ViewId {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return VIEWS.includes(raw as ViewId) ? (raw as ViewId) : "dashboard";
}

interface Persisted {
  v: 1;
  incidents: Incident[];
  heroes: Hero[];
  tasks: HeroTask[];
  wallet: CreditWallet;
  transactions: CreditTransaction[];
  votes: Record<string, "UP" | "DOWN">;
  offlineQueue: OfflineSignal[];
  disasterMode: boolean;
  forceOffline: boolean;
  audit: AuditEvent[];
  safetyCircle: SafetyCircleMember[];
  serviceRequests: ServiceRequest[];
  lastSyncAt: string;
}

function seed(): Persisted {
  return {
    v: 1,
    incidents: DEMO_INCIDENTS,
    heroes: DEMO_HEROES,
    tasks: DEMO_TASKS,
    wallet: DEMO_WALLET,
    transactions: DEMO_TX,
    votes: {},
    offlineQueue: [],
    disasterMode: false,
    forceOffline: false,
    audit: DEMO_AUDIT,
    safetyCircle: DEMO_CIRCLE,
    serviceRequests: [],
    lastSyncAt: new Date().toISOString(),
  };
}

interface FnnValue {
  view: ViewId;
  setView: (v: ViewId) => void;
  user: UserProfile;
  wallet: CreditWallet;
  transactions: CreditTransaction[];
  incidents: Incident[];
  heroes: Hero[];
  tasks: HeroTask[];
  organizations: CommunityOrganization[];
  services: ServiceProvider[];
  leaderboard: LeaderboardEntry[];
  safetyCircle: SafetyCircleMember[];
  audit: AuditEvent[];
  votes: Record<string, "UP" | "DOWN">;
  offlineQueue: OfflineSignal[];
  serviceRequests: ServiceRequest[];
  apiMode: ApiMode;
  online: boolean;
  disasterMode: boolean;
  forceOffline: boolean;
  lastSyncAt: string;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
  toast: (message: string, kind?: ToastItem["kind"]) => void;
  selectedId: string | null;
  openIncident: (id: string) => void;
  closeIncident: () => void;
  submitSignal: (description: string, category: Incident["category"], severity: Incident["severity"], urgency: Incident["urgency"], area: string, stake: number, mediaNote?: string) => Promise<Incident>;
  vote: (id: string, direction: "UP" | "DOWN") => void;
  findHero: (incidentId: string, preferredHeroId?: string) => Hero | null;
  acceptTask: (taskId: string) => void;
  advanceTask: (taskId: string, status: TaskStatus) => void;
  resolveTask: (taskId: string) => void;
  escalate: (incidentId: string) => void;
  activateSos: (kind: SosKind) => Incident;
  simulateLiveSignal: () => void;
  toggleDisaster: (on: boolean) => void;
  setForceOffline: (on: boolean) => void;
  restoreAndSync: () => Promise<void>;
  requestHelp: (providerId: string) => void;
  communityAction: (orgId: string, action: string) => void;
  demoPhase: DemoPhase;
  demoManual: boolean;
  demoBusy: boolean;
  runFullDemo: (manual?: boolean) => void;
  runSosDemo: () => void;
  demoNext: () => void;
  closeDemo: () => void;
  syncing: boolean;
}

const FnnContext = createContext<FnnValue | null>(null);

export function FnnProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => {
    const loaded = loadJson<Persisted | null>(null);
    return loaded && loaded.v === 1 ? loaded : seed();
  }, []);

  const [view, setViewState] = useState<ViewId>(parseView);
  const [incidents, setIncidents] = useState<Incident[]>(initial.incidents);
  const [heroes, setHeroes] = useState<Hero[]>(initial.heroes);
  const [tasks, setTasks] = useState<HeroTask[]>(initial.tasks);
  const [wallet, setWallet] = useState<CreditWallet>(initial.wallet);
  const [transactions, setTransactions] = useState<CreditTransaction[]>(initial.transactions);
  const [votes, setVotes] = useState<Record<string, "UP" | "DOWN">>(initial.votes);
  const [offlineQueue, setOfflineQueue] = useState<OfflineSignal[]>(initial.offlineQueue);
  const [disasterMode, setDisasterMode] = useState(initial.disasterMode);
  const [forceOffline, setForceOfflineState] = useState(initial.forceOffline);
  const [audit, setAudit] = useState<AuditEvent[]>(initial.audit);
  const [safetyCircle, setSafetyCircle] = useState<SafetyCircleMember[]>(initial.safetyCircle);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(initial.serviceRequests);
  const [lastSyncAt, setLastSyncAt] = useState(initial.lastSyncAt);
  const [apiMode, setApiMode] = useState<ApiMode>("LOCAL_DEMO");
  const [browserOnline, setBrowserOnline] = useState(navigator.onLine);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [demoPhase, setDemoPhase] = useState<DemoPhase>("idle");
  const [demoManual, setDemoManual] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const demoToken = useRef(0);
  const persistSkip = useRef(true);

  const online = browserOnline && !forceOffline;

  const toast = useCallback((message: string, kind: ToastItem["kind"] = "info") => {
    const id = uid("toast");
    setToasts((t) => [...t.slice(-4), { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const setView = useCallback((v: ViewId) => {
    setViewState(v);
    window.location.hash = `/${v}`;
  }, []);

  useEffect(() => {
    const onHash = () => setViewState(parseView());
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "/dashboard";
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const on = () => setBrowserOnline(true);
    const off = () => setBrowserOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getHealth().then((ok: boolean) => {
      if (!cancelled) setApiMode(ok ? "LIVE" : "LOCAL_DEMO");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (persistSkip.current) {
      persistSkip.current = false;
      return;
    }
    const payload: Persisted = {
      v: 1,
      incidents,
      heroes,
      tasks,
      wallet,
      transactions,
      votes,
      offlineQueue,
      disasterMode,
      forceOffline,
      audit,
      safetyCircle,
      serviceRequests,
      lastSyncAt,
    };
    saveJson(payload);
  }, [
    incidents,
    heroes,
    tasks,
    wallet,
    transactions,
    votes,
    offlineQueue,
    disasterMode,
    forceOffline,
    audit,
    safetyCircle,
    serviceRequests,
    lastSyncAt,
  ]);

  const addAudit = useCallback((label: string, detail: string, sensitive = false) => {
    setAudit((a) => [
      { id: uid("aud"), at: new Date().toISOString(), label, detail, sensitive },
      ...a,
    ]);
  }, []);

  const submitSignal = useCallback(
    async (
      description: string,
      category: Incident["category"],
      severity: Incident["severity"],
      urgency: Incident["urgency"],
      area: string,
      stake: number,
      mediaNote?: string,
    ) => {
      const input = { description, category, severity, urgency, approximateArea: area, stakeAmount: stake, mediaNote };
      if (!online) {
        const queued: OfflineSignal = {
          id: uid("off"),
          description,
          category,
          severity,
          urgency,
          approximateArea: area,
          stakeAmount: stake,
          createdAt: new Date().toISOString(),
          status: "QUEUED",
        };
        setOfflineQueue((q) => queueOfflineSignal(q, queued));
        const triage = localTriage(input);
        const incident = buildIncident(input, triage, { queuedOffline: true, status: "QUEUED" });
        setIncidents((list) => [incident, ...list]);
        toast("Signal queued locally. It will sync when connectivity returns.", "warn");
        return incident;
      }

      const triage = localTriage(input);
      let incident = buildIncident(input, triage);

      if (apiMode === "LIVE") {
        try {
          const remote = await postSignal({
            description,
            category: toBackendCategory(category),
            latitude: 12.8406,
            longitude: 80.153,
            severity,
            urgency: toBackendUrgency(urgency),
            stakeAmount: stake,
          });
          incident = { ...incident, id: remote.id, triageSource: "live" };
        } catch {
          incident = { ...incident, triageSource: "local" };
        }
      }

      setIncidents((list) => [incident, ...list]);
      if (stake > 0) {
        setWallet((w) => ({
          available: Math.max(0, w.available - stake),
          locked: w.locked + stake,
          total: w.total,
        }));
        setTransactions((tx) => [
          {
            id: uid("tx"),
            amount: -stake,
            label: "Stake locked on signal",
            type: "STAKE",
            createdAt: new Date().toISOString(),
            signalId: incident.id,
          },
          ...tx,
        ]);
      }
      toast("Spider Signal submitted", "success");
      toast("AI triage complete", "info");
      toast("Privacy shield activated", "info");
      return incident;
    },
    [apiMode, online, toast],
  );

  const vote = useCallback(
    (id: string, direction: "UP" | "DOWN") => {
      if (votes[id]) {
        toast("You already verified this signal.", "warn");
        return;
      }
      setVotes((v) => ({ ...v, [id]: direction }));
      setIncidents((list) =>
        list.map((inc) => {
          if (inc.id !== id) return inc;
          const up = inc.upvotes + (direction === "UP" ? 1 : 0);
          const down = inc.downvotes + (direction === "DOWN" ? 1 : 0);
          const nextStatus = direction === "UP" && inc.status === "VERIFYING" ? "VERIFIED" : inc.status;
          return { ...inc, upvotes: up, downvotes: down, status: nextStatus, updatedAt: new Date().toISOString() };
        }),
      );
      if (direction === "UP") {
        setWallet((w) => ({ ...w, available: w.available + 10, total: w.total + 10 }));
        setTransactions((tx) => [
          { id: uid("tx"), amount: 10, label: "Verified community vote", type: "REWARD", createdAt: new Date().toISOString(), signalId: id },
          ...tx,
        ]);
        toast("Signal verified", "success");
      } else {
        toast("Signal rejected locally", "warn");
      }
    },
    [toast, votes],
  );

  const findHero = useCallback(
    (incidentId: string, preferredHeroId?: string) => {
      const hero =
        heroes.find((h) => h.id === preferredHeroId) ??
        heroes.filter((h) => h.available).sort((a, b) => a.distanceMeters - b.distanceMeters)[0];
      if (!hero) {
        toast("No nearby Hero is available.", "warn");
        return null;
      }
      const taskId = uid("task");
      const now = new Date().toISOString();
      setTasks((t) => [
        { id: taskId, incidentId, heroId: hero.id, status: "ASSIGNED", createdAt: now, updatedAt: now },
        ...t,
      ]);
      setIncidents((list) =>
        list.map((inc) =>
          inc.id === incidentId
            ? {
                ...inc,
                status: "ASSIGNED",
                matchedHeroId: hero.id,
                matchedTaskId: taskId,
                updatedAt: now,
                timeline: [...inc.timeline, stamp("HERO MATCHED")],
              }
            : inc,
        ),
      );
      setHeroes((hs) => hs.map((h) => (h.id === hero.id ? { ...h, workload: h.workload + 1 } : h)));
      toast("Hero matched", "success");
      return hero;
    },
    [heroes, toast],
  );

  const acceptTask = useCallback(
    (taskId: string) => {
      const now = new Date().toISOString();
      setTasks((t) => t.map((task) => (task.id === taskId ? { ...task, status: "ACCEPTED", updatedAt: now } : task)));
      setIncidents((list) =>
        list.map((inc) => (inc.matchedTaskId === taskId ? { ...inc, status: "ACCEPTED", updatedAt: now } : inc)),
      );
      toast("Task accepted", "success");
    },
    [toast],
  );

  const advanceTask = useCallback((taskId: string, status: TaskStatus) => {
    const now = new Date().toISOString();
    setTasks((t) => t.map((task) => (task.id === taskId ? { ...task, status, updatedAt: now } : task)));
    setIncidents((list) =>
      list.map((inc) => {
        if (inc.matchedTaskId !== taskId) return inc;
        const label = status === "RESPONDING" ? stamp("RESPONDING") : status === "ARRIVED" ? stamp("ARRIVED") : undefined;
        return {
          ...inc,
          status,
          updatedAt: now,
          timeline: label ? [...inc.timeline, label] : inc.timeline,
        };
      }),
    );
  }, []);

  const resolveTask = useCallback(
    (taskId: string) => {
      const now = new Date().toISOString();
      const task = tasks.find((t) => t.id === taskId);
      setTasks((t) => t.map((item) => (item.id === taskId ? { ...item, status: "RESOLVED", updatedAt: now } : item)));
      setIncidents((list) =>
        list.map((inc) => {
          if (inc.matchedTaskId !== taskId) return inc;
          return {
            ...inc,
            status: "RESOLVED",
            updatedAt: now,
            stakeReleased: true,
            timeline: [...inc.timeline, stamp("RESOLVED")],
          };
        }),
      );
      const inc = incidents.find((i) => i.matchedTaskId === taskId);
      if (inc && !inc.stakeReleased && inc.stakeAmount > 0) {
        setWallet((w) => ({
          available: w.available + inc.stakeAmount + 15,
          locked: Math.max(0, w.locked - inc.stakeAmount),
          total: w.total + 15,
        }));
      } else {
        setWallet((w) => ({ ...w, available: w.available + 15, total: w.total + 15 }));
      }
      setTransactions((tx) => [
        { id: uid("tx"), amount: 15, label: "Problem resolved", type: "REWARD", createdAt: now, signalId: task?.incidentId },
        ...(inc && inc.stakeAmount > 0
          ? [{ id: uid("tx"), amount: inc.stakeAmount, label: "Reporter stake released", type: "RELEASE" as const, createdAt: now, signalId: inc.id }]
          : []),
        ...tx,
      ]);
      toast("Incident resolved", "success");
      toast("+15 Community Credits", "success");
    },
    [incidents, tasks, toast],
  );

  const escalate = useCallback(
    (incidentId: string) => {
      const now = new Date().toISOString();
      setIncidents((list) =>
        list.map((inc) =>
          inc.id === incidentId
            ? {
                ...inc,
                status: "ESCALATED",
                updatedAt: now,
                timeline: [...inc.timeline, stamp("CONTROLLED AUTHORITY ESCALATION"), stamp("MOCK_AUTHORITY"), stamp("SENT")],
              }
            : inc,
        ),
      );
      addAudit("Controlled authority escalation created", "MOCK_AUTHORITY destination. Controlled demo workflow.", true);
      addAudit("MOCK_AUTHORITY received event", "Demo escalation recorded. No real dispatch.", true);
      toast("Controlled demo escalation recorded", "warn");
    },
    [addAudit, toast],
  );

  const activateSos = useCallback(
    (kind: SosKind) => {
      const map: Record<SosKind, { cat: Incident["category"]; desc: string }> = {
        POLICE: { cat: "PERSONAL SAFETY", desc: "SOS: coordinated safety assistance requested (demo)." },
        "WOMEN HELP": { cat: "WOMEN SAFETY", desc: "SOS: women-help coordinated response requested (demo)." },
        "CHILD HELP": { cat: "CHILD SAFETY", desc: "SOS: child-help coordinated response requested (demo)." },
        FIRE: { cat: "DISASTER", desc: "SOS: fire / disaster coordinated response requested (demo)." },
        MEDICAL: { cat: "MEDICAL", desc: "SOS: medical coordinated help requested (demo)." },
        OTHER: { cat: "OTHER", desc: "SOS: immediate coordinated help requested (demo)." },
      };
      const spec = map[kind];
      const triage = localTriage({
        description: spec.desc,
        category: spec.cat,
        severity: "CRITICAL",
        urgency: "IMMEDIATE",
      });
      const now = new Date().toISOString();
      const incident = buildIncident(
        {
          description: spec.desc,
          category: spec.cat,
          severity: "CRITICAL",
          urgency: "IMMEDIATE",
          approximateArea: "Neighborhood Core",
          stakeAmount: 0,
        },
        { ...triage, severity: "CRITICAL", urgency: "IMMEDIATE", category: spec.cat },
        {
          isSos: true,
          status: "ESCALATED",
          timeline: [
            stamp("SOS ACTIVATED"),
            stamp("CRITICAL SIGNAL CREATED"),
            stamp("SAFETY CIRCLE NOTIFIED"),
            stamp("CONTROLLED AUTHORITY ESCALATION"),
            stamp("MOCK_AUTHORITY"),
            stamp("SENT"),
          ],
        },
      );
      incident.severity = "CRITICAL";
      incident.urgency = "IMMEDIATE";
      incident.createdAt = now;
      incident.updatedAt = now;
      setIncidents((list) => [incident, ...list]);
      setSafetyCircle((c) => c.map((m) => ({ ...m, status: "NOTIFIED" })));
      addAudit("SOS created", `${kind} SOS activated in controlled demo workflow.`, true);
      addAudit("Critical signal generated", incident.title, true);
      addAudit("Safety Circle notified", "Family, campus security, and trusted friend notified (demo).", true);
      addAudit("Controlled authority escalation created", "Destination: MOCK_AUTHORITY", true);
      addAudit("MOCK_AUTHORITY received event", "Status SENT. FNN does not perform real emergency dispatch.", true);
      toast("SOS activated", "critical");
      toast("Safety Circle notified", "warn");
      if (apiMode === "LIVE" && online) {
        void postSos(spec.desc).catch(() => undefined);
      }
      return incident;
    },
    [addAudit, apiMode, online, toast],
  );

  const simulateLiveSignal = useCallback(() => {
    const samples = [
      "Unattended bag near library steps, people avoiding the area.",
      "Cyclist down near hostel gate, conscious, requesting first aid.",
      "Streetlight out on the walking path after rain.",
    ];
    const description = samples[Math.floor(Math.random() * samples.length)] ?? samples[0];
    const triage = localTriage({
      description,
      category: "OTHER",
      severity: "MEDIUM",
      urgency: "NORMAL",
    });
    const incident = buildIncident(
      {
        description,
        category: triage.category,
        severity: triage.severity,
        urgency: triage.urgency,
        approximateArea: "Neighborhood Core",
        stakeAmount: 0,
      },
      triage,
    );
    setIncidents((list) => [incident, ...list]);
    toast("New nearby signal received", "info");
  }, [toast]);

  const restoreAndSync = useCallback(async () => {
    setForceOfflineState(false);
    setBrowserOnline(true);
    setSyncing(true);
    toast("Connectivity restored", "success");
    setOfflineQueue((q) => markQueueSyncing(q));
    await sleep(900);
    const pending = getOfflineQueue(offlineQueue);
    setIncidents((list) =>
      list.map((inc) =>
        inc.queuedOffline
          ? {
              ...inc,
              queuedOffline: false,
              synced: true,
              status: inc.status === "QUEUED" ? "TRIAGED" : inc.status,
              timeline: [...inc.timeline, stamp("SYNCED")],
              updatedAt: new Date().toISOString(),
            }
          : inc,
      ),
    );
    setOfflineQueue((q) => markQueueSynced(q));
    setLastSyncAt(new Date().toISOString());
    setSyncing(false);
    if (pending.length) toast("Pending reports synced", "success");
  }, [offlineQueue, toast]);

  const requestHelp = useCallback(
    (providerId: string) => {
      setServiceRequests((r) => [
        { id: uid("req"), providerId, status: "REQUESTED", createdAt: new Date().toISOString() },
        ...r,
      ]);
      toast("Help requested — provider notified in demo mode.", "success");
    },
    [toast],
  );

  const communityAction = useCallback(
    (orgId: string, action: string) => {
      toast(`${action} recorded for community partner.`, "success");
      addAudit("Community action", `${action} · ${orgId}`, false);
    },
    [addAudit, toast],
  );

  const openIncident = useCallback((id: string) => setSelectedId(id), []);
  const closeIncident = useCallback(() => setSelectedId(null), []);

  const closeDemo = useCallback(() => {
    demoToken.current += 1;
    setDemoPhase("idle");
    setDemoBusy(false);
    setDemoManual(false);
  }, []);

  const runFullDemo = useCallback(
    (manual = false) => {
      const token = ++demoToken.current;
      setDemoManual(manual);
      setDemoBusy(true);
      setDemoPhase("signal");
      setView("dashboard");

      const run = async () => {
        const wait = async (ms: number) => {
          if (manual) return;
          await sleep(ms);
        };
        if (demoToken.current !== token) return;
        await wait(1100);
        if (demoToken.current !== token) return;
        setDemoPhase("triage");
        await wait(1800);
        if (demoToken.current !== token) return;
        setDemoPhase("privacy");
        toast("Privacy shield activated", "info");
        await wait(1100);
        if (demoToken.current !== token) return;
        setDemoPhase("verification");
        await wait(1100);
        if (demoToken.current !== token) return;
        setDemoPhase("matching");
        toast("Hero matched", "success");
        await wait(1100);
        if (demoToken.current !== token) return;
        setDemoPhase("task");
        await wait(2200);
        if (demoToken.current !== token) return;
        setDemoPhase("resolution");

        const triage = localTriage({
          description: DEMO_FIGHT_TEXT,
          category: "PERSONAL SAFETY",
          severity: "HIGH",
          urgency: "URGENT",
        });
        const now = new Date().toISOString();
        const incident = buildIncident(
          {
            description: DEMO_FIGHT_TEXT,
            category: "PERSONAL SAFETY",
            severity: "HIGH",
            urgency: "URGENT",
            approximateArea: "Approximate Bus Stand Area",
            stakeAmount: 10,
          },
          { ...triage, confidence: 94, summary: DEMO_TRIAGE_SUMMARY, recommendedResponder: "SAFETY HERO" },
          {
            status: "RESOLVED",
            matchedHeroId: "hero-27",
            stakeReleased: true,
            upvotes: 4,
            timeline: [
              stamp("SIGNAL RECEIVED"),
              stamp("AI TRIAGED"),
              stamp("PRIVACY PROTECTED"),
              stamp("VERIFICATION REQUESTED"),
              stamp("HERO MATCHED"),
              stamp("RESPONDING"),
              stamp("ARRIVED"),
              stamp("RESOLVED"),
            ],
          },
        );
        const taskId = uid("task");
        incident.matchedTaskId = taskId;
        incident.updatedAt = now;
        setIncidents((list) => [incident, ...list]);
        setTasks((t) => [
          { id: taskId, incidentId: incident.id, heroId: "hero-27", status: "RESOLVED", createdAt: now, updatedAt: now },
          ...t,
        ]);
        setWallet((w) => ({
          available: w.available + 15,
          locked: Math.max(0, w.locked - 10),
          total: w.total + 15,
        }));
        setTransactions((tx) => [
          { id: uid("tx"), amount: 15, label: "Problem resolved", type: "REWARD", createdAt: now, signalId: incident.id },
          { id: uid("tx"), amount: 10, label: "Reporter stake released", type: "RELEASE", createdAt: now, signalId: incident.id },
          ...tx,
        ]);
        await wait(900);
        if (demoToken.current !== token) return;
        setDemoPhase("complete");
        setDemoBusy(false);
        toast("Incident resolved", "success");
        toast("+15 credits earned", "success");
      };
      void run();
    },
    [setView, toast],
  );

  const demoNext = useCallback(() => {
    const order: DemoPhase[] = ["signal", "triage", "privacy", "verification", "matching", "task", "resolution", "complete"];
    setDemoPhase((p) => {
      const i = order.indexOf(p);
      const next = order[Math.min(order.length - 1, i + 1)] ?? "complete";
      if (next === "complete" && p !== "complete") {
        const now = new Date().toISOString();
        const triage = localTriage({
          description: DEMO_FIGHT_TEXT,
          category: "PERSONAL SAFETY",
          severity: "HIGH",
          urgency: "URGENT",
        });
        const incident = buildIncident(
          {
            description: DEMO_FIGHT_TEXT,
            category: "PERSONAL SAFETY",
            severity: "HIGH",
            urgency: "URGENT",
            approximateArea: "Approximate Bus Stand Area",
            stakeAmount: 10,
          },
          { ...triage, confidence: 94, summary: DEMO_TRIAGE_SUMMARY },
          {
            status: "RESOLVED",
            matchedHeroId: "hero-27",
            stakeReleased: true,
            timeline: [
              stamp("SIGNAL RECEIVED"),
              stamp("AI TRIAGED"),
              stamp("PRIVACY PROTECTED"),
              stamp("VERIFICATION REQUESTED"),
              stamp("HERO MATCHED"),
              stamp("RESPONDING"),
              stamp("ARRIVED"),
              stamp("RESOLVED"),
            ],
          },
        );
        const taskId = uid("task");
        incident.matchedTaskId = taskId;
        setIncidents((list) => [incident, ...list]);
        setTasks((t) => [
          { id: taskId, incidentId: incident.id, heroId: "hero-27", status: "RESOLVED", createdAt: now, updatedAt: now },
          ...t,
        ]);
        setWallet((w) => ({ ...w, available: w.available + 15, total: w.total + 15 }));
        setDemoBusy(false);
        toast("+15 credits earned", "success");
      }
      return next;
    });
  }, [toast]);

  const runSosDemo = useCallback(() => {
    setView("sos");
    setDemoPhase("sos-critical");
    activateSos("MEDICAL");
  }, [activateSos, setView]);

  const value: FnnValue = {
    view,
    setView,
    user: DEMO_USER,
    wallet,
    transactions,
    incidents,
    heroes,
    tasks,
    organizations: DEMO_ORGS,
    services: DEMO_SERVICES,
    leaderboard: DEMO_TOP,
    safetyCircle,
    audit,
    votes,
    offlineQueue,
    serviceRequests,
    apiMode,
    online,
    disasterMode,
    forceOffline,
    lastSyncAt,
    toasts,
    dismissToast,
    toast,
    selectedId,
    openIncident,
    closeIncident,
    submitSignal,
    vote,
    findHero,
    acceptTask,
    advanceTask,
    resolveTask,
    escalate,
    activateSos,
    simulateLiveSignal,
    toggleDisaster: (on) => setDisasterMode(on),
    setForceOffline: (on) => setForceOfflineState(on),
    restoreAndSync,
    requestHelp,
    communityAction,
    demoPhase,
    demoManual,
    demoBusy,
    runFullDemo,
    runSosDemo,
    demoNext,
    closeDemo,
    syncing,
  };

  return <FnnContext.Provider value={value}>{children}</FnnContext.Provider>;
}

export function useFnn(): FnnValue {
  const ctx = useContext(FnnContext);
  if (!ctx) throw new Error("useFnn must be used within FnnProvider");
  return ctx;
}
