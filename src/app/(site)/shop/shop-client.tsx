"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useContent } from "@/context/content-context";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { Kicker } from "@/components/ui";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export default function ShopClient() {
  const { content } = useContent();
  const params = useSearchParams();
  const initialCategory = params.get("category") ?? "all";

  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const products = useMemo(() => {
    let list = content.products.filter((p) => p.status !== "archived");
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
        break;
      case "newest":
        list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [content.products, category, query, sort]);

  const categories = [{ slug: "all", name: "All pieces" }, ...content.categories];

  return (
    <div className="container-wide py-14">
      <header className="max-w-2xl">
        <Kicker className="mb-3">The shop</Kicker>
        <h1 className="text-4xl sm:text-5xl">Handmade, one skein at a time</h1>
        <p className="mt-3 text-moss">
          Browse ready-to-ship pieces and made-to-order favorites. Don&apos;t see quite what you want?
          A custom request is always an option.
        </p>
      </header>

      {/* Controls */}
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                category === c.slug
                  ? "border-evergreen bg-evergreen text-cream"
                  : "border-oat/60 bg-paper text-ink/70 hover:border-forest hover:text-heading"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-moss" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="field pl-9 py-2"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="field w-auto py-2"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <p className="mt-16 text-center text-moss">No pieces match just yet — try another filter.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
