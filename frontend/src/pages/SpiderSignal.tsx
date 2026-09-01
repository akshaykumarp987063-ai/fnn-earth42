import { useState } from "react";
import { useFnn } from "../context/FnnContext";
import { CATEGORIES, SEVERITIES, URGENCIES, type Category, type Incident, type Severity, type Urgency } from "../types/fnn";
import { localTriage } from "../services/triage";
import { TriagePanel } from "../components/TriagePanel";
import { PrivacyBanner } from "../components/PrivacyBadge";
import {
  ArrowRight,
  CheckCircle2,
  Send,
  Shield,
} from "lucide-react";

export function SpiderSignal() {
  const { submitSignal, wallet, openIncident } = useFnn();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("PERSONAL SAFETY");
  const [severity, setSeverity] = useState<Severity>("HIGH");
  const [urgency, setUrgency] = useState<Urgency>("URGENT");
  const [area, setArea] = useState("Campus Bus Stand Area");
  const [stake, setStake] = useState<number>(10);
  const [mediaNote, setMediaNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [triageResult, setTriageResult] = useState<ReturnType<typeof localTriage> | null>(null);
  const [createdIncident, setCreatedIncident] = useState<Incident | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    const triage = localTriage({
      description,
      category,
      severity,
      urgency,
    });
    setTriageResult(triage);

    const incident = await submitSignal(
      description,
      triage.category,
      triage.severity,
      triage.urgency,
      area,
      stake,
      mediaNote.trim() || undefined
    );

    setCreatedIncident(incident);
  };

  const handleReset = () => {
    setDescription("");
    setCategory("PERSONAL SAFETY");
    setSeverity("HIGH");
    setUrgency("URGENT");
    setStake(10);
    setMediaNote("");
    setIsSubmitting(false);
    setTriageResult(null);
    setCreatedIncident(null);
  };

  const handleSampleFill = (desc: string, cat: Category, sev: Severity, urg: Urgency) => {
    setDescription(desc);
    setCategory(cat);
    setSeverity(sev);
    setUrgency(urg);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "920px", margin: "0 auto" }}>
      {/* Header */}
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
            <Send size={18} />
          </div>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>
              Send a Spider Signal
            </h1>
            <p style={{ fontSize: "14px", color: "var(--cyan-light)", marginTop: "2px" }}>
              Report what you see. Protect who you are.
            </p>
          </div>
        </div>
      </div>

      <PrivacyBanner />

      {/* Main Submission Card or Triage Flow */}
      {!createdIncident ? (
        <div
          className="glass-card"
          style={{
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            background: "rgba(10, 16, 32, 0.88)",
          }}
        >
          {/* Quick Pre-fill Prompts */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
              QUICK OBSERVATION PRESETS (TESTING & DEMO):
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: "11.5px", padding: "5px 10px" }}
                onClick={() =>
                  handleSampleFill(
                    "Fight reported near campus bus stand. Several people are gathering.",
                    "PERSONAL SAFETY",
                    "HIGH",
                    "URGENT"
                  )
                }
              >
                🥊 Altercation at Bus Stand
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: "11.5px", padding: "5px 10px" }}
                onClick={() =>
                  handleSampleFill(
                    "Student injured near sports ground, needs immediate first aid support.",
                    "MEDICAL",
                    "HIGH",
                    "IMMEDIATE"
                  )
                }
              >
                🩹 Sports Injury (Medical)
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: "11.5px", padding: "5px 10px" }}
                onClick={() =>
                  handleSampleFill(
                    "Lost child reported near transit plaza wearing blue backpack.",
                    "CHILD SAFETY",
                    "CRITICAL",
                    "IMMEDIATE"
                  )
                }
              >
                🚨 Lost Child (Critical)
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: "11.5px", padding: "5px 10px" }}
                onClick={() =>
                  handleSampleFill(
                    "Extra meals available at community kitchen for anyone in need.",
                    "FOOD AID",
                    "LOW",
                    "NORMAL"
                  )
                }
              >
                🍲 Extra Food Available
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Description Textarea */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>
                Description of Observation *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe what you observed clearly. State the location landmark and any immediate safety concerns..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: "vertical", minHeight: "90px" }}
              />
            </div>

            {/* Category and Approximate Location row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px",
              }}
            >
              {/* Category */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  style={{ width: "100%" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Approximate Location */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>
                    Approximate Location Area
                  </label>
                  <span style={{ fontSize: "11px", color: "var(--cyan-light)" }}>
                    Area detected
                  </span>
                </div>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="Campus Bus Stand Area">Campus Bus Stand Area</option>
                  <option value="Market Square">Market Square</option>
                  <option value="Parking Deck B">Parking Deck B</option>
                  <option value="Community Kitchen">Community Kitchen</option>
                  <option value="North Residential Block">North Residential Block</option>
                  <option value="Sports Ground">Sports Ground</option>
                  <option value="Transit Plaza">Transit Plaza</option>
                  <option value="Storm Drain Road">Storm Drain Road</option>
                  <option value="Hostel Lane">Hostel Lane</option>
                  <option value="Neighborhood Core">Neighborhood Core</option>
                </select>
              </div>
            </div>

            {/* Severity, Urgency, and Stake row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px",
              }}
            >
              {/* Severity */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as Severity)}
                  style={{ width: "100%" }}
                >
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>
                  Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as Urgency)}
                  style={{ width: "100%" }}
                >
                  {URGENCIES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stake Amount */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>
                    Stake Amount
                  </label>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Avail: {wallet.available}
                  </span>
                </div>
                <select
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  style={{ width: "100%" }}
                >
                  <option value={0}>0 Credits (No Stake)</option>
                  <option value={5}>5 Credits (Standard)</option>
                  <option value={10}>10 Credits (High Trust)</option>
                  <option value={20}>20 Credits (Priority Anchor)</option>
                </select>
              </div>
            </div>

            {/* Optional Media Note */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>
                Optional Media Note or Evidence URL
              </label>
              <input
                type="text"
                placeholder="Optional photo description or verified proof note (no raw bystander face data)..."
                value={mediaNote}
                onChange={(e) => setMediaNote(e.target.value)}
              />
            </div>

            {/* Privacy Safeguard Shield Summary Box */}
            <div
              style={{
                background: "rgba(6, 182, 212, 0.08)",
                border: "1px solid rgba(6, 182, 212, 0.25)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#22d3ee", fontWeight: 700, fontSize: "12.5px" }}>
                <Shield size={14} />
                <span>PRIVACY SHIELD ACTIVE FOR THIS REPORT</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "8px",
                  fontSize: "12px",
                }}
              >
                <div>
                  <span style={{ color: "var(--text-muted)" }}>PUBLIC LOCATION: </span>
                  <strong style={{ color: "#e2e8f0" }}>Approximate neighborhood</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>EXACT LOCATION: </span>
                  <strong style={{ color: "#34d399" }}>Protected & Obfuscated</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>REPORTER ID: </span>
                  <strong style={{ color: "#38bdf8" }}>Pseudonymous Spider #4812</strong>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
              <button
                type="submit"
                className="btn-primary glow-cyan"
                style={{ padding: "12px 28px", fontSize: "14px", fontWeight: 700 }}
                disabled={!description.trim() || isSubmitting}
              >
                <Send size={16} />
                <span>Send Signal & Initiate AI Triage</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Multi-step AI Triage and Result Flow */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {triageResult && (
            <TriagePanel
              triage={triageResult}
              isProcessing={false}
            />
          )}

          <div
            className="glass-card animate-fade-in"
            style={{
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "14px",
              background: "rgba(10, 16, 32, 0.9)",
              border: "1px solid #10b981",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                <span>SIGNAL BROADCASTED TO NEIGHBORHOOD MESH</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                Nearby community members within 500m have received the verification request.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                className="btn-primary"
                style={{ padding: "8px 16px", fontSize: "13px" }}
                onClick={() => openIncident(createdIncident.id)}
              >
                <span>View Incident Detail</span>
                <ArrowRight size={14} />
              </button>

              <button
                className="btn-secondary"
                style={{ padding: "8px 16px", fontSize: "13px" }}
                onClick={handleReset}
              >
                Send Another Signal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
