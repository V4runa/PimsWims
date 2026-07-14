"use client";

import { useEffect, useState } from "react";
import { resolveImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/lib/types";

interface SmartImageProps {
  image?: ImageRef | null;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  /** Fallback SVG shown when no image is set. */
  fallback?: string;
  priority?: boolean;
}

/**
 * Renders any image regardless of where it lives: an `idb://` pointer (resolved
 * from IndexedDB), a data URL, a /public path, or a remote URL. Uses a plain
 * <img> so browser-stored data URLs work without Next's image optimizer.
 */
export default function SmartImage({
  image,
  src,
  alt,
  className,
  imgClassName,
  fallback = "/seed/swatch-oat.svg",
  priority,
}: SmartImageProps) {
  const rawSrc = image?.src ?? src ?? "";
  const [resolved, setResolved] = useState<string | null>(
    rawSrc && !rawSrc.startsWith("idb://") ? rawSrc : null
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    if (!rawSrc) {
      setResolved(fallback);
      return;
    }
    resolveImageSrc(rawSrc).then((r) => {
      if (active) setResolved(r ?? fallback);
    });
    return () => {
      active = false;
    };
  }, [rawSrc, fallback]);

  return (
    <span className={cn("block overflow-hidden bg-linen", className)}>
      {resolved && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={image?.alt ?? alt ?? ""}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      )}
    </span>
  );
}
