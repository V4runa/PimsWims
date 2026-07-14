"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  BlogPost,
  Category,
  ContactMessage,
  ContentData,
  GalleryItem,
  Product,
  QuoteRequest,
  SiteSettings,
  SubmissionStatus,
  Testimonial,
} from "@/lib/types";
import { loadContent, saveContent, resetContent, cloneSeed } from "@/lib/store";
import { uid } from "@/lib/images";

type Identifiable = { id: string };

function upsert<T extends Identifiable>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx === -1) return [...list, item];
  const copy = [...list];
  copy[idx] = item;
  return copy;
}

function remove<T extends Identifiable>(list: T[], id: string): T[] {
  return list.filter((x) => x.id !== id);
}

interface ContentContextValue {
  content: ContentData;
  ready: boolean;
  saveError: string | null;

  // settings
  updateSettings: (patch: Partial<SiteSettings>) => void;

  // catalog
  upsertProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  upsertCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  // media & social proof
  upsertGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  upsertTestimonial: (t: Testimonial) => void;
  deleteTestimonial: (id: string) => void;

  // blog
  upsertPost: (post: BlogPost) => void;
  deletePost: (id: string) => void;

  // inbound submissions
  addContactMessage: (msg: Omit<ContactMessage, "id" | "status" | "createdAt">) => void;
  addQuoteRequest: (q: Omit<QuoteRequest, "id" | "status" | "createdAt">) => void;
  setSubmissionStatus: (
    kind: "contact" | "quote",
    id: string,
    status: SubmissionStatus
  ) => void;
  deleteSubmission: (kind: "contact" | "quote", id: string) => void;

  // whole-document ops
  replaceAll: (data: ContentData) => void;
  reset: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  // Initial state must be deterministic to match SSR output; real (possibly
  // edited) content is loaded from storage after mount to avoid hydration
  // mismatches.
  const [content, setContent] = useState<ContentData>(() => cloneSeed());
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const skipPersist = useRef(true);

  useEffect(() => {
    setContent(loadContent());
    setReady(true);
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!ready) return;
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    try {
      saveContent(content);
      setSaveError(null);
    } catch {
      setSaveError(
        "Your browser storage is full. Try removing some images or exporting a backup."
      );
    }
  }, [content, ready]);

  const mutate = useCallback((fn: (prev: ContentData) => ContentData) => {
    setContent((prev) => fn(prev));
  }, []);

  const value = useMemo<ContentContextValue>(() => {
    const nowIso = () => new Date().toISOString();
    return {
      content,
      ready,
      saveError,

      updateSettings: (patch) =>
        mutate((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } })),

      upsertProduct: (product) =>
        mutate((prev) => ({ ...prev, products: upsert(prev.products, product) })),
      deleteProduct: (id) =>
        mutate((prev) => ({ ...prev, products: remove(prev.products, id) })),
      upsertCategory: (category) =>
        mutate((prev) => ({ ...prev, categories: upsert(prev.categories, category) })),
      deleteCategory: (id) =>
        mutate((prev) => ({ ...prev, categories: remove(prev.categories, id) })),

      upsertGalleryItem: (item) =>
        mutate((prev) => ({ ...prev, gallery: upsert(prev.gallery, item) })),
      deleteGalleryItem: (id) =>
        mutate((prev) => ({ ...prev, gallery: remove(prev.gallery, id) })),
      upsertTestimonial: (t) =>
        mutate((prev) => ({ ...prev, testimonials: upsert(prev.testimonials, t) })),
      deleteTestimonial: (id) =>
        mutate((prev) => ({ ...prev, testimonials: remove(prev.testimonials, id) })),

      upsertPost: (post) =>
        mutate((prev) => ({ ...prev, posts: upsert(prev.posts, post) })),
      deletePost: (id) => mutate((prev) => ({ ...prev, posts: remove(prev.posts, id) })),

      addContactMessage: (msg) =>
        mutate((prev) => ({
          ...prev,
          contactMessages: [
            { ...msg, id: uid("msg"), status: "new", createdAt: nowIso() },
            ...prev.contactMessages,
          ],
        })),
      addQuoteRequest: (q) =>
        mutate((prev) => ({
          ...prev,
          quoteRequests: [
            { ...q, id: uid("quote"), status: "new", createdAt: nowIso() },
            ...prev.quoteRequests,
          ],
        })),
      setSubmissionStatus: (kind, id, status) =>
        mutate((prev) =>
          kind === "contact"
            ? {
                ...prev,
                contactMessages: prev.contactMessages.map((m) =>
                  m.id === id ? { ...m, status } : m
                ),
              }
            : {
                ...prev,
                quoteRequests: prev.quoteRequests.map((q) =>
                  q.id === id ? { ...q, status } : q
                ),
              }
        ),
      deleteSubmission: (kind, id) =>
        mutate((prev) =>
          kind === "contact"
            ? { ...prev, contactMessages: remove(prev.contactMessages, id) }
            : { ...prev, quoteRequests: remove(prev.quoteRequests, id) }
        ),

      replaceAll: (data) => setContent(data),
      reset: () => setContent(resetContent()),
    };
  }, [content, ready, saveError, mutate]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within a ContentProvider");
  return ctx;
}
