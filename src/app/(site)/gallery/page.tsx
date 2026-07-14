"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { useContent } from "@/context/content-context";
import SmartImage from "@/components/smart-image";
import Reveal from "@/components/reveal";
import { Kicker } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/lib/types";

export default function GalleryPage() {
  const { content } = useContent();
  const [tag, setTag] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    content.gallery.forEach((g) => g.tags?.forEach((t) => set.add(t)));
    return ["all", ...Array.from(set)];
  }, [content.gallery]);

  const items = useMemo(() => {
    const sorted = [...content.gallery].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return tag === "all" ? sorted : sorted.filter((g) => g.tags?.includes(tag));
  }, [content.gallery, tag]);

  return (
    <div className="container-wide py-14">
      <header className="max-w-2xl">
        <Kicker className="mb-3">Gallery</Kicker>
        <h1 className="text-4xl sm:text-5xl">Finished pieces, out in the world</h1>
        <p className="mt-3 text-moss">
          A growing collection of makes — some for sale, some long gone to loving homes.
        </p>
      </header>

      {tags.length > 1 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-colors",
                tag === t
                  ? "border-evergreen bg-evergreen text-cream"
                  : "border-oat/60 bg-paper text-ink/70 hover:border-forest"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {items.map((g, i) => (
          <Reveal key={g.id} delay={(i % 4) * 50} className="break-inside-avoid">
            <button onClick={() => setLightbox(g)} className="group block w-full overflow-hidden rounded-xl2">
              <SmartImage image={g.image} className="w-full" imgClassName="group-hover:scale-105 transition-transform duration-500" />
            </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-pine/90 p-4 backdrop-blur"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-h-[85vh] max-w-3xl overflow-hidden rounded-xl3" onClick={(e) => e.stopPropagation()}>
            <SmartImage image={lightbox.image} className="max-h-[70vh] w-full" imgClassName="object-contain" />
            {(lightbox.title || lightbox.productSlug) && (
              <div className="flex items-center justify-between gap-4 bg-canvas p-4">
                <p className="font-display text-lg text-heading">{lightbox.title}</p>
                {lightbox.productSlug && (
                  <Link href={`/shop/${lightbox.productSlug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-heading">
                    View piece <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
