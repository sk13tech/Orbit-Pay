"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, ChevronRight, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { formatINR } from "@/lib/format";
import { MasterCardLogo } from "@/lib/assets";
import { AnimatedMoney } from "./AnimatedMoney";
import { ChipSvg, ContactlessSvg } from "./EntryCard";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type Totals = {
  owedToMe: number;
  iOwe: number;
  owedToMeCount: number;
  iOweCount: number;
};

export type SummaryFilter = "all" | "owed_to_me" | "i_owe";

function SummaryCard({
  active,
  onClick,
  icon,
  accent,
  label,
  sub,
  amountPaise,
  delay,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  accent: string;
  label: string;
  sub: string;
  amountPaise: number;
  delay: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={`group rounded-[24px] bg-white p-5 text-left shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${
        active ? "ring-2 ring-[#0071e3]" : "ring-1 ring-black/[0.04]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${accent}`}
        >
          {icon}
        </span>
        <ChevronRight
          className={`h-4 w-4 transition-all ${
            active
              ? "rotate-90 text-[#0071e3]"
              : "text-[#c7c7cc] group-hover:text-[#86868b]"
          }`}
        />
      </div>
      <p className="mt-4 text-xs font-medium text-[#6e6e73]">{label}</p>
      <p className="mt-1 text-[clamp(1.15rem,2.6vw,1.55rem)] font-semibold tracking-tight text-[#1d1d1f]">
        <AnimatedMoney paise={amountPaise} />
      </p>
      <p className="mt-1 text-[11px] text-[#86868b]">{sub}</p>
    </motion.button>
  );
}

export function Overview({
  totals,
  filter,
  onFilterChange,
}: {
  totals: Totals;
  filter: SummaryFilter;
  onFilterChange: (next: SummaryFilter) => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <section className="mx-auto max-w-5xl px-6 pt-8 sm:pt-10">
      {/* Flippable credit card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto w-full max-w-2xl"
      >
        <div
          className="relative aspect-[8/5] w-full cursor-pointer [perspective:1200px]"
          onClick={() => setFlipped((v) => !v)}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="relative h-full w-full [transform-style:preserve-3d]"
          >
            {/* ── FRONT: Total Receiving ──────────────── */}
            <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#131316] via-[#26262d] to-[#3e3e47] text-white shadow-[0_30px_70px_-18px_rgba(0,0,0,0.55)] [backface-visibility:hidden]">
              <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-12 h-56 w-56 rounded-full bg-black/30 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />

              <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <ChipSvg />
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-4 w-4 text-white/40" />
                    <ContactlessSvg />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:text-[11px]">
                    Total receiving balance
                  </p>
                  <p className="mt-2 text-[clamp(2.1rem,7vw,3.6rem)] font-bold leading-none tracking-tight">
                    <AnimatedMoney paise={totals.owedToMe} />
                  </p>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <p className="text-[11px] text-white/60 sm:text-xs">
                    To pay back ·{" "}
                    <span className="tnum font-semibold text-white/90">
                      {formatINR(totals.iOwe)}
                    </span>
                  </p>
                  <MasterCardLogo className="h-10 w-[3.75rem] opacity-90" />
                </div>
              </div>
            </div>

            {/* ── BACK: Total Payable ─────────────────── */}
            <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1a0a0a] via-[#2d1418] to-[#3e2024] text-white shadow-[0_30px_70px_-18px_rgba(0,0,0,0.55)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#ff453a]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-12 h-56 w-56 rounded-full bg-black/30 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />

              <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <ChipSvg />
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-4 w-4 text-white/40" />
                    <ContactlessSvg />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ff6961]/80 sm:text-[11px]">
                    Total payable balance
                  </p>
                  <p className="mt-2 text-[clamp(2.1rem,7vw,3.6rem)] font-bold leading-none tracking-tight">
                    <AnimatedMoney paise={totals.iOwe} />
                  </p>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <p className="text-[11px] text-white/60 sm:text-xs">
                    To receive ·{" "}
                    <span className="tnum font-semibold text-white/90">
                      {formatINR(totals.owedToMe)}
                    </span>
                  </p>
                  <MasterCardLogo className="h-10 w-[3.75rem] opacity-90" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Flip hint */}
        <p className="mt-3 text-center text-[11px] text-[#aeaeb2]">
          Tap card to flip
        </p>
      </motion.div>

      {/* Two normal cards — receive & pay */}
      <div className="mx-auto mt-5 grid max-w-2xl grid-cols-2 gap-4">
        <SummaryCard
          active={filter === "owed_to_me"}
          onClick={() =>
            onFilterChange(filter === "owed_to_me" ? "all" : "owed_to_me")
          }
          icon={<ArrowDownLeft className="h-4.5 w-4.5 text-white" strokeWidth={2.4} />}
          accent="bg-[#30d158]"
          label="To receive"
          sub={`${totals.owedToMeCount} ${totals.owedToMeCount === 1 ? "person owes" : "people owe"} you`}
          amountPaise={totals.owedToMe}
          delay={0.12}
        />
        <SummaryCard
          active={filter === "i_owe"}
          onClick={() => onFilterChange(filter === "i_owe" ? "all" : "i_owe")}
          icon={<ArrowUpRight className="h-4.5 w-4.5 text-white" strokeWidth={2.4} />}
          accent="bg-[#ff453a]"
          label="To pay"
          sub={`you owe ${totals.iOweCount} ${totals.iOweCount === 1 ? "person" : "people"}`}
          amountPaise={totals.iOwe}
          delay={0.2}
        />
      </div>
    </section>
  );
}
