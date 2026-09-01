import { useState, useEffect } from "react";
import { useFnn } from "../context/FnnContext";
import { PrivacyBadge, PrivacyBanner } from "../components/PrivacyBadge";
import {
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Fingerprint,
  RotateCcw,
  Shield,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export function PrivacyChallenge() {
  const { toast } = useFnn();
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [status, setStatus] = useState<"IDLE" | "MATCHED" | "NOT_ME" | "EXPIRED">("IDLE");

  useEffect(() => {
    if (status !== "IDLE" || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setStatus("EXPIRED");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, status]);

  const handleMatch = () => {
    setStatus("MATCHED");
    toast("Privacy lock activated: Match verified", "success");
  };

  const handleNotMe = () => {
    setStatus("NOT_ME");
    toast("Privacy lock activated: Bystander protected", "warn");
  };

  const handleReset = () => {
    setSecondsLeft(60);
    setStatus("IDLE");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
              Bystander Privacy Challenge
            </h1>
            <p style={{ fontSize: "14px", color: "var(--cyan-light)", marginTop: "2px" }}>
              Cryptographic verification protocol to safeguard innocent bystanders
            </p>
          </div>
        </div>
      </div>

      <PrivacyBanner />

      {/* Main Challenge Card */}
      <div
        className="glass-card"
        style={{
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "22px",
          background: "rgba(10, 16, 32, 0.9)",
        }}
      >
        {/* Countdown Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>
              Privacy Challenge Active
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Is this simulated observation image associated with the verified reporter?
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: secondsLeft <= 15 ? "rgba(239, 68, 68, 0.2)" : "rgba(6, 182, 212, 0.15)",
              border: secondsLeft <= 15 ? "1px solid #ef4444" : "1px solid rgba(6, 182, 212, 0.3)",
              color: secondsLeft <= 15 ? "#f87171" : "#38bdf8",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            <Clock size={14} />
            <span>00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</span>
          </div>
        </div>

        {/* Simulated Image Placeholder / Card */}
        <div
          style={{
            position: "relative",
            height: "220px",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            border: "2px dashed rgba(6, 182, 212, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            overflow: "hidden",
          }}
        >
          {/* Obfuscation shield overlay */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(6, 182, 212, 0.15)",
              border: "1px solid #06b6d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#22d3ee",
            }}
          >
            <Fingerprint size={32} />
          </div>

          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
              [ SIMULATED BYSTANDER IMAGE PROOF ]
            </span>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              Pixel-level obfuscation and facial blurring applied by client-side privacy layer
            </div>
          </div>

          <div style={{ position: "absolute", bottom: "12px", right: "14px" }}>
            <PrivacyBadge type="restricted" compact />
          </div>
        </div>

        {/* Action Controls or Result */}
        {status === "IDLE" ? (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="btn-primary"
              style={{ flex: 1, padding: "12px", fontSize: "14px", fontWeight: 700 }}
              onClick={handleMatch}
            >
              <CheckCircle2 size={16} />
              <span>MATCH (VERIFIED REPORTER)</span>
            </button>

            <button
              className="btn-danger"
              style={{ flex: 1, padding: "12px", fontSize: "14px" }}
              onClick={handleNotMe}
            >
              <XCircle size={16} />
              <span>NOT ME (PROTECT BYSTANDER)</span>
            </button>
          </div>
        ) : (
          <div
            className="animate-fade-in"
            style={{
              background:
                status === "MATCHED"
                  ? "rgba(16, 185, 129, 0.15)"
                  : status === "NOT_ME"
                  ? "rgba(245, 158, 11, 0.15)"
                  : "rgba(239, 68, 68, 0.15)",
              border:
                status === "MATCHED"
                  ? "1px solid #10b981"
                  : status === "NOT_ME"
                  ? "1px solid #f59e0b"
                  : "1px solid #ef4444",
              borderRadius: "var(--radius-md)",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {status === "MATCHED" && <CheckCircle2 size={20} color="#10b981" />}
                {status === "NOT_ME" && <Shield size={20} color="#f59e0b" />}
                {status === "EXPIRED" && <AlertCircle size={20} color="#ef4444" />}

                <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
                  {status === "MATCHED"
                    ? "Match Result: MATCHED"
                    : status === "NOT_ME"
                    ? "Match Result: NOT ME"
                    : "Challenge Expired"}
                </span>
              </div>

              {status === "MATCHED" && (
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#34d399" }}>
                  Match Confidence: 97%
                </span>
              )}
            </div>

            <div style={{ fontSize: "13px", color: "#cbd5e1" }}>
              {status === "MATCHED"
                ? "Privacy lock activated. Signal is verified and locked to pseudonymous reporter."
                : status === "NOT_ME"
                ? "Privacy lock activated. Unrelated bystander image discarded and omitted from community record."
                : "Challenge window expired. Signal placed in secondary radius verification."}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
              <button
                className="btn-secondary"
                style={{ padding: "6px 14px", fontSize: "12px" }}
                onClick={handleReset}
              >
                <RotateCcw size={13} />
                <span>Test Another Challenge</span>
              </button>
            </div>
          </div>
        )}

        {/* Essential Safety Disclaimer */}
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingTop: "8px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <AlertOctagon size={14} color="#06b6d4" />
          <span>
            <strong>Prototype verification only.</strong> No biometric template or real facial recognition is stored or executed.
          </span>
        </div>
      </div>
    </div>
  );
}
