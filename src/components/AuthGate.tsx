"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useFnn } from "@/lib/fnn-store";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user } = useFnn();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-400">
        Spinning up the web…
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1">{children}</div>
      <BottomNav />
    </div>
  );
}
