export type ViewId =
  | "dashboard"
  | "signals"
  | "spider"
  | "heroes"
  | "map"
  | "sos"
  | "community"
  | "services"
  | "credits"
  | "top5"
  | "privacy-challenge"
  | "disaster";

export type Category =
  | "TRANSPORT"
  | "PHYSICAL HELP"
  | "MEDICAL"
  | "PERSONAL SAFETY"
  | "CHILD SAFETY"
  | "WOMEN SAFETY"
  | "ELDERLY ASSISTANCE"
  | "COMMUNITY SERVICE"
  | "INFRASTRUCTURE"
  | "SUSPICIOUS ACTIVITY"
  | "DISASTER"
  | "LOST & FOUND"
  | "FOOD AID"
  | "OTHER";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Urgency = "LOW" | "NORMAL" | "URGENT" | "IMMEDIATE";

export type IncidentStatus =
  | "OPEN"
  | "TRIAGED"
  | "VERIFYING"
  | "VERIFIED"
  | "ASSIGNED"
  | "ACCEPTED"
  | "RESPONDING"
  | "ARRIVED"
  | "RESOLVED"
  | "ESCALATED"
  | "QUEUED";

export type TaskStatus = "ASSIGNED" | "ACCEPTED" | "RESPONDING" | "ARRIVED" | "RESOLVED";
export type ApiMode = "LIVE" | "LOCAL_DEMO";
export type ToastKind = "info" | "success" | "warn" | "critical";

export type TimelineStep =
  | "SIGNAL RECEIVED"
  | "AI TRIAGED"
  | "PRIVACY PROTECTED"
  | "VERIFICATION REQUESTED"
  | "HERO MATCHED"
  | "RESPONDING"
  | "ARRIVED"
  | "RESOLVED"
  | "SOS ACTIVATED"
  | "CRITICAL SIGNAL CREATED"
  | "SAFETY CIRCLE NOTIFIED"
  | "CONTROLLED AUTHORITY ESCALATION"
  | "MOCK_AUTHORITY"
  | "SENT"
  | "QUEUED OFFLINE"
  | "SYNCED";

export interface TimelineEntry {
  id: string;
  label: TimelineStep;
  at: string;
  done: boolean;
}

export interface Incident {
  id: string;
  reporterId: string;
  reporterPseudonym: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  urgency: Urgency;
  confidence: number;
  summary: string;
  recommendedResponder: string;
  approximateArea: string;
  status: IncidentStatus;
  upvotes: number;
  downvotes: number;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
  verificationRequired: boolean;
  verificationRadiusM: number;
  privacyExactProtected: boolean;
  isSos: boolean;
  queuedOffline?: boolean;
  synced?: boolean;
  matchedHeroId?: string;
  matchedTaskId?: string;
  stakeAmount: number;
  stakeReleased: boolean;
  triageSource: "local" | "live";
}

export interface Hero {
  id: string;
  pseudonym: string;
  distanceLabel: string;
  distanceMeters: number;
  skills: string[];
  available: boolean;
  reliability: number;
  reputation: number;
  workload: number;
  mapX: number;
  mapY: number;
}

export interface HeroTask {
  id: string;
  incidentId: string;
  heroId: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreditWallet {
  available: number;
  locked: number;
  total: number;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  label: string;
  type: "STAKE" | "RELEASE" | "PENALTY" | "REWARD" | "REFUND";
  createdAt: string;
  signalId?: string;
}

export interface CommunityOrganization {
  id: string;
  name: string;
  type: string;
  distanceLabel: string;
  open: boolean;
  verified: boolean;
  mapX: number;
  mapY: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  category: string;
  distanceLabel: string;
  verified: boolean;
  available: boolean;
  rating: number;
}

export interface ServiceRequest {
  id: string;
  providerId: string;
  status: "REQUESTED" | "ACKNOWLEDGED";
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  pseudonym: string;
  credits: number;
  tasksResolved: number;
  reliability: number;
  badge: string;
}

export interface SafetyCircleMember {
  id: string;
  name: string;
  role: string;
  status: "STANDBY" | "NOTIFIED";
}

export interface AuditEvent {
  id: string;
  at: string;
  label: string;
  detail: string;
  sensitive: boolean;
}

export interface UserProfile {
  id: string;
  pseudonym: string;
  role: string;
  reputation: number;
}

export interface TriageResult {
  category: Category;
  severity: Severity;
  urgency: Urgency;
  confidence: number;
  summary: string;
  recommendedResponder: string;
  verificationRequired: boolean;
  source: "local" | "live";
}

export interface OfflineSignal {
  id: string;
  description: string;
  category: Category;
  severity: Severity;
  urgency: Urgency;
  approximateArea: string;
  stakeAmount: number;
  createdAt: string;
  status: "QUEUED" | "SYNCING" | "SYNCED";
}

export interface ToastItem {
  id: string;
  message: string;
  kind: ToastKind;
}

export interface MapMarker {
  id: string;
  kind: "INCIDENT" | "HERO" | "HOSPITAL" | "SHELTER" | "FOOD BANK";
  label: string;
  x: number;
  y: number;
  severity?: Severity;
}

export interface CreateSignalInput {
  description: string;
  category: Category;
  severity: Severity;
  urgency: Urgency;
  approximateArea: string;
  stakeAmount: number;
  mediaNote?: string;
}

export type SosKind = "POLICE" | "WOMEN HELP" | "CHILD HELP" | "FIRE" | "MEDICAL" | "OTHER";

export type DemoPhase =
  | "idle"
  | "signal"
  | "triage"
  | "privacy"
  | "verification"
  | "matching"
  | "task"
  | "resolution"
  | "complete"
  | "sos-critical";

export const CATEGORIES: Category[] = [
  "TRANSPORT",
  "PHYSICAL HELP",
  "MEDICAL",
  "PERSONAL SAFETY",
  "CHILD SAFETY",
  "WOMEN SAFETY",
  "ELDERLY ASSISTANCE",
  "COMMUNITY SERVICE",
  "INFRASTRUCTURE",
  "SUSPICIOUS ACTIVITY",
  "DISASTER",
  "LOST & FOUND",
  "FOOD AID",
  "OTHER",
];

export const SEVERITIES: Severity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
export const URGENCIES: Urgency[] = ["LOW", "NORMAL", "URGENT", "IMMEDIATE"];
