"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Plus, Radio, UserRound, Shield } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Feed", icon: Radio },
  { href: "/report", label: "Report", icon: Plus, primary: true },
  { href: "/heroes/tasks", label: "Hero", icon: Shield },
  { href: "/services", label: "Services", icon: FolderOpen },
  { href: "/profile", label: "Wallet", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-white/10 bg-midnight/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
      <ul className="grid grid-cols-5 items-end">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          if (item.primary) {
            return (
              <li key={item.href} className="flex justify-center">
                <Link
                  href={item.href}
                  className="-mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-crimson text-white glow-ring"
                  aria-label="Report incident"
                >
                  <Icon className="h-7 w-7" strokeWidth={2.5} />
                </Link>
              </li>
            );
          }
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 text-[10px] tracking-wide ${
                  active ? "text-crimson" : "text-slate-400"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "drop-shadow-[0_0_8px_#E23636]" : ""}`} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
