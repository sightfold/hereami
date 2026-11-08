import "./layers.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Anton, Arima, Geist, Geist_Mono as GeistMono } from "next/font/google";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import Providers from "@/components/layout/Providers";
import ServiceWorker from "@/components/layout/ServiceWorker";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = GeistMono({ variable: "--font-geist-mono", subsets: ["latin"] });
const arima = Arima({ variable: "--font-arima", subsets: ["latin"] });
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });

const fontVars = [geistSans, geistMono, arima, anton].map((font) => font.variable).join(" ");

export const metadata: Metadata = {
  description: "Attendance and duty rosters for churches and religious organizations",
  appleWebApp: { capable: true, title: "Here Am I", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0d" },
  ],
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" suppressHydrationWarning className={`${fontVars} h-full antialiased`}>
    <body className="min-h-full font-sans">
      <InitColorSchemeScript attribute="class" defaultMode="system" />
      <Providers>{children}</Providers>
      <ServiceWorker />
    </body>
  </html>
);

export default RootLayout;
