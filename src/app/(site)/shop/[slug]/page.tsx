"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Check, ArrowRight } from "lucide-react";
import { useContent } from "@/context/content-context";
import SmartImage from "@/components/smart-image";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { StatusBadge, StarRating, Kicker } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const { content, ready } = useContent();
  const params = useParams<{ slug: string }>();
  const product = content.products.find((p) => p.slug === params.slug);
  const [active, setActive] = useState(0);

  const related = useMemo(() => {
    if (!product) return [];
    return content.products
      .filter((p) => p.category === product.category && p.id !== product.id && p.status !== "archived")
      .slice(0, 4);
  }, [content.products, product]);

  const reviews = useMemo(
    () => content.testimonials.filter((t) => t.productSlug === product?.slug),
    [content.testimonials, product]
  );

  if (!ready) {
    return <div className="container-page py-24 text-center text-moss">Loading…</div>;
  }
  if (!product) return notFound();

  const images = product.images.length ? product.images : [];

  return (
    <div className="container-wide py-10">
      <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-moss hover:text-heading">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-xl3 border border-oat/40">
            <SmartImage image={images[active]} className="h-full w-full" priority />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActive(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl2 border-2 transition ${
                    i === active ? "border-evergreen" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <SmartImage image={img} className="h-full w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:py-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={product.status} />
            <span className="text-xs uppercase tracking-widest text-moss">
              {content.categories.find((c) => c.slug === product.category)?.name}
            </span>
          </div>
          <h1 className="mt-3 text-4xl">{product.name}</h1>
          {product.tagline && <p className="mt-2 text-lg text-moss">{product.tagline}</p>}
          <p className="mt-4 text-2xl font-semibold text-cedar">
            {formatPrice(product.price, product.priceNote)}
          </p>

          <div className="mt-6 thread-divider" />

          <p className="mt-6 leading-relaxed text-ink/80">{product.description}</p>
          {product.details && product.details.length > 0 && (
            <ul className="mt-4 space-y-2">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-ink/80">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-forest" /> {d}
                </li>
              ))}
            </ul>
          )}

          {/* CTAs — no checkout; route to inquiry/commission */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/custom?piece=${encodeURIComponent(product.name)}`} className="btn-primary">
              {product.status === "made-to-order" ? "Request this piece" : "Ask about this piece"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-secondary">Message Pim</Link>
          </div>
          <p className="mt-3 text-xs text-moss">
            No online checkout — reach out and Pim will arrange the details personally.
          </p>

          {/* Specs */}
          {product.specs && product.specs.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl2 border border-oat/40 bg-paper/70 p-5">
              {product.specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wide text-moss">{s.label}</dt>
                  <dd className="font-semibold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* Reviews for this product */}
      {reviews.length > 0 && (
        <section className="mt-20">
          <Kicker className="mb-3">Kind words</Kicker>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((t) => (
              <div key={t.id} className="card p-6">
                <StarRating value={t.rating ?? 5} />
                <p className="mt-3 font-display text-lg italic text-heading">“{t.quote}”</p>
                <p className="mt-3 text-sm font-semibold text-ink">{t.author}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl">You might also love</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
