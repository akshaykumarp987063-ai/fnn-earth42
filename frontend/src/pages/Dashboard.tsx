import { useState } from "react";
import { useFnn } from "../context/FnnContext";
import { greetingForHour } from "../utils/formatters";
import { SignalCard } from "../components/SignalCard";
import { HeroCard } from "../components/HeroCard";
import { PrivacyBanner } from "../components/PrivacyBadge";
import {
  Activity,
  ArrowRight,
  Coins,
  Flame,
  Play,
  Radio,
  Send,
  Sparkles,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

export function Dashboard() {
  const {
    incidents,
    heroes,
    wallet,
    online,
    runFullDemo,
    runSosDemo,
    setView,
    openIncident,
  } = useFnn();

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);

  const activeIncidents = incidents.filter((i) => i.status !== "RESOLVED");
  const lowCount = incidents.filter((i) => i.severity === "LOW").length;
  const medCount = incidents.filter((i) => i.severity === "MEDIUM").length;
  const highCount = incidents.filter((i) => i.severity === "HIGH").length;
  const critCount = incidents.filter((i) => i.severity === "CRITICAL" || i.isSos).length;

  const filteredIncidents =
    selectedCategory === "ALL"
      ? incidents
      : incidents.filter((i) => i.category === selectedCategory);

  const availableHeroes = heroes.filter((h) => h.available);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Header Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
            {greeting}
          </h1>
          <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Your neighborhood is safer when everyone can help. People don't have to become heroes — they just send the signal.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            className="btn-primary"
            style={{ padding: "9px 16px", fontSize: "13px" }}
            onClick={() => setView("spider")}
          >
            <Send size={14} />
            <span>Send Spider Signal</span>
          </button>

          <button
            className="btn-danger"
            style={{ padding: "9px 16px", fontSize: "13px" }}
            onClick={runSosDemo}
          >
            <Flame size={14} />
            <span>Simulate Critical SOS</span>
          </button>
        </div>
      </div>

      {/* 2. Privacy Banner */}
      <PrivacyBanner />

      {/* 3. Top Status Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Active Signals */}
        <div
          className="glass-card"
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderLeft: "4px solid #06b6d4",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Active Signals
            </span>
            <Radio size={16} color="#06b6d4" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>
            {activeIncidents.length}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {incidents.length} total recorded in area
          </div>
        </div>

        {/* Nearby Heroes */}
        <div
          className="glass-card"
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderLeft: "4px solid #10b981",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Nearby Heroes
            </span>
            <Zap size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>
            {heroes.length}
          </div>
          <div style={{ fontSize: "12px", color: "#34d399", fontWeight: 500 }}>
            {availableHeroes.length} heroes ready for dispatch
          </div>
        </div>

        {/* Community Credits */}
        <div
          className="glass-card"
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Community Credits
            </span>
            <Coins size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>
            {wallet.available}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {wallet.locked} credits currently locked in stake
          </div>
        </div>

        {/* Network Status */}
        <div
          className="glass-card"
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderLeft: online ? "4px solid #10b981" : "4px solid #f59e0b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Network Status
            </span>
            {online ? <Wifi size={16} color="#10b981" /> : <WifiOff size={16} color="#f59e0b" />}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: online ? "#34d399" : "#fbbf24" }}>
            {online ? "ONLINE" : "OFFLINE"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Local mesh fallback operational
          </div>
        </div>
      </div>

      {/* 4. Community Safety Pulse */}
      <div
        className="glass-card"
        style={{
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          background: "rgba(11, 17, 33, 0.8)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} color="#06b6d4" />
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
              Community Safety Pulse
            </h3>
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Real-time neighborhood risk distribution
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
          }}
        >
          <div style={{ background: "rgba(148, 163, 184, 0.1)", padding: "12px 14px", borderRadius: "var(--radius-md)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>LOW SEVERITY</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#cbd5e1", marginTop: "2px" }}>{lowCount}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Aid & info notices</div>
          </div>

          <div style={{ background: "rgba(6, 182, 212, 0.1)", padding: "12px 14px", borderRadius: "var(--radius-md)", border: "1px solid rgba(6, 182, 212, 0.25)" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8" }}>MEDIUM SEVERITY</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#38bdf8", marginTop: "2px" }}>{medCount}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Assistance & fixes</div>
          </div>

          <div style={{ background: "rgba(245, 158, 11, 0.12)", padding: "12px 14px", borderRadius: "var(--radius-md)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#fbbf24" }}>HIGH SEVERITY</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#fbbf24", marginTop: "2px" }}>{highCount}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Safety & medical risks</div>
          </div>

          <div style={{ background: "rgba(239, 68, 68, 0.15)", padding: "12px 14px", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.4)" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#f87171" }}>CRITICAL / SOS</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#fca5a5", marginTop: "2px" }}>{critCount}</div>
            <div style={{ fontSize: "11px", color: "#fca5a5" }}>Immediate priority</div>
          </div>
        </div>
      </div>

      {/* 5. Prominent Hackathon Judge Demo Banner Card */}
      <div
        className="glass-card glow-cyan"
        style={{
          padding: "24px 28px",
          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid #06b6d4",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#22d3ee", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>
            <Sparkles size={16} />
            <span>Primary Judge Demonstration Scenario</span>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginTop: "4px" }}>
            Run Full End-to-End Demo Scenario
          </h2>
          <p style={{ fontSize: "13.5px", color: "#cbd5e1", marginTop: "4px", lineHeight: 1.45 }}>
            Watch a report move from <strong>signal</strong> → <strong>AI triage</strong> → <strong>privacy protection</strong> → <strong>community verification</strong> → <strong>Hero matching</strong> → <strong>resolution</strong> → <strong>credits</strong> in real time.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            className="btn-primary"
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 700,
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
            }}
            onClick={() => runFullDemo(false)}
          >
            <Play size={16} fill="#fff" />
            <span>RUN FULL DEMO</span>
          </button>
        </div>
      </div>

      {/* 6. Live Signals Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>
              Live Neighborhood Signals
            </h2>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              Hyperlocal observations triaged and verified by nearby community members
            </p>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {["ALL", "PERSONAL SAFETY", "MEDICAL", "CHILD SAFETY", "INFRASTRUCTURE", "FOOD AID"].map((cat) => (
              <button
                key={cat}
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  background: selectedCategory === cat ? "rgba(6, 182, 212, 0.2)" : "rgba(30, 41, 59, 0.5)",
                  border: selectedCategory === cat ? "1px solid #06b6d4" : "1px solid var(--border-subtle)",
                  color: selectedCategory === cat ? "#38bdf8" : "#94a3b8",
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Signals Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "16px",
          }}
        >
          {filteredIncidents.slice(0, 6).map((incident) => (
            <SignalCard
              key={incident.id}
              incident={incident}
              onClick={() => openIncident(incident.id)}
            />
          ))}
        </div>

        {filteredIncidents.length > 6 && (
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <button
              className="btn-secondary"
              style={{ padding: "8px 20px", fontSize: "13px" }}
              onClick={() => setView("signals")}
            >
              <span>View All {incidents.length} Signals</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* 7. Nearby Heroes Strip */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>
              Nearby Qualified Heroes
            </h2>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              Verified community members with safety, medical, and assistance skills
            </p>
          </div>

          <button
            className="btn-secondary"
            style={{ padding: "6px 14px", fontSize: "12px" }}
            onClick={() => setView("heroes")}
          >
            <span>Hero Center</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {heroes.slice(0, 3).map((hero) => (
            <HeroCard key={hero.id} hero={hero} showActions={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
