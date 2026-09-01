import { useState } from "react";
import { PrivacyMap } from "../components/PrivacyMap";
import { PrivacyBanner } from "../components/PrivacyBadge";
import { useFnn } from "../context/FnnContext";
import { Compass } from "lucide-react";

export function PrivacyMapPage() {
  const { incidents, heroes, organizations, openIncident } = useFnn();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const handleSelectIncident = (id: string) => {
    setSelectedIncidentId(id);
    openIncident(id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
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
              <Compass size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
                Hyperlocal Privacy Map
              </h1>
              <p style={{ fontSize: "14px", color: "var(--cyan-light)", marginTop: "2px" }}>
                Cryptographically obfuscated spatial coordination · Zero raw GPS exposure
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
          <span>Active Zones: <strong style={{ color: "#38bdf8" }}>{incidents.length}</strong></span>
          <span>·</span>
          <span>Available Heroes: <strong style={{ color: "#34d399" }}>{heroes.filter((h) => h.available).length}</strong></span>
          <span>·</span>
          <span>Community Hubs: <strong style={{ color: "#fbbf24" }}>{organizations.length}</strong></span>
        </div>
      </div>

      <PrivacyBanner />

      {/* Main Privacy Map Component */}
      <PrivacyMap
        height="640px"
        selectedIncidentId={selectedIncidentId}
        onSelectIncident={handleSelectIncident}
      />
    </div>
  );
}
