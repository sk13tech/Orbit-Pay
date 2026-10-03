import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { CopyGuard } from "@/components/orbit/CopyGuard";
import { SessionWrapper } from "@/components/orbit/SessionWrapper";
import { ServiceWorkerRegister } from "@/components/orbit/ServiceWorker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Orbit Pay — Debt & credit, beautifully managed",
  description:
    "Orbit Pay turns every \"I'll pay you back\" into a beautiful card you can track and settle.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-512.png",
    apple: "/icons/icon-512.png",
  },
  appleWebApp: {
    capable: true,
    title: "Orbit Pay",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#f5f5f7] text-[#1d1d1f] antialiased">
        <SessionWrapper>
          <ServiceWorkerRegister />
          <CopyGuard />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
