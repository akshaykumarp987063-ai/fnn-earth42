import type { Severity, Urgency } from "../types/fnn";

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning, Spider.";
  if (hour < 17) return "Good afternoon, Spider.";
  return "Good evening, Spider.";
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function formatClock(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function relativeMinutes(iso: string, now = Date.now()): string {
  const mins = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (mins <= 0) return "just now";
  if (mins === 1) return "1 minute ago";
  return `${mins} minutes ago`;
}

export function severityTone(severity: Severity): string {
  if (severity === "CRITICAL") return "critical";
  if (severity === "HIGH") return "high";
  if (severity === "MEDIUM") return "medium";
  return "low";
}

export function urgencyTone(urgency: Urgency): string {
  if (urgency === "IMMEDIATE") return "critical";
  if (urgency === "URGENT") return "high";
  if (urgency === "NORMAL") return "medium";
  return "low";
}

export function uid(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
