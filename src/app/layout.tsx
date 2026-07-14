import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/context/content-context";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pim's Wims — Handmade Knits & Crochet",
    template: "%s · Pim's Wims",
  },
  description:
    "One-of-a-kind handmade knitwear and crochet, inspired by mossy forests and quiet mornings. Shop ready-made pieces or request a custom creation.",
  metadataBase: new URL("https://pimswims.vercel.app"),
  openGraph: {
    title: "Pim's Wims — Handmade Knits & Crochet",
    description:
      "One-of-a-kind handmade knitwear and crochet, inspired by mossy forests and quiet mornings.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
