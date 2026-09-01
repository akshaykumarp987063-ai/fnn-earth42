"use client";

import { AuthGate } from "@/components/AuthGate";
import { IncidentCard } from "@/components/IncidentCard";
import { SosButton } from "@/components/SosButton";
import { CAMPUS } from "@/lib/format";
import { useFnn } from "@/lib/fnn-store";

export default function DashboardPage() {
  const { user, signals, radiusOnly, setRadiusOnly } = useFnn();
  const feed = radiusOnly
    ? signals.filter((s) => (s.distanceMeters ?? 0) <= 500)
    : signals;

  return (
    <AuthGate>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-midnight/90 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-crimson">FNN FEED</p>
            <h1 className="text-xl font-semibold">{user?.pseudonym}</h1>
            <p className="mt-1 font-mono text-xs text-slate-400">
              ${user?.credits} available · ${user?.lockedCredits} locked
            </p>
          </div>
          <SosButton />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <div>
            <p className="text-xs font-medium">{CAMPUS.name} demo</p>
            <p className="font-mono text-[10px] text-slate-500">500m neighborhood radius</p>
          </div>
          <button
            type="button"
            onClick={() => setRadiusOnly(!radiusOnly)}
            className={`relative h-7 w-12 rounded-full transition ${
              radiusOnly ? "bg-crimson" : "bg-white/15"
            }`}
            aria-pressed={radiusOnly}
            aria-label={radiusOnly ? "Within 500m" : "Show all"}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${
                radiusOnly ? "left-[1.55rem]" : "left-0.5"
              }`}
            />
          </button>
        </div>
        <p className="mt-2 text-right font-mono text-[10px] text-slate-500">
          {radiusOnly ? "Within 500m" : "Show all campus signals"}
        </p>
      </header>

      <main className="space-y-3 px-5 py-4">
        {feed.length === 0 && (
          <p className="rounded-2xl border border-white/10 p-6 text-center text-sm text-slate-400">
            No signals in this radius.
          </p>
        )}
        {feed.map((signal) => (
          <IncidentCard key={signal.id} signal={signal} />
        ))}
      </main>
    </AuthGate>
  );
}
