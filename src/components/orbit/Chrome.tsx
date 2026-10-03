"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Plus, X } from "lucide-react";
import { useAuth } from "./AuthContext";
import { OrbitLogo } from "./OrbitLogo";

function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* Full-screen Apple-style account menu */
function AccountMenu({
  open,
  onClose,
  user,
  onSignOut,
}: {
  open: boolean;
  onClose: () => void;
  user: { displayName?: string | null; email?: string | null; photoURL?: string | null };
  onSignOut: () => void;
}) {
  /* Lock scroll while open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99] flex flex-col bg-white"
        >
          {/* Menu top bar — mirrors the main nav exactly */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-black/[0.06] px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <OrbitLogo size={26} className="rounded-md" />
              <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
                Orbit Pay
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-[#f5f5f7] text-[#6e6e73] transition-colors hover:bg-[#e8e8ed]"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
            <div className="w-full max-w-[400px] space-y-0">

              {/* Avatar + name */}
              <div className="mb-10 flex flex-col items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-full ring-1 ring-black/[0.08]">
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photoURL}
                      alt={user.displayName ?? ""}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-[#f5f5f7] text-2xl font-bold text-[#1d1d1f]">
                      {(user.displayName ?? user.email ?? "U")[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                {user.displayName && (
                  <p className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">
                    {user.displayName}
                  </p>
                )}
              </div>

              {/* Menu items */}
              <div className="divide-y divide-[#f0f0f5] overflow-hidden rounded-2xl border border-[#e8e8ed]">

                {/* Email row with logout button */}
                <div className="flex items-center justify-between gap-4 bg-white px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#86868b]">
                      Orbit&nbsp;Pay&nbsp;ID
                    </p>
                    <p className="mt-0.5 truncate text-[15px] font-semibold text-[#1d1d1f]">
                      {user.email ?? "—"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { onClose(); onSignOut(); }}
                    className="shrink-0 rounded-full bg-[#f5f5f7] px-4 py-1.5 text-[13px] font-medium text-[#d70015] transition-colors hover:bg-[#fee]"
                  >
                    Sign Out
                  </button>
                </div>

                {/* Privacy Policy */}
                <a
                  href="/privacy"
                  className="flex items-center justify-between bg-white px-5 py-4 transition-colors hover:bg-[#f9f9f9]"
                >
                  <span className="text-[15px] font-medium text-[#1d1d1f]">
                    Privacy Policy
                  </span>
                  <ChevronRight className="h-4.5 w-4.5 text-[#c7c7cc]" />
                </a>

                {/* Terms & Conditions */}
                <a
                  href="/terms"
                  className="flex items-center justify-between bg-white px-5 py-4 transition-colors hover:bg-[#f9f9f9]"
                >
                  <span className="text-[15px] font-medium text-[#1d1d1f]">
                    Terms &amp; Conditions
                  </span>
                  <ChevronRight className="h-4.5 w-4.5 text-[#c7c7cc]" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Nav ─────────────────────────────────────────────── */
export function Nav({ onAdd }: { onAdd: () => void }) {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl backdrop-saturate-[1.8]">
        <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <a href="/" className="flex shrink-0 items-center gap-2">
            <OrbitLogo size={28} className="rounded-md" />
            <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
              Orbit Pay
            </span>
          </a>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            {user && (
              <button
                type="button"
                onClick={onAdd}
                className="flex h-8 items-center gap-1.5 rounded-full bg-[#0071e3] px-3.5 text-[13px] font-medium text-white transition-all hover:bg-[#0077ed] active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                <span className="hidden sm:inline">New card</span>
              </button>
            )}

            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-black/[0.06]" />
            ) : user ? (
              <button
                ref={btnRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/[0.08] transition-all hover:ring-2 hover:ring-black/20"
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? ""}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center bg-[#f5f5f7] text-[11px] font-bold text-[#1d1d1f]">
                    {(user.displayName ?? user.email ?? "U")[0]?.toUpperCase()}
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                className="flex h-8 items-center gap-2 rounded-full bg-white px-3.5 text-[13px] font-medium text-[#1d1d1f] ring-1 ring-black/[0.12] transition-all hover:bg-[#f5f5f7] hover:shadow-sm active:scale-95"
              >
                <GoogleIcon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Full-screen account menu */}
      {user && (
        <AccountMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          user={user}
          onSignOut={() => void signOut()}
        />
      )}
    </>
  );
}

export function Footer() {
  return null;
}
