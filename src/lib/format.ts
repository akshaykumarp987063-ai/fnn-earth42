import type { Category, Severity, SignalStatus, Urgency } from "@/types";

export const CAMPUS = {
  name: "VIT Chennai",
  latitude: 12.8406,
  longitude: 80.1534,
} as const;

export function categoryLabel(category: Category): string {
  const map: Record<Category, string> = {
    PERSONAL_SAFETY: "Personal Safety",
    MEDICAL: "Medical",
    FIRE: "Fire",
    HAZARD: "Hazard",
    INFRASTRUCTURE: "Infrastructure",
  };
  return map[category];
}

export function urgencyLabel(urgency: Urgency): string {
  if (urgency === "IMMEDIATE") return "IMMEDIATE";
  return "EXPECTED";
}

export function relativeTime(iso: string, now = Date.parse("2026-09-02T02:10:00.000Z")): string {
  const delta = now - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(delta / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function distanceLabel(meters?: number): string {
  if (meters == null) return "Campus";
  if (meters < 1000) return `${Math.round(meters)}m away`;
  return `${(meters / 1000).toFixed(1)}km away`;
}

export function coordsLabel(lat: number, lng: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export const severityTone: Record<Severity, string> = {
  CRITICAL: "bg-crimson/20 text-crimson border-crimson/50 shadow-[0_0_12px_rgba(226,54,54,0.35)]",
  HIGH: "bg-amber-500/15 text-amber-300 border-amber-400/40",
  MEDIUM: "bg-sky-500/15 text-sky-300 border-sky-400/40",
  LOW: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
};

export const statusTone: Record<SignalStatus, string> = {
  OPEN: "bg-white/5 text-slate-200 border-white/15",
  RESPONDING: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40",
  RESOLVED: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
  ESCALATED: "bg-violet-500/15 text-violet-300 border-violet-400/40",
};
