import Link from "next/link";
import SmartImage from "./smart-image";
import { StatusBadge } from "./ui";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl2 border border-oat/40 bg-paper/70 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <SmartImage
          image={product.images[0]}
          className="h-full w-full"
          imgClassName="group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={product.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-lg text-evergreen">{product.name}</h3>
        {product.tagline && (
          <p className="line-clamp-2 text-sm text-moss">{product.tagline}</p>
        )}
        <div className="mt-auto pt-3 text-sm font-semibold text-cedar">
          {formatPrice(product.price, product.priceNote)}
        </div>
      </div>
    </Link>
  );
}
