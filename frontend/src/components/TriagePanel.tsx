import { useState, useEffect } from "react";
import type { TriageResult } from "../types/fnn";
import { TRIAGE_STEPS } from "../services/demoService";
import { SeverityBadge, UrgencyBadge } from "./StatusBadge";
import { PrivacyBadge } from "./PrivacyBadge";
import { CheckCircle2, Clock, Loader2, Shield, Sparkles, UserCheck, Zap } from "lucide-react";

interface TriagePanelProps {
  triage: TriageResult;
  isProcessing?: boolean;
  onComplete?: () => void;
}

export function TriagePanel({ triage, isProcessing = true, onComplete }: TriagePanelProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(isProcessing ? 0 : TRIAGE_STEPS.length);

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < TRIAGE_STEPS.length) {
          return prev + 1;
        }
        clearInterval(interval);
        if (onComplete) onComplete();
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isProcessing, onComplete]);

  const isDone = currentStepIndex >= TRIAGE_STEPS.length;

  return (
    <div
      className="glass-card glow-cyan"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        background: "rgba(10, 16, 32, 0.92)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background: "rgba(6, 182, 212, 0.2)",
              border: "1px solid #06b6d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#22d3ee",
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
              {isDone ? "AI TRIAGE COMPLETE" : "AI TRIAGE IN PROGRESS"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              {triage.source === "live" ? "Live AI Pipeline Active" : "Local Safety Triage Engine (Deterministic Fallback)"}
            </p>
          </div>
        </div>

        <div>
          {isDone ? (
            <span
              className="badge glow-safe"
              style={{
                background: "rgba(16, 185, 129, 0.2)",
                color: "#4ade80",
                border: "1px solid #10b981",
              }}
            >
              <CheckCircle2 size={12} />
              <span>TRIAGE READY</span>
            </span>
          ) : (
            <span
              className="badge"
              style={{
                background: "rgba(6, 182, 212, 0.2)",
                color: "#38bdf8",
                border: "1px solid #06b6d4",
              }}
            >
              <Loader2 size={12} className="animate-spin" />
              <span>PROCESSING</span>
            </span>
          )}
        </div>
      </div>

      {/* 6-step progress visualizer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "8px",
        }}
      >
        {TRIAGE_STEPS.map((step, idx) => {
          const stepStatus = idx < currentStepIndex ? "complete" : idx === currentStepIndex ? "processing" : "pending";

          return (
            <div
              key={step}
              style={{
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                background:
                  stepStatus === "complete"
                    ? "rgba(16, 185, 129, 0.12)"
                    : stepStatus === "processing"
                    ? "rgba(6, 182, 212, 0.18)"
                    : "rgba(15, 23, 42, 0.6)",
                border:
                  stepStatus === "complete"
                    ? "1px solid rgba(16, 185, 129, 0.35)"
                    : stepStatus === "processing"
                    ? "1px solid #06b6d4"
                    : "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)" }}>
                  STEP 0{idx + 1}
                </span>
                {stepStatus === "complete" && <CheckCircle2 size={12} color="#10b981" />}
                {stepStatus === "processing" && <Loader2 size={12} color="#22d3ee" className="animate-spin" />}
                {stepStatus === "pending" && <Clock size={12} color="#64748b" />}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color:
                    stepStatus === "complete"
                      ? "#34d399"
                      : stepStatus === "processing"
                      ? "#38bdf8"
                      : "#64748b",
                  lineHeight: 1.2,
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* AI Result Card */}
      {isDone && (
        <div
          className="animate-fade-in"
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            borderRadius: "var(--radius-lg)",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Classified attributes */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Category:</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{triage.category}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <SeverityBadge severity={triage.severity} />
              <UrgencyBadge urgency={triage.urgency} />
              <span
                className="badge"
                style={{
                  background: "rgba(6, 182, 212, 0.15)",
                  color: "#22d3ee",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                }}
              >
                <Zap size={11} />
                <span>CONFIDENCE: {triage.confidence}%</span>
              </span>
            </div>
          </div>

          {/* AI Summary */}
          <div style={{ fontSize: "13.5px", color: "#e2e8f0", lineHeight: 1.5, background: "rgba(6, 182, 212, 0.05)", padding: "12px 14px", borderRadius: "var(--radius-md)", borderLeft: "3px solid #06b6d4" }}>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#38bdf8", marginBottom: "4px", textTransform: "uppercase" }}>
              Triage Assessment Summary
            </div>
            {triage.summary}
          </div>

          {/* Recommendations & Safeguards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
              fontSize: "12px",
            }}
          >
            <div style={{ background: "rgba(30, 41, 59, 0.5)", padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Recommended Responder</div>
              <div style={{ fontWeight: 600, color: "#f8fafc", marginTop: "2px", display: "flex", alignItems: "center", gap: "5px" }}>
                <UserCheck size={13} color="#22d3ee" />
                {triage.recommendedResponder}
              </div>
            </div>

            <div style={{ background: "rgba(30, 41, 59, 0.5)", padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Community Verification</div>
              <div style={{ fontWeight: 600, color: triage.verificationRequired ? "#fbbf24" : "#94a3b8", marginTop: "2px" }}>
                {triage.verificationRequired ? "500m Radius Validation Required" : "Standard Community Feed"}
              </div>
            </div>

            <div style={{ background: "rgba(30, 41, 59, 0.5)", padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Privacy Protection</div>
              <div style={{ marginTop: "3px" }}>
                <PrivacyBadge type="shield" compact />
              </div>
            </div>
          </div>

          {/* Important safety reminder */}
          <div
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              paddingTop: "6px",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <Shield size={13} color="#06b6d4" />
            <span>AI assists triage. Human responders remain responsible for high-stakes decisions.</span>
          </div>
        </div>
      )}
    </div>
  );
}
