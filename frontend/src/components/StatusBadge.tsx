import type { IncidentStatus, Severity, TaskStatus, Urgency } from "../types/fnn";
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Flame, Radio, Zap } from "lucide-react";

export function SeverityBadge({ severity }: { severity: Severity }) {
  if (severity === "CRITICAL") {
    return (
      <span
        className="badge glow-critical"
        style={{
          background: "rgba(239, 68, 68, 0.18)",
          color: "#f87171",
          border: "1px solid #ef4444",
        }}
      >
        <Flame size={12} />
        <span>CRITICAL</span>
      </span>
    );
  }

  if (severity === "HIGH") {
    return (
      <span
        className="badge"
        style={{
          background: "rgba(245, 158, 11, 0.16)",
          color: "#fbbf24",
          border: "1px solid rgba(245, 158, 11, 0.35)",
        }}
      >
        <AlertTriangle size={12} />
        <span>HIGH</span>
      </span>
    );
  }

  if (severity === "MEDIUM") {
    return (
      <span
        className="badge"
        style={{
          background: "rgba(6, 182, 212, 0.14)",
          color: "#38bdf8",
          border: "1px solid rgba(6, 182, 212, 0.28)",
        }}
      >
        <Clock size={12} />
        <span>MEDIUM</span>
      </span>
    );
  }

  return (
    <span
      className="badge"
      style={{
        background: "rgba(148, 163, 184, 0.14)",
        color: "#94a3b8",
        border: "1px solid rgba(148, 163, 184, 0.25)",
      }}
    >
      <Clock size={12} />
      <span>LOW</span>
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  if (urgency === "IMMEDIATE") {
    return (
      <span
        className="badge"
        style={{
          background: "rgba(239, 68, 68, 0.2)",
          color: "#fca5a5",
          border: "1px solid rgba(239, 68, 68, 0.5)",
        }}
      >
        <Zap size={12} />
        <span>IMMEDIATE</span>
      </span>
    );
  }

  if (urgency === "URGENT") {
    return (
      <span
        className="badge"
        style={{
          background: "rgba(245, 158, 11, 0.18)",
          color: "#fde047",
          border: "1px solid rgba(245, 158, 11, 0.4)",
        }}
      >
        <AlertCircle size={12} />
        <span>URGENT</span>
      </span>
    );
  }

  if (urgency === "NORMAL") {
    return (
      <span
        className="badge"
        style={{
          background: "rgba(100, 116, 139, 0.16)",
          color: "#cbd5e1",
          border: "1px solid rgba(148, 163, 184, 0.2)",
        }}
      >
        <span>NORMAL</span>
      </span>
    );
  }

  return (
    <span
      className="badge"
      style={{
        background: "rgba(71, 85, 105, 0.14)",
        color: "#94a3b8",
        border: "1px solid rgba(71, 85, 105, 0.25)",
      }}
    >
      <span>LOW</span>
    </span>
  );
}

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const map: Record<IncidentStatus, { bg: string; color: string; border: string; label: string; icon: React.ComponentType<{ size?: number }> }> = {
    OPEN: { bg: "rgba(148, 163, 184, 0.14)", color: "#cbd5e1", border: "rgba(148, 163, 184, 0.3)", label: "OPEN", icon: Radio },
    TRIAGED: { bg: "rgba(6, 182, 212, 0.15)", color: "#38bdf8", border: "rgba(6, 182, 212, 0.35)", label: "AI TRIAGED", icon: Zap },
    VERIFYING: { bg: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.35)", label: "VERIFYING", icon: Clock },
    VERIFIED: { bg: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "rgba(16, 185, 129, 0.35)", label: "VERIFIED", icon: CheckCircle2 },
    ASSIGNED: { bg: "rgba(147, 51, 234, 0.15)", color: "#c084fc", border: "rgba(147, 51, 234, 0.35)", label: "HERO ASSIGNED", icon: Radio },
    ACCEPTED: { bg: "rgba(59, 130, 246, 0.18)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.4)", label: "TASK ACCEPTED", icon: CheckCircle2 },
    RESPONDING: { bg: "rgba(245, 158, 11, 0.18)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.45)", label: "RESPONDING", icon: Radio },
    ARRIVED: { bg: "rgba(16, 185, 129, 0.2)", color: "#4ade80", border: "rgba(16, 185, 129, 0.45)", label: "ARRIVED ON SCENE", icon: CheckCircle2 },
    RESOLVED: { bg: "rgba(16, 185, 129, 0.22)", color: "#4ade80", border: "rgba(16, 185, 129, 0.5)", label: "RESOLVED", icon: CheckCircle2 },
    ESCALATED: { bg: "rgba(239, 68, 68, 0.22)", color: "#f87171", border: "rgba(239, 68, 68, 0.5)", label: "ESCALATED", icon: Flame },
    QUEUED: { bg: "rgba(148, 163, 184, 0.18)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.3)", label: "QUEUED OFFLINE", icon: Clock },
  };

  const item = map[status] ?? map.OPEN;
  const Icon = item.icon;

  return (
    <span
      className="badge"
      style={{
        background: item.bg,
        color: item.color,
        border: `1px solid ${item.border}`,
      }}
    >
      <Icon size={12} />
      <span>{item.label}</span>
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { bg: string; color: string; border: string; label: string }> = {
    ASSIGNED: { bg: "rgba(147, 51, 234, 0.16)", color: "#c084fc", border: "rgba(147, 51, 234, 0.35)", label: "ASSIGNED" },
    ACCEPTED: { bg: "rgba(59, 130, 246, 0.18)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.4)", label: "ACCEPTED" },
    RESPONDING: { bg: "rgba(245, 158, 11, 0.18)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.4)", label: "RESPONDING" },
    ARRIVED: { bg: "rgba(16, 185, 129, 0.18)", color: "#34d399", border: "rgba(16, 185, 129, 0.4)", label: "ARRIVED" },
    RESOLVED: { bg: "rgba(16, 185, 129, 0.24)", color: "#4ade80", border: "rgba(16, 185, 129, 0.5)", label: "RESOLVED (+15 CR)" },
  };

  const item = map[status] ?? map.ASSIGNED;

  return (
    <span
      className="badge"
      style={{
        background: item.bg,
        color: item.color,
        border: `1px solid ${item.border}`,
      }}
    >
      <span>{item.label}</span>
    </span>
  );
}
