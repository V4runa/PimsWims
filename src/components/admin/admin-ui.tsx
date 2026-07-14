"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl text-heading">{title}</h1>
        {description && <p className="mt-1 text-moss">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-pine/60 p-4 backdrop-blur-sm sm:p-8" onClick={onClose}>
      <div
        className={cn("w-full rounded-xl3 bg-canvas shadow-lift", wide ? "max-w-3xl" : "max-w-xl")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-oat/50 px-6 py-4">
          <h2 className="font-display text-xl text-heading">{title}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-moss hover:bg-oat/30" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl3 border-2 border-dashed border-oat/60 bg-paper/60 py-16 text-center">
      <p className="font-display text-lg text-heading">{title}</p>
      {hint && <p className="mt-1 text-sm text-moss">{hint}</p>}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-moss">{hint}</span>}
    </label>
  );
}
