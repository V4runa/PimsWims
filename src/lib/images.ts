// -----------------------------------------------------------------------------
// Image pipeline (client-only).
//
// Because there is no database, uploaded images are compressed in the browser
// and stored as data URLs in IndexedDB. Structured content (the JSON document)
// keeps only a lightweight `idb://<id>` pointer, which <SmartImage> resolves to
// the actual data URL at render time. This keeps localStorage tiny and well
// under its ~5MB ceiling, while IndexedDB comfortably holds the heavier images.
// -----------------------------------------------------------------------------

import { openDB, type IDBPDatabase } from "idb";
import imageCompression from "browser-image-compression";
import type { ImageRef } from "./types";

const DB_NAME = "pims-wims";
const DB_VERSION = 1;
const IMAGE_STORE = "images";

export const IDB_PREFIX = "idb://";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser.");
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(IMAGE_STORE)) {
          db.createObjectStore(IMAGE_STORE);
        }
      },
    });
  }
  return dbPromise;
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}

export interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

/**
 * Compress a user-selected image and persist it in IndexedDB.
 * Returns an ImageRef whose `src` is an `idb://` pointer.
 */
export async function saveImageFile(
  file: File,
  alt = "",
  opts: CompressOptions = {}
): Promise<ImageRef> {
  const compressed = await imageCompression(file, {
    maxSizeMB: opts.maxSizeMB ?? 0.4,
    maxWidthOrHeight: opts.maxWidthOrHeight ?? 1600,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.82,
  });

  const dataUrl = await fileToDataUrl(compressed);
  const { width, height } = await getDimensions(dataUrl);
  const id = uid("img");

  const db = await getDB();
  await db.put(IMAGE_STORE, dataUrl, id);

  return {
    id,
    src: `${IDB_PREFIX}${id}`,
    alt: alt || file.name.replace(/\.[^.]+$/, ""),
    width,
    height,
  };
}

/** Resolve any image source to something renderable. */
export async function resolveImageSrc(src: string): Promise<string | null> {
  if (!src) return null;
  if (!src.startsWith(IDB_PREFIX)) return src;
  const id = src.slice(IDB_PREFIX.length);
  try {
    const db = await getDB();
    const value = (await db.get(IMAGE_STORE, id)) as string | undefined;
    return value ?? null;
  } catch {
    return null;
  }
}

export async function deleteImage(src: string): Promise<void> {
  if (!src?.startsWith(IDB_PREFIX)) return;
  const id = src.slice(IDB_PREFIX.length);
  try {
    const db = await getDB();
    await db.delete(IMAGE_STORE, id);
  } catch {
    /* ignore */
  }
}

/** Export every stored image as a plain map for backup / migration. */
export async function exportAllImages(): Promise<Record<string, string>> {
  const db = await getDB();
  const keys = (await db.getAllKeys(IMAGE_STORE)) as string[];
  const values = (await db.getAll(IMAGE_STORE)) as string[];
  const map: Record<string, string> = {};
  keys.forEach((k, i) => {
    map[k] = values[i];
  });
  return map;
}

/** Restore images from an exported map (used by admin import). */
export async function importImages(map: Record<string, string>): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(IMAGE_STORE, "readwrite");
  await Promise.all(
    Object.entries(map).map(([key, value]) => tx.store.put(value, key))
  );
  await tx.done;
}
