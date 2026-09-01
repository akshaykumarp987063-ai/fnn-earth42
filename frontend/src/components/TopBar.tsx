import { useFnn } from "../context/FnnContext";
import {
  Flame,
  Play,
  Radio,
  Search,
  Shield,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  onOpenSos: () => void;
  onSearch?: (query: string) => void;
}

export function TopBar({ onOpenSos, onSearch }: TopBarProps) {
  const {
    user,
    online,
    apiMode,
    runFullDemo,
    simulateLiveSignal,
    view,
    setView,
  } = useFnn();

  const [searchVal, setSearchVal] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearch) onSearch(val);
    if (view !== "signals" && view !== "services" && val.trim().length > 0) {
      setView("signals");
    }
  };

  return (
    <header
      style={{
        height: "68px",
        background: "rgba(9, 14, 28, 0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        gap: "16px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Quick Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 320px", maxWidth: "420px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={16}
            color="#64748b"
            style={{ position: "absolute", left: "12px", pointerEvents: "none" }}
          />
          <input
            type="text"
            placeholder="Search signals, areas, heroes, services..."
            value={searchVal}
            onChange={handleSearchChange}
            style={{
              width: "100%",
              paddingLeft: "36px",
              paddingRight: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "13px",
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
            }}
          />
        </div>
      </div>

      {/* Right: Quick Action Controls & Statuses */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "nowrap" }}>
        {/* RUN FULL DEMO Button */}
        <button
          className="btn-primary glow-cyan"
          style={{
            padding: "7px 14px",
            fontSize: "12.5px",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
          onClick={() => runFullDemo(false)}
          title="Run complete 7-phase story walkthrough"
        >
          <Play size={13} fill="#fff" />
          <span>RUN FULL DEMO</span>
        </button>

        {/* SOS Button */}
        <button
          className="btn-danger"
          style={{
            padding: "7px 14px",
            fontSize: "12.5px",
            letterSpacing: "0.02em",
          }}
          onClick={onOpenSos}
          title="Trigger emergency SOS workflow"
        >
          <Flame size={14} />
          <span>SOS</span>
        </button>

        {/* Simulate live signal button */}
        <button
          className="btn-secondary"
          style={{
            padding: "7px 12px",
            fontSize: "12px",
          }}
          onClick={simulateLiveSignal}
          title="Inject a real-time signal into the local feed"
        >
          <Radio size={13} color="#22d3ee" />
          <span>+ Live Event</span>
        </button>

        {/* Connectivity Status Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(15, 23, 42, 0.8)",
            padding: "4px 8px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {online ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#34d399",
              }}
              title="Network connection active"
            >
              <Wifi size={12} color="#10b981" />
              <span>ONLINE</span>
            </span>
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#fbbf24",
              }}
              title="Operating in offline mode"
            >
              <WifiOff size={12} color="#f59e0b" />
              <span>OFFLINE</span>
            </span>
          )}

          <span style={{ color: "var(--border-subtle)" }}>|</span>

          <span
            style={{
              fontSize: "10.5px",
              fontWeight: 600,
              color: apiMode === "LIVE" ? "#38bdf8" : "#94a3b8",
            }}
            title={
              apiMode === "LIVE"
                ? "Connected to Live Backend API"
                : "Automatic Local Demo Fallback Mode"
            }
          >
            {apiMode === "LIVE" ? "LIVE API" : "LOCAL DEMO"}
          </span>
        </div>

        {/* User Identity Preview Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(15, 23, 42, 0.8)",
            padding: "5px 10px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
          title="Reporter pseudonym protects personal identity"
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Shield size={12} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#e2e8f0" }}>
            {user.pseudonym}
          </span>
        </div>
      </div>
    </header>
  );
}
