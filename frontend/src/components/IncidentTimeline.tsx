import type { TimelineEntry } from "../types/fnn";
import { formatTime } from "../utils/formatters";
import { CheckCircle2, Circle, Clock, Flame, Shield, UserCheck, Zap } from "lucide-react";

interface IncidentTimelineProps {
  timeline: TimelineEntry[];
  compact?: boolean;
}

export function IncidentTimeline({ timeline, compact = false }: IncidentTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ padding: "12px", color: "var(--text-muted)", fontSize: "13px" }}>
        No timeline events recorded yet.
      </div>
    );
  }

  const getStepIcon = (label: string) => {
    if (label.includes("SOS") || label.includes("CRITICAL")) return <Flame size={14} color="#f87171" />;
    if (label.includes("PRIVACY")) return <Shield size={14} color="#22d3ee" />;
    if (label.includes("AI")) return <Zap size={14} color="#38bdf8" />;
    if (label.includes("VERIFICATION") || label.includes("CIRCLE")) return <UserCheck size={14} color="#fbbf24" />;
    if (label.includes("RESOLVED") || label.includes("SYNCED")) return <CheckCircle2 size={14} color="#4ade80" />;
    return <Clock size={14} color="#94a3b8" />;
  };

  return (
    <div style={{ position: "relative", paddingLeft: compact ? "16px" : "24px" }}>
      {/* Vertical line connecting nodes */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          bottom: "16px",
          left: compact ? "6px" : "10px",
          width: "2px",
          background: "linear-gradient(180deg, rgba(6, 182, 212, 0.4) 0%, rgba(148, 163, 184, 0.15) 100%)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: compact ? "10px" : "16px" }}>
        {timeline.map((entry, idx) => {
          const isLatest = idx === timeline.length - 1;
          const isCritical = entry.label.includes("SOS") || entry.label.includes("CRITICAL") || entry.label.includes("ESCALATION");

          return (
            <div
              key={entry.id || idx}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                fontSize: compact ? "12px" : "13.5px",
              }}
            >
              {/* Dot / Icon */}
              <div
                style={{
                  position: "absolute",
                  left: compact ? "-16px" : "-24px",
                  top: "2px",
                  width: compact ? "14px" : "20px",
                  height: compact ? "14px" : "20px",
                  borderRadius: "50%",
                  background: isCritical
                    ? "#ef4444"
                    : isLatest
                    ? "#06b6d4"
                    : "#1e293b",
                  border: isLatest ? "2px solid #fff" : "1px solid rgba(148, 163, 184, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isLatest ? "0 0 10px rgba(6, 182, 212, 0.6)" : "none",
                }}
              >
                {isLatest ? (
                  <Circle size={compact ? 5 : 7} fill="#fff" color="#fff" />
                ) : (
                  <Circle size={compact ? 4 : 5} fill="#64748b" color="#64748b" />
                )}
              </div>

              {/* Text content */}
              <div style={{ flex: 1, paddingLeft: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  {getStepIcon(entry.label)}
                  <span
                    style={{
                      fontWeight: isLatest ? 700 : 500,
                      color: isCritical
                        ? "#fca5a5"
                        : isLatest
                        ? "#e0f2fe"
                        : "var(--text-secondary)",
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      fontSize: compact ? "11px" : "12px",
                    }}
                  >
                    {entry.label}
                  </span>
                  {isLatest && (
                    <span
                      style={{
                        fontSize: "9.5px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        background: isCritical ? "rgba(239, 68, 68, 0.3)" : "rgba(6, 182, 212, 0.2)",
                        color: isCritical ? "#f87171" : "#38bdf8",
                        borderRadius: "4px",
                      }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
                {entry.at && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {formatTime(entry.at)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
