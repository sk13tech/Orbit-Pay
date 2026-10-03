"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  Landmark,
  Loader2,
  Search,
  X,
} from "lucide-react";
import type { EntryDirection } from "@/lib/format";
import { BANKS, bankById } from "@/lib/banks";
import { BankBadge } from "./BankBadge";
import { AvatarPicker } from "./AvatarPicker";

export type NewEntryPayload = {
  personName: string;
  amount: number;
  direction: EntryDirection;
  note: string | null;
  phone: string | null;
  upiId: string | null;
  bank: string | null;
  avatar: string | null;
  dueDate: string | null;
  colorVariant: string;
};

type AddSheetProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: NewEntryPayload) => Promise<void>;
};

const QUICK_AMOUNTS = [500, 1000, 5000];

export function AddSheet({ open, onClose, onCreate }: AddSheetProps) {
  const [direction, setDirection] = useState<EntryDirection>("owed_to_me");
  const [amount, setAmount] = useState("");
  const [personName, setPersonName] = useState("");
  const [phone, setPhone] = useState("");
  const [upiId, setUpiId] = useState("");
  const [avatar, setAvatar] = useState("face1");
  const [bank, setBank] = useState<string | null>(null);
  const [bankOpen, setBankOpen] = useState(false);
  const [bankQuery, setBankQuery] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const colorVariant = "midnight";
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Lock body scroll + Escape to close while the sheet is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, saving, onClose]);

  function reset() {
    setDirection("owed_to_me");
    setAmount("");
    setPersonName("");
    setPhone("");
    setUpiId("");
    setBank(null);
    setBankOpen(false);
    setBankQuery("");
    setNote("");
    setDueDate("");
    // colorVariant is fixed to "midnight"
    setError(null);
    setSaving(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;

    const name = personName.trim();
    const value = Number(amount);

    if (name.length < 2) {
      setError("Add the person's name — at least 2 characters.");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await onCreate({
        personName: name,
        amount: value,
        direction,
        note: note.trim() ? note.trim() : null,
        phone: phone.trim() ? phone.trim() : null,
        upiId: upiId.trim() ? upiId.trim() : null,
        bank,
        avatar,
        dueDate: dueDate || null,
        colorVariant,
      });
      reset();
      onClose();
    } catch {
      setError("Couldn't save the card. Please try again.");
      setSaving(false);
    }
  }

  const gave = direction === "owed_to_me";
  const selectedBank = bankById(bank);
  const bankNeedle = bankQuery.trim().toLowerCase();
  const filteredBanks = bankNeedle
    ? BANKS.filter(
        (item) =>
          item.name.toLowerCase().includes(bankNeedle) ||
          item.short.toLowerCase().includes(bankNeedle),
      )
    : BANKS;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => !saving && onClose()}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="New card"
            initial={{ opacity: 0, y: 64, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 48, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="relative max-h-[92vh] w-full max-w-[540px] overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:rounded-[28px] sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">New card</h2>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full bg-[#f5f5f7] text-[#6e6e73] transition-colors hover:bg-[#e8e8ed]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Direction */}
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                  What happened?
                </p>
                <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#f5f5f7] p-1">
                  <button
                    type="button"
                    onClick={() => setDirection("owed_to_me")}
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                      gave
                        ? "bg-white text-[#248a3d] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                        : "text-[#6e6e73]"
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                    I gave money
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("i_owe")}
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                      !gave
                        ? "bg-white text-[#d70015] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                        : "text-[#6e6e73]"
                    }`}
                  >
                    <ArrowDownLeft className="h-4 w-4" strokeWidth={2.5} />
                    I took money
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                  Amount
                </p>
                <div className="flex items-center gap-3 rounded-2xl bg-[#f5f5f7] px-5 py-4">
                  <span className="text-2xl font-semibold text-[#86868b]">₹</span>
                  <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    inputMode="decimal"
                    placeholder="0"
                    aria-label="Amount in rupees"
                    className="tnum w-full bg-transparent text-3xl font-semibold tracking-tight text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  {QUICK_AMOUNTS.map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => setAmount(String(quick))}
                      className="tnum rounded-full bg-[#f5f5f7] px-3.5 py-1.5 text-xs font-medium text-[#6e6e73] transition-colors hover:bg-[#e8e8ed] hover:text-[#1d1d1f]"
                    >
                      ₹{quick.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Person */}
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                  {gave ? "To whom? (receiver)" : "From whom?"}
                </p>
                <input
                  value={personName}
                  onChange={(event) => setPersonName(event.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  maxLength={80}
                  aria-label="Person name"
                  className="w-full rounded-2xl bg-[#f5f5f7] px-5 py-3.5 text-[15px] text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
                />
              </div>

              {/* Phone + UPI */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                    Phone <span className="font-normal">(optional)</span>
                  </p>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    maxLength={20}
                    aria-label="Phone number"
                    className="tnum w-full rounded-2xl bg-[#f5f5f7] px-5 py-3.5 text-[15px] text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
                  />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                    UPI ID <span className="font-normal">(optional)</span>
                  </p>
                  <input
                    value={upiId}
                    onChange={(event) => setUpiId(event.target.value)}
                    placeholder="name@okhdfc"
                    maxLength={60}
                    aria-label="UPI ID"
                    className="w-full rounded-2xl bg-[#f5f5f7] px-5 py-3.5 text-[15px] text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
                  />
                </div>
              </div>

              {/* Bank */}
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                  Bank <span className="font-normal">(optional)</span>
                </p>

                <button
                  type="button"
                  onClick={() => setBankOpen((value) => !value)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-[#f5f5f7] px-4 py-3 text-left transition-colors hover:bg-[#ececf0]"
                >
                  {selectedBank ? (
                    <BankBadge bank={selectedBank} size="md" />
                  ) : (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#e1e1e6] text-[#86868b]">
                      <Landmark className="h-4.5 w-4.5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium text-[#1d1d1f]">
                      {selectedBank ? selectedBank.name : "Select a bank"}
                    </span>
                    <span className="block text-[11px] text-[#86868b]">
                      {selectedBank
                        ? "Tap to change"
                        : `${BANKS.length} banks available`}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#86868b] transition-transform duration-300 ${bankOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {bankOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 rounded-2xl bg-[#f5f5f7] p-2">
                        <label className="mb-1 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[13px] text-[#86868b]">
                          <Search className="h-3.5 w-3.5 shrink-0" />
                          <input
                            value={bankQuery}
                            onChange={(event) =>
                              setBankQuery(event.target.value)
                            }
                            placeholder="Search bank…"
                            className="w-full bg-transparent text-[#1d1d1f] placeholder:text-[#c7c7cc]"
                          />
                        </label>

                        <div className="max-h-56 overflow-y-auto">
                          {filteredBanks.length === 0 ? (
                            <p className="px-3 py-6 text-center text-[13px] text-[#86868b]">
                              No bank matches “{bankQuery}”.
                            </p>
                          ) : (
                            filteredBanks.map((item) => {
                              const chosen = bank === item.id;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    setBank(chosen ? null : item.id);
                                    setBankOpen(false);
                                    setBankQuery("");
                                  }}
                                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                                    chosen ? "bg-white" : "hover:bg-white/70"
                                  }`}
                                >
                                  <BankBadge bank={item} size="sm" />
                                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#1d1d1f]">
                                    {item.name}
                                  </span>
                                  {chosen && (
                                    <Check
                                      className="h-4 w-4 shrink-0 text-[#0071e3]"
                                      strokeWidth={2.6}
                                    />
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Note + due */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                    Note <span className="font-normal">(optional)</span>
                  </p>
                  <input
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Goa trip, rent split…"
                    maxLength={140}
                    aria-label="Note"
                    className="w-full rounded-2xl bg-[#f5f5f7] px-5 py-3.5 text-[15px] text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc]"
                  />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                    Due date <span className="font-normal">(optional)</span>
                  </p>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    aria-label="Due date"
                    className="w-full rounded-2xl bg-[#f5f5f7] px-5 py-3 text-[15px] text-[#1d1d1f] outline-none"
                  />
                </div>
              </div>

              {/* Avatar */}
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                  Person Avatar
                </p>
                <AvatarPicker selected={avatar} onSelect={setAvatar} />
              </div>



              {error && (
                <p className="rounded-xl bg-[#d70015]/10 px-4 py-2.5 text-[13px] font-medium text-[#d70015]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] text-[15px] font-semibold text-white transition-all hover:bg-[#0077ed] active:scale-[0.99] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding…
                  </>
                ) : gave ? (
                  "Add to wallet — you gave"
                ) : (
                  "Add to wallet — you took"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
