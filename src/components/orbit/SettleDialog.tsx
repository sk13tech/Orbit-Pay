"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Loader2, X } from "lucide-react";
import type { Entry } from "@/lib/format";
import { formatINR, remainingPaise } from "@/lib/format";

type SettleDialogProps = {
  entry: Entry | null;
  onCancel: () => void;
  onSubmit: (entry: Entry, amountRupees: number) => Promise<void>;
};

/**
 * Asks how much was actually received/paid. Full amount settles the card,
 * anything less keeps it active with the remaining balance.
 */
export function SettleDialog({ entry, onCancel, onSubmit }: SettleDialogProps) {
  const outstanding = entry ? remainingPaise(entry) : 0;
  const outstandingRupees = outstanding / 100;

  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!entry) return;
    setValue(String(Number((remainingPaise(entry) / 100).toFixed(2))));
    setError(null);
    setWorking(false);
  }, [entry]);

  useEffect(() => {
    if (!entry) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !working) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry, working, onCancel]);

  const parsed = Number(value);
  const valid = Number.isFinite(parsed) && parsed > 0;
  const capped = valid ? Math.min(parsed, outstandingRupees) : 0;
  const leftover = Math.max(outstandingRupees - capped, 0);
  const settlesFully = valid && leftover <= 0;
  const percent = useMemo(
    () =>
      outstandingRupees > 0
        ? Math.min(Math.round((capped / outstandingRupees) * 100), 100)
        : 0,
    [capped, outstandingRupees],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!entry || working) return;
    if (!valid) {
      setError("Enter an amount greater than zero.");
      return;
    }
    setError(null);
    setWorking(true);
    try {
      await onSubmit(entry, capped);
    } catch {
      setError("Couldn't record that payment. Please try again.");
      setWorking(false);
    }
  }

  const receiving = entry?.direction === "owed_to_me";

  return (
    <AnimatePresence>
      {entry && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !working && onCancel()}
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Record payment"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-[400px] overflow-hidden rounded-[26px] bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={working}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-[#f5f5f7] text-[#6e6e73] transition-colors hover:bg-[#e8e8ed]"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-semibold tracking-tight">
              {receiving ? "Amount received" : "Amount paid"}
            </h2>
            <p className="mt-1 text-[13px] text-[#6e6e73]">
              {receiving
                ? `How much did ${entry.personName} give back?`
                : `How much did you pay ${entry.personName}?`}
            </p>

            <form onSubmit={handleSubmit} className="mt-5">
              <div className="flex items-center gap-3 rounded-2xl bg-[#f5f5f7] px-5 py-4">
                <span className="text-2xl font-semibold text-[#86868b]">₹</span>
                <input
                  autoFocus
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                  aria-label="Amount"
                  className="tnum w-full bg-transparent text-3xl font-semibold tracking-tight text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
                />
              </div>

              {/* Quick splits */}
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[
                  { label: "Full", factor: 1 },
                  { label: "Half", factor: 0.5 },
                  { label: "25%", factor: 0.25 },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() =>
                      setValue(
                        String(
                          Number((outstandingRupees * chip.factor).toFixed(2)),
                        ),
                      )
                    }
                    className="tnum rounded-full bg-[#f5f5f7] px-3.5 py-1.5 text-xs font-medium text-[#6e6e73] transition-colors hover:bg-[#e8e8ed] hover:text-[#1d1d1f]"
                  >
                    {chip.label} · ₹
                    {Number(
                      (outstandingRupees * chip.factor).toFixed(2),
                    ).toLocaleString("en-IN")}
                  </button>
                ))}
              </div>

              {/* Live progress */}
              <div className="mt-5 rounded-2xl bg-[#f5f5f7] p-4">
                <div className="flex items-center justify-between text-xs font-medium text-[#6e6e73]">
                  <span>Outstanding</span>
                  <span className="tnum">{formatINR(outstanding)}</span>
                </div>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-black/[0.08]">
                  <motion.div
                    animate={{ width: `${percent}%` }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    className={`h-full rounded-full ${
                      settlesFully ? "bg-[#30d158]" : "bg-[#0071e3]"
                    }`}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1d1d1f]">
                    {percent}% covered
                  </span>
                  <span
                    className={`tnum font-semibold ${
                      settlesFully ? "text-[#248a3d]" : "text-[#1d1d1f]"
                    }`}
                  >
                    {settlesFully
                      ? "Settles this card"
                      : `${formatINR(Math.round(leftover * 100))} will remain`}
                  </span>
                </div>
              </div>

              {error && (
                <p className="mt-3 rounded-xl bg-[#d70015]/10 px-4 py-2.5 text-[13px] font-medium text-[#d70015]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={working || !valid}
                className={`mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-all active:scale-[0.99] disabled:opacity-50 ${
                  settlesFully
                    ? "bg-[#30d158] hover:bg-[#28bb4e]"
                    : "bg-[#0071e3] hover:bg-[#0077ed]"
                }`}
              >
                {working ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <BadgeCheck className="h-4.5 w-4.5" />
                    {settlesFully
                      ? "Mark fully settled"
                      : `Record ${formatINR(Math.round(capped * 100))}`}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
