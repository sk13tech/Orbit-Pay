"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  authError: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const fbAuth = getFirebaseAuth();

    // Handle any pending redirect result
    getRedirectResult(fbAuth).catch(() => {});

    const unsub = onAuthStateChanged(fbAuth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) setAuthError(null);
    });
    return unsub;
  }, []);

  async function signInWithGoogle() {
    if (typeof window === "undefined") return;
    setAuthError(null);

    const fbAuth = getFirebaseAuth();
    try {
      await signInWithPopup(fbAuth, getGoogleProvider());
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      const msg  = (err as { message?: string })?.message ?? "";

      if (code === "auth/unauthorized-domain") {
        const host = window.location.hostname;
        setAuthError(
          `Domain not authorized: "${host}". Go to Firebase Console → ` +
          `Authentication → Settings → Authorized domains and add it.`,
        );
      } else if (
        code === "auth/popup-blocked" ||
        code === "auth/cancelled-popup-request"
      ) {
        try {
          await signInWithRedirect(fbAuth, getGoogleProvider());
        } catch {
          setAuthError("Redirect sign-in failed. Please allow popups.");
        }
      } else if (code === "auth/popup-closed-by-user") {
        // user dismissed — do nothing
      } else {
        setAuthError(msg || "Sign-in failed. Please try again.");
      }
    }
  }

  async function signOut() {
    await fbSignOut(getFirebaseAuth());
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
