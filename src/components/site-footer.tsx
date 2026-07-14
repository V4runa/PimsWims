"use client";

import Link from "next/link";
import { Instagram, Youtube, Music2, Mail } from "lucide-react";
import { useContent } from "@/context/content-context";

export default function SiteFooter() {
  const { content } = useContent();
  const { settings } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-oat/50 bg-pine text-cream/80">
      <div className="container-wide grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-evergreen font-display text-lg">
              P
            </span>
            <span className="font-display text-xl text-cream">{settings.brandName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-cream/70">{settings.tagline}</p>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-oatgold">Shop</Link></li>
            <li><Link href="/gallery" className="hover:text-oatgold">Gallery</Link></li>
            <li><Link href="/blog" className="hover:text-oatgold">Journal</Link></li>
            <li><Link href="/testimonials" className="hover:text-oatgold">Kind words</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream">Say hello</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-oatgold">About Pim</Link></li>
            <li><Link href="/contact" className="hover:text-oatgold">Contact</Link></li>
            <li><Link href="/custom" className="hover:text-oatgold">Make me something</Link></li>
            {settings.contact.email && (
              <li>
                <a href={`mailto:${settings.contact.email}`} className="hover:text-oatgold">
                  {settings.contact.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream">Follow along</h4>
          <div className="mt-4 flex gap-3">
            {settings.contact.instagram && (
              <a href={settings.contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 hover:border-oatgold hover:text-oatgold">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {settings.contact.tiktok && (
              <a href={settings.contact.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 hover:border-oatgold hover:text-oatgold">
                <Music2 className="h-5 w-5" />
              </a>
            )}
            {settings.contact.youtube && (
              <a href={settings.contact.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 hover:border-oatgold hover:text-oatgold">
                <Youtube className="h-5 w-5" />
              </a>
            )}
            <a href={`mailto:${settings.contact.email}`} aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 hover:border-oatgold hover:text-oatgold">
              <Mail className="h-5 w-5" />
            </a>
          </div>
          {settings.contact.location && (
            <p className="mt-4 text-sm text-cream/60">{settings.contact.location}</p>
          )}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row">
          <p>© {year} {settings.brandName}. Handmade with love.</p>
          <Link href="/admin" className="hover:text-oatgold">Studio login</Link>
        </div>
      </div>
    </footer>
  );
}
