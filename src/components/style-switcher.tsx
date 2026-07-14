"use client";

import { useState } from "react";
import { Palette, Sun, Moon, Type, Squircle, LayoutTemplate, PanelTop, X, RotateCcw, Wand2 } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { PALETTES, FONTS, RADII, HEROES, HEADERS } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function StyleSwitcher() {
  const { style, set, reset, ready } = useTheme();
  const [open, setOpen] = useState(false);
  if (!ready) return null;

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[80] grid h-14 w-14 place-items-center rounded-full bg-evergreen text-cream shadow-lift transition hover:scale-105"
        aria-label="Open style switcher"
      >
        {open ? <X className="h-6 w-6" /> : <Wand2 className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[80] max-h-[80vh] w-[min(92vw,360px)] overflow-y-auto rounded-xl3 border border-oat/50 bg-canvas p-5 shadow-lift no-scrollbar">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-forest" />
              <h3 className="font-display text-lg text-heading">Style studio</h3>
            </div>
            <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-semibold text-moss hover:text-heading">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
          <p className="mb-5 text-xs text-moss">
            A playground to dial in the look. Your choices are saved locally while we explore.
          </p>

          {/* Palette */}
          <Group icon={<Palette className="h-4 w-4" />} title="Color palette">
            <div className="grid grid-cols-1 gap-2">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => set("palette", p.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl2 border px-3 py-2 transition",
                    style.palette === p.id ? "border-forest bg-forest/10" : "border-oat/50 hover:border-forest/50"
                  )}
                >
                  <span className="text-sm font-semibold text-ink">{p.label}</span>
                  <span className="flex gap-1">
                    {p.swatches.map((c) => (
                      <span key={c} className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </Group>

          {/* Mode */}
          <Group icon={<Sun className="h-4 w-4" />} title="Theme mode">
            <div className="grid grid-cols-2 gap-2">
              <Segment active={style.mode === "light"} onClick={() => set("mode", "light")}>
                <Sun className="h-4 w-4" /> Light
              </Segment>
              <Segment active={style.mode === "dark"} onClick={() => set("mode", "dark")}>
                <Moon className="h-4 w-4" /> Dark
              </Segment>
            </div>
          </Group>

          {/* Typography */}
          <Group icon={<Type className="h-4 w-4" />} title="Typography">
            <div className="grid gap-2">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => set("font", f.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl2 border px-3 py-2 text-left transition",
                    style.font === f.id ? "border-forest bg-forest/10" : "border-oat/50 hover:border-forest/50"
                  )}
                >
                  <span className="text-sm font-semibold text-ink">{f.label}</span>
                  <span className="text-xs text-moss">{f.sample}</span>
                </button>
              ))}
            </div>
          </Group>

          {/* Radius */}
          <Group icon={<Squircle className="h-4 w-4" />} title="Corners">
            <Pills options={RADII} value={style.radius} onSelect={(v) => set("radius", v)} />
          </Group>

          {/* Hero */}
          <Group icon={<LayoutTemplate className="h-4 w-4" />} title="Hero layout">
            <Pills options={HEROES} value={style.hero} onSelect={(v) => set("hero", v)} />
          </Group>

          {/* Header */}
          <Group icon={<PanelTop className="h-4 w-4" />} title="Header style">
            <Pills options={HEADERS} value={style.header} onSelect={(v) => set("header", v)} />
          </Group>
        </div>
      )}
    </>
  );
}

function Group({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-moss">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function Segment({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl2 border px-3 py-2 text-sm font-semibold transition",
        active ? "border-forest bg-evergreen text-cream" : "border-oat/50 text-ink hover:border-forest/50"
      )}
    >
      {children}
    </button>
  );
}

function Pills<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { id: T; label: string }[];
  value: T;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-semibold transition",
            value === o.id ? "border-forest bg-forest/10 text-heading" : "border-oat/50 text-ink hover:border-forest/50"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
