import type { Hero } from "../types/fnn";
import { CheckCircle2, MapPin, Shield, Star, Zap } from "lucide-react";
import { useFnn } from "../context/FnnContext";

interface HeroCardProps {
  hero: Hero;
  onSelect?: () => void;
  showActions?: boolean;
}

export function HeroCard({ hero, onSelect, showActions = true }: HeroCardProps) {
  const { tasks, acceptTask, advanceTask, resolveTask, incidents } = useFnn();

  const assignedTask = tasks.find(
    (t) => t.heroId === hero.id && t.status !== "RESOLVED"
  );
  const matchedIncident = assignedTask
    ? incidents.find((i) => i.id === assignedTask.incidentId)
    : null;

  return (
    <div
      className="glass-card"
      style={{
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        borderTop: hero.available ? "3px solid #10b981" : "3px solid #64748b",
      }}
    >
      {/* Header: Pseudonym, Distance, Availability */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              {hero.pseudonym.replace(/[^0-9A-Za-z]/g, "").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: "15.5px", fontWeight: 700, color: "#f8fafc" }}>
                {hero.pseudonym}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-muted)" }}>
                <MapPin size={12} color="#22d3ee" />
                <span>{hero.distanceLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {hero.available ? (
            <span
              className="badge glow-safe"
              style={{
                background: "rgba(16, 185, 129, 0.18)",
                color: "#34d399",
                border: "1px solid #10b981",
              }}
            >
              <CheckCircle2 size={11} />
              <span>AVAILABLE</span>
            </span>
          ) : (
            <span
              className="badge"
              style={{
                background: "rgba(100, 116, 139, 0.18)",
                color: "#94a3b8",
                border: "1px solid rgba(148, 163, 184, 0.25)",
              }}
            >
              <span>BUSY ({hero.workload})</span>
            </span>
          )}
        </div>
      </div>

      {/* Skills tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {hero.skills.map((skill) => (
          <span
            key={skill}
            style={{
              fontSize: "11px",
              fontWeight: 500,
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(6, 182, 212, 0.1)",
              border: "1px solid rgba(6, 182, 212, 0.22)",
              color: "#38bdf8",
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Metrics: Reliability, Reputation, Workload */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          background: "rgba(15, 23, 42, 0.5)",
          padding: "10px 12px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Reliability</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
            <Shield size={12} />
            <span>{hero.reliability}%</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Reputation</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
            <Star size={12} />
            <span>{hero.reputation}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Workload</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
            <Zap size={12} />
            <span>{hero.workload}</span>
          </div>
        </div>
      </div>

      {/* Active Task State Machine Progression */}
      {assignedTask && (
        <div
          style={{
            background: "rgba(30, 41, 59, 0.7)",
            padding: "10px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
            <span style={{ fontWeight: 600, color: "#60a5fa" }}>Active Assignment</span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                background: "rgba(59, 130, 246, 0.2)",
                color: "#93c5fd",
              }}
            >
              {assignedTask.status}
            </span>
          </div>

          {matchedIncident && (
            <div style={{ fontSize: "12px", color: "#cbd5e1" }}>
              Incident: <span style={{ fontWeight: 500, color: "#fff" }}>{matchedIncident.title}</span>
            </div>
          )}

          {/* Task Step Transition Buttons */}
          <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
            {assignedTask.status === "ASSIGNED" && (
              <button
                className="btn-primary"
                style={{ flex: 1, padding: "6px 10px", fontSize: "12px" }}
                onClick={() => acceptTask(assignedTask.id)}
              >
                Accept Task
              </button>
            )}

            {assignedTask.status === "ACCEPTED" && (
              <button
                className="btn-secondary"
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  fontSize: "12px",
                  background: "rgba(245, 158, 11, 0.2)",
                  borderColor: "#f59e0b",
                  color: "#fbbf24",
                }}
                onClick={() => advanceTask(assignedTask.id, "RESPONDING")}
              >
                Mark Responding
              </button>
            )}

            {assignedTask.status === "RESPONDING" && (
              <button
                className="btn-secondary"
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  fontSize: "12px",
                  background: "rgba(16, 185, 129, 0.2)",
                  borderColor: "#10b981",
                  color: "#34d399",
                }}
                onClick={() => advanceTask(assignedTask.id, "ARRIVED")}
              >
                Mark Arrived on Scene
              </button>
            )}

            {assignedTask.status === "ARRIVED" && (
              <button
                className="btn-success"
                style={{ flex: 1, padding: "6px 10px", fontSize: "12px" }}
                onClick={() => resolveTask(assignedTask.id)}
              >
                Resolve Incident (+15 Credits)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      {showActions && !assignedTask && (
        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
          <button
            className="btn-secondary"
            style={{ flex: 1, padding: "8px 12px", fontSize: "12.5px" }}
            onClick={onSelect}
          >
            View Profile
          </button>
        </div>
      )}
    </div>
  );
}
