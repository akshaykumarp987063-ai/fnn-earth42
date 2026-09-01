import { GoogleGenAI } from "@google/genai";
import {
  IncidentAnalysis,
  IncidentCategory,
  IncidentSeverity,
  IncidentUrgency,
} from "../schemas/incident";
import { applySafetyRules } from "../rules/safetyRules";

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

const categories: IncidentCategory[] = [
  "MEDICAL",
  "FIRE",
  "PERSONAL_SAFETY",
  "INFRASTRUCTURE",
  "NATURAL_DISASTER",
  "LOST_PERSON",
  "LOST_ITEM",
  "OTHER",
];

const severities: IncidentSeverity[] = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
];

const urgencies: IncidentUrgency[] = [
  "IMMEDIATE",
  "SOON",
  "NORMAL",
];

function isValidCategory(value: unknown): value is IncidentCategory {
  return typeof value === "string" && categories.includes(value as IncidentCategory);
}

function isValidSeverity(value: unknown): value is IncidentSeverity {
  return typeof value === "string" && severities.includes(value as IncidentSeverity);
}

function isValidUrgency(value: unknown): value is IncidentUrgency {
  return typeof value === "string" && urgencies.includes(value as IncidentUrgency);
}

function createFallback(description: string): IncidentAnalysis {
  return {
    category: "OTHER",
    summary: description.slice(0, 200),
    severity: "LOW",
    urgency: "NORMAL",
    confidence: 0.3,
    recommendedResponder: "CAMPUS_SECURITY",
    source: "FALLBACK",
  };
}

export async function analyzeIncident(
  description: string
): Promise<IncidentAnalysis> {

  if (!description || description.trim().length < 3) {
    throw new Error("Incident description is too short");
  }

  /*
   * STEP 1:
   * Check deterministic emergency rules first.
   */
  const safetyResult = applySafetyRules(description);

  if (safetyResult) {
    return safetyResult;
  }

  /*
   * STEP 2:
   * If Gemini is unavailable, return a safe fallback.
   */
  if (!ai) {
    return createFallback(description);
  }

  /*
   * STEP 3:
   * Ask Gemini to classify the incident.
   */
  const prompt = `
You are the emergency incident triage engine for a campus disaster-management application.

Analyze the following incident report.

Incident:
${description}

Classify it into exactly one category:

MEDICAL
FIRE
PERSONAL_SAFETY
INFRASTRUCTURE
NATURAL_DISASTER
LOST_PERSON
LOST_ITEM
OTHER

Choose severity:

CRITICAL = immediate danger to life, major fire, serious violence, major disaster
HIGH = serious incident requiring rapid response
MEDIUM = incident requiring attention but not immediately life-threatening
LOW = minor incident or non-emergency

Choose urgency:

IMMEDIATE
SOON
NORMAL

Do not invent facts.

Return ONLY valid JSON with these fields:

{
  "category": "...",
  "summary": "...",
  "severity": "...",
  "urgency": "...",
  "confidence": 0.0,
  "recommendedResponder": "..."
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      return createFallback(description);
    }

    const parsed = JSON.parse(text);

    /*
     * STEP 4:
     * Validate Gemini's output before trusting it.
     */

    if (
      !isValidCategory(parsed.category) ||
      !isValidSeverity(parsed.severity) ||
      !isValidUrgency(parsed.urgency)
    ) {
      return createFallback(description);
    }

    const confidence =
      typeof parsed.confidence === "number"
        ? Math.max(0, Math.min(1, parsed.confidence))
        : 0.5;

    return {
      category: parsed.category,
      summary:
        typeof parsed.summary === "string"
          ? parsed.summary.slice(0, 500)
          : description.slice(0, 200),
      severity: parsed.severity,
      urgency: parsed.urgency,
      confidence,
      recommendedResponder:
        typeof parsed.recommendedResponder === "string"
          ? parsed.recommendedResponder
          : "CAMPUS_SECURITY",
      source: "GEMINI",
    };

  } catch (error) {
    console.error("Gemini classification failed. Using fallback.");

    return createFallback(description);
  }
}
