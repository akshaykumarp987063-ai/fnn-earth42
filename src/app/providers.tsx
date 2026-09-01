"use client";

import { FnnProvider } from "@/lib/fnn-store";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <FnnProvider>{children}</FnnProvider>;
}
