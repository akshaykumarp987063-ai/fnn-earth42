import { useState } from "react";
import { useFnn } from "../context/FnnContext";
import { PrivacyBadge } from "./PrivacyBadge";
import {
  Activity,
  AlertOctagon,
  EyeOff,
  Filter,
  Heart,
  Home,
  Shield,
  Utensils,
  Zap,
} from "lucide-react";
import { AREA_MARKERS } from "../data/demoData";

interface PrivacyMapProps {
  interactive?: boolean;
  height?: string;
  selectedIncidentId?: string | null;
  onSelectIncident?: (id: string) => void;
}

export function PrivacyMap({
  interactive = true,
  height = "560px",
  selectedIncidentId,
  onSelectIncident,
}: PrivacyMapProps) {
  const { incidents, heroes, organizations, openIncident } = useFnn();
  const [filter, setFilter] = useState<"ALL" | "INCIDENTS" | "HEROES" | "ORGS">("ALL");
  const [shieldActive, setShieldActive] = useState(true);
  const [activeMarker, setActiveMarker] = useState<{
    id: string;
    type: "INCIDENT" | "HERO" | "ORG";
    title: string;
    subtitle: string;
    extra?: string;
    incidentId?: string;
    x: number;
    y: number;
  } | null>(null);

  // Map incident coordinates from approximate areas
  const incidentMarkers = incidents.map((inc) => {
    const coords = AREA_MARKERS[inc.approximateArea] || { x: 50, y: 50 };
    return {
      id: inc.id,
      type: "INCIDENT" as const,
      title: inc.title,
      subtitle: `${inc.category} · ${inc.severity}`,
      extra: inc.approximateArea,
      severity: inc.severity,
      isSos: inc.isSos,
      x: coords.x,
      y: coords.y,
    };
  });

  const heroMarkers = heroes.map((h) => ({
    id: h.id,
    type: "HERO" as const,
    title: h.pseudonym,
    subtitle: `${h.distanceLabel} · ${h.reliability}% Reliability`,
    extra: h.skills.join(", "),
    available: h.available,
    x: h.mapX,
    y: h.mapY,
  }));

  const orgMarkers = organizations.map((org) => ({
    id: org.id,
    type: "ORG" as const,
    title: org.name,
    subtitle: `${org.type} · ${org.distanceLabel}`,
    extra: org.open ? "Open Now" : "Closed",
    orgType: org.type,
    x: org.mapX,
    y: org.mapY,
  }));

  interface MarkerItem {
    id: string;
    type: "INCIDENT" | "HERO" | "ORG";
    title: string;
    subtitle: string;
    extra?: string;
    incidentId?: string;
    x: number;
    y: number;
  }

  const handleMarkerClick = (marker: MarkerItem) => {
    setActiveMarker(marker);
    if (marker.type === "INCIDENT") {
      if (onSelectIncident) {
        onSelectIncident(marker.id);
      }
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        position: "relative",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-medium)",
        background: "#070c18",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Map Controls Header */}
      <div
        style={{
          padding: "14px 18px",
          background: "rgba(10, 15, 30, 0.9)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          zIndex: 10,
        }}
      >
        {/* Layer Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Filter size={14} color="#94a3b8" />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", marginRight: "4px" }}>LAYERS:</span>
          {(["ALL", "INCIDENTS", "HEROES", "ORGS"] as const).map((mode) => (
            <button
              key={mode}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "var(--radius-sm)",
                background: filter === mode ? "rgba(6, 182, 212, 0.2)" : "rgba(30, 41, 59, 0.6)",
                border: filter === mode ? "1px solid #06b6d4" : "1px solid var(--border-subtle)",
                color: filter === mode ? "#38bdf8" : "#94a3b8",
              }}
              onClick={() => setFilter(mode)}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Privacy Shield Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "var(--radius-md)",
              background: shieldActive ? "rgba(6, 182, 212, 0.18)" : "rgba(30, 41, 59, 0.6)",
              border: shieldActive ? "1px solid #06b6d4" : "1px solid var(--border-subtle)",
              color: shieldActive ? "#22d3ee" : "#94a3b8",
              fontSize: "12px",
              fontWeight: 600,
            }}
            onClick={() => setShieldActive(!shieldActive)}
            title="Toggle privacy boundary obfuscation visualization"
          >
            {shieldActive ? <Shield size={13} /> : <EyeOff size={13} />}
            <span>{shieldActive ? "Privacy Shield: ACTIVE" : "Approximate View"}</span>
          </button>
          <PrivacyBadge type="shield" compact />
        </div>
      </div>

      {/* Map Canvas / SVG Area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height,
          background: "#060a14",
          overflow: "hidden",
        }}
      >
        {/* SVG Neighborhood Roads, Zones, and Grid */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, opacity: 0.85 }}
        >
          {/* Subtle tactical grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="0.3" />
            </pattern>
            {/* Radial glow gradient for radar */}
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="50" cy="50" r="45" fill="url(#radarGlow)" />

          {/* Neighborhood road network */}
          <g stroke="rgba(51, 65, 85, 0.45)" strokeWidth="0.8" fill="none">
            {/* Major avenues */}
            <path d="M 0 35 Q 30 38 60 30 T 100 32" strokeWidth="1.2" stroke="rgba(71, 85, 105, 0.6)" />
            <path d="M 0 65 Q 40 60 70 70 T 100 62" strokeWidth="1.2" stroke="rgba(71, 85, 105, 0.6)" />
            <path d="M 35 0 Q 38 40 32 70 T 36 100" strokeWidth="1.2" stroke="rgba(71, 85, 105, 0.6)" />
            <path d="M 68 0 Q 64 35 70 65 T 66 100" strokeWidth="1.2" stroke="rgba(71, 85, 105, 0.6)" />

            {/* Connecting neighborhood streets */}
            <path d="M 10 10 L 90 90" strokeDasharray="1.5,1.5" stroke="rgba(51, 65, 85, 0.3)" />
            <path d="M 15 85 L 85 15" strokeDasharray="1.5,1.5" stroke="rgba(51, 65, 85, 0.3)" />
            <path d="M 35 35 L 68 30" />
            <path d="M 32 70 L 70 65" />
            <path d="M 35 35 L 32 70" />
            <path d="M 68 30 L 70 65" />
          </g>

          {/* Neighborhood Sector Zones */}
          <rect x="20" y="15" width="22" height="18" rx="2" fill="rgba(6, 182, 212, 0.03)" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.4" />
          <rect x="55" y="18" width="30" height="20" rx="2" fill="rgba(16, 185, 129, 0.03)" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="0.4" />
          <rect x="18" y="52" width="26" height="32" rx="2" fill="rgba(245, 158, 11, 0.03)" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="0.4" />
          <rect x="52" y="48" width="36" height="36" rx="2" fill="rgba(147, 51, 234, 0.03)" stroke="rgba(147, 51, 234, 0.15)" strokeWidth="0.4" />

          {/* Neighborhood Sector Labels */}
          <text x="22" y="19" fill="#475569" fontSize="2.5" fontWeight="600">SECTOR A · NORTH</text>
          <text x="57" y="22" fill="#475569" fontSize="2.5" fontWeight="600">SECTOR B · EAST CAMPUS</text>
          <text x="20" y="56" fill="#475569" fontSize="2.5" fontWeight="600">SECTOR C · TRANSIT HUB</text>
          <text x="54" y="52" fill="#475569" fontSize="2.5" fontWeight="600">SECTOR D · COMMUNITY CORE</text>

          {/* Obfuscated Privacy Shield Radius Rings around Incident Zones */}
          {shieldActive && (filter === "ALL" || filter === "INCIDENTS") &&
            incidentMarkers.map((inc) => (
              <g key={`shield-${inc.id}`}>
                {/* Outer approximate zone radius ring (500m representation) */}
                <circle
                  cx={inc.x}
                  cy={inc.y}
                  r={inc.isSos || inc.severity === "CRITICAL" ? "9" : "7.5"}
                  fill={
                    inc.isSos || inc.severity === "CRITICAL"
                      ? "rgba(239, 68, 68, 0.12)"
                      : inc.severity === "HIGH"
                      ? "rgba(245, 158, 11, 0.09)"
                      : "rgba(6, 182, 212, 0.08)"
                  }
                  stroke={
                    inc.isSos || inc.severity === "CRITICAL"
                      ? "rgba(239, 68, 68, 0.4)"
                      : inc.severity === "HIGH"
                      ? "rgba(245, 158, 11, 0.3)"
                      : "rgba(6, 182, 212, 0.25)"
                  }
                  strokeWidth="0.4"
                  strokeDasharray="1.2,1"
                />
              </g>
            ))}
        </svg>

        {/* HTML Interactive Markers overlay */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: interactive ? "auto" : "none" }}>
          {/* 1. Incident Markers */}
          {(filter === "ALL" || filter === "INCIDENTS") &&
            incidentMarkers.map((inc) => {
              const isSelected = selectedIncidentId === inc.id;
              const isCritical = inc.severity === "CRITICAL" || inc.isSos;

              return (
                <div
                  key={`marker-inc-${inc.id}`}
                  style={{
                    position: "absolute",
                    left: `${inc.x}%`,
                    top: `${inc.y}%`,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    zIndex: isSelected ? 30 : 20,
                  }}
                  onClick={() => handleMarkerClick(inc)}
                  title={`${inc.title} (${inc.extra})`}
                >
                  <div
                    style={{
                      width: isCritical ? "30px" : "26px",
                      height: isCritical ? "30px" : "26px",
                      borderRadius: "50%",
                      background: isCritical
                        ? "#dc2626"
                        : inc.severity === "HIGH"
                        ? "#d97706"
                        : "#0891b2",
                      border: isSelected ? "3px solid #fff" : "2px solid rgba(255,255,255,0.85)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: isCritical
                        ? "0 0 16px rgba(239, 68, 68, 0.85)"
                        : "0 0 12px rgba(6, 182, 212, 0.6)",
                      transition: "transform 0.15s ease",
                    }}
                    className={isCritical ? "animate-pulse-glow" : ""}
                  >
                    {isCritical ? (
                      <AlertOctagon size={14} />
                    ) : (
                      <Shield size={12} />
                    )}
                  </div>
                  {/* Small tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      marginTop: "3px",
                      fontSize: "9.5px",
                      fontWeight: 700,
                      background: "rgba(6, 10, 20, 0.9)",
                      padding: "1px 5px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap",
                      color: isCritical ? "#fca5a5" : "#e2e8f0",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                    }}
                  >
                    {inc.extra}
                  </div>
                </div>
              );
            })}

          {/* 2. Hero Markers */}
          {(filter === "ALL" || filter === "HEROES") &&
            heroMarkers.map((h) => (
              <div
                key={`marker-hero-${h.id}`}
                style={{
                  position: "absolute",
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: 18,
                }}
                onClick={() => handleMarkerClick(h)}
                title={`${h.title} (${h.subtitle})`}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: h.available ? "#059669" : "#475569",
                    border: "2px solid #fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    boxShadow: h.available ? "0 0 10px rgba(16, 185, 129, 0.6)" : "none",
                  }}
                >
                  <Zap size={11} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "2px",
                    fontSize: "9px",
                    fontWeight: 600,
                    background: "rgba(6, 10, 20, 0.85)",
                    padding: "1px 4px",
                    borderRadius: "3px",
                    whiteSpace: "nowrap",
                    color: h.available ? "#34d399" : "#94a3b8",
                  }}
                >
                  {h.title}
                </div>
              </div>
            ))}

          {/* 3. Community Organization Markers */}
          {(filter === "ALL" || filter === "ORGS") &&
            orgMarkers.map((org) => (
              <div
                key={`marker-org-${org.id}`}
                style={{
                  position: "absolute",
                  left: `${org.x}%`,
                  top: `${org.y}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: 15,
                }}
                onClick={() => handleMarkerClick(org)}
                title={`${org.title} (${org.subtitle})`}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "4px",
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1.5px solid #38bdf8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#38bdf8",
                  }}
                >
                  {org.orgType === "Hospital" && <Activity size={12} color="#ef4444" />}
                  {org.orgType === "Shelter" && <Home size={12} color="#fbbf24" />}
                  {(org.orgType === "Food Bank" || org.orgType === "Community Kitchen") && (
                    <Utensils size={12} color="#34d399" />
                  )}
                  {org.orgType === "Old Age Home" && <Heart size={12} color="#f472b6" />}
                  {org.orgType === "Relief Organization" && <Shield size={12} color="#38bdf8" />}
                </div>
              </div>
            ))}
        </div>

        {/* Floating Active Marker Card Popover */}
        {activeMarker && (
          <div
            className="glass-card animate-fade-in"
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              maxWidth: "320px",
              padding: "14px 16px",
              background: "rgba(10, 16, 32, 0.95)",
              border: "1px solid var(--border-highlight)",
              zIndex: 40,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
              <div>
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: "var(--cyan-light)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {activeMarker.type} DETAILS
                </span>
                <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "#f8fafc", marginTop: "2px" }}>
                  {activeMarker.title}
                </h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "3px" }}>
                  {activeMarker.subtitle}
                </p>
                {activeMarker.extra && (
                  <p style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {activeMarker.extra}
                  </p>
                )}
              </div>
              <button
                style={{ color: "var(--text-muted)", padding: "2px" }}
                onClick={() => setActiveMarker(null)}
              >
                ✕
              </button>
            </div>

            {activeMarker.type === "INCIDENT" && (
              <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, padding: "6px 10px", fontSize: "12px" }}
                  onClick={() => openIncident(activeMarker.id)}
                >
                  View Incident & Verify
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Privacy Notice & Legend Footer */}
      <div
        style={{
          padding: "12px 18px",
          background: "rgba(10, 15, 30, 0.95)",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#06b6d4" }} />
            <span>Incident Zone (500m Approx)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
            <span>Nearby Hero</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#38bdf8" }} />
            <span>Community Center</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PrivacyBadge type="map" compact />
          <PrivacyBadge type="shield" compact />
        </div>
      </div>
    </div>
  );
}
