"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import type { Entry } from "@/lib/format";
import { formatINR, remainingPaise } from "@/lib/format";
import { showNotification } from "@/lib/notifications";
import {
  createEntry as fsCreate,
  editEntry as fsEdit,
  recordPayment as fsPayment,
  removeEntry as fsRemove,
  setEntryStatus as fsSetStatus,
  subscribeEntries,
} from "@/lib/firestore";
import { useAuth } from "./AuthContext";
import type { NewEntryPayload } from "./AddSheet";
import { AddSheet } from "./AddSheet";
import { Footer, Nav } from "./Chrome";
import { ConfirmDialog } from "./ConfirmDialog";
import { DetailSheet } from "./DetailSheet";
import type { EditPayload } from "./EditSheet";
import { EditSheet } from "./EditSheet";
import { OrbitLogo } from "./OrbitLogo";
import { Overview } from "./Overview";
import { SettleDialog } from "./SettleDialog";
import { UserCards, type Filter, type SortKey } from "./UserCards";

type Toast = { id: number; message: string };

/* ─── Google icon SVG ─────────────────────────────────────── */
function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ─── Apple-style sign-in page ────────────────────────────── */
function SignInPage({
  onSignIn,
  error,
}: {
  onSignIn: () => void;
  error: string | null;
}) {
  return (
    /* Full viewport, white, vertically centred, no top nav offset */
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-5">
      <div className="w-full max-w-[340px]">

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <OrbitLogo size={52} className="rounded-xl" />
        </div>

        {/* Heading */}
        <h1 className="mb-1 text-center text-[26px] font-semibold leading-snug tracking-tight text-[#1d1d1f]">
          Sign in to Orbit Pay
        </h1>
        <p className="mb-8 text-center text-[15px] leading-snug text-[#6e6e73]">
          Your personal debt &amp; credit ledger.
        </p>

        {/* Google button */}
        <button
          type="button"
          onClick={onSignIn}
          className="flex h-[50px] w-full items-center justify-center gap-3 rounded-[10px] border border-[#d2d2d7] bg-white text-[15px] font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] active:scale-[0.98]"
        >
          <GoogleG size={18} />
          Continue with Google
        </button>

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-[10px] bg-[#fff0f0] px-4 py-3 text-[13px] leading-snug text-[#d70015]">
            {error}
          </p>
        )}

        {/* Footer note */}
        <p className="mt-8 text-center text-[12px] leading-relaxed text-[#86868b]">
          By continuing, you agree to Orbit Pay's terms.
          <br />
          <a
            href="https://accounts.google.com/signup"
            target="_blank"
            rel="noreferrer"
            className="text-[#0071e3] hover:underline"
          >
            No Google account? Create one.
          </a>
        </p>

      </div>
    </div>
  );
}

/* ─── Main App ─────────────────────────────────────────────── */
export default function OrbitApp() {
  const { user, loading: authLoading, authError, signInWithGoogle } = useAuth();
  const uid = user?.uid ?? null;

  const [entries, setEntries] = useState<Entry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [settleId, setSettleId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey>("date_new_to_old");
  const [query, setQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const unsubRef = useRef<(() => void) | null>(null);

  /* Subscribe to Firestore when uid changes */
  useEffect(() => {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    if (!uid) { setEntries([]); setDataLoading(false); return; }
    setDataLoading(true);
    unsubRef.current = subscribeEntries(uid, (e) => {
      setEntries(e);
      setDataLoading(false);
    });
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, [uid]);

  function pushToast(msg: string) {
    const id = Date.now() + Math.random();
    setToasts((c) => [...c, { id, message: msg }]);
  }

  useEffect(() => {
    if (toasts.length === 0) return;
    const t = window.setTimeout(() => setToasts((c) => c.slice(1)), 3600);
    return () => window.clearTimeout(t);
  }, [toasts]);

  const byId = (id: string | null) =>
    id ? (entries.find((e) => e.id === id) ?? null) : null;

  const active = useMemo(
    () => entries.filter((e) => e.status === "active"),
    [entries],
  );
  const settled = useMemo(
    () => entries.filter((e) => e.status === "settled"),
    [entries],
  );

  const totals = useMemo(() => {
    let owedToMe = 0, iOwe = 0, owedToMeCount = 0, iOweCount = 0;
    for (const e of active) {
      const left = remainingPaise(e);
      if (e.direction === "owed_to_me") { owedToMe += left; owedToMeCount++; }
      else { iOwe += left; iOweCount++; }
    }
    return { owedToMe, iOwe, owedToMeCount, iOweCount };
  }, [active]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = active.filter((e) => {
      if (filter !== "all" && e.direction !== filter) return false;
      if (!needle) return true;
      return (
        e.personName.toLowerCase().includes(needle) ||
        (e.phone ?? "").replace(/\D/g, "").includes(needle.replace(/\D/g, "")) ||
        (e.note ?? "").toLowerCase().includes(needle)
      );
    });
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "date_old_to_new": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "date_new_to_old": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "amount_high_to_low": return remainingPaise(b) - remainingPaise(a);
        case "amount_low_to_high": return remainingPaise(a) - remainingPaise(b);
        default: return 0;
      }
    });
  }, [active, filter, sort, query]);

  /* ── Actions ──────────────────────────────────────────────── */
  async function handleCreate(payload: NewEntryPayload) {
    if (!uid) return;
    await fsCreate(uid, {
      personName: payload.personName,
      amountPaise: Math.round(payload.amount * 100),
      direction: payload.direction,
      note: payload.note,
      phone: payload.phone,
      upiId: payload.upiId,
      bank: payload.bank,
      avatar: payload.avatar ?? "face1",
      dueDate: payload.dueDate,
      colorVariant: payload.colorVariant,
    });
    void showNotification(
      "Card Added",
      `${payload.personName} · ${formatINR(Math.round(payload.amount * 100))}`,
    );
  }

  async function handleEdit(entryId: string, payload: EditPayload) {
    if (!uid) return;
    await fsEdit(uid, entryId, {
      personName: payload.personName,
      amountPaise: Math.round(payload.amount * 100),
      direction: payload.direction,
      note: payload.note,
      phone: payload.phone,
      upiId: payload.upiId,
      bank: payload.bank,
      avatar: payload.avatar ?? "face1",
      dueDate: payload.dueDate,
      colorVariant: payload.colorVariant,
    });
    pushToast("Card updated.");
  }

  async function handlePayment(entry: Entry, amountRupees: number) {
    if (!uid) return;
    await fsPayment(uid, entry, amountRupees);
    setSettleId(null);
    const addPaise = Math.min(Math.round(amountRupees * 100), Math.max(entry.amountPaise - entry.paidPaise, 0));
    const left = Math.max(entry.amountPaise - entry.paidPaise - addPaise, 0);
    const msg = left === 0
      ? `${entry.personName} is fully settled 🎉`
      : `Recorded ${formatINR(Math.round(amountRupees * 100))} · ${formatINR(left)} still pending`;
    pushToast(msg);
    void showNotification("Payment Recorded", msg);
  }

  async function handleReopen(entry: Entry) {
    if (!uid) return;
    await fsSetStatus(uid, entry, "active");
    pushToast(`${entry.personName} moved back to active.`);
  }

  async function handleDelete(entry: Entry) {
    if (!uid) return;
    setDeleteId(null);
    setDetailId((id) => (id === entry.id ? null : id));
    await fsRemove(uid, entry.id);
    pushToast(`Deleted ${entry.personName}'s card.`);
  }

  /* ── Render ───────────────────────────────────────────────── */

  /* Loading spinner while auth resolves */
  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black" />
      </div>
    );
  }

  /* Sign-in page (no nav) */
  if (!user) {
    return <SignInPage onSignIn={() => void signInWithGoogle()} error={authError} />;
  }

  /* Main app */
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Nav onAdd={() => setSheetOpen(true)} />

      <main className="pt-[44px]">
        {dataLoading ? (
          <div className="grid min-h-[60vh] place-items-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-black" />
          </div>
        ) : (
          <>
            <Overview totals={totals} filter={filter} onFilterChange={setFilter} />
            <UserCards
              entries={visible}
              activeTotal={totals.owedToMe + totals.iOwe}
              activeCount={active.length}
              filter={filter}
              onFilterChange={setFilter}
              sort={sort}
              onSortChange={setSort}
              query={query}
              onQueryChange={setQuery}
              settled={settled}
              onView={(e) => setDetailId(e.id)}
            />
          </>
        )}
      </main>

      <Footer />

      <AddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onCreate={handleCreate} />
      <DetailSheet
        entry={byId(detailId)}
        onClose={() => setDetailId(null)}
        onSettle={(e) => setSettleId(e.id)}
        onReopen={(e) => void handleReopen(e)}
        onDelete={(e) => setDeleteId(e.id)}
        onEdit={(e) => { setDetailId(null); setEditId(e.id); }}
      />
      <EditSheet entry={byId(editId)} onClose={() => setEditId(null)} onSave={handleEdit} />
      <SettleDialog entry={byId(settleId)} onCancel={() => setSettleId(null)} onSubmit={handlePayment} />
      <ConfirmDialog entry={byId(deleteId)} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} />

      {/* Toasts */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#1d1d1f] px-4 py-2.5 text-[13px] font-medium text-white shadow-xl"
            >
              <CircleAlert className="h-4 w-4 text-[#ffd60a]" />
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
