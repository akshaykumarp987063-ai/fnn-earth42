import type { IncidentCategory, IncidentSeverity, IncidentUrgency } from "../types";

export type AiTriageResult = {
  severity: IncidentSeverity;
  urgency: IncidentUrgency;
  confidence: number;
  summary: string;
  recommendedResponder: string;
  workflow: "COMMUNITY_ASSISTANCE" | "HERO_VOLUNTEER" | "RESTRICTED_REVIEW" | "EMERGENCY_SOS";
};

/**
 * Hyperlocal AI Triage Engine.
 * Analyzes incident reports to determine severity, urgency, confidence, summary,
 * recommended responder, and automated routing.
 */
export function triageIncident(
  description: string,
  category: IncidentCategory,
  userSeverity?: IncidentSeverity,
  userUrgency?: IncidentUrgency,
): AiTriageResult {
  const text = description.toLowerCase();

  // Critical indicators
  const criticalKeywords = [
    "fire",
    "smoke",
    "unconscious",
    "severe bleeding",
    "cardiac",
    "heart attack",
    "collapsed",
    "explosion",
    "armed",
    "weapon",
    "gas leak",
    "life-threatening",
    "dying",
    "sos",
  ];

  // High severity indicators
  const highKeywords = [
    "injured",
    "broken bone",
    "fracture",
    "harassment",
    "stalker",
    "assault",
    "physical attack",
    "deep cut",
    "trapped",
    "panic",
    "danger",
  ];

  // Medium severity indicators
  const mediumKeywords = [
    "water leak",
    "pipe burst",
    "power outage",
    "spark",
    "road block",
    "suspicious",
    "lost child",
    "lost person",
    "missing",
    "flooding",
  ];

  let calculatedSeverity: IncidentSeverity = "LOW";
  let calculatedUrgency: IncidentUrgency = "NORMAL";
  let confidence = 0.85;

  if (
    category === "FIRE" ||
    criticalKeywords.some((kw) => text.includes(kw)) ||
    userSeverity === "CRITICAL"
  ) {
    calculatedSeverity = "CRITICAL";
    calculatedUrgency = "IMMEDIATE";
    confidence = 0.95;
  } else if (
    category === "MEDICAL" ||
    category === "PERSONAL_SAFETY" ||
    category === "WOMEN_SAFETY" ||
    category === "CHILD_SAFETY" ||
    highKeywords.some((kw) => text.includes(kw)) ||
    userSeverity === "HIGH"
  ) {
    calculatedSeverity = userSeverity ?? "HIGH";
    calculatedUrgency = userUrgency ?? (calculatedSeverity === "HIGH" ? "IMMEDIATE" : "SOON");
    confidence = 0.90;
  } else if (
    category === "INFRASTRUCTURE" ||
    category === "DISASTER" ||
    category === "NATURAL_DISASTER" ||
    category === "SUSPICIOUS_ACTIVITY" ||
    mediumKeywords.some((kw) => text.includes(kw)) ||
    userSeverity === "MEDIUM"
  ) {
    calculatedSeverity = userSeverity ?? "MEDIUM";
    calculatedUrgency = userUrgency ?? "SOON";
    confidence = 0.82;
  } else {
    calculatedSeverity = userSeverity ?? "LOW";
    calculatedUrgency = userUrgency ?? "NORMAL";
    confidence = 0.78;
  }

  // Generate concise AI summary
  const cleanDesc = description.trim();
  const summary =
    cleanDesc.length > 120
      ? `${cleanDesc.substring(0, 117)}...`
      : cleanDesc;

  // Determine recommended responder & routing workflow
  let recommendedResponder = "Community Volunteers";
  let workflow: AiTriageResult["workflow"] = "COMMUNITY_ASSISTANCE";

  switch (calculatedSeverity) {
    case "CRITICAL":
      recommendedResponder = "Emergency Dispatch (SOS & Campus Security)";
      workflow = "EMERGENCY_SOS";
      break;
    case "HIGH":
      recommendedResponder = "Campus Security & First Aid Team";
      workflow = "RESTRICTED_REVIEW";
      break;
    case "MEDIUM":
      recommendedResponder = "Nearby Hero / Campus Maintenance";
      workflow = "HERO_VOLUNTEER";
      break;
    case "LOW":
    default:
      recommendedResponder = "Community Assistance / Student Volunteers";
      workflow = "COMMUNITY_ASSISTANCE";
      break;
  }

  return {
    severity: calculatedSeverity,
    urgency: calculatedUrgency,
    confidence,
    summary,
    recommendedResponder,
    workflow,
  };
}
