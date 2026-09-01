import { useState } from "react";
import { useFnn } from "../context/FnnContext";
import { PrivacyBanner } from "../components/PrivacyBadge";
import {
  Activity,
  CheckCircle2,
  Heart,
  HeartHandshake,
  Home,
  MapPin,
  Shield,
  Truck,
  UserPlus,
  Utensils,
} from "lucide-react";

export function Community() {
  const { organizations, communityAction } = useFnn();
  const [filter, setFilter] = useState<string>("ALL");

  const orgTypes = ["ALL", "Hospital", "Shelter", "Food Bank", "Community Kitchen", "Old Age Home", "Relief Organization"];

  const filteredOrgs =
    filter === "ALL"
      ? organizations
      : organizations.filter((o) => o.type === filter);

  const getOrgIcon = (type: string) => {
    switch (type) {
      case "Hospital":
        return <Activity size={20} color="#ef4444" />;
      case "Shelter":
        return <Home size={20} color="#fbbf24" />;
      case "Food Bank":
      case "Community Kitchen":
        return <Utensils size={20} color="#34d399" />;
      case "Old Age Home":
        return <Heart size={20} color="#f472b6" />;
      default:
        return <Shield size={20} color="#38bdf8" />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
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
              <HeartHandshake size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
                Community Aid & Resource Hubs
              </h1>
              <p style={{ fontSize: "14px", color: "var(--cyan-light)", marginTop: "2px" }}>
                Hyperlocal hospitals, food banks, shelters, and relief collectives
              </p>
            </div>
          </div>
        </div>
      </div>

      <PrivacyBanner />

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}
      >
        {orgTypes.map((type) => (
          <button
            key={type}
            style={{
              fontSize: "12px",
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: "var(--radius-md)",
              background: filter === type ? "rgba(6, 182, 212, 0.2)" : "rgba(30, 41, 59, 0.6)",
              border: filter === type ? "1px solid #06b6d4" : "1px solid var(--border-subtle)",
              color: filter === type ? "#38bdf8" : "#94a3b8",
              whiteSpace: "nowrap",
            }}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Organization Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "18px",
        }}
      >
        {filteredOrgs.map((org) => (
          <div
            key={org.id}
            className="glass-card"
            style={{
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              borderTop: "3px solid var(--cyan-primary)",
            }}
          >
            {/* Header: Name, Type, Distance, Verified */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getOrgIcon(org.type)}
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                    {org.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
                    <span>{org.type}</span>
                    <span>·</span>
                    <MapPin size={11} color="#22d3ee" />
                    <span>{org.distanceLabel}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                {org.verified && (
                  <span
                    className="badge glow-safe"
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399",
                      border: "1px solid #10b981",
                      fontSize: "10px",
                    }}
                  >
                    <CheckCircle2 size={10} />
                    <span>VERIFIED HUB</span>
                  </span>
                )}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: org.open ? "#4ade80" : "#94a3b8",
                  }}
                >
                  {org.open ? "● Open Now" : "○ Closed"}
                </span>
              </div>
            </div>

            {/* Actions: Volunteer, Donate, Transport Help */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                paddingTop: "10px",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <button
                className="btn-secondary"
                style={{ padding: "8px 6px", fontSize: "11.5px", display: "flex", flexDirection: "column", gap: "4px" }}
                onClick={() => communityAction(org.id, `Volunteer at ${org.name}`)}
              >
                <UserPlus size={14} color="#38bdf8" />
                <span>Volunteer</span>
              </button>

              <button
                className="btn-secondary"
                style={{ padding: "8px 6px", fontSize: "11.5px", display: "flex", flexDirection: "column", gap: "4px" }}
                onClick={() => communityAction(org.id, `Donation pledged to ${org.name}`)}
              >
                <Heart size={14} color="#f472b6" />
                <span>Donate</span>
              </button>

              <button
                className="btn-secondary"
                style={{ padding: "8px 6px", fontSize: "11.5px", display: "flex", flexDirection: "column", gap: "4px" }}
                onClick={() => communityAction(org.id, `Transport assistance coordinated with ${org.name}`)}
              >
                <Truck size={14} color="#fbbf24" />
                <span>Transport</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
