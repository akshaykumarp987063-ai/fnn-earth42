import { useState } from "react";
import { useFnn } from "../context/FnnContext";
import { PrivacyBanner } from "../components/PrivacyBadge";
import { formatTime, relativeMinutes } from "../utils/formatters";
import {
  AlertOctagon,
  HardDrive,
  Info,
  Plus,
  RefreshCw,
  WifiOff,
} from "lucide-react";

export function DisasterMode() {
  const {
    disasterMode,
    toggleDisaster,
    online,
    setForceOffline,
    forceOffline,
    restoreAndSync,
    syncing,
    offlineQueue,
    submitSignal,
    lastSyncAt,
  } = useFnn();

  const [offlineDesc, setOfflineDesc] = useState("");
  const [offlineArea, setOfflineArea] = useState("Storm Drain Road");

  const pendingOffline = offlineQueue.filter((q) => q.status !== "SYNCED");

  const handleCreateOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineDesc.trim()) return;

    await submitSignal(
      offlineDesc,
      "DISASTER",
      "HIGH",
      "URGENT",
      offlineArea,
      0
    );
    setOfflineDesc("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header with Disaster Toggle Switch */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          background: disasterMode
            ? "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)"
            : "rgba(10, 16, 32, 0.8)",
          border: disasterMode ? "1px solid #f59e0b" : "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          padding: "24px 28px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: disasterMode
                  ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  : "rgba(100, 116, 139, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <AlertOctagon size={22} className={disasterMode ? "animate-pulse-glow" : ""} />
            </div>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
                Disaster Resilience & Mesh Mode
              </h1>
              <p style={{ fontSize: "14px", color: disasterMode ? "#fde047" : "var(--text-secondary)", marginTop: "2px" }}>
                Maintains local community coordination even when cellular and internet connectivity fail
              </p>
            </div>
          </div>
        </div>

        {/* Big Switch Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className={disasterMode ? "btn-danger" : "btn-secondary"}
            style={{
              padding: "10px 20px",
              fontSize: "13.5px",
              fontWeight: 700,
              background: disasterMode ? undefined : "rgba(30, 41, 59, 0.8)",
            }}
            onClick={() => toggleDisaster(!disasterMode)}
          >
            <AlertOctagon size={16} />
            <span>{disasterMode ? "DISASTER MODE ACTIVE" : "ACTIVATE DISASTER MODE"}</span>
          </button>
        </div>
      </div>

      <PrivacyBanner />

      {/* Resilience Metrics Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "14px",
        }}
      >
        <div className="glass-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>Mesh Coverage</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#38bdf8", marginTop: "2px" }}>15 km Cached</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Offline spatial tile index</div>
        </div>

        <div className="glass-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>Local Offline Queue</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: pendingOffline.length > 0 ? "#fbbf24" : "#34d399", marginTop: "2px" }}>
            {pendingOffline.length} Pending
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Stored in browser storage</div>
        </div>

        <div className="glass-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>Network State</div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: online ? "#34d399" : "#f87171", marginTop: "2px" }}>
            {online ? "ONLINE" : "OFFLINE"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {forceOffline ? "Manually Simulated Offline" : "Live Browser Network"}
          </div>
        </div>

        <div className="glass-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>Last Cloud Sync</div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#cbd5e1", marginTop: "4px" }}>
            {relativeMinutes(lastSyncAt)}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{formatTime(lastSyncAt)}</div>
        </div>
      </div>

      {/* Network Simulation Controls */}
      <div
        className="glass-card"
        style={{
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          background: "rgba(15, 23, 42, 0.75)",
        }}
      >
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
            Connectivity Simulation Controls (Hackathon Testing)
          </h3>
          <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Test the resilience workflow: ONLINE → NETWORK LOST → OFFLINE MODE → LOCAL QUEUE → NETWORK RESTORED → SYNC
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {online ? (
            <button
              className="btn-danger"
              style={{ padding: "8px 16px", fontSize: "12.5px" }}
              onClick={() => setForceOffline(true)}
            >
              <WifiOff size={14} />
              <span>Simulate Network Loss (Go Offline)</span>
            </button>
          ) : (
            <button
              className="btn-success glow-safe"
              style={{ padding: "8px 20px", fontSize: "12.5px", fontWeight: 700 }}
              onClick={restoreAndSync}
              disabled={syncing}
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              <span>{syncing ? "Syncing Mesh Reports..." : "Restore Connectivity & Sync Queue"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Create Offline Signal Form & Emergency Instructions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "18px",
        }}
      >
        {/* Offline Signal Creation Form */}
        <div
          className="glass-card"
          style={{
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <HardDrive size={18} color="#22d3ee" />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
              Create Offline Signal (Local Mesh)
            </h3>
          </div>

          <form onSubmit={handleCreateOffline} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)" }}>Hazard Observation</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Fallen electrical wire blocking south corridor after storm..."
                value={offlineDesc}
                onChange={(e) => setOfflineDesc(e.target.value)}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)" }}>Approximate Landmark Area</label>
              <select
                value={offlineArea}
                onChange={(e) => setOfflineArea(e.target.value)}
                style={{ width: "100%", marginTop: "4px" }}
              >
                <option value="Storm Drain Road">Storm Drain Road</option>
                <option value="Hostel Lane">Hostel Lane</option>
                <option value="Campus Bus Stand Area">Campus Bus Stand Area</option>
                <option value="North Residential Block">North Residential Block</option>
                <option value="Transit Plaza">Transit Plaza</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: "9px 16px", fontSize: "13px", marginTop: "4px" }}
            >
              <Plus size={15} />
              <span>Queue Signal Locally in Offline Storage</span>
            </button>
          </form>
        </div>

        {/* Official Disaster Emergency Instructions */}
        <div
          className="glass-card"
          style={{
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Info size={18} color="#fbbf24" />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
              Disaster Protocol & Safety Guidelines
            </h3>
          </div>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "#fbbf24" }}>✓</span>
              <span><strong>Move away from immediate hazards:</strong> Seek designated community shelter hubs or high ground.</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "#fbbf24" }}>✓</span>
              <span><strong>Conserve device battery:</strong> Lower screen brightness and close background apps.</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "#fbbf24" }}>✓</span>
              <span><strong>Stay with your Safety Circle:</strong> Maintain proximity with trusted nearby contacts.</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "#fbbf24" }}>✓</span>
              <span><strong>Use local communication channels:</strong> FNN mesh queue will relay data peer-to-peer.</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "#fbbf24" }}>✓</span>
              <span><strong>Share verified observations:</strong> Avoid forwarding unconfirmed rumors.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Offline Stored Queue Table / Cards */}
      <div
        className="glass-card"
        style={{
          padding: "22px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
            Locally Queued Reports ({offlineQueue.length})
          </h3>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Persisted in localStorage until cloud connectivity is restored
          </span>
        </div>

        {offlineQueue.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {offlineQueue.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                    {item.description}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {item.approximateArea} · {item.category} · {formatTime(item.createdAt)}
                  </div>
                </div>

                <div>
                  <span
                    className="badge"
                    style={{
                      background:
                        item.status === "SYNCED"
                          ? "rgba(16, 185, 129, 0.2)"
                          : item.status === "SYNCING"
                          ? "rgba(6, 182, 212, 0.2)"
                          : "rgba(245, 158, 11, 0.2)",
                      color:
                        item.status === "SYNCED"
                          ? "#34d399"
                          : item.status === "SYNCING"
                          ? "#38bdf8"
                          : "#fbbf24",
                      border:
                        item.status === "SYNCED"
                          ? "1px solid #10b981"
                          : item.status === "SYNCING"
                          ? "1px solid #06b6d4"
                          : "1px solid #f59e0b",
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            No pending offline signals. All local observations are synchronized.
          </div>
        )}
      </div>
    </div>
  );
}
