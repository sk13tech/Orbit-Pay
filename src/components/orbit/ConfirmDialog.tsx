"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import type { Entry } from "@/lib/format";
import { formatINR, initials, remainingPaise } from "@/lib/format";
import { variantById } from "./EntryCard";

type ConfirmDialogProps = {
  entry: Entry | null;
  onCancel: () => void;
  onConfirm: (entry: Entry) => Promise<void> | void;
};

/** Dynamic delete confirmation — shows exactly which card is going away. */
export function ConfirmDialog({
  entry,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const [working, setWorking] = useState(false);

  useEffect(() => {
    setWorking(false);
  }, [entry?.id]);

  useEffect(() => {
    if (!entry) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !working) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry, working, onCancel]);

  async function handleConfirm() {
    if (!entry || working) return;
    setWorking(true);
    await onConfirm(entry);
  }

  const outstanding = entry ? remainingPaise(entry) : 0;

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
            role="alertdialog"
            aria-modal="true"
            aria-label={`Delete card for ${entry.personName}`}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="relative w-full max-w-[380px] overflow-hidden rounded-[26px] bg-white p-6 text-center shadow-2xl"
          >
            <motion.span
              initial={{ scale: 0.5, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 16, delay: 0.05 }}
              className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#ff453a]/10"
            >
              <TriangleAlert className="h-7 w-7 text-[#d70015]" />
            </motion.span>

            <h2 className="mt-4 text-lg font-semibold tracking-tight">
              Delete this card?
            </h2>

            {/* The actual card being removed */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f5f5f7] p-3 text-left">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[13px] font-bold text-white ${variantById(entry.colorVariant).gradient}`}
              >
                {initials(entry.personName)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[#1d1d1f]">
                  {entry.personName}
                </span>
                <span className="block truncate text-xs text-[#86868b]">
                  {entry.status === "settled"
                    ? `Settled · ${formatINR(entry.amountPaise)}`
                    : entry.direction === "owed_to_me"
                      ? `Owes you ${formatINR(outstanding)}`
                      : `You owe ${formatINR(outstanding)}`}
                </span>
              </span>
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-[#6e6e73]">
              {entry.status === "settled"
                ? "This settled record will be removed from your history permanently."
                : outstanding > 0
                  ? `${formatINR(outstanding)} is still outstanding. Deleting removes this card for good — this can’t be undone.`
                  : "This can’t be undone."}
            </p>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                disabled={working}
                className="h-11 flex-1 rounded-full bg-[#f5f5f7] text-sm font-semibold text-[#1d1d1f] transition-colors hover:bg-[#e8e8ed] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={working}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#d70015] text-sm font-semibold text-white transition-colors hover:bg-[#b3000f] disabled:opacity-60"
              >
                {working ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
