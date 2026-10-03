export type EntryDirection = "owed_to_me" | "i_owe";
export type EntryStatus = "active" | "settled";

export type Entry = {
  id: string;
  personName: string;
  amountPaise: number;
  paidPaise: number;
  direction: EntryDirection;
  note: string | null;
  phone: string | null;
  upiId: string | null;
  bank: string | null;
  avatar: string | null;
  dueDate: string | null;
  colorVariant: string;
  status: EntryStatus;
  createdAt: string;
  settledAt: string | null;
};



/** What is still outstanding on this entry. */
export function remainingPaise(entry: {
  amountPaise: number;
  paidPaise: number;
}): number {
  return Math.max(entry.amountPaise - entry.paidPaise, 0);
}

export function formatINR(paise: number): string {
  const hasPaise = Math.abs(Math.round(paise) % 100) > 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: hasPaise ? 2 : 0,
    maximumFractionDigits: hasPaise ? 2 : 0,
  }).format(paise / 100);
}

export function formatSignedINR(paise: number): string {
  const sign = paise < 0 ? "\u2212" : "+";
  return `${sign}${formatINR(Math.abs(paise))}`;
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDDMMYYYY(dateStr: string): string {
  if (!dateStr || dateStr.indexOf("-") === -1) return dateStr;
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export type DueInfo = {
  label: string;
  tone: "danger" | "warn" | "neutral";
};

export function dueInfo(dueDate: string | null): DueInfo | null {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(due.getTime())) return null;
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diffDays < 0) return { label: "Overdue", tone: "danger" };
  if (diffDays === 0) return { label: "Due today", tone: "warn" };
  if (diffDays <= 3) return { label: `Due in ${diffDays}d`, tone: "warn" };
  return { label: `Due ${formatDate(due)}`, tone: "neutral" };
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (a + b).toUpperCase();
}

/** tel: link for dialling the person. */
export function telHref(phone: string | null): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  return cleaned.length >= 5 ? `tel:${cleaned}` : null;
}

/**
 * upi:// deep link — opens the user's payment app (GPay, PhonePe, Paytm…)
 * pre-filled with payee, name and amount, like an Apple Pay sheet.
 */
export function upiHref({
  upiId,
  phone,
  name,
  amountPaise,
}: {
  upiId: string | null;
  phone: string | null;
  name: string;
  amountPaise: number;
}): string | null {
  const digits = phone ? phone.replace(/\D/g, "") : "";
  const pa = upiId ?? (digits.length >= 10 ? `${digits}@upi` : null);
  if (!pa) return null;
  const params = new URLSearchParams({
    pa,
    pn: name,
    am: (amountPaise / 100).toFixed(2),
    cu: "INR",
    tn: "Orbit Pay settlement",
  });
  return `upi://pay?${params.toString()}`;
}
