"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { Badge } from "@/components/IncidentCard";
import { SpiderSenseLoader } from "@/components/SpiderSenseLoader";
import { CAMPUS, categoryLabel, coordsLabel, severityTone, urgencyLabel } from "@/lib/format";
import { REPORT_STAKE, simulateTriage, useFnn } from "@/lib/fnn-store";
import type { TriageResult } from "@/types";

type Step = 1 | 2 | 3;

export default function ReportPage() {
  const { submitReport } = useFnn();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [description, setDescription] = useState("Fight reported near east gate");
  const [lat] = useState(CAMPUS.latitude + 0.0004);
  const [lng] = useState(CAMPUS.longitude + 0.0011);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [scanning, setScanning] = useState(false);

  function runTriage(e: FormEvent) {
    e.preventDefault();
    setStep(2);
    setScanning(true);
    window.setTimeout(() => {
      setTriage(simulateTriage(description));
      setScanning(false);
    }, 1800);
  }

  function submit() {
    if (!triage) return;
    const signal = submitReport({ description, latitude: lat, longitude: lng, triage });
    router.push(`/signals/${signal.id}`);
  }

  return (
    <AuthGate>
      <header className="px-5 pb-2 pt-6">
        <p className="font-mono text-[10px] tracking-[0.3em] text-crimson">NEW SIGNAL</p>
        <h1 className="text-2xl font-semibold">Report incident</h1>
        <p className="mt-1 font-mono text-[11px] text-slate-500">Step {step} of 3</p>
      </header>

      <main className="px-5 pb-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="s1"
              onSubmit={runTriage}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="space-y-4"
            >
              <label className="block text-xs text-slate-400">
                What did you notice?
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-crimson/60"
                />
              </label>
              <div className="panel rounded-2xl p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-crimson" /> Location pin
                </p>
                <p className="mt-1 font-mono text-xs text-cyan-300">{coordsLabel(lat, lng)}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {CAMPUS.name} · East Gate cluster (demo GPS)
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                Category hint: Spider-Sense will classify Personal Safety, Medical, Fire,
                Hazard, or Infrastructure.
              </p>
              <button type="submit" className="w-full rounded-2xl bg-crimson py-3 text-sm font-semibold">
                Run Spider-Sense triage
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
            >
              {scanning || !triage ? (
                <SpiderSenseLoader />
              ) : (
                <div className="panel space-y-3 rounded-3xl p-5">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-crimson">
                    TRIAGE RESULT
                  </p>
                  <h2 className="text-lg font-semibold">{triage.summary}</h2>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className={severityTone[triage.severity]}>{triage.severity}</Badge>
                    <Badge className="border-crimson/30 bg-crimson/10 text-crimson">
                      {urgencyLabel(triage.urgency)}
                    </Badge>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                    <div>
                      <dt className="text-slate-500">category</dt>
                      <dd>{categoryLabel(triage.category)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">confidence</dt>
                      <dd className="text-cyan-300">{Math.round(triage.confidence * 100)}%</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-slate-500">recommendedResponder</dt>
                      <dd>{triage.recommendedResponder}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full rounded-2xl bg-crimson py-3 text-sm font-semibold"
                  >
                    Continue to staking
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && triage && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="panel rounded-3xl p-5"
            >
              <p className="font-mono text-[10px] tracking-[0.25em] text-amber-300">
                STAKE NOTICE
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {REPORT_STAKE} Credits Locked for Report Submission
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Credits return after community verification. False reports can slash reputation.
              </p>
              <button
                type="button"
                onClick={submit}
                className="mt-6 w-full rounded-2xl bg-crimson py-3 text-sm font-semibold glow-ring"
              >
                Submit signal
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-2 w-full py-2 text-xs text-slate-500"
              >
                Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </AuthGate>
  );
}
