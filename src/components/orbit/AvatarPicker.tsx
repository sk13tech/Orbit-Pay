"use client";

import { MEMOJIS, memojiById } from "@/lib/assets";

/**
 * iOS-style Memoji face picker — exactly 6 faces in a horizontal row.
 * Works in both the light Add sheet and the dark Edit sheet.
 */
export function AvatarPicker({
  selected,
  onSelect,
  dark = false,
}: {
  selected: string;
  onSelect: (id: string) => void;
  dark?: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      {MEMOJIS.map((face) => {
        const chosen = selected === face.id;
        return (
          <button
            key={face.id}
            type="button"
            onClick={() => onSelect(face.id)}
            aria-label={face.label}
            className={`relative flex-1 rounded-2xl p-1 transition-all ${
              chosen
                ? dark
                  ? "bg-white/20 ring-2 ring-white/50 scale-105"
                  : "bg-[#e8e8ed] ring-2 ring-[#0071e3] scale-105"
                : dark
                  ? "hover:bg-white/10"
                  : "hover:bg-[#f5f5f7]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={face.src}
              alt={face.label}
              width={64}
              height={64}
              className="mx-auto aspect-square w-full rounded-xl object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Renders the selected Memoji face image — used in list rows, receipts, etc.
 * Falls back to an initial letter if the image fails.
 */
export function AvatarDisplay({
  avatar,
  name,
  className = "",
}: {
  avatar: string | null;
  name: string;
  className?: string;
}) {
  const face = memojiById(avatar);

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5f5f7] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={face.src}
        alt={name}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
