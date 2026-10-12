import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cooch Behar Durga Puja Interactive Guide & Navigation App",
  description:
    "Mobile-first PWA guide for exploring Durga Puja pandals, routes, amenities, and crowd updates in Cooch Behar.",
  applicationName: "Cooch Behar Durga Puja Guide",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cooch Behar Durga Puja Guide",
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
      <body className="min-h-full flex flex-col antialiased bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
