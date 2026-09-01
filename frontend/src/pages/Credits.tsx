import { useFnn } from "../context/FnnContext";
import { PrivacyBanner } from "../components/PrivacyBadge";
import { formatTime, relativeMinutes } from "../utils/formatters";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Lock,
  Shield,
} from "lucide-react";

export function Credits() {
  const { wallet, transactions } = useFnn();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Coins size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
                Community Credit Wallet
              </h1>
              <p style={{ fontSize: "14px", color: "var(--cyan-light)", marginTop: "2px" }}>
                Credits reward verified community action and mutual-aid resolution
              </p>
            </div>
          </div>
        </div>
      </div>

      <PrivacyBanner />

      {/* Credit Policy Statement Box */}
      <div
        style={{
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "13px",
          color: "#cbd5e1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Shield size={18} color="#f59e0b" />
          <span>
            <strong>Credits cannot be purchased.</strong> They are purely earned through verified community contribution, local radius voting, and emergency assistance.
          </span>
        </div>
      </div>

      {/* Top 3 Balance Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {/* Available Credits */}
        <div
          className="glass-card"
          style={{
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderLeft: "4px solid #10b981",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            AVAILABLE CREDITS
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "#34d399" }}>
            {wallet.available}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Usable for high-trust signal staking
          </div>
        </div>

        {/* Locked Credits */}
        <div
          className="glass-card"
          style={{
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            LOCKED IN STAKE
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "#fbbf24" }}>
            {wallet.locked}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Released automatically upon signal resolution
          </div>
        </div>

        {/* Total Balance */}
        <div
          className="glass-card"
          style={{
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderLeft: "4px solid #06b6d4",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            TOTAL REPUTATION POOL
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "#fff" }}>
            {wallet.total}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Cumulative contribution balance
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div
        className="glass-card"
        style={{
          padding: "22px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>
            Verified Transaction Ledger
          </h2>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {transactions.length} recorded events
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {transactions.map((tx) => {
            const isPositive = tx.amount > 0;
            const isStake = tx.type === "STAKE";

            return (
              <div
                key={tx.id}
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: isPositive
                        ? "rgba(16, 185, 129, 0.15)"
                        : isStake
                        ? "rgba(245, 158, 11, 0.15)"
                        : "rgba(239, 68, 68, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isPositive ? "#34d399" : isStake ? "#fbbf24" : "#f87171",
                    }}
                  >
                    {isPositive ? <ArrowDownLeft size={16} /> : isStake ? <Lock size={14} /> : <ArrowUpRight size={16} />}
                  </div>

                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#f8fafc" }}>
                      {tx.label}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "1px" }}>
                      {formatTime(tx.createdAt)} · {relativeMinutes(tx.createdAt)}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: isPositive ? "#34d399" : isStake ? "#fbbf24" : "#f87171",
                    }}
                  >
                    {isPositive ? `+${tx.amount}` : tx.amount} CR
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {tx.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
