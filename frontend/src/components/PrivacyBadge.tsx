import { Shield, Lock, MapPin, UserCheck } from "lucide-react";

interface PrivacyBadgeProps {
  type: "shield" | "user" | "map" | "restricted";
  compact?: boolean;
}

export function PrivacyBadge({ type, compact = false }: PrivacyBadgeProps) {
  if (type === "shield") {
    return (
      <span
        className="badge"
        style={{
          background: "rgba(6, 182, 212, 0.12)",
          color: "#22d3ee",
          border: "1px solid rgba(6, 182, 212, 0.28)",
          padding: compact ? "2px 6px" : "3px 8px",
          fontSize: compact ? "10px" : "11px",
        }}
        title="Exact GPS coordinates are protected and never shown to ordinary users."
      >
        <Shield size={compact ? 11 : 13} />
        <span>EXACT LOCATION PROTECTED</span>
      </span>
    );
  }

  if (type === "user") {
    return (
      <span
        className="badge"
        style={{
          background: "rgba(148, 163, 184, 0.12)",
          color: "#cbd5e1",
          border: "1px solid rgba(148, 163, 184, 0.25)",
          padding: compact ? "2px 6px" : "3px 8px",
          fontSize: compact ? "10px" : "11px",
        }}
        title="Reporter identity is masked with a cryptographic pseudonym."
      >
        <Lock size={compact ? 11 : 13} />
        <span>IDENTITY PSEUDONYMOUS</span>
      </span>
    );
  }

  if (type === "restricted") {
    return (
      <span
        className="badge"
        style={{
          background: "rgba(245, 158, 11, 0.12)",
          color: "#fbbf24",
          border: "1px solid rgba(245, 158, 11, 0.28)",
          padding: compact ? "2px 6px" : "3px 8px",
          fontSize: compact ? "10px" : "11px",
        }}
        title="Verified identity restricted to trusted safety workflows."
      >
        <UserCheck size={compact ? 11 : 13} />
        <span>RESTRICTED VERIFIED IDENTITY</span>
      </span>
    );
  }

  return (
    <span
      className="badge"
      style={{
        background: "rgba(16, 185, 129, 0.12)",
        color: "#34d399",
        border: "1px solid rgba(16, 185, 129, 0.28)",
        padding: compact ? "2px 6px" : "3px 8px",
        fontSize: compact ? "10px" : "11px",
      }}
      title="Public map displays approximate neighborhood boundary only."
    >
      <MapPin size={compact ? 11 : 13} />
      <span>APPROXIMATE AREA ONLY</span>
    </span>
  );
}

export function PrivacyBanner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        padding: "10px 16px",
        background: "rgba(6, 182, 212, 0.08)",
        border: "1px solid rgba(6, 182, 212, 0.22)",
        borderRadius: "var(--radius-md)",
        fontSize: "12.5px",
        color: "#94a3b8",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e2e8f0" }}>
        <Shield size={16} color="#22d3ee" />
        <span style={{ fontWeight: 500 }}>
          Exact reporter location is never exposed on the public map.
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <PrivacyBadge type="map" compact />
        <PrivacyBadge type="shield" compact />
        <PrivacyBadge type="user" compact />
      </div>
    </div>
  );
}
