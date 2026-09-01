import { useState } from "react";
import { useFnn } from "../context/FnnContext";
import { HeroCard } from "../components/HeroCard";
import { PrivacyBanner } from "../components/PrivacyBadge";
import {
  CheckCircle2,
  Filter,
  Radio,
  Zap,
} from "lucide-react";

export function Heroes() {
  const { heroes, tasks, incidents, acceptTask, advanceTask, resolveTask, openIncident } = useFnn();
  const [skillFilter, setSkillFilter] = useState<string>("ALL");
  const [availFilter, setAvailFilter] = useState<"ALL" | "AVAILABLE" | "BUSY">("ALL");

  const skillsList = [
    "First Aid",
    "Safety",
    "Medical",
    "Child Safety",
    "Women Safety",
    "Crowd Safety",
    "Elder Assistance",
    "Disaster Response",
    "Electrical",
    "Transport",
  ];

  const filteredHeroes = heroes.filter((h) => {
    if (skillFilter !== "ALL" && !h.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()))) {
      return false;
    }
    if (availFilter === "AVAILABLE" && !h.available) return false;
    if (availFilter === "BUSY" && h.available) return false;
    return true;
  });

  const activeTasks = tasks.filter((t) => t.status !== "RESOLVED");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
            Hero Coordination Center
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Nearby verified volunteers equipped with safety, medical, and emergency skills
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            className="badge glow-safe"
            style={{
              background: "rgba(16, 185, 129, 0.2)",
              color: "#34d399",
              border: "1px solid #10b981",
              padding: "6px 12px",
              fontSize: "12px",
            }}
          >
            <Zap size={13} />
            <span>{heroes.filter((h) => h.available).length} HEROES ON STANDBY</span>
          </span>
        </div>
      </div>

      <PrivacyBanner />

      {/* Top Metrics Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
        }}
      >
        <div className="glass-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>Registered Heroes</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginTop: "2px" }}>{heroes.length}</div>
          <div style={{ fontSize: "12px", color: "var(--cyan-light)" }}>Hyperlocal network</div>
        </div>

        <div className="glass-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>Active Tasks</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#fbbf24", marginTop: "2px" }}>{activeTasks.length}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>In progress</div>
        </div>

        <div className="glass-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>Average Reliability</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#34d399", marginTop: "2px" }}>97.5%</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Consensus verified</div>
        </div>

        <div className="glass-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>Resolution Reward</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#38bdf8", marginTop: "2px" }}>+15 Credits</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Per completed response</div>
        </div>
      </div>

      {/* Active Tasks Coordination Board */}
      {activeTasks.length > 0 && (
        <div
          className="glass-card"
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            borderLeft: "4px solid #3b82f6",
            background: "rgba(10, 18, 36, 0.88)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Radio size={18} color="#60a5fa" className="animate-pulse-glow" />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                Active Task State Machine
              </h3>
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Step transitions: ASSIGNED → ACCEPTED → RESPONDING → ARRIVED → RESOLVED
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeTasks.map((task) => {
              const matchedHero = heroes.find((h) => h.id === task.heroId);
              const matchedInc = incidents.find((i) => i.id === task.incidentId);

              return (
                <div
                  key={task.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14.5px", fontWeight: 700, color: "#f8fafc" }}>
                        {matchedHero?.pseudonym || "Assigned Hero"}
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: "rgba(59, 130, 246, 0.2)",
                          color: "#93c5fd",
                          border: "1px solid #3b82f6",
                        }}
                      >
                        STATUS: {task.status}
                      </span>
                    </div>
                    {matchedInc && (
                      <div
                        style={{
                          fontSize: "12.5px",
                          color: "var(--text-secondary)",
                          marginTop: "3px",
                          cursor: "pointer",
                        }}
                        onClick={() => openIncident(matchedInc.id)}
                      >
                        Incident: <span style={{ color: "#38bdf8", textDecoration: "underline" }}>{matchedInc.title}</span> ({matchedInc.approximateArea})
                      </div>
                    )}
                  </div>

                  {/* Task Progression Stepper Buttons */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {task.status === "ASSIGNED" && (
                      <button
                        className="btn-primary"
                        style={{ padding: "6px 14px", fontSize: "12.5px" }}
                        onClick={() => acceptTask(task.id)}
                      >
                        Accept Task
                      </button>
                    )}

                    {task.status === "ACCEPTED" && (
                      <button
                        className="btn-secondary"
                        style={{
                          padding: "6px 14px",
                          fontSize: "12.5px",
                          background: "rgba(245, 158, 11, 0.2)",
                          borderColor: "#f59e0b",
                          color: "#fbbf24",
                        }}
                        onClick={() => advanceTask(task.id, "RESPONDING")}
                      >
                        Mark Responding
                      </button>
                    )}

                    {task.status === "RESPONDING" && (
                      <button
                        className="btn-secondary"
                        style={{
                          padding: "6px 14px",
                          fontSize: "12.5px",
                          background: "rgba(16, 185, 129, 0.2)",
                          borderColor: "#10b981",
                          color: "#34d399",
                        }}
                        onClick={() => advanceTask(task.id, "ARRIVED")}
                      >
                        Mark Arrived on Scene
                      </button>
                    )}

                    {task.status === "ARRIVED" && (
                      <button
                        className="btn-success"
                        style={{ padding: "6px 16px", fontSize: "12.5px" }}
                        onClick={() => resolveTask(task.id)}
                      >
                        <CheckCircle2 size={14} />
                        <span>Resolve Incident (+15 Credits)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div
        className="glass-card"
        style={{
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          background: "rgba(10, 16, 32, 0.8)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <Filter size={14} color="#94a3b8" />
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>SKILL:</span>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            style={{ padding: "6px 10px", fontSize: "12px" }}
          >
            <option value="ALL">All Skills</option>
            {skillsList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "8px" }}>AVAILABILITY:</span>
          {(["ALL", "AVAILABLE", "BUSY"] as const).map((mode) => (
            <button
              key={mode}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                background: availFilter === mode ? "rgba(6, 182, 212, 0.2)" : "rgba(30, 41, 59, 0.5)",
                border: availFilter === mode ? "1px solid #06b6d4" : "1px solid var(--border-subtle)",
                color: availFilter === mode ? "#38bdf8" : "#94a3b8",
              }}
              onClick={() => setAvailFilter(mode)}
            >
              {mode}
            </button>
          ))}
        </div>

        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Showing <strong>{filteredHeroes.length}</strong> heroes
        </span>
      </div>

      {/* Hero Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredHeroes.map((hero) => (
          <HeroCard key={hero.id} hero={hero} showActions={true} />
        ))}
      </div>
    </div>
  );
}
