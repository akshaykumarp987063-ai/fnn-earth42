import { useFnn } from "../context/FnnContext";
import type { ViewId } from "../types/fnn";
import {
  AlertOctagon,
  Award,
  Coins,
  Compass,
  Flame,
  HeartHandshake,
  LayoutDashboard,
  Radio,
  Send,
  Shield,
  ShieldCheck,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

interface SidebarProps {
  onOpenSos: () => void;
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const {
    view,
    setView,
    user,
    wallet,
    incidents,
    disasterMode,
  } = useFnn();

  const activeSignalsCount = incidents.filter((i) => i.status !== "RESOLVED").length;
  const criticalCount = incidents.filter(
    (i) => (i.severity === "CRITICAL" || i.isSos) && i.status !== "RESOLVED"
  ).length;

  const navItems: { id: ViewId; label: string; icon: React.ComponentType<{ size?: number; color?: string }>; badge?: string | number; criticalBadge?: boolean }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "signals",
      label: "Signals",
      icon: Radio,
      badge: activeSignalsCount > 0 ? activeSignalsCount : undefined,
      criticalBadge: criticalCount > 0,
    },
    { id: "spider", label: "Spider Signal", icon: Send },
    { id: "heroes", label: "Heroes", icon: Zap },
    { id: "map", label: "Privacy Map", icon: Compass },
    { id: "sos", label: "SOS Emergency", icon: Flame, criticalBadge: true },
    { id: "community", label: "Community", icon: HeartHandshake },
    { id: "services", label: "Services", icon: Wrench },
    { id: "credits", label: "Credits", icon: Coins, badge: wallet.available },
    { id: "top5", label: "Top 5", icon: Award },
    { id: "privacy-challenge", label: "Privacy Challenge", icon: ShieldCheck },
  ];

  const handleNavClick = (id: ViewId) => {
    setView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      style={{
        width: "260px",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 60,
        overflowY: "auto",
      }}
    >
      {/* Top: Logo Brand Header */}
      <div>
        <div
          style={{
            padding: "20px 22px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => handleNavClick("dashboard")}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(6, 182, 212, 0.4)",
              color: "#fff",
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff" }}>
                FNN
              </h1>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: "4px",
                  background: "rgba(6, 182, 212, 0.2)",
                  color: "#38bdf8",
                  letterSpacing: "0.04em",
                }}
              >
                EARTH-42
              </span>
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "-2px" }}>
              Friendly Neighborhood Network
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: "3px" }}>
          {navItems.map((item) => {
            const isActive = view === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: "var(--radius-md)",
                  background: isActive
                    ? "rgba(6, 182, 212, 0.16)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(6, 182, 212, 0.35)"
                    : "1px solid transparent",
                  color: isActive ? "#38bdf8" : "var(--text-secondary)",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "13.5px",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
                onClick={() => handleNavClick(item.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icon
                    size={17}
                    color={
                      item.id === "sos"
                        ? "#f87171"
                        : isActive
                        ? "#22d3ee"
                        : "#64748b"
                    }
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "var(--radius-full)",
                      background: item.criticalBadge
                        ? "rgba(239, 68, 68, 0.25)"
                        : "rgba(6, 182, 212, 0.2)",
                      color: item.criticalBadge ? "#fca5a5" : "#38bdf8",
                      border: item.criticalBadge
                        ? "1px solid rgba(239, 68, 68, 0.4)"
                        : "1px solid rgba(6, 182, 212, 0.3)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Disaster Mode Toggle & User Profile Card */}
      <div
        style={{
          padding: "14px 12px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: "rgba(6, 9, 18, 0.6)",
        }}
      >
        {/* Disaster Mode Button / Link */}
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: "var(--radius-md)",
            background: disasterMode
              ? "rgba(245, 158, 11, 0.22)"
              : "rgba(30, 41, 59, 0.5)",
            border: disasterMode ? "1px solid #f59e0b" : "1px solid var(--border-subtle)",
            color: disasterMode ? "#fbbf24" : "var(--text-secondary)",
            fontSize: "12.5px",
            fontWeight: 600,
          }}
          onClick={() => handleNavClick("disaster")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertOctagon size={16} color={disasterMode ? "#f59e0b" : "#94a3b8"} />
            <span>Disaster Mode</span>
          </div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: "4px",
              background: disasterMode ? "rgba(245, 158, 11, 0.3)" : "rgba(100, 116, 139, 0.2)",
              color: disasterMode ? "#fde047" : "#94a3b8",
            }}
          >
            {disasterMode ? "ACTIVE" : "STANDBY"}
          </span>
        </button>

        {/* User Profile Info Card */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#f8fafc" }}>
              {user.pseudonym}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#22d3ee",
                background: "rgba(6, 182, 212, 0.15)",
                padding: "1px 5px",
                borderRadius: "3px",
              }}
            >
              {user.role}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "11.5px",
              color: "var(--text-muted)",
              paddingTop: "4px",
              borderTop: "1px solid rgba(148, 163, 184, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Star size={11} color="#fbbf24" />
              <span>Rep: <strong style={{ color: "#fbbf24" }}>{user.reputation}</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Coins size={11} color="#34d399" />
              <span>Credits: <strong style={{ color: "#34d399" }}>{wallet.available}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
