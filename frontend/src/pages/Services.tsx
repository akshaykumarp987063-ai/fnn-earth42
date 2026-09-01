import { useState } from "react";
import { useFnn } from "../context/FnnContext";
import { PrivacyBanner } from "../components/PrivacyBadge";
import {
  CheckCircle2,
  MapPin,
  Search,
  Star,
  Wrench,
} from "lucide-react";

export function Services() {
  const { services, requestHelp, serviceRequests } = useFnn();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("ALL");

  const categories = ["ALL", "Plumber", "Electrician", "Mechanic", "Repair Worker", "Cleaner", "Caregiver"];

  const filteredServices = services.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.service.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (catFilter !== "ALL" && s.category !== catFilter) return false;
    return true;
  });

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
              <Wrench size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
                Public & Neighborhood Utility Services
              </h1>
              <p style={{ fontSize: "14px", color: "var(--cyan-light)", marginTop: "2px" }}>
                Verified local plumbers, electricians, mechanics, and maintenance workers
              </p>
            </div>
          </div>
        </div>
      </div>

      <PrivacyBanner />

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          background: "rgba(10, 16, 32, 0.85)",
        }}
      >
        <div style={{ flex: "1 1 240px", position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={15} color="#64748b" style={{ position: "absolute", left: "10px" }} />
          <input
            type="text"
            placeholder="Search service, tradesperson, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: "32px",
              paddingRight: "10px",
              paddingTop: "7px",
              paddingBottom: "7px",
              fontSize: "13px",
            }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button
              key={c}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "5px 12px",
                borderRadius: "var(--radius-sm)",
                background: catFilter === c ? "rgba(6, 182, 212, 0.2)" : "rgba(30, 41, 59, 0.6)",
                border: catFilter === c ? "1px solid #06b6d4" : "1px solid var(--border-subtle)",
                color: catFilter === c ? "#38bdf8" : "#94a3b8",
              }}
              onClick={() => setCatFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Service Providers Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "18px",
        }}
      >
        {filteredServices.map((svc) => {
          const isRequested = serviceRequests.some((r) => r.providerId === svc.id);

          return (
            <div
              key={svc.id}
              className="glass-card"
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderTop: "3px solid #3b82f6",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                    {svc.name}
                  </h3>
                  <div style={{ fontSize: "12.5px", color: "var(--cyan-light)", fontWeight: 500 }}>
                    {svc.category} · {svc.service}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    <MapPin size={11} color="#22d3ee" />
                    <span>{svc.distanceLabel}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  {svc.verified && (
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
                      <span>VERIFIED</span>
                    </span>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "#fbbf24", fontWeight: 700 }}>
                    <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    <span>{svc.rating}</span>
                  </div>
                </div>
              </div>

              {/* Request Help Button */}
              <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                <button
                  className={isRequested ? "btn-secondary" : "btn-primary"}
                  style={{
                    width: "100%",
                    padding: "8px 14px",
                    fontSize: "12.5px",
                    borderColor: isRequested ? "#10b981" : undefined,
                    color: isRequested ? "#34d399" : undefined,
                  }}
                  onClick={() => requestHelp(svc.id)}
                  disabled={!svc.available && !isRequested}
                >
                  {isRequested ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Help Requested (Standby)</span>
                    </>
                  ) : svc.available ? (
                    <>
                      <Wrench size={14} />
                      <span>Request Help</span>
                    </>
                  ) : (
                    <span>Currently Unavailable</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
