"use client";

import { Phone, MapPinned } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { CAMPUS_SERVICES } from "@/data/mock";

const accent: Record<string, string> = {
  crimson: "border-crimson/40 bg-crimson/10",
  cyan: "border-cyan-400/40 bg-cyan-500/10",
  gold: "border-amber-400/40 bg-amber-500/10",
  violet: "border-violet-400/40 bg-violet-500/10",
};

export default function ServicesPage() {
  return (
    <AuthGate>
      <header className="px-5 pt-6">
        <p className="font-mono text-[10px] tracking-[0.3em] text-crimson">CAMPUS GRID</p>
        <h1 className="text-2xl font-semibold">SOS &amp; services</h1>
        <p className="mt-1 text-sm text-slate-400">
          One-tap calls. Markers are demo locations on the VIT Chennai mesh.
        </p>
      </header>
      <main className="space-y-3 px-5 py-4">
        {CAMPUS_SERVICES.map((svc) => (
          <article key={svc.id} className={`rounded-3xl border p-4 ${accent[svc.accent]}`}>
            <h2 className="text-lg font-semibold">{svc.name}</h2>
            <p className="text-sm text-slate-300">{svc.subtitle}</p>
            <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-slate-400">
              <MapPinned className="h-3.5 w-3.5" /> {svc.marker}
            </p>
            <a
              href={`tel:${svc.phone.replace(/[^0-9+]/g, "")}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 text-sm font-semibold"
            >
              <Phone className="h-4 w-4" /> Call {svc.phone}
            </a>
          </article>
        ))}
      </main>
    </AuthGate>
  );
}
