import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MeshBackground from "@/components/MeshBackground";
import ScrollReveal from "@/components/ScrollReveal";
import SiteEffects from "@/components/SiteEffects";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SleekTech — Engineering Collective",
  description:
    "A modern engineering collective where companies get execution-ready teams and engineers earn through real projects — not broken hiring pipelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <MeshBackground />
        <SiteEffects />
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
