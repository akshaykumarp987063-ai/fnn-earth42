"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function WebMesh({ className = "" }: { className?: string }) {
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg viewBox="0 0 400 400" className="h-full w-full opacity-40">
        <defs>
          <radialGradient id="webGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E23636" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E23636" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="180" fill="url(#webGlow)" />
        {[40, 80, 120, 160].map((r) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="#E23636"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1="200"
              y1="200"
              x2={200 + Math.cos(a) * 180}
              y2={200 + Math.sin(a) * 180}
              stroke="#E23636"
              strokeOpacity="0.16"
            />
          );
        })}
        {[
          [200, 80],
          [280, 160],
          [120, 210],
          [250, 260],
          [150, 120],
        ].map(([x, y], i) =>
          live ? (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill="#E23636"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35 }}
            />
          ) : (
            <circle key={i} cx={x} cy={y} r="3.5" fill="#E23636" opacity="0.6" />
          ),
        )}
      </svg>
    </div>
  );
}
