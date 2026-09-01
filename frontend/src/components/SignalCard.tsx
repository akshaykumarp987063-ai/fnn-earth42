import type { Incident } from "../types/fnn";
import { relativeMinutes } from "../utils/formatters";
import { IncidentStatusBadge, SeverityBadge, UrgencyBadge } from "./StatusBadge";
import { PrivacyBadge } from "./PrivacyBadge";
import {
  Activity,
  AlertOctagon,
  Clock,
  Heart,
  HelpCircle,
  MapPin,
  Shield,
  ThumbsDown,
  ThumbsUp,
  User,
  Utensils,
  Wrench,
  Zap,
} from "lucide-react";
import { useFnn } from "../context/FnnContext";

interface SignalCardProps {
  incident: Incident;
  onClick?: () => void;
  compact?: boolean;
}

export function SignalCard({ incident, onClick, compact = false }: SignalCardProps) {
  const { vote, votes, openIncident } = useFnn();
  const userVote = votes[incident.id];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "MEDICAL":
        return <Activity size={16} color="#ef4444" />;
      case "PERSONAL SAFETY":
      case "WOMEN SAFETY":
      case "CHILD SAFETY":
        return <Shield size={16} color="#38bdf8" />;
      case "ELDERLY ASSISTANCE":
      case "PHYSICAL HELP":
        return <Heart size={16} color="#f472b6" />;
      case "FOOD AID":
        return <Utensils size={16} color="#4ade80" />;
      case "INFRASTRUCTURE":
        return <Wrench size={16} color="#fbbf24" />;
      case "DISASTER":
        return <AlertOctagon size={16} color="#ef4444" />;
      default:
        return <HelpCircle size={16} color="#94a3b8" />;
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      openIncident(incident.id);
    }
  };

  const isCritical = incident.severity === "CRITICAL" || incident.isSos;

  return (
    <div
      className={`glass-card glass-card-interactive ${isCritical ? "glow-critical" : ""}`}
      style={{
        padding: compact ? "14px 16px" : "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        borderLeft: isCritical
          ? "4px solid #ef4444"
          : incident.severity === "HIGH"
          ? "4px solid #f59e0b"
          : "4px solid var(--cyan-primary)",
      }}
      onClick={handleCardClick}
    >
      {/* Top row: Category, Severity, Urgency, Time */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(15, 23, 42, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {getCategoryIcon(incident.category)}
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
            {incident.category}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <SeverityBadge severity={incident.severity} />
          <UrgencyBadge urgency={incident.urgency} />
          <IncidentStatusBadge status={incident.status} />
        </div>
      </div>

      {/* Main content: Title & Description */}
      <div>
        <h3
          style={{
            fontSize: compact ? "14.5px" : "16px",
            fontWeight: 600,
            color: "#f8fafc",
            marginBottom: "4px",
            lineHeight: 1.35,
          }}
        >
          {incident.title}
        </h3>
        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-secondary)",
            lineHeight: 1.45,
            display: "-webkit-box",
            WebkitLineClamp: compact ? 2 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {incident.description}
        </p>
      </div>

      {/* AI Triage snippet if available */}
      {incident.summary && (
        <div
          style={{
            background: "rgba(6, 182, 212, 0.06)",
            border: "1px solid rgba(6, 182, 212, 0.18)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px",
            fontSize: "12px",
            color: "#cbd5e1",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <Zap size={14} color="#38bdf8" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, color: "#38bdf8" }}>AI Triage ({incident.confidence}%): </span>
            <span>{incident.summary}</span>
          </div>
        </div>
      )}

      {/* Location & Privacy strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          paddingTop: "6px",
          borderTop: "1px solid var(--border-subtle)",
          fontSize: "12px",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#94a3b8" }}>
            <MapPin size={13} color="#22d3ee" />
            <span style={{ fontWeight: 500 }}>{incident.approximateArea}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--text-muted)" }}>
            <User size={13} />
            <span>{incident.reporterPseudonym}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Clock size={12} />
            <span>{relativeMinutes(incident.createdAt)}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Quick verification buttons */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 8px",
                fontSize: "11px",
                borderRadius: "var(--radius-sm)",
                background: userVote === "UP" ? "rgba(16, 185, 129, 0.25)" : "rgba(30, 41, 59, 0.6)",
                border: userVote === "UP" ? "1px solid #10b981" : "1px solid var(--border-subtle)",
                color: userVote === "UP" ? "#4ade80" : "#cbd5e1",
              }}
              title="Verify signal (within 500m radius)"
              onClick={() => vote(incident.id, "UP")}
            >
              <ThumbsUp size={11} />
              <span>{incident.upvotes}</span>
            </button>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 8px",
                fontSize: "11px",
                borderRadius: "var(--radius-sm)",
                background: userVote === "DOWN" ? "rgba(239, 68, 68, 0.25)" : "rgba(30, 41, 59, 0.6)",
                border: userVote === "DOWN" ? "1px solid #ef4444" : "1px solid var(--border-subtle)",
                color: userVote === "DOWN" ? "#f87171" : "#cbd5e1",
              }}
              title="Reject signal"
              onClick={() => vote(incident.id, "DOWN")}
            >
              <ThumbsDown size={11} />
              <span>{incident.downvotes}</span>
            </button>
          </div>

          <PrivacyBadge type="shield" compact />
        </div>
      </div>
    </div>
  );
}
