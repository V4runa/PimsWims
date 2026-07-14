"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useContent } from "@/context/content-context";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const { content } = useContent();
  const { style } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const announcement = content.settings.announcement?.trim();
  const variant = style.header;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const Logo = ({ className }: { className?: string }) => (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-evergreen text-cream font-display text-lg">P</span>
      <span className="font-display text-xl leading-none text-heading">{content.settings.brandName}</span>
    </Link>
  );

  const NavLinks = ({ className }: { className?: string }) => (
    <div className={cn("items-center gap-1", className)}>
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active ? "bg-forest/10 text-heading" : "text-ink/70 hover:text-heading"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  const MenuButton = ({ className }: { className?: string }) => (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className={cn("grid h-10 w-10 place-items-center rounded-full border border-oat/50 text-heading", className)}
      aria-label="Toggle menu"
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );

  const cta = (
    <Link href="/custom" className="btn-primary hidden sm:inline-flex">
      Make me something
    </Link>
  );

  return (
    <header className="sticky top-0 z-50">
      {announcement && (
        <div className="bg-evergreen text-cream">
          <div className="container-wide flex items-center justify-center gap-2 py-2 text-center text-xs sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-oatgold" />
            <span>{announcement}</span>
          </div>
        </div>
      )}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled ? "border-oat/50 bg-canvas/85 backdrop-blur-md" : "border-transparent bg-canvas/40 backdrop-blur-sm"
        )}
      >
        {variant === "classic" && (
          <nav className="container-wide flex h-16 items-center justify-between gap-4">
            <Logo />
            <NavLinks className="hidden md:flex" />
            <div className="flex items-center gap-2">
              {cta}
              <MenuButton className="md:hidden" />
            </div>
          </nav>
        )}

        {variant === "centered" && (
          <nav className="container-wide py-3">
            <div className="flex items-center justify-between gap-4">
              <MenuButton className="md:hidden" />
              <Logo className="md:mx-auto" />
              {cta}
            </div>
            <NavLinks className="mt-2 hidden justify-center md:flex" />
          </nav>
        )}

        {variant === "minimal" && (
          <nav className="container-wide flex h-16 items-center justify-between gap-4">
            <Logo />
            <div className="flex items-center gap-3">
              {cta}
              <MenuButton />
            </div>
          </nav>
        )}

        {open && (
          <div className="border-t border-oat/40 bg-canvas">
            <div className="container-wide flex flex-col py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl2 px-3 py-3 text-base font-semibold text-ink/80 hover:bg-forest/10"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/custom" className="btn-primary mt-2">Make me something</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
