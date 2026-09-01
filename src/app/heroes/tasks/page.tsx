"use client";

import { AuthGate } from "@/components/AuthGate";
import { Badge } from "@/components/IncidentCard";
import { SwipeConfirm } from "@/components/SwipeConfirm";
import { distanceLabel, severityTone, urgencyLabel } from "@/lib/format";
import { useFnn } from "@/lib/fnn-store";
import type { HeroTaskStage, Signal } from "@/types";

const PIPELINE: HeroTaskStage[] = ["ACCEPT", "EN_ROUTE", "ARRIVED", "RESOLVE"];

function nextLabel(stage: HeroTaskStage): string {
  if (stage === "ACCEPT") return "Mark EN ROUTE";
  if (stage === "EN_ROUTE") return "Mark ARRIVED";
  if (stage === "ARRIVED") return "RESOLVE INCIDENT";
  return "Resolved";
}

function TaskCard({
  signal,
  stage,
  onAccept,
  onAdvance,
}: {
  signal: Signal;
  stage: HeroTaskStage;
  onAccept: () => void;
  onAdvance: () => void;
}) {
  const activeIndex = PIPELINE.indexOf(stage === "ACCEPT" && signal.status === "OPEN" ? "ACCEPT" : stage);

  return (
    <article className="panel rounded-3xl p-4">
      <div className="mb-2 flex flex-wrap gap-1.5">
        <Badge className={severityTone[signal.severity]}>{signal.severity}</Badge>
        <Badge className="border-crimson/30 bg-crimson/10 text-crimson">
          {urgencyLabel(signal.urgency)}
        </Badge>
      </div>
      <h2 className="text-[15px] font-semibold">{signal.summary ?? signal.description}</h2>
      <p className="mt-1 font-mono text-[11px] text-cyan-300">
        {distanceLabel(signal.distanceMeters)}
      </p>
      <div className="mt-3 flex gap-1">
        {PIPELINE.map((step, i) => (
          <div key={step} className="flex-1">
            <div
              className={`h-1 rounded-full ${i <= activeIndex ? "bg-crimson" : "bg-white/10"}`}
            />
            <p className="mt-1 text-center font-mono text-[8px] text-slate-500">{step}</p>
          </div>
        ))}
      </div>
      {signal.status === "OPEN" && stage === "ACCEPT" ? (
        <div className="mt-4">
          <SwipeConfirm label="SWIPE TO ACCEPT TASK" onConfirm={onAccept} />
        </div>
      ) : signal.status === "RESOLVED" || stage === "RESOLVE" ? (
        <p className="mt-4 text-center font-mono text-xs text-emerald-300">INCIDENT RESOLVED</p>
      ) : (
        <button
          type="button"
          onClick={onAdvance}
          className="mt-4 w-full rounded-2xl bg-crimson py-3 text-sm font-semibold"
        >
          {nextLabel(stage)}
        </button>
      )}
    </article>
  );
}

export default function HeroTasksPage() {
  const { signals, heroStage, acceptHeroTask, advanceHeroTask } = useFnn();
  const tasks = signals.filter(
    (s) =>
      s.urgency === "IMMEDIATE" &&
      s.status !== "RESOLVED" &&
      (s.distanceMeters ?? 0) <= 800,
  );

  return (
    <AuthGate>
      <header className="px-5 pt-6">
        <p className="font-mono text-[10px] tracking-[0.3em] text-crimson">HERO DISPATCH</p>
        <h1 className="text-2xl font-semibold">Nearby tasks</h1>
        <p className="mt-1 text-sm text-slate-400">
          Immediate signals inside the neighborhood web.
        </p>
      </header>
      <main className="space-y-3 px-5 py-4">
        {tasks.length === 0 && (
          <p className="panel rounded-2xl p-6 text-center text-sm text-slate-400">
            No open hero tasks in range.
          </p>
        )}
        {tasks.map((signal) => (
          <TaskCard
            key={signal.id}
            signal={signal}
            stage={heroStage[signal.id] ?? "ACCEPT"}
            onAccept={() => acceptHeroTask(signal.id)}
            onAdvance={() => advanceHeroTask(signal.id)}
          />
        ))}
      </main>
    </AuthGate>
  );
}
