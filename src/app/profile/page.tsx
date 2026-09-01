"use client";

import { useRouter } from "next/navigation";
import { AuthGate } from "@/components/AuthGate";
import { useFnn } from "@/lib/fnn-store";

export default function ProfilePage() {
  const { user, logout } = useFnn();
  const router = useRouter();

  return (
    <AuthGate>
      <header className="px-5 pt-6">
        <p className="font-mono text-[10px] tracking-[0.3em] text-crimson">NODE WALLET</p>
        <h1 className="text-2xl font-semibold">{user?.pseudonym}</h1>
        <p className="text-sm text-slate-400">{user?.role} · {user?.email}</p>
      </header>
      <main className="space-y-3 px-5 py-5">
        <div className="panel rounded-3xl p-5">
          <p className="font-mono text-[10px] text-slate-500">REPUTATION</p>
          <p className="text-4xl font-semibold text-crimson">{user?.reputation}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="panel rounded-3xl p-4">
            <p className="font-mono text-[10px] text-slate-500">AVAILABLE</p>
            <p className="text-2xl font-semibold text-cyan-300">${user?.credits}</p>
          </div>
          <div className="panel rounded-3xl p-4">
            <p className="font-mono text-[10px] text-slate-500">LOCKED STAKE</p>
            <p className="text-2xl font-semibold text-amber-300">${user?.lockedCredits}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Demo wallet. New students start with $100 credits. Reports lock 10 credits until
          verification.
        </p>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full rounded-2xl border border-white/15 py-3 text-sm text-slate-300"
        >
          Sign out
        </button>
      </main>
    </AuthGate>
  );
}
