import { useFnn } from "../context/FnnContext";
import { PrivacyBadge } from "./PrivacyBadge";
import { SeverityBadge, UrgencyBadge } from "./StatusBadge";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

export function DemoRunner() {
  const { demoPhase, demoNext, closeDemo, runFullDemo } = useFnn();

  if (demoPhase === "idle") return null;

  const phases = [
    { id: "signal", num: "01", title: "SIGNAL RECEIVED", desc: "Citizen sends privacy-shielded observation" },
    { id: "triage", num: "02", title: "AI TRIAGE", desc: "Local classification & urgency assessment" },
    { id: "privacy", num: "03", title: "PRIVACY SHIELD", desc: "Exact coordinates locked & pseudonym applied" },
    { id: "verification", num: "04", title: "COMMUNITY VERIFICATION", desc: "500m radius consensus verification" },
    { id: "matching", num: "05", title: "HERO MATCHING", desc: "Nearest qualified responder paired" },
    { id: "task", num: "06", title: "RESPONSE WORKFLOW", desc: "Accepted → Responding → Arrived on scene" },
    { id: "resolution", num: "07", title: "RESOLUTION & CREDITS", desc: "Incident closed & +15 credits awarded" },
    { id: "complete", num: "08", title: "COORDINATION COMPLETE", desc: "Story finished successfully" },
  ];

  const currentIdx = phases.findIndex((p) => p.id === demoPhase);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(4, 7, 16, 0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="glass-card glow-cyan animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "#080d1e",
          border: "1px solid #06b6d4",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 40px rgba(6, 182, 212, 0.35)",
        }}
      >
        {/* Modal Top Strip */}
        <div
          style={{
            padding: "16px 24px",
            background: "linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)",
            borderBottom: "1px solid rgba(6, 182, 212, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-md)",
                background: "#06b6d4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>
                LIVE DEMO SCENARIO: FIGHT AT CAMPUS BUS STAND
              </h2>
              <p style={{ fontSize: "12px", color: "var(--cyan-light)" }}>
                Watch FNN transform a raw observation into verified community resolution
              </p>
            </div>
          </div>

          <button
            style={{ color: "var(--text-muted)", padding: "4px" }}
            onClick={closeDemo}
            aria-label="Close demo"
          >
            <X size={20} />
          </button>
        </div>

        {/* Phase Step Tracker Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: "2px",
            background: "rgba(15, 23, 42, 0.8)",
            padding: "8px 16px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {phases.map((p, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={p.id}
                style={{
                  textAlign: "center",
                  padding: "4px 2px",
                  borderRadius: "4px",
                  background: isCurrent
                    ? "rgba(6, 182, 212, 0.25)"
                    : isDone
                    ? "rgba(16, 185, 129, 0.15)"
                    : "transparent",
                  borderBottom: isCurrent
                    ? "2px solid #22d3ee"
                    : isDone
                    ? "2px solid #10b981"
                    : "2px solid transparent",
                }}
              >
                <div
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 700,
                    color: isCurrent ? "#38bdf8" : isDone ? "#34d399" : "#64748b",
                  }}
                >
                  {p.num}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: isCurrent ? "#fff" : isDone ? "#94a3b8" : "#475569",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.title.split(" ")[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase Content Stage */}
        <div style={{ padding: "28px 32px", minHeight: "280px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* PHASE 1: Signal Received */}
          {demoPhase === "signal" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge" style={{ background: "rgba(6, 182, 212, 0.2)", color: "#38bdf8" }}>
                  PHASE 1 OF 7
                </span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>SIGNAL RECEIVED</span>
              </div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 20px",
                }}
              >
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#f8fafc", marginBottom: "8px" }}>
                  "Fight reported near campus bus stand. Several people are gathering."
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                  <span className="badge" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#38bdf8" }}>
                    PERSONAL SAFETY
                  </span>
                  <SeverityBadge severity="HIGH" />
                  <UrgencyBadge urgency="URGENT" />
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Stake: 10 Credits</span>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 2: AI Triage */}
          {demoPhase === "triage" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge" style={{ background: "rgba(6, 182, 212, 0.2)", color: "#38bdf8" }}>
                  PHASE 2 OF 7
                </span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>AI TRIAGE COMPLETE</span>
              </div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, color: "#22d3ee" }}>Confidence: 94%</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <SeverityBadge severity="HIGH" />
                    <UrgencyBadge urgency="URGENT" />
                  </div>
                </div>
                <div style={{ fontSize: "14px", color: "#e2e8f0" }}>
                  "Possible physical altercation near the bus stand. Nearby verification and a Safety Hero are recommended."
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Recommended Responder: <strong style={{ color: "#38bdf8" }}>SAFETY HERO</strong>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 3: Privacy Shield */}
          {demoPhase === "privacy" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge" style={{ background: "rgba(6, 182, 212, 0.2)", color: "#38bdf8" }}>
                  PHASE 3 OF 7
                </span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>PRIVACY SHIELD ENGAGED</span>
              </div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 20px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Reporter Identity</div>
                  <div style={{ fontSize: "14.5px", fontWeight: 700, color: "#f8fafc", marginTop: "2px" }}>
                    Anonymous Spider #4812
                  </div>
                  <div style={{ marginTop: "4px" }}><PrivacyBadge type="user" compact /></div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Location Visibility</div>
                  <div style={{ fontSize: "14.5px", fontWeight: 700, color: "#22d3ee", marginTop: "2px" }}>
                    Approximate Bus Stand Area
                  </div>
                  <div style={{ marginTop: "4px" }}><PrivacyBadge type="shield" compact /></div>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 4: Verification */}
          {demoPhase === "verification" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge" style={{ background: "rgba(6, 182, 212, 0.2)", color: "#38bdf8" }}>
                  PHASE 4 OF 7
                </span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>COMMUNITY VERIFICATION</span>
              </div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13.5px", color: "#fbbf24", fontWeight: 600 }}>
                    500m Verification Radius Active
                  </span>
                  <span className="badge" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
                    4 NEARBY VOTES
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Consensus reached from verified users within radius. Signal promoted to <strong>VERIFIED</strong>.
                </div>
              </div>
            </div>
          )}

          {/* PHASE 5: Hero Matching */}
          {demoPhase === "matching" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge" style={{ background: "rgba(6, 182, 212, 0.2)", color: "#38bdf8" }}>
                  PHASE 5 OF 7
                </span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>HERO MATCHED</span>
              </div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(6, 182, 212, 0.35)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>Hero #27</h4>
                  <p style={{ fontSize: "13px", color: "var(--cyan-light)" }}>450m away · Skills: Safety, First Aid</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    98% Reliability · 921 Reputation
                  </p>
                </div>
                <span className="badge glow-safe" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#4ade80" }}>
                  ASSIGNED & AVAILABLE
                </span>
              </div>
            </div>
          )}

          {/* PHASE 6: Task Progression */}
          {demoPhase === "task" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge" style={{ background: "rgba(6, 182, 212, 0.2)", color: "#38bdf8" }}>
                  PHASE 6 OF 7
                </span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>HERO RESPONSE LIFECYCLE</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  background: "rgba(15, 23, 42, 0.8)",
                  padding: "18px 20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                }}
              >
                {["ASSIGNED", "ACCEPTED", "RESPONDING", "ARRIVED"].map((step) => (
                  <div key={step} style={{ textAlign: "center", flex: 1 }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#06b6d4",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 6px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#e2e8f0" }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PHASE 7 & Complete: Resolution */}
          {(demoPhase === "resolution" || demoPhase === "complete") && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  boxShadow: "0 0 24px rgba(16, 185, 129, 0.5)",
                  color: "#fff",
                }}
              >
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#4ade80" }}>
                  INCIDENT SUCCESSFULLY RESOLVED
                </h3>
                <p style={{ fontSize: "14px", color: "#cbd5e1", marginTop: "4px" }}>
                  "FNN coordinated the incident from observation to resolution."
                </p>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid #10b981",
                  borderRadius: "var(--radius-lg)",
                  padding: "12px 24px",
                  margin: "0 auto",
                }}
              >
                <Award size={20} color="#34d399" />
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#86efac" }}>
                  +15 Community Credits Awarded · Reporter Stake Released
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        <div
          style={{
            padding: "16px 24px",
            background: "rgba(15, 23, 42, 0.85)",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "13px" }}
            onClick={() => runFullDemo(true)}
          >
            <RotateCcw size={14} />
            <span>Restart Demo (Step-by-Step)</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {demoPhase !== "complete" && (
              <button
                className="btn-primary glow-cyan"
                style={{ padding: "8px 18px", fontSize: "13px" }}
                onClick={demoNext}
              >
                <span>Next Step</span>
                <ArrowRight size={14} />
              </button>
            )}

            <button
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: "13px" }}
              onClick={closeDemo}
            >
              Close Walkthrough
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
