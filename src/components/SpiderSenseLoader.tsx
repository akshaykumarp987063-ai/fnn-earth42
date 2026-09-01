"use client";

import { motion } from "framer-motion";
import { WebMesh } from "@/components/WebMesh";

export function SpiderSenseLoader({ label = "Spider-Sense triage" }: { label?: string }) {
  return (
    <div className="panel relative overflow-hidden rounded-3xl px-6 py-12 text-center">
      <WebMesh />
      <motion.div
        className="relative mx-auto h-36 w-36 rounded-full border border-crimson/30"
        animate={{ boxShadow: ["0 0 0 0 rgba(226,54,54,0.45)", "0 0 0 24px rgba(226,54,54,0)"] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        <motion.div
          className="absolute inset-3 rounded-full border border-crimson/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xs tracking-[0.3em] text-crimson">SCAN</span>
        </div>
      </motion.div>
      <p className="relative mt-6 text-sm text-slate-300">{label}</p>
      <p className="relative mt-1 font-mono text-[11px] text-slate-500">
        Extracting category · severity · responder
      </p>
    </div>
  );
}
