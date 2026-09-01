import { useFnn } from "../context/FnnContext";
import type { SosKind } from "../types/fnn";
import { formatTime } from "../utils/formatters";
import { IncidentTimeline } from "../components/IncidentTimeline";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Flame,
  Heart,
  Shield,
  ShieldAlert,
  Users,
} from "lucide-react";

export function SOS() {
  const { activateSos, safetyCircle, audit, incidents, openIncident } = useFnn();

  const sosIncidents = incidents.filter((i) => i.isSos || i.severity === "CRITICAL");
  const latestSos = sosIncidents[0];

  const sosButtons: { kind: SosKind; label: string; desc: string; icon: React.ComponentType<{ size?: number }>; color: string; bg: string }[] = [
    { kind: "MEDICAL", label: "Medical Emergency", desc: "Injury, cardiac, or medical trauma", icon: Activity, color: "#f87171", bg: "rgba(239, 68, 68, 0.15)" },
    { kind: "POLICE", label: "Police / Assault Threat", desc: "Physical violence or personal danger", icon: ShieldAlert, color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)" },
    { kind: "WOMEN HELP", label: "Women Safety SOS", desc: "Emergency women assistance & escorts", icon: Heart, color: "#f472b6", bg: "rgba(244, 114, 182, 0.15)" },
    { kind: "CHILD HELP", label: "Child Safety SOS", desc: "Missing or endangered minor", icon: Users, color: "#fbbf24", bg: "rgba(251, 191, 36, 0.15)" },
    { kind: "FIRE", label: "Fire / Hazard SOS", desc: "Blaze, chemical leak, or smoke", icon: Flame, color: "#f97316", bg: "rgba(249, 115, 22, 0.15)" },
    { kind: "OTHER", label: "General Emergency", desc: "Other critical immediate emergency", icon: AlertTriangle, color: "#cbd5e1", bg: "rgba(203, 213, 225, 0.15)" },
  ];

  const handleTriggerSos = (kind: SosKind) => {
    activateSos(kind);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 0 20px rgba(220, 38, 38, 0.5)",
              }}
            >
              <Flame size={22} className="animate-pulse-glow" />
            </div>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>
                Emergency SOS Coordination
              </h1>
              <p style={{ fontSize: "14px", color: "#fca5a5", marginTop: "2px" }}>
                Use SOS when immediate coordinated community help is required.
              </p>
            </div>
          </div>
        </div>

        <span
          className="badge glow-critical"
          style={{
            background: "rgba(239, 68, 68, 0.2)",
            color: "#f87171",
            border: "1px solid #ef4444",
            padding: "6px 14px",
            fontSize: "12px",
          }}
        >
          <Flame size={14} />
          <span>IMMEDIATE ESCALATION ACTIVE</span>
        </span>
      </div>

      {/* Prominent Demo & Safety Disclaimer */}
      <div
        style={{
          background: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          color: "#fca5a5",
          fontSize: "13px",
        }}
      >
        <AlertOctagon size={20} style={{ marginTop: "2px", flexShrink: 0 }} />
        <div>
          <strong style={{ textTransform: "uppercase", letterSpacing: "0.02em" }}>
            CONTROLLED DEMO WORKFLOW · MOCK AUTHORITY PROTOCOL
          </strong>
          <p style={{ marginTop: "3px", color: "#cbd5e1" }}>
            FNN does not perform real emergency dispatch (112 / Police / EMS) in this prototype. All authority escalations are routed to a verified <strong>MOCK_AUTHORITY</strong> simulation for audit logging and safety demonstrations.
          </p>
        </div>
      </div>

      {/* 6 Large SOS Triggers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>
          One-Touch Emergency SOS Triggers
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "14px",
          }}
        >
          {sosButtons.map((btn) => {
            const Icon = btn.icon;

            return (
              <button
                key={btn.kind}
                className="glass-card glass-card-interactive"
                style={{
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  textAlign: "left",
                  borderLeft: `4px solid ${btn.color}`,
                }}
                onClick={() => handleTriggerSos(btn.kind)}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--radius-md)",
                    background: btn.bg,
                    border: `1px solid ${btn.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: btn.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                    {btn.label}
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {btn.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Circle & Controlled Escalation Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "18px",
        }}
      >
        {/* Safety Circle Status Card */}
        <div
          className="glass-card"
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={18} color="#06b6d4" />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                Safety Circle Status
              </h3>
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Direct trusted responder network
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {safetyCircle.map((member) => (
              <div
                key={member.id}
                style={{
                  background: "rgba(15, 23, 42, 0.75)",
                  border:
                    member.status === "NOTIFIED"
                      ? "1px solid rgba(16, 185, 129, 0.4)"
                      : "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {member.role}
                  </div>
                </div>

                <span
                  className="badge"
                  style={{
                    background:
                      member.status === "NOTIFIED"
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(100, 116, 139, 0.2)",
                    color: member.status === "NOTIFIED" ? "#34d399" : "#94a3b8",
                    border:
                      member.status === "NOTIFIED"
                        ? "1px solid #10b981"
                        : "1px solid var(--border-subtle)",
                  }}
                >
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Escalation & Audit Log Card */}
        <div
          className="glass-card"
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield size={18} color="#f87171" />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                Emergency Audit Trail
              </h3>
            </div>
            <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
              Recorded for accountability
            </span>
          </div>

          <div
            style={{
              maxHeight: "260px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {audit.slice(0, 8).map((evt) => (
              <div
                key={evt.id}
                style={{
                  background: evt.sensitive ? "rgba(239, 68, 68, 0.1)" : "rgba(15, 23, 42, 0.6)",
                  border: evt.sensitive
                    ? "1px solid rgba(239, 68, 68, 0.3)"
                    : "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: evt.sensitive ? "#fca5a5" : "#38bdf8",
                    }}
                  >
                    {evt.label}
                  </span>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                    }}
                  >
                    {formatTime(evt.at)}
                  </span>
                </div>
                <div style={{ color: "#cbd5e1", marginTop: "3px" }}>{evt.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Active SOS Signal Details if any */}
      {latestSos && (
        <div
          className="glass-card glow-critical"
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            border: "1px solid #ef4444",
            background: "rgba(20, 8, 12, 0.9)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Flame size={18} color="#ef4444" />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                Active SOS: {latestSos.title}
              </h3>
            </div>

            <button
              className="btn-danger"
              style={{ padding: "6px 14px", fontSize: "12px" }}
              onClick={() => openIncident(latestSos.id)}
            >
              View Full Incident
            </button>
          </div>

          <p style={{ fontSize: "13.5px", color: "#fca5a5" }}>
            {latestSos.description}
          </p>

          <div style={{ background: "rgba(10, 5, 8, 0.7)", padding: "14px", borderRadius: "var(--radius-md)" }}>
            <IncidentTimeline timeline={latestSos.timeline} compact={true} />
          </div>
        </div>
      )}
    </div>
  );
}
