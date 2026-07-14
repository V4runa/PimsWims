import type { Metadata } from "next";
import {
  Fraunces,
  Nunito_Sans,
  Cormorant_Garamond,
  Work_Sans,
  DM_Serif_Display,
  Inter,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { ContentProvider } from "@/context/content-context";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
  display: "swap",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dmserif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fontVars = [
  fraunces.variable,
  nunito.variable,
  cormorant.variable,
  workSans.variable,
  dmSerif.variable,
  inter.variable,
].join(" ");

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

const themeInitScript = `(function(){try{var d=document.documentElement;var s=JSON.parse(localStorage.getItem('pims-wims:style')||'{}');d.dataset.theme=s.palette||'evergreen';d.dataset.mode=s.mode||'light';d.dataset.font=s.font||'storybook';d.dataset.radius=s.radius||'soft';d.style.colorScheme=s.mode||'light';}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ContentProvider>{children}</ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
