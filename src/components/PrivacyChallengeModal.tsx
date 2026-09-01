"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ShieldAlert, X } from "lucide-react";
import type { PrivacyChallengeState } from "@/types";

export function PrivacyChallengeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [seconds, setSeconds] = useState(60);
  const [state, setState] = useState<PrivacyChallengeState>("IDLE");
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    if (!open) {
      setSeconds(60);
      setState("IDLE");
      setCaptured(false);
      return;
    }
    setState("COUNTDOWN");
  }, [open]);

  useEffect(() => {
    if (!open || state !== "COUNTDOWN") return;
    if (seconds <= 0) {
      setState("EXPIRED");
      return;
    }
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [open, seconds, state]);

  function submitSelfie() {
    setCaptured(true);
    setState("VERIFYING");
    window.setTimeout(() => {
      setState("LIKELY_MATCH");
    }, 1600);
  }

  const bar = (seconds / 60) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="panel w-full max-w-md rounded-3xl p-5"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.25em] text-crimson">
                  PRIVACY PROTOCOL
                </p>
                <h2 className="text-lg font-semibold">60-Second Challenge</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-white/5"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-crimson"
                animate={{ width: `${bar}%` }}
                transition={{ ease: "linear", duration: 0.3 }}
              />
            </div>
            <p className="mb-4 font-mono text-sm text-slate-300">
              {state === "EXPIRED" ? "00:00" : `00:${String(seconds).padStart(2, "0")}`} remaining
            </p>

            <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-black">
              <div className="absolute inset-6 rounded-xl border border-dashed border-crimson/50" />
              <div className="absolute left-1/2 top-1/3 h-24 w-20 -translate-x-1/2 rounded-full border-2 border-crimson/70" />
              <div className="absolute bottom-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-[40%] border border-white/20" />
              {captured && (
                <div className="absolute inset-0 bg-crimson/20 mix-blend-screen" />
              )}
              <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] tracking-widest text-slate-400">
                MOCK VIEWFINDER · NO CAMERA ACCESS
              </p>
            </div>

            {state === "COUNTDOWN" && (
              <button
                type="button"
                onClick={submitSelfie}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-crimson py-3 text-sm font-semibold"
              >
                <Camera className="h-4 w-4" /> Capture selfie proof
              </button>
            )}

            {state === "VERIFYING" && (
              <p className="flex items-center justify-center gap-2 py-3 font-mono text-xs tracking-widest text-cyan-300">
                VERIFYING BIOMETRICS
              </p>
            )}

            {state === "LIKELY_MATCH" && (
              <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100">
                <p className="flex items-center gap-2 font-semibold">
                  <ShieldAlert className="h-4 w-4" /> LIKELY_MATCH
                </p>
                <p className="mt-1 text-xs text-amber-200/80">
                  Privacy hold applied. Signal visibility is restricted pending review.
                </p>
              </div>
            )}

            {state === "UNCERTAIN" && (
              <div className="rounded-2xl border border-slate-400/30 bg-white/5 p-4 text-sm">
                <p className="font-semibold">UNCERTAIN</p>
                <p className="mt-1 text-xs text-slate-400">
                  No confident match. Challenge closed without a privacy hold.
                </p>
              </div>
            )}

            {state === "EXPIRED" && (
              <div className="rounded-2xl border border-crimson/30 bg-crimson/10 p-4 text-sm">
                <p className="font-semibold text-crimson">EXPIRED</p>
                <p className="mt-1 text-xs text-slate-400">
                  The 60-second window closed. You can start a new challenge later.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
