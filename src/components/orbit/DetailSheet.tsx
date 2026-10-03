"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import {
  Check,
  ChevronLeft,
  Copy,
  Download,
  Loader2,
  Pencil,
  RotateCcw,
  Trash2,
  Wallet,
} from "lucide-react";
import type { Entry } from "@/lib/format";
import {
  dueInfo,
  formatDate,
  formatDDMMYYYY,
  formatINR,
  remainingPaise,
  telHref,
  upiHref,
} from "@/lib/format";
import { bankById } from "@/lib/banks";
import { BankBadge } from "./BankBadge";
import { AvatarDisplay } from "./AvatarPicker";

function zigZagClipPath(teeth = 32, depth = 9): string {
  const points: string[] = ["0% 0px"];
  const step = 100 / teeth;
  for (let i = 0; i < teeth; i++) {
    points.push(
      `${((i + 0.5) * step).toFixed(3)}% ${depth}px`,
      `${((i + 1) * step).toFixed(3)}% 0px`,
    );
  }
  points.push("100% 100%");
  for (let i = teeth - 1; i >= 0; i--) {
    points.push(
      `${((i + 0.5) * step).toFixed(3)}% calc(100% - ${depth}px)`,
      `${(i * step).toFixed(3)}% 100%`,
    );
  }
  return `polygon(${points.join(", ")})`;
}

function Barcode({ seed }: { seed: string }) {
  const bars = useMemo(() => {
    let hash = 0;
    for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    const widths: number[] = [];
    let state = hash || 7;
    for (let i = 0; i < 36; i++) {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      widths.push((state % 4) + 1);
    }
    return widths;
  }, [seed]);

  return (
    <div className="flex h-10 items-stretch justify-center gap-[2px]" aria-hidden="true">
      {bars.map((w, i) => (
        <span key={i} style={{ width: w }} className="rounded-[0.5px] bg-[#1d1d1f]" />
      ))}
    </div>
  );
}

function BillRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-[#8e8e93]">
        {label}
      </span>
      <span className="min-w-0 truncate text-right text-[13px] font-semibold uppercase tracking-[0.04em] text-[#1d1d1f]">
        {children}
      </span>
    </div>
  );
}

type DetailSheetProps = {
  entry: Entry | null;
  onClose: () => void;
  onSettle: (entry: Entry) => void;
  onReopen: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
  onEdit: (entry: Entry) => void;
};

export function DetailSheet({ entry, onClose, onSettle, onReopen, onDelete, onEdit }: DetailSheetProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const clipPath = useMemo(() => zigZagClipPath(), []);

  useEffect(() => {
    if (!entry) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [entry, onClose]);

  useEffect(() => { setCopied(false); setDownloading(false); }, [entry?.id]);

  const payLink = entry
    ? upiHref({ upiId: entry.upiId, phone: entry.phone, name: entry.personName, amountPaise: remainingPaise(entry) })
    : null;
  const callLink = entry ? telHref(entry.phone) : null;
  const due = entry ? dueInfo(entry.dueDate) : null;
  const outstanding = entry ? remainingPaise(entry) : 0;
  const bank = bankById(entry?.bank);
  const partlyPaid = !!entry && entry.paidPaise > 0 && entry.status === "active";

  function copyUpi() {
    if (!entry?.upiId) return;
    void navigator.clipboard?.writeText(entry.upiId).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  }

  async function downloadReceipt() {
    const node = receiptRef.current;
    if (!node || !entry || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `orbit-receipt-${entry.personName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${entry.id.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
    } catch { /* silent */ } finally {
      setDownloading(false);
    }
  }

  return (
    <AnimatePresence>
      {entry && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0b0b0e]/75 backdrop-blur-md"
          />

          {/* iOS top bar */}
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-0 z-20 flex items-center justify-between px-3 py-3 sm:px-5 sm:py-4"
          >
            <button type="button" onClick={onClose}
              className="flex items-center gap-0.5 rounded-full bg-white/10 py-2 pl-2 pr-4 text-[15px] font-medium text-white backdrop-blur-xl hover:bg-white/20 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
              Back
            </button>
            <button type="button" onClick={downloadReceipt} disabled={downloading}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[14px] font-medium text-white backdrop-blur-xl hover:bg-white/20 active:scale-95 disabled:opacity-60"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" strokeWidth={2.2} />}
              <span className="hidden sm:inline">Download Receipt</span>
              <span className="sm:hidden">Save</span>
            </button>
          </motion.div>

          {/* Receipt */}
          <div className="relative flex min-h-[calc(100vh-72px)] items-start justify-center px-4 pb-10">
            <motion.div
              role="dialog" aria-modal="true"
              initial={{ opacity: 0, y: 80, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: 60, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="w-full max-w-[400px]"
            >
              <div style={{ filter: "drop-shadow(0 34px 60px rgba(0,0,0,0.55))" }}>
                <div ref={receiptRef} style={{ clipPath }} className="overflow-hidden bg-white">
                  <div className="relative px-6 pb-8 pt-7 font-mono">

                    {/* Stamp */}
                    <div className={`pointer-events-none absolute right-5 top-24 rotate-[-12deg] rounded-md border-[3px] px-2.5 py-1 text-sm font-black tracking-[0.3em] ${
                      entry.status === "settled"
                        ? "border-[#248a3d]/80 bg-[#248a3d]/[0.05] text-[#248a3d]"
                        : partlyPaid
                          ? "border-[#b25000]/70 bg-[#ff9f0a]/[0.08] text-[#b25000]"
                          : "border-[#d70015]/70 bg-[#d70015]/[0.04] text-[#d70015]"
                    }`}>
                      {entry.status === "settled" ? "PAID" : partlyPaid ? "PART" : "DUE"}
                    </div>

                    {/* Letterhead */}
                    <div className="flex flex-col items-center text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/orbit-logo.png" alt="Orbit Pay" width={36} height={36} className="rounded-lg object-contain" />
                      <p className="mt-2 text-xs font-black tracking-[0.35em] text-[#1d1d1f]">ORBIT PAY</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#8e8e93]">
                        {entry.status === "settled" ? "Payment receipt" : entry.direction === "i_owe" ? "Payment due slip" : "Receivable slip"}
                        {" · No. "}{entry.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-[#8e8e93]">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>

                    <div className="my-4 border-t border-dashed border-[#c7c7cc]" />

                    {/* Billed party */}
                    <div className="flex items-center gap-3">
                      <AvatarDisplay avatar={entry.avatar} name={entry.personName} className="h-12 w-12 shrink-0 text-2xl" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#8e8e93]">
                          {entry.direction === "i_owe" ? "Payable to" : "Receivable from"}
                        </p>
                        <p className="mt-0.5 truncate text-lg font-black uppercase tracking-[0.03em] text-[#1d1d1f]">
                          {entry.personName}
                        </p>
                      </div>
                    </div>
                    {entry.phone ? (
                      <a href={callLink ?? "#"} className="tnum mt-1 inline-block text-xs font-semibold text-[#0071e3] underline decoration-dotted underline-offset-2">
                        {entry.phone}
                      </a>
                    ) : (
                      <p className="mt-1 text-xs text-[#aeaeb2]">No phone added</p>
                    )}

                    <div className="my-4 border-t border-dashed border-[#c7c7cc]" />

                    {/* Bill rows — due date shown only once, only if present */}
                    <BillRow label={entry.direction === "i_owe" ? "Received on" : "Given on"}>
                      {formatDate(entry.createdAt)}
                    </BillRow>

                    {entry.dueDate && (
                      <BillRow label="Due date">
                        <span className={due?.tone === "danger" && entry.status === "active" ? "text-[#d70015]" : ""}>
                          {formatDDMMYYYY(entry.dueDate)}
                        </span>
                      </BillRow>
                    )}

                    {bank && (
                      <div className="flex items-center justify-between gap-4 py-1">
                        <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-[#8e8e93]">Bank</span>
                        <span className="flex min-w-0 items-center gap-2">
                          <BankBadge bank={bank} size="xs" />
                          <span className="truncate text-[13px] font-semibold uppercase tracking-[0.04em] text-[#1d1d1f]">{bank.name}</span>
                        </span>
                      </div>
                    )}

                    <BillRow label="Status">
                      {entry.status === "settled" ? "Paid in full" : partlyPaid ? "Partly paid" : "Pending"}
                    </BillRow>

                    {entry.settledAt && entry.status === "settled" && (
                      <BillRow label="Closed on">{formatDate(entry.settledAt)}</BillRow>
                    )}

                    {entry.upiId && (
                      <BillRow label="UPI ID">
                        <button type="button" onClick={copyUpi}
                          className="inline-flex items-center gap-1.5 text-[#0071e3] underline decoration-dotted underline-offset-2"
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {entry.upiId}
                        </button>
                      </BillRow>
                    )}

                    {entry.note?.trim() && (
                      <BillRow label="Note">
                        <span className="normal-case">{entry.note}</span>
                      </BillRow>
                    )}

                    <div className="my-4 border-t border-dashed border-[#c7c7cc]" />

                    {/* Money breakdown */}
                    <BillRow label="Card amount">{formatINR(entry.amountPaise)}</BillRow>
                    {(partlyPaid || entry.status === "settled") && (
                      <BillRow label="Paid so far">− {formatINR(entry.paidPaise)}</BillRow>
                    )}

                    <div className="my-3 border-t border-[#1d1d1f]" />

                    {/* Total */}
                    <div className="flex items-end justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1d1d1f]">
                        {entry.status === "settled" ? "Total paid" : entry.direction === "i_owe" ? "Balance payable" : "Balance receivable"}
                      </span>
                      <span className={`tnum text-[clamp(1.2rem,5vw,1.625rem)] font-black leading-none tracking-tight ${
                        entry.status === "settled" ? "text-[#248a3d]" : entry.direction === "i_owe" ? "text-[#1d1d1f]" : "text-[#248a3d]"
                      }`}>
                        {formatINR(entry.status === "settled" ? entry.amountPaise : outstanding)}
                      </span>
                    </div>

                    <div className="my-4 border-t border-dashed border-[#c7c7cc]" />

                    <Barcode seed={entry.id} />
                    <p className="mt-2 text-center text-[9px] uppercase tracking-[0.24em] text-[#aeaeb2]">
                      orbit pay · friendly ledger slip
                    </p>
                    <p className="mt-0.5 text-center text-[9px] uppercase tracking-[0.24em] text-[#aeaeb2]">
                      not a bank statement
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                {entry.direction === "i_owe" && entry.status === "active" && (
                  <div>
                    {payLink ? (
                      <>
                        <a href={payLink} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-black shadow-[0_14px_30px_rgba(0,0,0,0.35)] hover:scale-[1.01] active:scale-[0.99]">
                          <Wallet className="h-4.5 w-4.5" />
                          Pay {formatINR(outstanding)}
                        </a>
                        <p className="mt-2 text-center text-[11px] text-white/50">Opens your payment app · GPay, PhonePe, Paytm</p>
                      </>
                    ) : (
                      <p className="rounded-2xl bg-white/10 px-4 py-3 text-center text-[13px] text-white/60 backdrop-blur">
                        Add this person's phone or UPI ID to enable one-tap pay.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2.5">
                  {entry.status === "active" ? (
                    <button type="button" onClick={() => onSettle(entry)}
                      className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0071e3] text-sm font-semibold text-white hover:bg-[#0077ed]"
                    >
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                      {entry.direction === "i_owe" ? "Mark paid" : "Mark received"}
                    </button>
                  ) : (
                    <button type="button" onClick={() => onReopen(entry)}
                      className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0071e3] text-sm font-semibold text-white hover:bg-[#0077ed]"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reopen card
                    </button>
                  )}
                  <button type="button" onClick={() => onEdit(entry)}
                    className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(entry)}
                    className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur hover:bg-[#d70015]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
