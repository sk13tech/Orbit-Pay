"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";
import type { Entry } from "@/lib/format";
import {
  dueInfo,
  formatDate,
  formatINR,
  formatSignedINR,
  initials,
  remainingPaise,
} from "@/lib/format";
import { bankById } from "@/lib/banks";
import { BankBadge } from "./BankBadge";
import { AvatarDisplay } from "./AvatarPicker";
import { variantById } from "./EntryCard";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type Filter = "all" | "owed_to_me" | "i_owe";
export type SortKey =
  | "date_new_to_old"
  | "date_old_to_new"
  | "amount_high_to_low"
  | "amount_low_to_high";

const FILTERS: { id: Filter; label: string; dot: string | null }[] = [
  { id: "all", label: "All", dot: null },
  { id: "owed_to_me", label: "To receive", dot: "bg-[#30d158]" },
  { id: "i_owe", label: "To pay", dot: "bg-[#ff453a]" },
];

const FILTER_LABEL: Record<Filter, string> = {
  all: "All",
  owed_to_me: "To receive",
  i_owe: "To pay",
};

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "date_new_to_old", label: "Date · New to old" },
  { id: "date_old_to_new", label: "Date · Old to new" },
  { id: "amount_high_to_low", label: "Amount · High to low" },
  { id: "amount_low_to_high", label: "Amount · Low to high" },
];

const SORT_LABEL: Record<SortKey, string> = {
  date_new_to_old: "New to old",
  date_old_to_new: "Old to new",
  amount_high_to_low: "High to low",
  amount_low_to_high: "Low to high",
};

type UserCardsProps = {
  entries: Entry[];
  activeTotal: number;
  activeCount: number;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  query: string;
  onQueryChange: (q: string) => void;
  settled: Entry[];
  onView: (entry: Entry) => void;
};

function Avatar({ entry, size = "md" }: { entry: Entry; size?: "md" | "sm" }) {
  const dims = size === "md" ? "h-10 w-10" : "h-9 w-9";
  return (
    <AvatarDisplay
      avatar={entry.avatar}
      name={entry.personName}
      className={`${dims} transition-transform duration-300 group-hover:scale-105`}
    />
  );
}

export function UserCards({
  entries,
  activeTotal,
  activeCount,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  settled,
  onView,
  query,
  onQueryChange,
}: UserCardsProps) {
  const [showSettled, setShowSettled] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  // `entries` is already filtered+sorted+searched by OrbitApp — render directly
  const visible = entries;

  return (
    <section className="mx-auto max-w-2xl px-6 pb-24 pt-12 sm:pt-14">
      {/* Non-sticky header title */}
      <div className="mb-5">
        <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-0.02em]">
          Your cards
        </h2>
      </div>

      {/* ── STICKY BAR: tabs + search + sort ──────────────────────── */}
      <div className="sticky top-12 z-40 -mx-6 flex flex-col gap-3 bg-[#f5f5f7]/90 px-6 pb-4 pt-3 backdrop-blur-xl">
        {/* Tabs — centered */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-black/[0.06] p-1 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onFilterChange(item.id)}
                className={`relative rounded-full px-5 py-1.5 text-[13px] font-medium transition-colors ${
                  filter === item.id
                    ? "text-[#1d1d1f]"
                    : "text-[#6e6e73] hover:text-[#1d1d1f]"
                }`}
              >
                {filter === item.id && (
                  <motion.span
                    layoutId="user-filter-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-1.5">
                  {item.dot && filter === item.id && (
                    <span className={`h-[6px] w-[6px] rounded-full ${item.dot}`} />
                  )}
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search + sort — row */}
        <div className="flex w-full gap-3">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] text-[#86868b] shadow-[0_1px_6px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04] sm:w-auto sm:min-w-[190px]">
                <Search className="h-3.5 w-3.5 shrink-0" />
                <input
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="Search name or phone…"
                  className="w-full bg-transparent text-[#1d1d1f] placeholder:text-[#aeaeb2]"
                />
              </label>

              <div
                className="relative z-30 shrink-0"
                onMouseEnter={() => setSortOpen(true)}
                onMouseLeave={() => setSortOpen(false)}
              >
                {/* The Sort Button */}
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex h-[36px] min-w-[90px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05] transition-colors hover:bg-black/[0.02] sm:min-w-[110px]"
                >
                  <ArrowUpDown className="h-3.5 w-3.5 text-[#6e6e73]" />
                  <span>Sort</span>
                  <span className="hidden text-[#86868b] sm:inline">
                    {SORT_LABEL[sort]}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[#86868b] transition-transform duration-200 ${
                      sortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Instant Popup Options (No animations) */}
                {sortOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[240px] overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.3),0_15px_30px_-10px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.05] sm:w-[280px]">
                    <div className="space-y-0.5">
                      {SORT_OPTIONS.map((option) => {
                        const active = sort === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              onSortChange(option.id);
                              setSortOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[14px] transition-colors ${
                              active
                                ? "bg-[#f5f5f7] text-[#1d1d1f]"
                                : "text-[#424245] hover:bg-[#f5f5f7]"
                            }`}
                          >
                            <span className="font-medium">{option.label}</span>
                            {active && (
                              <Check
                                className="h-4 w-4 text-[#0071e3]"
                                strokeWidth={2.8}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-7 overflow-hidden rounded-[24px] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        {visible.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-[#86868b]">
            Nothing here — add a card or change the filter to get started.
          </p>
        ) : (
          <ul className="divide-y divide-black/[0.05]">
            <AnimatePresence initial={true} mode="popLayout">
              {visible.map((entry, index) => {
                const positive = entry.direction === "owed_to_me";
                const due = dueInfo(entry.dueDate);
                const DirectionIcon = positive ? ArrowDownLeft : ArrowUpRight;
                const bank = bankById(entry.bank);
                return (
                  <motion.li
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, height: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: EASE,
                      delay: Math.min(index * 0.05, 0.35),
                      layout: { type: "spring", stiffness: 340, damping: 30 },
                    }}
                    className="overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => onView(entry)}
                      className="group flex w-full items-center gap-3 px-4 py-4 text-left transition-all duration-300 hover:bg-black/[0.02] sm:gap-4 sm:px-6"
                    >
                      <Avatar entry={entry} />

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-[#1d1d1f]">
                          {entry.personName}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-xs text-[#86868b]">
                          {due && (
                            <span
                              className={`shrink-0 rounded-full px-1.5 py-px text-[10px] font-semibold ${
                                due.tone === "danger"
                                  ? "bg-[#ff453a]/15 text-[#d70015]"
                                  : due.tone === "warn"
                                    ? "bg-[#ffd60a]/40 text-[#8a6d00]"
                                    : "bg-black/[0.05] text-[#6e6e73]"
                              }`}
                            >
                              {due.label}
                            </span>
                          )}
                          <span className="truncate">
                            {entry.paidPaise > 0
                              ? `${formatINR(entry.paidPaise)} of ${formatINR(entry.amountPaise)} paid`
                              : `${positive ? "Owes you" : "You owe"} · ${
                                  entry.note?.trim() ||
                                  `${positive ? "Given" : "Received"} ${formatDate(entry.createdAt)}`
                                }`}
                          </span>
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-2.5">
                        <span className="text-right">
                          <span
                            className={`tnum flex items-center justify-end gap-1 text-[15px] font-semibold transition-transform duration-300 group-hover:scale-105 ${
                              positive ? "text-[#248a3d]" : "text-[#d70015]"
                            }`}
                          >
                            <DirectionIcon className="h-3.5 w-3.5" strokeWidth={2.6} />
                            {formatINR(remainingPaise(entry))}
                          </span>
                          <span className="block text-[10px] font-medium text-[#aeaeb2]">
                            {positive ? "to receive" : "to pay"}
                          </span>
                        </span>

                        <span className="grid h-8 w-8 place-items-center rounded-full transition-all duration-300 group-hover:bg-black/[0.05]">
                          <ChevronRight className="h-4 w-4 text-[#c7c7cc] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#1d1d1f]" />
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Settled cards — quiet expandable */}
      {settled.length > 0 && (
        <div className="mt-14">
          <button
            type="button"
            onClick={() => setShowSettled((value) => !value)}
            className="mx-auto flex items-center gap-1.5 text-[13px] font-medium text-[#6e6e73] transition-colors hover:text-black"
          >
            Settled cards ({settled.length})
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${showSettled ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence initial={false}>
            {showSettled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="mt-5 divide-y divide-black/[0.06] overflow-hidden rounded-[20px] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                  {settled.map((entry) => {
                    const positive = entry.direction === "owed_to_me";
                    const bank = bankById(entry.bank);
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => onView(entry)}
                        className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-black/[0.02] sm:gap-4 sm:px-6"
                      >
                        <Avatar entry={entry} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-[#1d1d1f]">
                            {entry.personName}
                          </span>
                          <span className="block truncate text-[11px] text-[#86868b]">
                            {entry.settledAt
                              ? `Settled ${formatDate(entry.settledAt)}`
                              : "Settled"}
                            {entry.note ? ` · ${entry.note}` : ""}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2.5">
                          <span className="text-right">
                            <span
                              className={`tnum block text-sm font-semibold ${
                                positive ? "text-[#248a3d]" : "text-[#d70015]"
                              }`}
                            >
                              {formatSignedINR(
                                positive ? entry.amountPaise : -entry.amountPaise,
                              )}
                            </span>
                            <span className="block text-[10px] font-medium text-[#aeaeb2]">
                              view receipt
                            </span>
                          </span>
                          <span className="grid h-8 w-8 place-items-center rounded-full transition-all duration-300 group-hover:bg-black/[0.05]">
                            <ChevronRight className="h-4 w-4 text-[#c7c7cc] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#1d1d1f]" />
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
