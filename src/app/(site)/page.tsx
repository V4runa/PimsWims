"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Scissors, Sparkles, HeartHandshake } from "lucide-react";
import { useContent } from "@/context/content-context";
import SmartImage from "@/components/smart-image";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { SectionHeading, StarRating, Kicker } from "@/components/ui";

const VALUES = [
  { icon: Leaf, title: "Natural fibers", text: "Merino, cotton, and alpaca chosen for how they feel and last." },
  { icon: Scissors, title: "Made by hand", text: "Every stitch worked by Pim in small, unhurried batches." },
  { icon: Sparkles, title: "One of a kind", text: "No two pieces are ever exactly alike — yours is truly yours." },
  { icon: HeartHandshake, title: "Made for you", text: "Custom sizes and colorways are always welcome." },
];

export default function HomePage() {
  const { content } = useContent();
  const { settings } = content;
  const featured = content.products.filter((p) => p.featured).slice(0, 3);
  const galleryPreview = [...content.gallery].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 6);
  const featuredTestimonials = content.testimonials.filter((t) => t.featured).slice(0, 3);
  const latestPosts = content.posts.filter((p) => p.published).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <SmartImage image={settings.heroImage} className="h-full w-full" imgClassName="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-pine/85 via-pine/45 to-pine/25" />
        </div>
        <div className="container-wide flex min-h-[82vh] flex-col justify-end pb-16 pt-28 sm:pb-24">
          <div className="max-w-2xl animate-fade-up">
            <Kicker className="mb-4 text-oatgold">{settings.tagline}</Kicker>
            <h1 className="text-4xl leading-[1.05] text-cream sm:text-6xl">
              {settings.heroHeadline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-cream/85">{settings.heroSubcopy}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-gold">
                Explore the shop <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/custom" className="btn-secondary border-cream/40 text-cream hover:bg-cream/10">
                Commission a piece
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-wide -mt-10 relative z-10">
        <div className="grid gap-4 rounded-xl3 border border-oat/50 bg-paper/90 p-6 shadow-lift backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 80} className="flex items-start gap-3 p-2">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest/10 text-forest">
                <v.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg text-evergreen">{v.title}</p>
                <p className="text-sm text-moss">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="container-wide mt-24">
          <SectionHeading
            kicker="Fresh off the needles"
            title="Featured pieces"
            subtitle="A handful of favorites, ready to wear or made just for you."
            cta={{ href: "/shop", label: "Shop all" }}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container-wide mt-24">
        <SectionHeading kicker="Find your thing" title="Browse by collection" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...content.categories]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((c, i) => (
              <Reveal key={c.id} delay={i * 70}>
                <Link href={`/shop?category=${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-xl2">
                  <SmartImage image={c.image} className="h-full w-full" imgClassName="group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-pine/80 to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <h3 className="font-display text-2xl text-cream">{c.name}</h3>
                    <p className="mt-1 text-sm text-cream/80">{c.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
        </div>
      </section>

      {/* Custom CTA band */}
      <section className="container-wide mt-24">
        <div className="relative overflow-hidden rounded-xl3 bg-evergreen px-6 py-14 text-center text-cream sm:px-16 sm:py-20">
          <div className="absolute inset-0 -z-0 opacity-30">
            <SmartImage src="/seed/hero.svg" className="h-full w-full" imgClassName="object-cover" />
          </div>
          <div className="relative z-10 mx-auto max-w-2xl">
            <Kicker className="mb-4 justify-center text-oatgold">Make me something</Kicker>
            <h2 className="text-3xl text-cream sm:text-4xl">Have a dream piece in mind?</h2>
            <p className="mt-4 text-cream/85">
              Tell me about the colors, the fit, and the feeling you're after. I'll bring it to life,
              stitch by stitch — no two commissions are ever the same.
            </p>
            <Link href="/custom" className="btn-gold mt-8">
              Start a custom request <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      {galleryPreview.length > 0 && (
        <section className="container-wide mt-24">
          <SectionHeading
            kicker="In the wild"
            title="From the gallery"
            cta={{ href: "/gallery", label: "See the full gallery" }}
          />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {galleryPreview.map((g, i) => (
              <Reveal key={g.id} delay={i * 50} className="aspect-square overflow-hidden rounded-xl2">
                <SmartImage image={g.image} className="h-full w-full" imgClassName="hover:scale-110 transition-transform duration-500" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {featuredTestimonials.length > 0 && (
        <section className="container-wide mt-24">
          <SectionHeading kicker="Kind words" title="Loved by makers & wearers" align="center" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredTestimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 80} className="card flex flex-col p-6">
                <StarRating value={t.rating ?? 5} />
                <p className="mt-4 flex-1 font-display text-lg italic text-evergreen">“{t.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-ink">
                  {t.author}
                  {t.location && <span className="font-normal text-moss"> · {t.location}</span>}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Journal preview */}
      {latestPosts.length > 0 && (
        <section className="container-wide mt-24">
          <SectionHeading
            kicker="From the journal"
            title="Studio notes"
            cta={{ href: "/blog", label: "Read the journal" }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {latestPosts.map((post, i) => (
              <Reveal key={post.id} delay={i * 80}>
                <Link href={`/blog/${post.slug}`} className="group grid overflow-hidden rounded-xl2 border border-oat/40 bg-paper/70 shadow-soft sm:grid-cols-2">
                  <div className="aspect-[4/3] sm:aspect-auto">
                    <SmartImage image={post.coverImage} className="h-full w-full" imgClassName="group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center gap-2 p-6">
                    <h3 className="font-display text-xl text-evergreen">{post.title}</h3>
                    <p className="line-clamp-3 text-sm text-moss">{post.excerpt}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-forest">
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
