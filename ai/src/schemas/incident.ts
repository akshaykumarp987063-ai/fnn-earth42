export type IncidentCategory =
  | "MEDICAL"
  | "FIRE"
  | "PERSONAL_SAFETY"
  | "INFRASTRUCTURE"
  | "NATURAL_DISASTER"
  | "LOST_PERSON"
  | "LOST_ITEM"
  | "OTHER";

export type IncidentSeverity =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type IncidentUrgency =
  | "IMMEDIATE"
  | "SOON"
  | "NORMAL";

export interface IncidentAnalysis {
  category: IncidentCategory;
  summary: string;
  severity: IncidentSeverity;
  urgency: IncidentUrgency;
  confidence: number;
  recommendedResponder: string;
  source: "GEMINI" | "SAFETY_RULES" | "FALLBACK";
}
