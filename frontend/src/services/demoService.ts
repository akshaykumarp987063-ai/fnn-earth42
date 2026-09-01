import type { CreateSignalInput, Incident, TimelineEntry, TimelineStep, TriageResult } from "../types/fnn";
import { uid } from "../utils/formatters";

export function stamp(label: TimelineStep, done = true): TimelineEntry {
  return { id: uid("tl"), label, at: new Date().toISOString(), done };
}

export function buildIncident(input: CreateSignalInput, triage: TriageResult, extra?: Partial<Incident>): Incident {
  const now = new Date().toISOString();
  return {
    id: uid("inc"),
    reporterId: "user-demo-4812",
    reporterPseudonym: "Anonymous Spider #4812",
    title: input.description.slice(0, 72),
    description: input.description,
    category: triage.category,
    severity: triage.severity,
    urgency: triage.urgency,
    confidence: triage.confidence,
    summary: triage.summary,
    recommendedResponder: triage.recommendedResponder,
    approximateArea: input.approximateArea,
    status: extra?.queuedOffline ? "QUEUED" : "TRIAGED",
    upvotes: 0,
    downvotes: 0,
    mediaUrls: input.mediaNote ? [input.mediaNote] : [],
    createdAt: now,
    updatedAt: now,
    timeline: extra?.queuedOffline
      ? [stamp("QUEUED OFFLINE")]
      : [stamp("SIGNAL RECEIVED"), stamp("AI TRIAGED"), stamp("PRIVACY PROTECTED")],
    verificationRequired: triage.verificationRequired,
    verificationRadiusM: 500,
    privacyExactProtected: true,
    isSos: false,
    stakeAmount: input.stakeAmount,
    stakeReleased: false,
    triageSource: triage.source,
    ...extra,
  };
}

export const DEMO_FIGHT_TEXT =
  "Fight reported near campus bus stand. Several people are gathering.";

export const DEMO_TRIAGE_SUMMARY =
  "Possible physical altercation near the bus stand. Nearby verification and a Safety Hero are recommended.";

export const TRIAGE_STEPS = [
  "SIGNAL RECEIVED",
  "AI TRIAGE",
  "DUPLICATE CHECK",
  "PRIVACY SHIELD",
  "COMMUNITY VERIFICATION",
  "HERO MATCHING",
] as const;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
