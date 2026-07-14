import type { ContentData } from "./types";
import { seedContent, CONTENT_VERSION } from "./seed";

// -----------------------------------------------------------------------------
// Content persistence (localStorage).
//
// The structured content document is small (text + image pointers only), so it
// lives comfortably in localStorage. Images live in IndexedDB (see images.ts).
//
// This module is intentionally storage-agnostic at the edges: `loadContent` /
// `saveContent` are the only touch points, so swapping to a hosted backend
// later (Vercel Blob/KV, Supabase, etc.) means changing this file alone.
// -----------------------------------------------------------------------------

const STORAGE_KEY = "pims-wims:content";

export function cloneSeed(): ContentData {
  // Structured clone keeps the provider state independent from the module const.
  return JSON.parse(JSON.stringify(seedContent)) as ContentData;
}

export function loadContent(): ContentData {
  if (typeof window === "undefined") return cloneSeed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneSeed();
    const parsed = JSON.parse(raw) as ContentData;
    if (!parsed || typeof parsed !== "object") return cloneSeed();
    // Basic migration guard: if the stored doc predates the current shape,
    // merge new seed top-level keys in so the app never crashes on a missing
    // collection. Existing user data is preserved.
    if (parsed.version !== CONTENT_VERSION) {
      return { ...cloneSeed(), ...parsed, version: CONTENT_VERSION };
    }
    return parsed;
  } catch {
    return cloneSeed();
  }
}

export function saveContent(data: ContentData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    // Most likely a quota error — surface it so the UI can warn the artist.
    console.error("Failed to save content to localStorage", err);
    throw err;
  }
}

export function resetContent(): ContentData {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return cloneSeed();
}

export function hasLocalEdits(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) !== null;
}
