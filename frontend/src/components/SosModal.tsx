import { useState } from "react";
import { useFnn } from "../context/FnnContext";
import { Modal } from "./Modal";
import type { SosKind } from "../types/fnn";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Flame,
  Heart,
  ShieldAlert,
  Users,
} from "lucide-react";

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SosModal({ isOpen, onClose }: SosModalProps) {
  const { activateSos, safetyCircle, setView } = useFnn();
  const [selectedKind, setSelectedKind] = useState<SosKind | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const options: { kind: SosKind; label: string; desc: string; icon: React.ComponentType<{ size?: number; color?: string }>; color: string }[] = [
    { kind: "MEDICAL", label: "Medical SOS", desc: "Injury, cardiac, or medical emergency", icon: Activity, color: "#ef4444" },
    { kind: "POLICE", label: "Police / Safety SOS", desc: "Violence, threat, or personal assault", icon: ShieldAlert, color: "#38bdf8" },
    { kind: "WOMEN HELP", label: "Women Safety SOS", desc: "Emergency women assistance & escorts", icon: Heart, color: "#f472b6" },
    { kind: "CHILD HELP", label: "Child Safety SOS", desc: "Lost or endangered child coordination", icon: Users, color: "#fbbf24" },
    { kind: "FIRE", label: "Fire / Disaster SOS", desc: "Fire outbreak or natural hazard", icon: Flame, color: "#f97316" },
    { kind: "OTHER", label: "General SOS", desc: "Other critical immediate emergency", icon: AlertTriangle, color: "#cbd5e1" },
  ];

  const handleSelect = (kind: SosKind) => {
    setSelectedKind(kind);
  };

  const handleConfirm = () => {
    if (!selectedKind) return;
    activateSos(selectedKind);
    setConfirmed(true);
  };

  const handleFinish = () => {
    setConfirmed(false);
    setSelectedKind(null);
    onClose();
    setView("sos");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f87171" }}>
          <Flame size={20} className="animate-pulse-glow" />
          <span>Emergency SOS Coordination</span>
        </div>
      }
      subtitle="Immediate coordinated help workflow for critical situations"
      maxWidth="620px"
      isCritical={true}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* Important Disclaimer Notice */}
        <div
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            fontSize: "12px",
            color: "#fca5a5",
          }}
        >
          <div style={{ fontWeight: 700, textTransform: "uppercase", marginBottom: "3px", display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertOctagon size={14} />
            <span>CONTROLLED DEMO WORKFLOW · MOCK AUTHORITY ONLY</span>
          </div>
          <div>
            FNN does not perform real emergency 112/police dispatch in this prototype. In a real life-threatening emergency, call official authorities directly.
          </div>
        </div>

        {!confirmed ? (
          <>
            {/* Category selection */}
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "10px" }}>
                Select Emergency Category:
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >
                {options.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedKind === opt.kind;

                  return (
                    <button
                      key={opt.kind}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "var(--radius-md)",
                        background: isSelected
                          ? "rgba(239, 68, 68, 0.25)"
                          : "rgba(15, 23, 42, 0.7)",
                        border: isSelected
                          ? "2px solid #ef4444"
                          : "1px solid var(--border-subtle)",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        boxShadow: isSelected ? "0 0 16px rgba(239, 68, 68, 0.4)" : "none",
                      }}
                      onClick={() => handleSelect(opt.kind)}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(0,0,0,0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: opt.color,
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirmation details if selected */}
            {selectedKind && (
              <div
                className="animate-fade-in"
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 16px",
                  fontSize: "12.5px",
                  color: "#e2e8f0",
                }}
              >
                <div style={{ fontWeight: 700, color: "#f87171", marginBottom: "4px" }}>
                  Activate {selectedKind} SOS?
                </div>
                <div>
                  An immediate critical signal will be generated, your <strong>Safety Circle</strong> (Family, Campus Security, Trusted Friend) will be alerted, and a controlled escalation event will be logged.
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "10px",
                paddingTop: "10px",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <button
                className="btn-secondary"
                style={{ padding: "8px 16px", fontSize: "13px" }}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="btn-danger"
                style={{
                  padding: "8px 20px",
                  fontSize: "13px",
                  opacity: selectedKind ? 1 : 0.5,
                  pointerEvents: selectedKind ? "auto" : "none",
                }}
                onClick={handleConfirm}
              >
                <Flame size={15} />
                <span>Confirm SOS Activation</span>
              </button>
            </div>
          </>
        ) : (
          /* Confirmation Success / Escalation State */
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid #ef4444",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#fca5a5" }}>
                EMERGENCY SOS BROADCASTED (DEMO)
              </div>
              <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px" }}>
                Critical signal generated · Urgency set to IMMEDIATE
              </p>
            </div>

            {/* Safety circle status cards */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                Safety Circle Status (3/3 Notified)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {safetyCircle.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(16, 185, 129, 0.35)",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>{member.name}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{member.role}</div>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "4px",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "3px",
                        background: "rgba(16, 185, 129, 0.2)",
                        color: "#4ade80",
                      }}
                    >
                      NOTIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                className="btn-primary"
                style={{ padding: "8px 18px", fontSize: "13px" }}
                onClick={handleFinish}
              >
                Go to SOS Emergency Center
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
