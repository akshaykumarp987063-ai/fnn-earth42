export type Role = "STUDENT" | "HERO" | "ADMIN";

export type Category =
  | "PERSONAL_SAFETY"
  | "MEDICAL"
  | "FIRE"
  | "HAZARD"
  | "INFRASTRUCTURE";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type Urgency = "IMMEDIATE" | "HIGH" | "LOW";

export type SignalStatus = "OPEN" | "RESPONDING" | "RESOLVED" | "ESCALATED";

export type RecommendedResponder = "Security" | "Medical" | "Fire" | "Student Hero";

export type HeroTaskStage = "ACCEPT" | "EN_ROUTE" | "ARRIVED" | "RESOLVE";

export type PrivacyChallengeState =
  | "IDLE"
  | "COUNTDOWN"
  | "VERIFYING"
  | "LIKELY_MATCH"
  | "UNCERTAIN"
  | "EXPIRED";

export interface User {
  id: string;
  email: string;
  pseudonym: string;
  role: Role;
  credits: number;
  lockedCredits: number;
  reputation: number;
}

export interface Signal {
  id: string;
  description: string;
  summary?: string;
  category: Category;
  severity: Severity;
  urgency: Urgency;
  confidence: number;
  latitude: number;
  longitude: number;
  status: SignalStatus;
  reporterId: string;
  distanceMeters?: number;
  upvotes: number;
  downvotes: number;
  hasVoted?: boolean;
  proofSubmitted?: boolean;
  createdAt: string;
  recommendedResponder?: RecommendedResponder;
  heroPseudonym?: string;
  heroEtaMinutes?: number;
}

export interface CampusService {
  id: string;
  name: string;
  subtitle: string;
  phone: string;
  marker: string;
  accent: "crimson" | "cyan" | "gold" | "violet";
}

export interface TriageResult {
  category: Category;
  summary: string;
  severity: Severity;
  urgency: Urgency;
  confidence: number;
  recommendedResponder: RecommendedResponder;
}
