import {
  IncidentAnalysis,
  IncidentCategory,
  IncidentSeverity,
  IncidentUrgency,
} from "../schemas/incident";

interface SafetyRule {
  keywords: string[];
  category: IncidentCategory;
  responder: string;
}

const SAFETY_RULES: SafetyRule[] = [
  {
    keywords: [
      "not breathing",
      "cannot breathe",
      "can't breathe",
      "unconscious",
      "heavy bleeding",
      "severe bleeding",
    ],
    category: "MEDICAL",
    responder: "MEDICAL",
  },
  {
    keywords: [
      "fire",
      "flames",
      "building on fire",
      "smoke",
      "explosion",
    ],
    category: "FIRE",
    responder: "FIRE_SERVICE",
  },
  {
    keywords: [
      "weapon",
      "knife",
      "gun",
      "attack",
      "assault",
    ],
    category: "PERSONAL_SAFETY",
    responder: "POLICE",
  },
  {
    keywords: [
      "collapsed building",
      "building collapsed",
      "structural collapse",
    ],
    category: "INFRASTRUCTURE",
    responder: "EMERGENCY_SERVICES",
  },
];

export function applySafetyRules(
  description: string
): IncidentAnalysis | null {
  const text = description.toLowerCase();

  for (const rule of SAFETY_RULES) {
    const matched = rule.keywords.some((keyword) =>
      text.includes(keyword)
    );

    if (matched) {
      return {
        category: rule.category,
        summary: description,
        severity: "CRITICAL",
        urgency: "IMMEDIATE",
        confidence: 1,
        recommendedResponder: rule.responder,
        source: "SAFETY_RULES",
      };
    }
  }

  return null;
}
