"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";

export function SessionWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
