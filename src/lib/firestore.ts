/**
 * Firestore data layer — replaces the PostgreSQL/Drizzle layer.
 * All entries are stored under: users/{uid}/entries/{entryId}
 */
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { Entry, EntryDirection, EntryStatus } from "./format";

function entriesCol(uid: string) {
  return collection(getFirebaseDb(), "users", uid, "entries");
}

function entryDoc(uid: string, id: string) {
  return doc(getFirebaseDb(), "users", uid, "entries", id);
}

function toEntry(id: string, data: Record<string, unknown>): Entry {
  const ts = (v: unknown) => {
    if (!v) return null;
    if (v instanceof Timestamp) return v.toDate().toISOString();
    if (typeof v === "string") return v;
    return null;
  };
  return {
    id,
    personName: String(data.personName ?? ""),
    amountPaise: Number(data.amountPaise ?? 0),
    paidPaise: Number(data.paidPaise ?? 0),
    direction: (data.direction as EntryDirection) ?? "owed_to_me",
    note: data.note ? String(data.note) : null,
    phone: data.phone ? String(data.phone) : null,
    upiId: data.upiId ? String(data.upiId) : null,
    bank: data.bank ? String(data.bank) : null,
    avatar: data.avatar ? String(data.avatar) : "face1",
    dueDate: data.dueDate ? String(data.dueDate) : null,
    colorVariant: String(data.colorVariant ?? "midnight"),
    status: (data.status as EntryStatus) ?? "active",
    createdAt: ts(data.createdAt) ?? new Date().toISOString(),
    settledAt: ts(data.settledAt),
  };
}

/** Subscribe to real-time entry updates for a user. Returns unsubscribe fn. */
export function subscribeEntries(
  uid: string,
  onChange: (entries: Entry[]) => void,
): Unsubscribe {
  const q = query(entriesCol(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const entries = snap.docs.map((d) =>
      toEntry(d.id, d.data() as Record<string, unknown>),
    );
    onChange(entries);
  });
}

export async function createEntry(
  uid: string,
  payload: {
    personName: string;
    amountPaise: number;
    direction: EntryDirection;
    note: string | null;
    phone: string | null;
    upiId: string | null;
    bank: string | null;
    avatar: string;
    dueDate: string | null;
    colorVariant: string;
  },
): Promise<string> {
  const ref = await addDoc(entriesCol(uid), {
    ...payload,
    paidPaise: 0,
    status: "active",
    createdAt: serverTimestamp(),
    settledAt: null,
  });
  return ref.id;
}

export async function recordPayment(
  uid: string,
  entry: Entry,
  amountRupees: number,
): Promise<Partial<Entry>> {
  const outstanding = Math.max(entry.amountPaise - entry.paidPaise, 0);
  const addPaise = Math.min(
    Math.round(amountRupees * 100),
    outstanding,
  );
  const paidPaise = entry.paidPaise + addPaise;
  const fullySettled = paidPaise >= entry.amountPaise;
  const updates = {
    paidPaise,
    status: fullySettled ? "settled" : "active",
    settledAt: fullySettled ? serverTimestamp() : null,
  };
  await updateDoc(entryDoc(uid, entry.id), updates);
  return updates as Partial<Entry>;
}

export async function setEntryStatus(
  uid: string,
  entry: Entry,
  status: EntryStatus,
): Promise<void> {
  const updates: Record<string, unknown> = {
    status,
    settledAt: status === "settled" ? serverTimestamp() : null,
    paidPaise:
      status === "settled"
        ? entry.amountPaise
        : entry.paidPaise >= entry.amountPaise
          ? 0
          : entry.paidPaise,
  };
  await updateDoc(entryDoc(uid, entry.id), updates);
}

export async function editEntry(
  uid: string,
  id: string,
  updates: Partial<{
    personName: string;
    amountPaise: number;
    direction: EntryDirection;
    note: string | null;
    phone: string | null;
    upiId: string | null;
    bank: string | null;
    avatar: string;
    dueDate: string | null;
    colorVariant: string;
  }>,
): Promise<void> {
  await updateDoc(entryDoc(uid, id), updates);
}

export async function removeEntry(uid: string, id: string): Promise<void> {
  await deleteDoc(entryDoc(uid, id));
}
