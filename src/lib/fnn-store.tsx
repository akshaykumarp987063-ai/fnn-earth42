"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_SIGNALS, DEMO_USER } from "@/data/mock";
import type {
  HeroTaskStage,
  Signal,
  TriageResult,
  User,
} from "@/types";

const REPORT_STAKE = 10;

type FnnContextValue = {
  user: User | null;
  signals: Signal[];
  radiusOnly: boolean;
  setRadiusOnly: (value: boolean) => void;
  login: (input: { email: string; password: string; pseudonym?: string }) => void;
  signup: (input: { email: string; password: string; pseudonym: string }) => void;
  logout: () => void;
  submitReport: (input: {
    description: string;
    latitude: number;
    longitude: number;
    triage: TriageResult;
  }) => Signal;
  getSignal: (id: string) => Signal | undefined;
  submitProof: (id: string) => void;
  vote: (id: string, direction: "up" | "down") => void;
  heroStage: Record<string, HeroTaskStage>;
  advanceHeroTask: (id: string) => void;
  acceptHeroTask: (id: string) => void;
};

const FnnContext = createContext<FnnContextValue | null>(null);

function triageFromText(description: string): TriageResult {
  const text = description.toLowerCase();
  if (text.includes("fight") || text.includes("assault") || text.includes("harass")) {
    return {
      category: "PERSONAL_SAFETY",
      summary: "Personal safety incident requiring rapid on-ground presence.",
      severity: "CRITICAL",
      urgency: "IMMEDIATE",
      confidence: 0.91,
      recommendedResponder: "Security",
    };
  }
  if (text.includes("faint") || text.includes("blood") || text.includes("unconscious") || text.includes("injury")) {
    return {
      category: "MEDICAL",
      summary: "Medical distress signal extracted from report language.",
      severity: "HIGH",
      urgency: "IMMEDIATE",
      confidence: 0.88,
      recommendedResponder: "Medical",
    };
  }
  if (text.includes("fire") || text.includes("smoke") || text.includes("burn")) {
    return {
      category: "FIRE",
      summary: "Combustion / smoke indicators — fire response recommended.",
      severity: "HIGH",
      urgency: "IMMEDIATE",
      confidence: 0.86,
      recommendedResponder: "Fire",
    };
  }
  if (text.includes("wire") || text.includes("flood") || text.includes("glass") || text.includes("hazard")) {
    return {
      category: "HAZARD",
      summary: "Environmental hazard detected on campus walkway.",
      severity: "MEDIUM",
      urgency: "HIGH",
      confidence: 0.8,
      recommendedResponder: "Student Hero",
    };
  }
  return {
    category: "INFRASTRUCTURE",
    summary: "Campus operations issue — student hero or facilities dispatch.",
    severity: "LOW",
    urgency: "LOW",
    confidence: 0.74,
    recommendedResponder: "Student Hero",
  };
}

export function simulateTriage(description: string): TriageResult {
  return triageFromText(description);
}

export function FnnProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [signals, setSignals] = useState<Signal[]>(DEMO_SIGNALS);
  const [radiusOnly, setRadiusOnly] = useState(true);
  const [heroStage, setHeroStage] = useState<Record<string, HeroTaskStage>>({
    "sig-mh-faint": "EN_ROUTE",
  });

  const login = useCallback(
    ({ email, pseudonym }: { email: string; password: string; pseudonym?: string }) => {
      setUser({
        ...DEMO_USER,
        email: email || DEMO_USER.email,
        pseudonym: pseudonym || DEMO_USER.pseudonym,
      });
    },
    [],
  );

  const signup = useCallback(
    ({ email, pseudonym }: { email: string; password: string; pseudonym: string }) => {
      setUser({
        ...DEMO_USER,
        id: `u-${pseudonym.toLowerCase()}`,
        email,
        pseudonym,
        credits: 100,
        lockedCredits: 0,
        reputation: 50,
        role: "STUDENT",
      });
    },
    [],
  );

  const logout = useCallback(() => setUser(null), []);

  const submitReport = useCallback(
    ({
      description,
      latitude,
      longitude,
      triage,
    }: {
      description: string;
      latitude: number;
      longitude: number;
      triage: TriageResult;
    }) => {
      const signal: Signal = {
        id: `sig-${Date.now()}`,
        description,
        summary: triage.summary,
        category: triage.category,
        severity: triage.severity,
        urgency: triage.urgency,
        confidence: triage.confidence,
        latitude,
        longitude,
        status: "OPEN",
        reporterId: user?.id ?? "anonymous",
        distanceMeters: 18,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date().toISOString(),
        recommendedResponder: triage.recommendedResponder,
      };
      setSignals((prev) => [signal, ...prev]);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              credits: Math.max(0, prev.credits - REPORT_STAKE),
              lockedCredits: prev.lockedCredits + REPORT_STAKE,
            }
          : prev,
      );
      return signal;
    },
    [user?.id],
  );

  const getSignal = useCallback(
    (id: string) => signals.find((s) => s.id === id),
    [signals],
  );

  const submitProof = useCallback((id: string) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, proofSubmitted: true } : s)),
    );
  }, []);

  const vote = useCallback((id: string, direction: "up" | "down") => {
    setSignals((prev) =>
      prev.map((s) => {
        if (s.id !== id || s.hasVoted || !s.proofSubmitted) return s;
        return {
          ...s,
          hasVoted: true,
          upvotes: s.upvotes + (direction === "up" ? 1 : 0),
          downvotes: s.downvotes + (direction === "down" ? 1 : 0),
        };
      }),
    );
  }, []);

  const acceptHeroTask = useCallback((id: string) => {
    setHeroStage((prev) => ({ ...prev, [id]: "EN_ROUTE" }));
    setSignals((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "RESPONDING",
              heroPseudonym: user?.pseudonym ?? "WebGuardian42",
              heroEtaMinutes: 2,
            }
          : s,
      ),
    );
  }, [user?.pseudonym]);

  const advanceHeroTask = useCallback((id: string) => {
    setHeroStage((prev) => {
      const current = prev[id] ?? "ACCEPT";
      const next: HeroTaskStage =
        current === "ACCEPT"
          ? "EN_ROUTE"
          : current === "EN_ROUTE"
            ? "ARRIVED"
            : "RESOLVE";
      setSignals((signals) =>
        signals.map((s) => {
          if (s.id !== id) return s;
          if (next === "RESOLVE") {
            return { ...s, status: "RESOLVED", heroEtaMinutes: 0 };
          }
          return {
            ...s,
            status: "RESPONDING",
            heroEtaMinutes: next === "ARRIVED" ? 0 : 2,
          };
        }),
      );
      return { ...prev, [id]: next };
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      signals,
      radiusOnly,
      setRadiusOnly,
      login,
      signup,
      logout,
      submitReport,
      getSignal,
      submitProof,
      vote,
      heroStage,
      advanceHeroTask,
      acceptHeroTask,
    }),
    [
      user,
      signals,
      radiusOnly,
      login,
      signup,
      logout,
      submitReport,
      getSignal,
      submitProof,
      vote,
      heroStage,
      advanceHeroTask,
      acceptHeroTask,
    ],
  );

  return <FnnContext.Provider value={value}>{children}</FnnContext.Provider>;
}

export function useFnn() {
  const ctx = useContext(FnnContext);
  if (!ctx) throw new Error("useFnn must be used within FnnProvider");
  return ctx;
}

export { REPORT_STAKE };
