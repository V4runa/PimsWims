// -----------------------------------------------------------------------------
// Content model for Pim's Wims.
//
// Everything the artist manages through the admin CMS is described here. The
// site is "local-first": a set of seed content ships in the repo (so public
// visitors always see something), and the admin's edits are layered on top and
// persisted in the browser. See `lib/store.ts` for how that layering works.
// -----------------------------------------------------------------------------

/**
 * An image reference. Content images are compressed client-side and stored in
 * IndexedDB; `src` then holds an `idb://<id>` pointer that the <SmartImage>
 * component resolves to a data URL at render time. Seed/editorial images can
 * also use a plain http(s) URL or a path under /public.
 */
export interface ImageRef {
  id: string;
  src: string;
  alt: string;
  /** Optional focal hints / captions used by galleries. */
  caption?: string;
  width?: number;
  height?: number;
}

export type ProductStatus = "available" | "made-to-order" | "sold" | "archived";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // references Category.slug
  /** Short one-liner used on cards. */
  tagline?: string;
  description: string;
  /** Rich details rendered as paragraphs. */
  details?: string[];
  price?: number; // optional — no checkout, shown for reference only
  priceNote?: string; // e.g. "starting at" / "DM to purchase"
  status: ProductStatus;
  images: ImageRef[];
  /** Free-form spec pairs, e.g. { Yarn: "Merino wool", Size: "Adult M" }. */
  specs?: { label: string; value: string }[];
  materials?: string[];
  tags?: string[];
  featured?: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: ImageRef;
  order?: number;
}

export interface GalleryItem {
  id: string;
  image: ImageRef;
  title?: string;
  /** Optional link to a related product slug. */
  productSlug?: string;
  tags?: string[];
  order?: number;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location?: string;
  quote: string;
  rating?: number; // 1..5
  image?: ImageRef;
  productSlug?: string;
  featured?: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown-ish body; rendered as paragraphs + headings. */
  body: string;
  coverImage?: ImageRef;
  gallery?: ImageRef[];
  tags?: string[];
  author?: string;
  published: boolean;
  publishedAt: string; // ISO
  updatedAt: string;
}

// --- Inbound submissions (from public forms) --------------------------------

export type SubmissionStatus = "new" | "read" | "replied" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string; // e.g. "Sweater", "Blanket", "Amigurumi"
  description: string;
  budget?: string;
  timeline?: string;
  colors?: string;
  size?: string;
  /** Reference images uploaded by the customer (compressed, IndexedDB). */
  references?: ImageRef[];
  status: SubmissionStatus;
  createdAt: string;
}

// --- Site-wide settings -----------------------------------------------------

export interface SiteSettings {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroImage?: ImageRef;
  logo?: ImageRef;
  about: {
    headline: string;
    story: string; // multi-paragraph
    portrait?: ImageRef;
    highlights?: { label: string; value: string }[];
  };
  contact: {
    email: string;
    phone?: string;
    location?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    etsy?: string;
  };
  faqs?: { question: string; answer: string }[];
  /** Announcement bar text; empty string hides it. */
  announcement?: string;
}

// --- The full content document ----------------------------------------------

export interface ContentData {
  version: number;
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  posts: BlogPost[];
  contactMessages: ContactMessage[];
  quoteRequests: QuoteRequest[];
}
