"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Signal } from "@/types";
import {
  categoryLabel,
  distanceLabel,
  relativeTime,
  severityTone,
  statusTone,
  urgencyLabel,
} from "@/lib/format";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export function IncidentCard({ signal }: { signal: Signal }) {
  return (
    <Link href={`/signals/${signal.id}`}>
      <motion.article
        layout
        whileTap={{ scale: 0.98 }}
        className="panel rounded-2xl p-4"
      >
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge className={severityTone[signal.severity]}>{signal.severity}</Badge>
          <Badge className="border-crimson/30 bg-crimson/10 text-crimson">
            {urgencyLabel(signal.urgency)}
          </Badge>
          <Badge className={statusTone[signal.status]}>{signal.status}</Badge>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
          {categoryLabel(signal.category)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-white">
          {signal.summary ?? signal.description}
        </h3>
        <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-slate-400">
          <span>{relativeTime(signal.createdAt)}</span>
          <span className="text-cyan-300">{distanceLabel(signal.distanceMeters)}</span>
        </div>
      </motion.article>
    </Link>
  );
}
