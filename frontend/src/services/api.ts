import type { Category, Severity, Urgency } from "../types/fnn";

const DEFAULT_URL = "http://localhost:5000";

export function apiBase(): string {
  const env = import.meta.env.VITE_API_URL;
  return (typeof env === "string" && env.trim() ? env.trim() : DEFAULT_URL).replace(/\/$/, "");
}

export class ApiUnavailableError extends Error {
  constructor(message = "Live services unavailable") {
    super(message);
    this.name = "ApiUnavailableError";
  }
}

async function request<T>(path: string, init?: RequestInit, timeoutMs = 4000): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${apiBase()}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) {
      throw new ApiUnavailableError(`Request failed (${res.status})`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } catch {
    throw new ApiUnavailableError();
  } finally {
    window.clearTimeout(timer);
  }
}

export async function getHealth(): Promise<boolean> {
  try {
    const data = await request<{ status?: string }>("/health", { method: "GET" }, 2500);
    return data.status === "ok";
  } catch {
    try {
      const data = await request<{ status?: string }>("/api/health", { method: "GET" }, 2500);
      return data.status === "ok";
    } catch {
      return false;
    }
  }
}

export type BackendSignal = {
  id: string;
  reporterId: string;
  reporterPseudonym?: string;
  description: string;
  category: string;
  severity: string;
  urgency: string;
  confidence: number;
  summary?: string;
  recommendedResponder?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  upvotes: number;
  downvotes: number;
  mediaUrls?: string[];
  createdAt: string;
  updatedAt: string;
};

export async function fetchSignals(): Promise<BackendSignal[]> {
  const data = await request<{ signals: BackendSignal[] }>("/api/signals");
  return data.signals ?? [];
}

export async function postSignal(body: {
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  severity?: string;
  urgency?: string;
  stakeAmount?: number;
}): Promise<BackendSignal> {
  return request<BackendSignal>("/api/signals", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function voteSignal(id: string, vote: "UP" | "DOWN"): Promise<unknown> {
  return request(`/api/signals/${id}/vote`, {
    method: "POST",
    body: JSON.stringify({ vote }),
  });
}

export async function fetchNearbyHeroes(): Promise<
  { id: string; pseudonym: string; skills: string[]; availability: boolean; reputation: number; distanceMeters: number }[]
> {
  const data = await request<{ heroes: { id: string; pseudonym: string; skills: string[]; availability: boolean; reputation: number; distanceMeters: number }[] }>(
    "/api/heroes/nearby?latitude=12.8406&longitude=80.1530&radius=2000",
  );
  return data.heroes ?? [];
}

export async function acceptTask(id: string): Promise<unknown> {
  return request(`/api/tasks/${id}/accept`, { method: "POST" });
}

export async function patchTaskStatus(id: string, status: string): Promise<unknown> {
  return request(`/api/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function escalateSignal(id: string, reason: string): Promise<unknown> {
  return request(`/api/signals/${id}/escalate`, {
    method: "POST",
    body: JSON.stringify({ reason, destination: "MOCK_AUTHORITY" }),
  });
}

export async function postSos(note: string): Promise<{ signal: BackendSignal; escalation?: { destination?: string; status?: string } }> {
  return request("/api/sos", {
    method: "POST",
    body: JSON.stringify({ latitude: 12.8406, longitude: 80.1530, note }),
  });
}

export async function fetchServices(): Promise<{ id: string; name: string; category: string; phone: string; website: string }[]> {
  const data = await request<{ services: { id: string; name: string; category: string; phone: string; website: string }[] }>("/api/services");
  return data.services ?? [];
}

export function toFrontendCategory(raw: string): Category {
  const map: Record<string, Category> = {
    PERSONAL_SAFETY: "PERSONAL SAFETY",
    WOMEN_SAFETY: "WOMEN SAFETY",
    CHILD_SAFETY: "CHILD SAFETY",
    ELDERLY_HELP: "ELDERLY ASSISTANCE",
    MEDICAL: "MEDICAL",
    TRANSPORT: "TRANSPORT",
    SUSPICIOUS_ACTIVITY: "SUSPICIOUS ACTIVITY",
    DISASTER: "DISASTER",
    COMMUNITY_SERVICE: "COMMUNITY SERVICE",
    FIRE: "DISASTER",
    INFRASTRUCTURE: "INFRASTRUCTURE",
    NATURAL_DISASTER: "DISASTER",
    LOST_PERSON: "LOST & FOUND",
    LOST_ITEM: "LOST & FOUND",
    OTHER: "OTHER",
  };
  return map[raw] ?? "OTHER";
}

export function toBackendCategory(cat: Category): string {
  const map: Record<Category, string> = {
    TRANSPORT: "TRANSPORT",
    "PHYSICAL HELP": "COMMUNITY_SERVICE",
    MEDICAL: "MEDICAL",
    "PERSONAL SAFETY": "PERSONAL_SAFETY",
    "CHILD SAFETY": "CHILD_SAFETY",
    "WOMEN SAFETY": "WOMEN_SAFETY",
    "ELDERLY ASSISTANCE": "ELDERLY_HELP",
    "COMMUNITY SERVICE": "COMMUNITY_SERVICE",
    INFRASTRUCTURE: "INFRASTRUCTURE",
    "SUSPICIOUS ACTIVITY": "SUSPICIOUS_ACTIVITY",
    DISASTER: "DISASTER",
    "LOST & FOUND": "LOST_ITEM",
    "FOOD AID": "COMMUNITY_SERVICE",
    OTHER: "OTHER",
  };
  return map[cat];
}

export function toFrontendSeverity(raw: string): Severity {
  if (raw === "CRITICAL" || raw === "HIGH" || raw === "MEDIUM" || raw === "LOW") return raw;
  return "MEDIUM";
}

export function toBackendUrgency(u: Urgency): string {
  if (u === "IMMEDIATE") return "IMMEDIATE";
  if (u === "URGENT") return "SOON";
  return "NORMAL";
}

export function toFrontendUrgency(raw: string): Urgency {
  if (raw === "IMMEDIATE") return "IMMEDIATE";
  if (raw === "SOON") return "URGENT";
  if (raw === "URGENT") return "URGENT";
  if (raw === "LOW") return "LOW";
  return "NORMAL";
}
