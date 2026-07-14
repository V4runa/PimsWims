"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { saveImageFile, deleteImage, resolveImageSrc } from "@/lib/images";
import type { ImageRef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  value: ImageRef[];
  onChange: (images: ImageRef[]) => void;
  multiple?: boolean;
  max?: number;
  label?: string;
  className?: string;
}

/** Client-side image intake: compresses to WebP and stores in IndexedDB. */
export default function ImageUploader({
  value,
  onChange,
  multiple = true,
  max = 8,
  label = "Add images",
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const incoming = Array.from(files).slice(0, max - value.length);
      const saved: ImageRef[] = [];
      for (const file of incoming) {
        if (!file.type.startsWith("image/")) continue;
        saved.push(await saveImageFile(file, file.name));
      }
      onChange(multiple ? [...value, ...saved] : saved.slice(0, 1));
    } catch (e) {
      console.error(e);
      setError("Something went wrong compressing that image. Try a different file.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeAt(idx: number) {
    const img = value[idx];
    if (img?.src) await deleteImage(img.src);
    onChange(value.filter((_, i) => i !== idx));
  }

  const canAdd = value.length < max;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div key={img.id} className="relative h-24 w-24 overflow-hidden rounded-xl2 border border-oat/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <PreviewThumb src={img.src} alt={img.alt} />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-pine/80 text-cream hover:bg-pine"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className={cn(
              "grid h-24 w-24 place-items-center rounded-xl2 border-2 border-dashed border-oat text-moss transition hover:border-forest hover:text-forest",
              busy && "opacity-60"
            )}
          >
            {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <span className="flex flex-col items-center gap-1 text-xs">
                <ImagePlus className="h-6 w-6" /> {label}
              </span>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-sm text-rustwood">{error}</p>}
      <p className="mt-2 text-xs text-moss">
        Images are compressed automatically. {value.length}/{max} added.
      </p>
    </div>
  );
}

function PreviewThumb({ src, alt }: { src: string; alt: string }) {
  const [resolved, setResolved] = useState<string | null>(
    src.startsWith("idb://") ? null : src
  );
  useEffect(() => {
    let active = true;
    resolveImageSrc(src).then((r) => active && setResolved(r));
    return () => {
      active = false;
    };
  }, [src]);
  if (!resolved) return <span className="block h-full w-full bg-linen" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={resolved} alt={alt} className="h-full w-full object-cover" />;
}
