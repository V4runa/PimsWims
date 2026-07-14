import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/lib/types";

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("kicker", className)}>{children}</span>;
}

export function StarRating({ value = 5, className }: { value?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-oatgold", className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4"
          fill={i < value ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

const STATUS_LABELS: Record<ProductStatus, { label: string; cls: string }> = {
  available: { label: "Ready to ship", cls: "bg-fern/15 text-fern" },
  "made-to-order": { label: "Made to order", cls: "bg-oatgold/30 text-cedar" },
  sold: { label: "Sold", cls: "bg-ink/10 text-ink/70" },
  archived: { label: "Archived", cls: "bg-ink/10 text-ink/50" },
};

export function StatusBadge({ status, className }: { status: ProductStatus; className?: string }) {
  const s = STATUS_LABELS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        s.cls,
        className
      )}
    >
      {s.label}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  cta,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  cta?: { href: string; label: string };
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        cta && "sm:flex-row sm:items-end sm:justify-between"
      )}
    >
      <div className={cn(align === "center" && "max-w-2xl")}>
        {kicker && <Kicker className="mb-3">{kicker}</Kicker>}
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 max-w-2xl text-moss">{subtitle}</p>}
      </div>
      {cta && (
        <Link href={cta.href} className="btn-secondary shrink-0">
          {cta.label}
        </Link>
      )}
    </div>
  );
}
