"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  MapPin,
  Shield,
  ThumbsDown,
  ThumbsUp,
  UserRoundSearch,
} from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { Badge } from "@/components/IncidentCard";
import { PrivacyChallengeModal } from "@/components/PrivacyChallengeModal";
import {
  categoryLabel,
  coordsLabel,
  distanceLabel,
  relativeTime,
  severityTone,
  statusTone,
  urgencyLabel,
} from "@/lib/format";
import { useFnn } from "@/lib/fnn-store";

export default function SignalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getSignal, submitProof, vote } = useFnn();
  const signal = getSignal(id);
  const router = useRouter();
  const [privacyOpen, setPrivacyOpen] = useState(false);

  if (!signal) {
    return (
      <AuthGate>
        <div className="p-8 text-center text-sm text-slate-400">
          Signal not found.
          <button type="button" className="mt-4 block w-full text-crimson" onClick={() => router.push("/dashboard")}>
            Back to feed
          </button>
        </div>
      </AuthGate>
    );
  }

  const voteLocked = !signal.proofSubmitted || signal.hasVoted;
  const total = signal.upvotes + signal.downvotes;
  const upPct = total === 0 ? 50 : Math.round((signal.upvotes / total) * 100);

  return (
    <AuthGate>
      <header className="px-5 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="font-mono text-[11px] text-slate-500"
        >
          ← Feed
        </button>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge className={severityTone[signal.severity]}>{signal.severity}</Badge>
          <Badge className="border-crimson/30 bg-crimson/10 text-crimson">
            {urgencyLabel(signal.urgency)}
          </Badge>
          <Badge className={statusTone[signal.status]}>{signal.status}</Badge>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-400">
          {categoryLabel(signal.category)}
        </p>
        <h1 className="text-2xl font-semibold leading-tight">
          {signal.summary ?? signal.description}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{signal.description}</p>
      </header>

      <main className="space-y-4 px-5 py-5">
        <div className="panel rounded-2xl p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-crimson" /> Coordinate box
          </p>
          <p className="mt-2 font-mono text-sm text-cyan-300">
            {coordsLabel(signal.latitude, signal.longitude)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {distanceLabel(signal.distanceMeters)} · {relativeTime(signal.createdAt)}
          </p>
          <div className="relative mt-3 h-28 overflow-hidden rounded-xl border border-white/10 bg-[#0a1220]">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#1c2740_1px,transparent_1px),linear-gradient(90deg,#1c2740_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson shadow-[0_0_18px_#E23636]" />
          </div>
        </div>

        <section className="panel rounded-2xl p-4">
          <p className="flex items-center gap-2 font-medium">
            <Shield className="h-4 w-4 text-cyan-300" /> Hero status
          </p>
          {signal.heroPseudonym ? (
            <p className="mt-2 text-sm text-cyan-200">
              {signal.heroPseudonym} is responding — ETA {signal.heroEtaMinutes ?? 2} mins
            </p>
          ) : (
            <p className="mt-2 text-sm text-amber-200">
              No Local Responder Found — Escalating to Campus Security/112
            </p>
          )}
        </section>

        <section className="panel rounded-2xl p-4">
          <p className="text-sm font-medium">Evidence-backed voting</p>
          <p className="mt-1 text-xs text-slate-500">
            Votes unlock after location proof. One vote per node.
          </p>
          <button
            type="button"
            disabled={signal.proofSubmitted}
            onClick={() => submitProof(signal.id)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3 text-sm disabled:opacity-50"
          >
            <Camera className="h-4 w-4" />
            {signal.proofSubmitted ? "Location proof submitted" : "Submit Location Proof"}
          </button>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={voteLocked}
              onClick={() => vote(signal.id, "up")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 py-3 text-sm text-emerald-300 disabled:opacity-35"
            >
              <ThumbsUp className="h-4 w-4" /> Upvote
            </button>
            <button
              type="button"
              disabled={voteLocked}
              onClick={() => vote(signal.id, "down")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-crimson/30 py-3 text-sm text-crimson disabled:opacity-35"
            >
              <ThumbsDown className="h-4 w-4" /> Downvote
            </button>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between font-mono text-[11px] text-slate-400">
              <span>{signal.upvotes} confirm</span>
              <span>{signal.downvotes} dispute</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-emerald-400" style={{ width: `${upPct}%` }} />
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => setPrivacyOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-500/10 py-3 text-sm text-amber-100"
        >
          <UserRoundSearch className="h-4 w-4" /> I may be the person shown (60s Privacy Challenge)
        </button>
      </main>

      <PrivacyChallengeModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </AuthGate>
  );
}
