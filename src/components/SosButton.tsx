"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Siren, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CAMPUS } from "@/lib/format";
import { simulateTriage, useFnn } from "@/lib/fnn-store";

export function SosButton() {
  const [open, setOpen] = useState(false);
  const { submitReport } = useFnn();
  const router = useRouter();

  function fireSos() {
    const triage = simulateTriage("SOS panic — student in immediate danger on campus");
    const signal = submitReport({
      description: "SOS panic button — immediate personal safety request.",
      latitude: CAMPUS.latitude,
      longitude: CAMPUS.longitude,
      triage: { ...triage, severity: "CRITICAL", urgency: "IMMEDIATE" },
    });
    setOpen(false);
    router.push(`/signals/${signal.id}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full bg-crimson px-3 py-1.5 text-xs font-semibold uppercase tracking-wide glow-ring"
      >
        <Siren className="h-3.5 w-3.5" /> SOS
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="panel w-full rounded-3xl p-5">
              <div className="mb-3 flex justify-end">
                <button type="button" onClick={() => setOpen(false)} aria-label="Cancel">
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>
              <h2 className="text-xl font-semibold">Panic web</h2>
              <p className="mt-2 text-sm text-slate-400">
                This broadcasts a CRITICAL personal-safety signal at your campus pin and
                locks 10 report credits.
              </p>
              <button
                type="button"
                onClick={fireSos}
                className="mt-5 w-full rounded-2xl bg-crimson py-3 text-sm font-semibold"
              >
                Send SOS now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
