# Pim's Wims

A handmade knitting & crochet boutique site for the artist **Pim**, with a built-in
content management studio. Built with **Next.js (App Router) + TypeScript + Tailwind**,
designed to deploy on **Vercel**, and — by request — **database-free**: content is
stored locally in the browser and images are compressed client-side.

> Brand direction: cozy cottagecore meets enchanted forest — deep evergreens, warm
> oat/cream neutrals, and rustwood accents. Editorial, tactile, and unhurried.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build & run production:

```bash
npm run build
npm start
```

> **Current workflow:** we deploy to Vercel on every push to `main` and review on the
> live URL (the site isn't public yet). Local dev is optional.

### Admin studio

Visit **`/admin`** (or "Studio login" in the footer). Default passcode: `pimstudio`
(override with `NEXT_PUBLIC_ADMIN_PASSCODE` — see `.env.example`).

---

## Feature map

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/` | Hero, values, featured products, collections, custom CTA, gallery, testimonials, journal |
| Shop | `/shop` | Category filter, search, sort |
| Product detail | `/shop/[slug]` | Gallery, specs, related pieces, reviews, inquiry CTAs (no checkout) |
| Gallery | `/gallery` | Masonry + lightbox, tag filter |
| Journal (blog) | `/blog`, `/blog/[slug]` | Cover + in-post galleries |
| About | `/about` | Story, highlights, FAQs |
| Contact | `/contact` | Contact form → studio inbox |
| Make Me Something | `/custom` | Custom-quote request with reference-image uploads |
| Testimonials | `/testimonials` | |
| Studio CMS | `/admin/**` | Dashboard, Products, Categories, Gallery, Testimonials, Journal, Inbox, Settings |

---

## Design & theming (Style Studio)

The whole look is driven by **CSS-variable design tokens**, so the palette, mode, and
layout can be swapped at runtime with no reload. A floating **Style Studio** panel (the
wand button, bottom-right of the public site) lets us explore variations while we settle
the final look. Selections persist to `localStorage` and are applied before first paint
(via a small inline script in `layout.tsx`) so there's no theme flash.

Switchable dimensions:

| Dimension | Options |
| --- | --- |
| **Palette** | Evergreen & Oat · Sage & Cream · Rustwood Autumn · Forest & Wine · Moonlit Grove |
| **Mode** | Light · Dark |
| **Typography** | Storybook (Fraunces · Nunito) · Classic (Cormorant · Work Sans) · Modern (DM Serif · Inter) |
| **Corners** | Soft · Sharp · Round |
| **Hero layout** | Immersive · Split · Centered · Editorial |
| **Header style** | Classic · Centered · Minimal |

How it fits together:

- **Tokens** — every color is a CSS variable (`--c-*`, space-separated RGB) that Tailwind
  reads with alpha support (`tailwind.config.ts`). Corner radius is variable-driven too.
- **Palettes & modes** — defined as `[data-theme]` / `[data-mode]` blocks in
  `globals.css`. Palettes were drawn from the artist's inspiration images. Two semantic
  tokens — `canvas` (page background) and `heading` (heading text) — let light/dark flip
  cleanly while intentionally-dark areas (hero overlays, footer, buttons) stay dark.
- **State** — `src/context/theme-context.tsx` stores the selection and reflects it onto
  `<html data-* >`; option lists live in `src/lib/theme.ts`; the panel is
  `src/components/style-switcher.tsx`.
- **Layout variants** — `src/components/hero.tsx` and `src/components/site-header.tsx`
  read the active variant from the theme context and render accordingly.

> Once a final look is chosen, we bake those values in as the defaults (and can remove or
> hide the Style Studio for launch). The switcher currently appears on the public site
> only.

---

## Architecture (no database)

Content is **local-first**:

- **Seed content** ships in `src/lib/seed.ts` — this is what every visitor sees out of
  the box, so the site is never empty or broken.
- **Admin edits** are layered on top and saved to **`localStorage`** (small JSON:
  text + image pointers only). See `src/lib/store.ts`.
- **Images** are compressed to WebP in the browser (`browser-image-compression`) and
  stored in **IndexedDB** (`src/lib/images.ts`). Content only holds an `idb://<id>`
  pointer, which `<SmartImage>` resolves at render time. This keeps `localStorage`
  well under its ~5MB ceiling.
- **Backup / restore**: Settings → *Export/Import backup* produces a single JSON file
  containing both content and images, for moving between devices or safekeeping.

The storage layer is deliberately isolated (`store.ts` + `images.ts`) so it can be
swapped for a hosted backend later (Vercel Blob/KV, Supabase, etc.) **without touching
the UI**.

### ⚠️ Important limitation to decide on (see notes to the client)

`localStorage`/IndexedDB is **per-browser, per-device**. That means:

- Content the artist creates in `/admin` on her laptop is **not** automatically visible
  to public visitors, and **form submissions** (contact / custom quotes) are saved into
  the *visitor's* browser — not delivered to Pim.

For a real public launch we need a shared "publish" mechanism. Options, cheapest first:
1. **Email submissions** via a serverless route + a free-tier provider (e.g. Resend) so
   quotes/contact reach Pim's inbox.
2. **Vercel Blob / KV** for a lightweight hosted content store (generous free tier, no
   Postgres cost).
3. Keep the current model and treat `/admin` as an authoring tool that exports a content
   bundle to commit + redeploy (fully free, but manual).

This first iteration implements the local-first model end-to-end and is ready to grow
into any of the above.

---

## Project structure

```
src/
  app/
    (site)/            # public site (shared header/footer layout + Style Studio)
    admin/             # studio CMS (own shell + passcode gate)
    layout.tsx         # root: fonts + ThemeProvider + ContentProvider
    globals.css        # design tokens, palettes, light/dark, base styles
  components/
    hero.tsx           # hero layout variants
    site-header.tsx    # header layout variants
    style-switcher.tsx # the Style Studio panel
    smart-image.tsx    # resolves idb:// / data / remote image sources
    ...                # Reveal, footer, cards, admin UI
  context/
    theme-context.tsx  # style/theme state + persistence
    content-context.tsx  # single source of truth + CRUD
  lib/
    theme.ts           # style-switcher option definitions
    types.ts           # content model
    seed.ts            # default content
    store.ts           # localStorage persistence
    images.ts          # compression + IndexedDB
    utils.ts
public/seed/           # on-brand SVG placeholder imagery
```

## Deploying to Vercel

Import the repo in Vercel (framework auto-detected as Next.js via `vercel.json`). Set
`NEXT_PUBLIC_ADMIN_PASSCODE` in Project → Settings → Environment Variables. Every push to
`main` triggers a deploy.
