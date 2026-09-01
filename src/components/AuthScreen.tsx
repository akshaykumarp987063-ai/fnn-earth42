"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useFnn } from "@/lib/fnn-store";
import { DEMO_USER } from "@/data/mock";

const WebMesh = dynamic(() => import("@/components/WebMesh").then((m) => m.WebMesh), {
  ssr: false,
});

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const { login, signup, user } = useFnn();
  const router = useRouter();
  const [email, setEmail] = useState(mode === "login" ? DEMO_USER.email : "");
  const [password, setPassword] = useState("web-of-trust");
  const [pseudonym, setPseudonym] = useState(
    mode === "login" ? DEMO_USER.pseudonym : "WebGuardian42",
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode === "signup") {
      signup({ email, password, pseudonym });
    } else {
      login({ email, password, pseudonym });
    }
    router.push("/dashboard");
  }

  const shown = user ?? {
    ...DEMO_USER,
    pseudonym,
    email,
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden px-5 pb-8 pt-10">
      <WebMesh />
      <div className="relative">
        <p className="font-mono text-[10px] tracking-[0.35em] text-crimson">EARTH-42 · VIT CHENNAI</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Friendly Neighborhood Network
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Campus emergency mesh. Report, verify, respond — without exposing real names.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel relative mt-8 rounded-3xl p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-slate-500">OPERATOR CARD</p>
            <h2 className="text-xl font-semibold">{shown.pseudonym}</h2>
            <p className="text-xs text-slate-400">{shown.role} node</p>
          </div>
          <div className="text-right">
            <span className="inline-flex rounded-full border border-crimson/40 bg-crimson/15 px-2 py-1 font-mono text-[10px] text-crimson">
              REP {shown.reputation}
            </span>
            <p className="mt-2 font-mono text-sm text-cyan-300">${shown.credits} credits</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={onSubmit} className="relative mt-6 space-y-3">
        <label className="block text-xs text-slate-400">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-crimson/60"
          />
        </label>
        <label className="block text-xs text-slate-400">
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-crimson/60"
          />
        </label>
        <label className="block text-xs text-slate-400">
          Pseudonym
          <input
            required
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-crimson/60"
          />
        </label>
        <button
          type="submit"
          className="mt-2 w-full rounded-2xl bg-crimson py-3 text-sm font-semibold glow-ring"
        >
          {mode === "login" ? "Enter the web" : "Create neighborhood node"}
        </button>
      </form>

      <p className="relative mt-6 text-center text-sm text-slate-400">
        {mode === "login" ? (
          <>
            New student?{" "}
            <Link href="/signup" className="text-crimson">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already wired in?{" "}
            <Link href="/login" className="text-crimson">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
