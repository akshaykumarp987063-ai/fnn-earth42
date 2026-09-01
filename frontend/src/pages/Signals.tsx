import { useState } from "react";
import { useFnn } from "../context/FnnContext";
import { SignalCard } from "../components/SignalCard";
import { PrivacyBanner } from "../components/PrivacyBadge";
import { CATEGORIES, SEVERITIES, URGENCIES } from "../types/fnn";
import { Plus, Radio, Search, X } from "lucide-react";

export function Signals() {
  const { incidents, openIncident, setView } = useFnn();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("ALL");
  const [sevFilter, setSevFilter] = useState<string>("ALL");
  const [urgFilter, setUrgFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = incidents.filter((inc) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        inc.title.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.approximateArea.toLowerCase().includes(q) ||
        inc.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (catFilter !== "ALL" && inc.category !== catFilter) return false;
    if (sevFilter !== "ALL" && inc.severity !== sevFilter) return false;
    if (urgFilter !== "ALL" && inc.urgency !== urgFilter) return false;
    if (statusFilter !== "ALL" && inc.status !== statusFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setSearch("");
    setCatFilter("ALL");
    setSevFilter("ALL");
    setUrgFilter("ALL");
    setStatusFilter("ALL");
  };

  const hasActiveFilters =
    search.trim().length > 0 ||
    catFilter !== "ALL" ||
    sevFilter !== "ALL" ||
    urgFilter !== "ALL" ||
    statusFilter !== "ALL";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
            Community Signal Feed
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Real-time verified neighborhood alerts, aid requests, and infrastructure notices
          </p>
        </div>

        <button
          className="btn-primary"
          style={{ padding: "9px 16px", fontSize: "13px" }}
          onClick={() => setView("spider")}
        >
          <Plus size={15} />
          <span>Send Spider Signal</span>
        </button>
      </div>

      <PrivacyBanner />

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          background: "rgba(10, 16, 32, 0.85)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Search box */}
          <div style={{ flex: "1 1 240px", position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={15} color="#64748b" style={{ position: "absolute", left: "10px" }} />
            <input
              type="text"
              placeholder="Search by keywords, area, or description..."
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

          {/* Category dropdown */}
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{ padding: "7px 12px", fontSize: "12.5px" }}
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Severity dropdown */}
          <select
            value={sevFilter}
            onChange={(e) => setSevFilter(e.target.value)}
            style={{ padding: "7px 12px", fontSize: "12.5px" }}
          >
            <option value="ALL">All Severities</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s} Severity
              </option>
            ))}
          </select>

          {/* Urgency dropdown */}
          <select
            value={urgFilter}
            onChange={(e) => setUrgFilter(e.target.value)}
            style={{ padding: "7px 12px", fontSize: "12.5px" }}
          >
            <option value="ALL">All Urgencies</option>
            {URGENCIES.map((u) => (
              <option key={u} value={u}>
                {u} Urgency
              </option>
            ))}
          </select>

          {/* Status dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "7px 12px", fontSize: "12.5px" }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="VERIFYING">Verifying</option>
            <option value="VERIFIED">Verified</option>
            <option value="ASSIGNED">Hero Assigned</option>
            <option value="RESPONDING">Responding</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ESCALATED">Escalated</option>
          </select>

          {hasActiveFilters && (
            <button
              className="btn-secondary"
              style={{ padding: "7px 12px", fontSize: "12px", color: "#f87171" }}
              onClick={clearFilters}
            >
              <X size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
          <span>
            Showing <strong>{filtered.length}</strong> of {incidents.length} signals
          </span>
          <span style={{ color: "#38bdf8" }}>
            Radius verification available on active signals
          </span>
        </div>
      </div>

      {/* Signals Grid */}
      {filtered.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((incident) => (
            <SignalCard
              key={incident.id}
              incident={incident}
              onClick={() => openIncident(incident.id)}
            />
          ))}
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Radio size={36} color="#64748b" />
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
            No signals match your filter criteria
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "420px" }}>
            Try adjusting your search terms or clearing your category and severity filters.
          </p>
          <button
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "12.5px", marginTop: "6px" }}
            onClick={clearFilters}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
