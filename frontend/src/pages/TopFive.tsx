import { useFnn } from "../context/FnnContext";
import { PrivacyBanner } from "../components/PrivacyBadge";
import { Award, Crown, Medal, Shield, Trophy } from "lucide-react";

export function TopFive() {
  const { leaderboard } = useFnn();

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontWeight: 800,
              fontSize: "15px",
              boxShadow: "0 0 16px rgba(251, 191, 36, 0.4)",
            }}
          >
            <Crown size={20} />
          </div>
        );
      case 2:
        return (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #94a3b8 0%, #475569 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "15px",
            }}
          >
            <Medal size={20} />
          </div>
        );
      case 3:
        return (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #b45309 0%, #78350f 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "15px",
            }}
          >
            <Award size={20} />
          </div>
        );
      default:
        return (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(30, 41, 59, 0.8)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            #{rank}
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "920px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
              }}
            >
              <Trophy size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
                Top 5 Community Heroes
              </h1>
              <p style={{ fontSize: "14px", color: "var(--cyan-light)", marginTop: "2px" }}>
                Leading verified responders recognized by neighborhood consensus
              </p>
            </div>
          </div>
        </div>
      </div>

      <PrivacyBanner />

      {/* Leaderboard Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {leaderboard.map((entry) => {
          const isFirst = entry.rank === 1;

          return (
            <div
              key={entry.rank}
              className={`glass-card ${isFirst ? "glow-cyan" : ""}`}
              style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                borderLeft: isFirst ? "4px solid #fbbf24" : "4px solid var(--cyan-primary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {getRankBadge(entry.rank)}

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>
                      {entry.pseudonym}
                    </h3>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(6, 182, 212, 0.15)",
                        border: "1px solid rgba(6, 182, 212, 0.3)",
                        color: "#38bdf8",
                      }}
                    >
                      {entry.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                    Pseudonymous identity protected · Verified responder
                  </div>
                </div>
              </div>

              {/* Stats: Credits, Resolved, Reliability */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Tasks Resolved</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
                    {entry.tasksResolved}
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Reliability</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#34d399", marginTop: "2px", display: "flex", alignItems: "center", gap: "3px" }}>
                    <Shield size={12} />
                    <span>{entry.reliability}%</span>
                  </div>
                </div>

                <div style={{ textAlign: "right", minWidth: "90px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Credits</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#fbbf24", marginTop: "2px" }}>
                    {entry.credits} CR
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
