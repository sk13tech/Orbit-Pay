"use client";

import { useState } from "react";
import type { Bank } from "@/lib/banks";

const SIZES = {
  xs: { tile: "h-6 w-6 rounded-[7px] p-[3px]", text: "text-[8px]" },
  sm: { tile: "h-7 w-7 rounded-lg p-1", text: "text-[9px]" },
  md: { tile: "h-9 w-9 rounded-[10px] p-1", text: "text-[11px]" },
} as const;

/**
 * Real bank logo inside a white tile. If the asset is unavailable
 * (offline, missing file) it degrades to the old gradient + code tile.
 */
export function BankBadge({
  bank,
  size = "sm",
  className = "",
}: {
  bank: Bank;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const dims = SIZES[size];

  if (failed || !bank.logo) {
    return (
      <span
        title={bank.name}
        aria-label={bank.name}
        className={`grid shrink-0 place-items-center bg-gradient-to-br font-black leading-none tracking-tight text-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] ${dims.tile} ${dims.text} ${bank.gradient} ${className}`}
      >
        {bank.short}
      </span>
    );
  }

  return (
    <span
      title={bank.name}
      aria-label={bank.name}
      className={`grid shrink-0 place-items-center overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.07] ${dims.tile} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local static asset with fallback */}
      <img
        src={bank.logo}
        alt={bank.name}
        loading="lazy"
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
