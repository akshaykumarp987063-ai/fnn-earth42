import type { Category, CreateSignalInput, TriageResult } from "../types/fnn";

function scoreFromText(text: string): number {
  let h = 17;
  for (let i = 0; i < text.length; i += 1) {
    h = (h * 31 + text.charCodeAt(i)) % 1000;
  }
  return 78 + (h % 18);
}

export function localTriage(input: Pick<CreateSignalInput, "description" | "category" | "severity" | "urgency">): TriageResult {
  const d = input.description.toLowerCase();
  let category: Category = input.category;
  let severity = input.severity;
  let urgency = input.urgency;
  let recommended = "NEIGHBORHOOD HERO";
  let summary = "Community observation received. Nearby verification is recommended.";

  if (/(fight|attack|assault|violence|altercation)/.test(d)) {
    category = "PERSONAL SAFETY";
    severity = "HIGH";
    urgency = "URGENT";
    recommended = "SAFETY HERO";
    summary =
      "Possible physical altercation reported near the campus bus stand. Nearby verification and a safety responder are recommended.";
  } else if (/(blood|injured|accident|unconscious|faint)/.test(d)) {
    category = "MEDICAL";
    severity = "HIGH";
    urgency = "IMMEDIATE";
    recommended = "MEDICAL HERO";
    summary = "Possible medical emergency. Immediate nearby first-aid support is recommended. AI assists triage.";
  } else if (/(child|missing child|lost kid|lost child)/.test(d)) {
    category = "CHILD SAFETY";
    severity = "CRITICAL";
    urgency = "IMMEDIATE";
    recommended = "CHILD SAFETY HERO";
    summary = "Possible child-safety incident. Immediate coordinated community response is recommended.";
  } else if (/(fire|burning|smoke|blaze)/.test(d)) {
    category = "DISASTER";
    severity = "CRITICAL";
    urgency = "IMMEDIATE";
    recommended = "DISASTER RESPONSE HERO";
    summary = "Possible fire-related emergency. Controlled coordination and nearby verification are recommended.";
  } else if (/(elderly|old person|senior)/.test(d)) {
    category = "ELDERLY ASSISTANCE";
    severity = "MEDIUM";
    urgency = "NORMAL";
    recommended = "ELDER ASSISTANCE HERO";
    summary = "Elder assistance request. A nearby helper can coordinate support.";
  } else if (/(food|extra food|meals|kitchen)/.test(d)) {
    category = "FOOD AID";
    severity = "LOW";
    urgency = "NORMAL";
    recommended = "COMMUNITY HERO";
    summary = "Food-aid opportunity. Community pickup or distribution can be coordinated.";
  } else if (category === "OTHER" && !d.trim()) {
    category = "OTHER";
    severity = "LOW";
    urgency = "NORMAL";
  }

  const confidence = scoreFromText(d || category);

  return {
    category,
    severity,
    urgency,
    confidence,
    summary,
    recommendedResponder: recommended,
    verificationRequired: severity === "HIGH" || severity === "CRITICAL",
    source: "local",
  };
}
