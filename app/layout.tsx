import type { Metadata, Viewport } from "next";
import {
  Alegreya,
  Alegreya_Sans,
  Noto_Sans_Ethiopic,
  Noto_Serif_Ethiopic,
} from "next/font/google";
import SiteHeader from "@/components/site-header";
import "./globals.css";

// Headings: Alegreya. Only the weights we use, so pages stay light.
const alegreya = Alegreya({
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  variable: "--font-alegreya",
  display: "swap",
});

// Body and interface: Alegreya Sans
const alegreyaSans = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-alegreya-sans",
  display: "swap",
});

// Fallbacks for Amharic. preload: false means they only download
// when a page actually contains Ethiopic letters.
const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-noto-sans-ethiopic",
  display: "swap",
  preload: false,
});

const notoSerifEthiopic = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-noto-serif-ethiopic",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "NILU",
  description:
    "Discover the best-rated places to spend your time, reviewed by people who were really there.",
};

export const viewport: Viewport = {
  themeColor: "#f5efe3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${alegreya.variable} ${alegreyaSans.variable} ${notoSansEthiopic.variable} ${notoSerifEthiopic.variable}`}
    >
      <body className="min-h-screen antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
