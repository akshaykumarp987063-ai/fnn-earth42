"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronsRight } from "lucide-react";

export function SwipeConfirm({
  label,
  onConfirm,
}: {
  label: string;
  onConfirm: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [done, setDone] = useState(false);
  const opacity = useTransform(x, [0, 180], [1, 0.15]);

  return (
    <div
      ref={trackRef}
      className="relative h-14 overflow-hidden rounded-full border border-crimson/40 bg-crimson/10"
    >
      <motion.p
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] tracking-[0.2em] text-crimson"
      >
        {done ? "LOCKED IN" : label}
      </motion.p>
      <motion.button
        drag="x"
        dragConstraints={trackRef}
        dragElastic={0.05}
        style={{ x }}
        disabled={done}
        onDragEnd={(_, info) => {
          const width = trackRef.current?.offsetWidth ?? 0;
          if (info.offset.x > width * 0.55) {
            setDone(true);
            onConfirm();
          }
        }}
        className="absolute left-1 top-1 flex h-12 w-12 items-center justify-center rounded-full bg-crimson text-white"
        aria-label={label}
      >
        <ChevronsRight className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
