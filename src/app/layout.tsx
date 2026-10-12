import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PreferenceProvider } from "@/components/preferences/PreferenceProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cooch Behar Puja Guide — Interactive Map & Pandal Guide",
  description:
    "Mobile-first, accessible guide for exploring Durga Puja pandals, routes, amenities, and real-time crowd updates across Cooch Behar, West Bengal.",
  applicationName: "Cooch Behar Puja Guide",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cooch Behar Puja Guide",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#881337",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors">
        <PreferenceProvider>{children}</PreferenceProvider>
      </body>
    </html>
  );
}
