import { useState, type ReactNode } from "react";
import { useFnn } from "../context/FnnContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ToastContainer } from "./Toast";
import { DemoRunner } from "./DemoRunner";
import { IncidentDetailModal } from "./IncidentDetailModal";
import { SosModal } from "./SosModal";
import { AlertOctagon, RefreshCw } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

export function AppShell({ children, onSearch }: AppShellProps) {
  const { disasterMode, online, restoreAndSync, syncing, offlineQueue } = useFnn();
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const pendingCount = offlineQueue.filter((q) => q.status !== "SYNCED").length;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-app)",
        color: "var(--text-primary)",
        position: "relative",
      }}
    >
      {/* Sidebar Desktop */}
      <div className="desktop-only" style={{ display: "flex" }}>
        <Sidebar onOpenSos={() => setSosModalOpen(true)} />
      </div>

      {/* Main App Content Column */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: "var(--bg-app)",
        }}
      >
        {/* Disaster Mode Global Alert Bar if active */}
        {disasterMode && (
          <div
            style={{
              background: "linear-gradient(90deg, #b45309 0%, #78350f 100%)",
              color: "#fef3c7",
              padding: "8px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12.5px",
              fontWeight: 600,
              borderBottom: "1px solid #d97706",
              zIndex: 70,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertOctagon size={16} color="#fde047" className="animate-pulse-glow" />
              <span>
                DISASTER RESILIENCE MODE ACTIVE · Local offline mesh & cached response protocol engaged
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {!online && pendingCount > 0 && (
                <span style={{ background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: "4px" }}>
                  {pendingCount} Queued Offline
                </span>
              )}
              {!online && (
                <button
                  style={{
                    background: "#f59e0b",
                    color: "#000",
                    padding: "3px 10px",
                    borderRadius: "4px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  onClick={restoreAndSync}
                  disabled={syncing}
                >
                  <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
                  <span>{syncing ? "Syncing..." : "Restore & Sync"}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Global Top Bar */}
        <TopBar onOpenSos={() => setSosModalOpen(true)} onSearch={onSearch} />

        {/* Main Routed Page Content */}
        <main
          style={{
            flex: 1,
            padding: "24px 28px",
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <DemoRunner />
      <IncidentDetailModal />
      <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
      <ToastContainer />
    </div>
  );
}
