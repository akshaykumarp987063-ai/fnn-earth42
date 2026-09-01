import { useFnn } from "../context/FnnContext";
import { Modal } from "./Modal";
import { IncidentStatusBadge, SeverityBadge, UrgencyBadge } from "./StatusBadge";
import { PrivacyBadge } from "./PrivacyBadge";
import { IncidentTimeline } from "./IncidentTimeline";
import {
  CheckCircle2,
  Flame,
  MapPin,
  Shield,
  ThumbsDown,
  ThumbsUp,
  User,
  Zap,
} from "lucide-react";

export function IncidentDetailModal() {
  const {
    selectedId,
    closeIncident,
    incidents,
    heroes,
    tasks,
    votes,
    vote,
    findHero,
    resolveTask,
    escalate,
  } = useFnn();

  if (!selectedId) return null;

  const incident = incidents.find((i) => i.id === selectedId);
  if (!incident) return null;

  const matchedHero = heroes.find((h) => h.id === incident.matchedHeroId);
  const matchedTask = tasks.find((t) => t.id === incident.matchedTaskId);
  const userVote = votes[incident.id];
  const isCritical = incident.severity === "CRITICAL" || incident.isSos;

  return (
    <Modal
      isOpen={Boolean(selectedId)}
      onClose={closeIncident}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span>{incident.title}</span>
          <SeverityBadge severity={incident.severity} />
          <UrgencyBadge urgency={incident.urgency} />
          <IncidentStatusBadge status={incident.status} />
        </div>
      }
      subtitle={`Reported ${incident.reporterPseudonym} · ${incident.approximateArea}`}
      maxWidth="720px"
      isCritical={isCritical}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Top Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            background: "rgba(15, 23, 42, 0.6)",
            padding: "16px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Category</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
              {incident.category}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Approximate Area</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#22d3ee", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={13} />
              <span>{incident.approximateArea}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Reporter Identity</div>
            <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#cbd5e1", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
              <User size={13} />
              <span>{incident.reporterPseudonym}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Stake Amount</div>
            <div style={{ fontSize: "13.5px", fontWeight: 600, color: incident.stakeReleased ? "#34d399" : "#fbbf24", marginTop: "2px" }}>
              {incident.stakeAmount} Credits ({incident.stakeReleased ? "Released" : "Locked in Stake"})
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
            Observation Description
          </h4>
          <p style={{ fontSize: "14px", color: "#f1f5f9", lineHeight: 1.5, background: "rgba(15, 23, 42, 0.4)", padding: "12px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            {incident.description}
          </p>
        </div>

        {/* AI Triage Card */}
        {incident.summary && (
          <div
            style={{
              background: "rgba(6, 182, 212, 0.08)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontWeight: 700, fontSize: "12.5px" }}>
                <Zap size={14} />
                <span>AI SAFETY TRIAGE ({incident.confidence}% CONFIDENCE)</span>
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Source: {incident.triageSource === "live" ? "Live ML Pipeline" : "Deterministic Safety Engine"}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>
              {incident.summary}
            </p>
            <div style={{ fontSize: "11.5px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", paddingTop: "4px", borderTop: "1px solid rgba(6, 182, 212, 0.15)" }}>
              <Shield size={12} color="#06b6d4" />
              <span>AI assists triage. Human responders remain responsible for high-stakes decisions.</span>
            </div>
          </div>
        )}

        {/* Privacy & Safeguard Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
            padding: "10px 14px",
            background: "rgba(15, 23, 42, 0.7)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <PrivacyBadge type="map" />
            <PrivacyBadge type="shield" />
            <PrivacyBadge type="user" />
          </div>
        </div>

        {/* Community Verification Strip */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
              Community Radius Verification
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Verification radius: <strong style={{ color: "#38bdf8" }}>500m</strong> · Voter Status:{" "}
              <span style={{ color: "#34d399", fontWeight: 600 }}>Within verification radius</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className="btn-secondary"
              style={{
                background: userVote === "UP" ? "rgba(16, 185, 129, 0.25)" : undefined,
                borderColor: userVote === "UP" ? "#10b981" : undefined,
                color: userVote === "UP" ? "#4ade80" : undefined,
                fontSize: "12.5px",
                padding: "6px 14px",
              }}
              onClick={() => vote(incident.id, "UP")}
            >
              <ThumbsUp size={14} />
              <span>Verify ({incident.upvotes})</span>
            </button>
            <button
              className="btn-secondary"
              style={{
                background: userVote === "DOWN" ? "rgba(239, 68, 68, 0.25)" : undefined,
                borderColor: userVote === "DOWN" ? "#ef4444" : undefined,
                color: userVote === "DOWN" ? "#f87171" : undefined,
                fontSize: "12.5px",
                padding: "6px 14px",
              }}
              onClick={() => vote(incident.id, "DOWN")}
            >
              <ThumbsDown size={14} />
              <span>Reject ({incident.downvotes})</span>
            </button>
          </div>
        </div>

        {/* Matched Hero Info */}
        {matchedHero && (
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--cyan-light)", textTransform: "uppercase", fontWeight: 700 }}>
                Matched Responder
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
                {matchedHero.pseudonym}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {matchedHero.distanceLabel} · Skills: {matchedHero.skills.join(", ")}
              </div>
            </div>

            {matchedTask && (
              <div>
                <span
                  className="badge"
                  style={{
                    background: "rgba(59, 130, 246, 0.2)",
                    color: "#93c5fd",
                    border: "1px solid #3b82f6",
                  }}
                >
                  TASK: {matchedTask.status}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Incident Status Timeline */}
        <div>
          <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>
            Incident Status Timeline
          </h4>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <IncidentTimeline timeline={incident.timeline} />
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            paddingTop: "14px",
            borderTop: "1px solid var(--border-subtle)",
            flexWrap: "wrap",
          }}
        >
          {/* Find Hero button */}
          {!matchedHero && incident.status !== "RESOLVED" && (
            <button
              className="btn-primary"
              style={{ fontSize: "13px", padding: "8px 16px" }}
              onClick={() => findHero(incident.id)}
            >
              <Zap size={14} />
              <span>Find Nearby Hero</span>
            </button>
          )}

          {/* Resolve button */}
          {matchedTask && matchedTask.status !== "RESOLVED" && (
            <button
              className="btn-success"
              style={{ fontSize: "13px", padding: "8px 16px" }}
              onClick={() => resolveTask(matchedTask.id)}
            >
              <CheckCircle2 size={14} />
              <span>Resolve Incident (+15 Credits)</span>
            </button>
          )}

          {/* Escalate button */}
          {incident.status !== "ESCALATED" && incident.status !== "RESOLVED" && (
            <button
              className="btn-danger"
              style={{ fontSize: "13px", padding: "8px 16px" }}
              onClick={() => escalate(incident.id)}
            >
              <Flame size={14} />
              <span>Escalate (Controlled Demo)</span>
            </button>
          )}

          <button
            className="btn-secondary"
            style={{ fontSize: "13px", padding: "8px 16px" }}
            onClick={closeIncident}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
