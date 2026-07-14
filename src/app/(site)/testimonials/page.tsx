"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/context/content-context";
import SmartImage from "@/components/smart-image";
import Reveal from "@/components/reveal";
import { Kicker, StarRating } from "@/components/ui";

export default function TestimonialsPage() {
  const { content } = useContent();
  const testimonials = content.testimonials;

  return (
    <div className="container-wide py-14">
      <header className="max-w-2xl">
        <Kicker className="mb-3">Kind words</Kicker>
        <h1 className="text-4xl sm:text-5xl">What people are saying</h1>
        <p className="mt-3 text-moss">
          Nothing means more than a happy maker. Here&apos;s a little love from folks who&apos;ve
          welcomed a Pim&apos;s Wims piece into their lives.
        </p>
      </header>

      {testimonials.length === 0 ? (
        <p className="mt-16 text-center text-moss">No testimonials yet.</p>
      ) : (
        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 70} className="break-inside-avoid">
              <figure className="card p-6">
                <StarRating value={t.rating ?? 5} />
                <blockquote className="mt-4 font-display text-lg italic text-heading">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  {t.image && (
                    <span className="h-11 w-11 overflow-hidden rounded-full">
                      <SmartImage image={t.image} className="h-full w-full" />
                    </span>
                  )}
                  <span>
                    <span className="block text-sm font-semibold text-ink">{t.author}</span>
                    {t.location && <span className="block text-xs text-moss">{t.location}</span>}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <Link href="/custom" className="btn-primary">
          Join them — commission a piece <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
