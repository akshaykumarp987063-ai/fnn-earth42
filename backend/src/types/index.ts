export type HealthResponse = {
  status: "ok";
  service: "fnn-api";
};

export type MeResponse = {
  id: string;
  email: string | null;
  pseudonym: string;
  role: string;
  reputation: number;
};

export type IncidentCategory =
  | "PERSONAL_SAFETY"
  | "WOMEN_SAFETY"
  | "CHILD_SAFETY"
  | "ELDERLY_HELP"
  | "MEDICAL"
  | "TRANSPORT"
  | "SUSPICIOUS_ACTIVITY"
  | "DISASTER"
  | "COMMUNITY_SERVICE"
  | "FIRE"
  | "INFRASTRUCTURE"
  | "NATURAL_DISASTER"
  | "LOST_PERSON"
  | "LOST_ITEM"
  | "OTHER";

export type IncidentSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentUrgency = "IMMEDIATE" | "SOON" | "NORMAL";

export type IncidentStatus =
  | "OPEN"
  | "VERIFYING"
  | "VERIFIED"
  | "ASSIGNED"
  | "RESPONDING"
  | "RESOLVED"
  | "CANCELLED"
  | "ESCALATED";

export type PublicSignal = {
  id: string;
  reporterId: string;
  reporterPseudonym: string;
  description: string;
  category: string;
  severity: string;
  urgency: string;
  confidence: number;
  summary?: string;
  recommendedResponder?: string;
  latitude: number;
  longitude: number;
  status: string;
  upvotes: number;
  downvotes: number;
  mediaUrls: string[];
  distanceMeters?: number;
  createdAt: string;
  updatedAt: string;
};

export type CreditWalletResponse = {
  available: number;
  locked: number;
  total: number;
};

export type CreditTransaction = {
  id: string;
  userId: string;
  signalId: string | null;
  amount: number;
  type: "STAKE" | "RELEASE" | "PENALTY" | "REWARD" | "REFUND";
  createdAt: string;
};

export type CreditsResponse = {
  balance: CreditWalletResponse;
  transactions: CreditTransaction[];
};

export type HeroNearbyResponse = {
  id: string;
  pseudonym: string;
  skills: string[];
  availability: boolean;
  reputation: number;
  distanceMeters: number;
};

export type HeroTaskStatus =
  | "ASSIGNED"
  | "ACCEPTED"
  | "RESPONDING"
  | "ARRIVED"
  | "RESOLVED"
  | "COMPLETED"
  | "CANCELLED";

export type HeroTask = {
  id: string;
  signalId: string;
  heroId: string;
  status: HeroTaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type EscalationRecord = {
  id: string;
  signalId: string;
  reason: string;
  destination: string;
  status: "PENDING" | "SENT" | "FAILED";
  sentAt: string | null;
  createdAt: string;
};

export type PrivacyChallengeStatus =
  | "PENDING"
  | "ACTIVE"
  | "MATCHED"
  | "NOT_MATCHED"
  | "REJECTED"
  | "EXPIRED";

export type PrivacyChallenge = {
  id: string;
  signalId: string;
  userId: string;
  status: PrivacyChallengeStatus;
  expiresAt: string;
  matchConfidence: number | null;
  createdAt: string;
};

export type PublicService = {
  id: string;
  name: string;
  category: string;
  phone: string;
  website: string;
};

