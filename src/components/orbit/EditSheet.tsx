"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  Landmark,
  Loader2,
  Search,
} from "lucide-react";
import type { Entry, EntryDirection } from "@/lib/format";
import { BANKS, bankById } from "@/lib/banks";
import { BankBadge } from "./BankBadge";
import { AvatarPicker } from "./AvatarPicker";

export type EditPayload = {
  edit: true;
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

type EditSheetProps = {
  entry: Entry | null;
  onClose: () => void;
  onSave: (entryId: string, payload: EditPayload) => Promise<void>;
};

export function EditSheet({ entry, onClose, onSave }: EditSheetProps) {
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
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form when entry changes
  useEffect(() => {
    if (!entry) return;
    setDirection(entry.direction);
    setAmount(String(entry.amountPaise / 100));
    setPersonName(entry.personName);
    setPhone(entry.phone ?? "");
    setUpiId(entry.upiId ?? "");
    setAvatar(entry.avatar ?? "👤");
    setBank(entry.bank);
    setBankOpen(false);
    setBankQuery("");
    setNote(entry.note ?? "");
    setDueDate(entry.dueDate ?? "");
    // colorVariant is fixed
    setError(null);
    setSaving(false);
  }, [entry]);

  useEffect(() => {
    if (!entry) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [entry, saving, onClose]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (saving || !entry) return;

    const name = personName.trim();
    const value = Number(amount);

    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await onSave(entry.id, {
        edit: true,
        personName: name,
        amount: value,
        direction,
        note: note.trim() || null,
        phone: phone.trim() || null,
        upiId: upiId.trim() || null,
        bank,
        avatar,
        dueDate: dueDate || null,
        colorVariant,
      });
      onClose();
    } catch {
      setError("Couldn't save changes. Please try again.");
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
      {entry && (
        <div className="fixed inset-0 z-[65] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => !saving && onClose()}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm"
          />

          {/* iOS nav bar */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-0 z-20 flex items-center justify-between px-3 py-3 sm:px-5 sm:py-4"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex items-center gap-0.5 rounded-full bg-white/10 py-2 pl-2 pr-4 text-[15px] font-medium text-white backdrop-blur-xl transition-colors hover:bg-white/20 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
              Cancel
            </button>
            <p className="text-sm font-semibold text-white">Edit Card</p>
            <button
              type="button"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={saving}
              className="flex items-center gap-1 rounded-full bg-[#0071e3] px-4 py-2 text-[15px] font-semibold text-white transition-colors hover:bg-[#0077ed] active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Done"
              )}
            </button>
          </motion.div>

          <div className="relative flex min-h-[calc(100vh-72px)] items-start justify-center px-4 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className="w-full max-w-[520px]"
            >
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Direction */}
                <div className="rounded-2xl bg-white/[0.08] p-4 backdrop-blur-xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Type
                  </p>
                  <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/10 p-1">
                    <button
                      type="button"
                      onClick={() => setDirection("owed_to_me")}
                      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                        gave
                          ? "bg-white text-[#248a3d] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                          : "text-white/60"
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
                          ? "bg-white text-[#d70015] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                          : "text-white/60"
                      }`}
                    >
                      <ArrowDownLeft className="h-4 w-4" strokeWidth={2.5} />
                      I took money
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div className="rounded-2xl bg-white/[0.08] p-4 backdrop-blur-xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Amount
                  </p>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4">
                    <span className="text-2xl font-semibold text-white/40">₹</span>
                    <input
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      inputMode="decimal"
                      placeholder="0"
                      aria-label="Amount in rupees"
                      className="tnum w-full bg-transparent text-3xl font-semibold tracking-tight text-white placeholder:text-white/25"
                    />
                  </div>
                </div>

                {/* Person */}
                <div className="rounded-2xl bg-white/[0.08] p-4 backdrop-blur-xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    {gave ? "To whom? (receiver)" : "From whom?"}
                  </p>
                  <input
                    value={personName}
                    onChange={(event) => setPersonName(event.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    maxLength={80}
                    aria-label="Person name"
                    className="w-full rounded-2xl bg-white/10 px-5 py-3.5 text-[15px] text-white placeholder:text-white/30"
                  />
                </div>

                {/* Phone + UPI */}
                <div className="rounded-2xl bg-white/[0.08] p-4 backdrop-blur-xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Contact
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      inputMode="tel"
                      placeholder="Phone"
                      maxLength={20}
                      aria-label="Phone number"
                      className="tnum w-full rounded-2xl bg-white/10 px-5 py-3.5 text-[15px] text-white placeholder:text-white/30"
                    />
                    <input
                      value={upiId}
                      onChange={(event) => setUpiId(event.target.value)}
                      placeholder="UPI ID (name@bank)"
                      maxLength={60}
                      aria-label="UPI ID"
                      className="w-full rounded-2xl bg-white/10 px-5 py-3.5 text-[15px] text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Bank */}
                <div className="rounded-2xl bg-white/[0.08] p-4 backdrop-blur-xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Bank
                  </p>
                  <button
                    type="button"
                    onClick={() => setBankOpen((v) => !v)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-left transition-colors hover:bg-white/15"
                  >
                    {selectedBank ? (
                      <BankBadge bank={selectedBank} size="md" />
                    ) : (
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-white/10 text-white/40">
                        <Landmark className="h-4.5 w-4.5" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-white">
                        {selectedBank ? selectedBank.name : "Select a bank"}
                      </span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-300 ${bankOpen ? "rotate-180" : ""}`}
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
                        <div className="mt-2 rounded-2xl bg-white/10 p-2">
                          <label className="mb-1 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-[13px] text-white/50">
                            <Search className="h-3.5 w-3.5 shrink-0" />
                            <input
                              value={bankQuery}
                              onChange={(event) => setBankQuery(event.target.value)}
                              placeholder="Search bank…"
                              className="w-full bg-transparent text-white placeholder:text-white/30"
                            />
                          </label>
                          <div className="max-h-56 overflow-y-auto">
                            {filteredBanks.length === 0 ? (
                              <p className="px-3 py-6 text-center text-[13px] text-white/40">
                                No bank found.
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
                                      chosen ? "bg-white/15" : "hover:bg-white/10"
                                    }`}
                                  >
                                    <BankBadge bank={item} size="sm" />
                                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-white">
                                      {item.name}
                                    </span>
                                    {chosen && (
                                      <Check
                                        className="h-4 w-4 shrink-0 text-[#30d158]"
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
                <div className="rounded-2xl bg-white/[0.08] p-4 backdrop-blur-xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Details
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Note (optional)"
                      maxLength={140}
                      aria-label="Note"
                      className="w-full rounded-2xl bg-white/10 px-5 py-3.5 text-[15px] text-white placeholder:text-white/30"
                    />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                      aria-label="Due date"
                      className="w-full rounded-2xl bg-white/10 px-5 py-3 text-[15px] text-white [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Avatar */}
                <div className="rounded-2xl bg-white/[0.08] p-4 backdrop-blur-xl">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Person Avatar
                  </p>
                  <AvatarPicker selected={avatar} onSelect={setAvatar} dark />
                </div>

                {error && (
                  <div className="rounded-2xl bg-[#d70015]/20 px-4 py-3 text-center text-[13px] font-medium text-[#ff6961] backdrop-blur">
                    {error}
                  </div>
                )}

                {/* Bottom Done button for scroll convenience */}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] text-[15px] font-semibold text-white transition-all hover:bg-[#0077ed] active:scale-[0.99] disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
