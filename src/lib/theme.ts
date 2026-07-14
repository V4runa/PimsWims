// Style-switcher options. Colors here are only for the switcher's preview
// swatches; the real palettes live as CSS variables in globals.css.

export type PaletteId = "evergreen" | "sage" | "rustwood" | "wine" | "moonlit";
export type ModeId = "light" | "dark";
export type FontId = "storybook" | "classic" | "modern";
export type RadiusId = "soft" | "sharp" | "round";
export type HeroId = "immersive" | "split" | "centered" | "editorial";
export type HeaderId = "classic" | "centered" | "minimal";

export interface StyleState {
  palette: PaletteId;
  mode: ModeId;
  font: FontId;
  radius: RadiusId;
  hero: HeroId;
  header: HeaderId;
}

export const DEFAULT_STYLE: StyleState = {
  palette: "evergreen",
  mode: "light",
  font: "storybook",
  radius: "soft",
  hero: "immersive",
  header: "classic",
};

export const PALETTES: { id: PaletteId; label: string; swatches: string[] }[] = [
  { id: "evergreen", label: "Evergreen & Oat", swatches: ["#1F3B2C", "#6D6A55", "#CBBF9A", "#F4EFE4"] },
  { id: "sage", label: "Sage & Cream", swatches: ["#4A5C3A", "#97A97C", "#C7C7AA", "#F5F2E9"] },
  { id: "rustwood", label: "Rustwood Autumn", swatches: ["#515932", "#F2C48D", "#803A18", "#593825"] },
  { id: "wine", label: "Forest & Wine", swatches: ["#3D4E3A", "#743C3F", "#B09474", "#2C2826"] },
  { id: "moonlit", label: "Moonlit Grove", swatches: ["#18403C", "#5A7470", "#A8BEBA", "#ECF0EE"] },
];

export const FONTS: { id: FontId; label: string; sample: string }[] = [
  { id: "storybook", label: "Storybook", sample: "Fraunces · Nunito Sans" },
  { id: "classic", label: "Classic", sample: "Cormorant · Work Sans" },
  { id: "modern", label: "Modern", sample: "DM Serif · Inter" },
];

export const RADII: { id: RadiusId; label: string }[] = [
  { id: "soft", label: "Soft" },
  { id: "sharp", label: "Sharp" },
  { id: "round", label: "Round" },
];

export const HEROES: { id: HeroId; label: string }[] = [
  { id: "immersive", label: "Immersive" },
  { id: "split", label: "Split" },
  { id: "centered", label: "Centered" },
  { id: "editorial", label: "Editorial" },
];

export const HEADERS: { id: HeaderId; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "centered", label: "Centered" },
  { id: "minimal", label: "Minimal" },
];

const STORAGE_KEY = "pims-wims:style";

export function loadStyle(): StyleState {
  if (typeof window === "undefined") return DEFAULT_STYLE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STYLE;
    return { ...DEFAULT_STYLE, ...(JSON.parse(raw) as Partial<StyleState>) };
  } catch {
    return DEFAULT_STYLE;
  }
}

export function saveStyle(style: StyleState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(style));
  } catch {
    /* ignore */
  }
}

/** Reflect the style onto <html> data-* attributes for CSS to consume. */
export function applyStyle(style: StyleState) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.dataset.theme = style.palette;
  el.dataset.mode = style.mode;
  el.dataset.font = style.font;
  el.dataset.radius = style.radius;
  el.style.colorScheme = style.mode;
}
