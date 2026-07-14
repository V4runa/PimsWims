"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/context/content-context";
import SmartImage from "@/components/smart-image";
import Prose from "@/components/prose";
import Reveal from "@/components/reveal";
import { Kicker, SectionHeading } from "@/components/ui";

export default function AboutPage() {
  const { content } = useContent();
  const { about, faqs } = content.settings;

  return (
    <div className="py-14">
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <Kicker className="mb-3">About</Kicker>
          <h1 className="text-4xl sm:text-5xl">{about.headline}</h1>
          <div className="mt-6">
            <Prose text={about.story} />
          </div>
          {about.highlights && about.highlights.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-8">
              {about.highlights.map((h) => (
                <div key={h.label}>
                  <p className="font-display text-4xl text-forest">{h.value}</p>
                  <p className="text-sm uppercase tracking-wide text-moss">{h.label}</p>
                </div>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={120}>
          <div className="aspect-[4/5] overflow-hidden rounded-xl3 border border-oat/40 shadow-lift">
            <SmartImage image={about.portrait} className="h-full w-full" priority />
          </div>
        </Reveal>
      </div>

      {faqs && faqs.length > 0 && (
        <section className="container-page mt-24 max-w-3xl">
          <SectionHeading kicker="Good to know" title="Frequently asked" align="center" />
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-xl2 border border-oat/50 bg-paper/70 p-5 open:shadow-soft">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg text-heading">
                  {f.question}
                  <span className="ml-4 text-2xl text-moss transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-ink/80">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="container-wide mt-24">
        <div className="rounded-xl3 bg-forest px-6 py-14 text-center text-cream sm:py-20">
          <h2 className="text-3xl text-cream sm:text-4xl">Let&apos;s make something together</h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/85">
            Every piece starts with a conversation. Tell me what you&apos;re dreaming of.
          </p>
          <Link href="/custom" className="btn-gold mt-8">
            Start a custom request <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
