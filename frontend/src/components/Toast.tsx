import { useFnn } from "../context/FnnContext";
import { AlertTriangle, CheckCircle2, Flame, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismissToast } = useFnn();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "380px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => {
        const isCritical = t.kind === "critical";
        const isSuccess = t.kind === "success";
        const isWarn = t.kind === "warn";

        const bg = isCritical
          ? "rgba(30, 10, 15, 0.95)"
          : isSuccess
          ? "rgba(10, 25, 20, 0.95)"
          : isWarn
          ? "rgba(30, 25, 10, 0.95)"
          : "rgba(10, 20, 35, 0.95)";

        const border = isCritical
          ? "#ef4444"
          : isSuccess
          ? "#10b981"
          : isWarn
          ? "#f59e0b"
          : "#06b6d4";

        const textColor = isCritical
          ? "#fca5a5"
          : isSuccess
          ? "#86efac"
          : isWarn
          ? "#fde047"
          : "#7dd3fc";

        return (
          <div
            key={t.id}
            className={`glass-card animate-fade-in ${isCritical ? "glow-critical" : ""}`}
            style={{
              padding: "12px 16px",
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              pointerEvents: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isCritical && <Flame size={18} color="#ef4444" className="animate-pulse-glow" />}
              {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
              {isWarn && <AlertTriangle size={18} color="#f59e0b" />}
              {!isCritical && !isSuccess && !isWarn && <Info size={18} color="#06b6d4" />}

              <span style={{ fontSize: "13.5px", fontWeight: 500, color: textColor }}>
                {t.message}
              </span>
            </div>

            <button
              style={{
                color: "var(--text-muted)",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
