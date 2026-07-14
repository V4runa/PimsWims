"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/context/content-context";
import { useTheme } from "@/context/theme-context";
import SmartImage from "@/components/smart-image";
import { Kicker } from "@/components/ui";

export default function Hero() {
  const { content } = useContent();
  const { style } = useTheme();
  const { settings } = content;
  const variant = style.hero;

  const headline = settings.heroHeadline;
  const sub = settings.heroSubcopy;
  const tagline = settings.tagline;

  const overlayCtas = (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/shop" className="btn-gold">
        Explore the shop <ArrowRight className="h-4 w-4" />
      </Link>
      <Link href="/custom" className="btn-secondary border-cream/40 text-cream hover:bg-cream/10">
        Commission a piece
      </Link>
    </div>
  );

  const lightCtas = (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/shop" className="btn-primary">
        Explore the shop <ArrowRight className="h-4 w-4" />
      </Link>
      <Link href="/custom" className="btn-secondary">Commission a piece</Link>
    </div>
  );

  if (variant === "split") {
    return (
      <section className="container-wide pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="animate-fade-up py-6">
            <Kicker className="mb-4">{tagline}</Kicker>
            <h1 className="text-4xl leading-[1.05] sm:text-6xl">{headline}</h1>
            <p className="mt-5 max-w-xl text-lg text-moss">{sub}</p>
            {lightCtas}
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl3 border border-oat/40 shadow-lift lg:aspect-[5/6]">
            <SmartImage image={settings.heroImage} className="h-full w-full" priority />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <SmartImage image={settings.heroImage} className="h-full w-full" imgClassName="object-cover" priority />
          <div className="absolute inset-0 bg-pine/70" />
        </div>
        <div className="container-page flex min-h-[80vh] flex-col items-center justify-center py-28 text-center">
          <div className="max-w-3xl animate-fade-up">
            <Kicker className="mb-4 justify-center text-oatgold">{tagline}</Kicker>
            <h1 className="text-5xl leading-[1.05] text-cream sm:text-7xl">{headline}</h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-cream/85">{sub}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
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
    );
  }

  if (variant === "editorial") {
    return (
      <section className="container-wide pt-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="animate-fade-up lg:col-span-7">
            <Kicker className="mb-4">{tagline}</Kicker>
            <h1 className="text-5xl leading-[0.98] sm:text-7xl lg:text-8xl">{headline}</h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-lg text-moss">{sub}</p>
            {lightCtas}
          </div>
        </div>
        <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-xl3 border border-oat/40 shadow-lift">
          <SmartImage image={settings.heroImage} className="h-full w-full" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-pine/40 to-transparent" />
        </div>
      </section>
    );
  }

  // immersive (default)
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SmartImage image={settings.heroImage} className="h-full w-full" imgClassName="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-pine/85 via-pine/45 to-pine/25" />
      </div>
      <div className="container-wide flex min-h-[82vh] flex-col justify-end pb-16 pt-28 sm:pb-24">
        <div className="max-w-2xl animate-fade-up">
          <Kicker className="mb-4 text-oatgold">{tagline}</Kicker>
          <h1 className="text-4xl leading-[1.05] text-cream sm:text-6xl">{headline}</h1>
          <p className="mt-5 max-w-xl text-lg text-cream/85">{sub}</p>
          {overlayCtas}
        </div>
      </div>
    </section>
  );
}
