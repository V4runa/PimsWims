import type { ContentData } from "./types";

// -----------------------------------------------------------------------------
// Seed content — the default site everyone sees before/without any admin edits.
// The artist replaces this over time through the CMS. Images point at on-brand
// SVG placeholders under /public/seed so nothing is ever broken out of the box.
// -----------------------------------------------------------------------------

const now = "2026-01-01T00:00:00.000Z";

export const CONTENT_VERSION = 1;

export const seedContent: ContentData = {
  version: CONTENT_VERSION,
  settings: {
    brandName: "Pim's Wims",
    tagline: "Handmade knits & crochet, spun with a little woodland magic.",
    heroHeadline: "Cozy things, made slow by hand.",
    heroSubcopy:
      "One-of-a-kind knitwear and crochet pieces inspired by mossy forests, misty mornings, and the quiet magic of the wild. Each stitch is worked by Pim herself.",
    heroImage: { id: "seed-hero", src: "/seed/hero.svg", alt: "Enchanted forest at dusk" },
    about: {
      headline: "Made by Pim, one loop at a time",
      story:
        "Hi, I'm Pim. I learned to knit at my grandmother's kitchen table and never really stopped. What began as a way to keep my hands busy on long walks through the woods turned into a little studio full of yarn, wildflowers, and half-finished dreams.\n\nEverything I make is worked by hand in small batches, using natural fibers I love to touch. I'm drawn to the colors of the forest floor — deep evergreens, soft oat, warm rustwood — and I try to fold a bit of that calm into every piece.\n\nWhether it's a chunky beanie for a frosty morning or a custom sweater for someone you love, I'd be honored to make something just for you.",
      portrait: { id: "seed-portrait", src: "/seed/portrait.svg", alt: "Portrait of Pim, the maker" },
      highlights: [
        { label: "Years making", value: "9+" },
        { label: "Pieces handmade", value: "600+" },
        { label: "Natural fibers", value: "100%" },
      ],
    },
    contact: {
      email: "hello@pimswims.com",
      location: "Pacific Northwest, USA",
      instagram: "https://instagram.com/",
      tiktok: "https://tiktok.com/",
      youtube: "https://youtube.com/",
    },
    faqs: [
      {
        question: "Do you sell finished pieces or just patterns?",
        answer:
          "Both! Many pieces in the catalog are ready-made and one-of-a-kind. Others are made to order in your size and colors. Look for the badge on each product.",
      },
      {
        question: "How does a custom order work?",
        answer:
          "Head to the 'Make Me Something' page and tell me about your dream piece. I'll reply within a few days with ideas, timing, and a price. No commitment until we're both excited.",
      },
      {
        question: "What yarns do you use?",
        answer:
          "I favor natural fibers — merino wool, cotton, alpaca, and the occasional lovingly-sourced blend. If you have sensitivities, just let me know and we'll find the right fiber.",
      },
      {
        question: "How do I care for my piece?",
        answer:
          "Most pieces prefer a gentle hand-wash in cool water and a flat dry. Each order ships with a little care card specific to its fiber.",
      },
    ],
    announcement: "Custom holiday orders are open — reserve your spot on the 'Make Me Something' page.",
  },
  categories: [
    { id: "cat-tops", slug: "tops", name: "Tops", description: "Breezy crochet tops and cozy knit sweaters.", order: 1, image: { id: "c1", src: "/seed/swatch-sage.svg", alt: "Tops" } },
    { id: "cat-hats", slug: "hats", name: "Hats & Beanies", description: "Chunky beanies and bucket hats for every season.", order: 2, image: { id: "c2", src: "/seed/swatch-rust.svg", alt: "Hats" } },
    { id: "cat-winter", slug: "winter-wear", name: "Winter Wear", description: "Scarves, cowls, and ear warmers for frosty mornings.", order: 3, image: { id: "c3", src: "/seed/swatch-forest.svg", alt: "Winter wear" } },
    { id: "cat-accessories", slug: "accessories", name: "Accessories", description: "Bags, bandanas, and little handmade extras.", order: 4, image: { id: "c4", src: "/seed/swatch-oat.svg", alt: "Accessories" } },
  ],
  products: [
    {
      id: "p-moss-beanie",
      slug: "mossy-hollow-beanie",
      name: "Mossy Hollow Beanie",
      category: "hats",
      tagline: "A chunky ribbed beanie in forest green merino.",
      description:
        "Worked in a squishy chunky rib, the Mossy Hollow Beanie is the hat you'll reach for every cold morning. Naturally stretchy, warm, and soft enough to wear all day.",
      details: [
        "Hand-knit in 100% merino wool with a deep folded brim.",
        "Naturally stretchy rib fits most adult heads.",
        "Available in evergreen, oat, and rustwood.",
      ],
      price: 42,
      priceNote: "each",
      status: "available",
      images: [
        { id: "pi1", src: "/seed/swatch-forest.svg", alt: "Mossy Hollow Beanie in evergreen" },
        { id: "pi1b", src: "/seed/swatch-sage.svg", alt: "Beanie detail" },
      ],
      specs: [
        { label: "Fiber", value: "100% merino wool" },
        { label: "Fit", value: "Adult, one size" },
        { label: "Care", value: "Hand wash, dry flat" },
      ],
      materials: ["Merino wool"],
      tags: ["beanie", "winter", "bestseller"],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "p-fern-top",
      slug: "fernlight-summer-top",
      name: "Fernlight Summer Top",
      category: "tops",
      tagline: "An airy crochet top with a delicate leaf lace.",
      description:
        "Light as a breeze, the Fernlight top is crocheted in breathable cotton with an open leaf-lace yoke. Perfect layered over a slip on warm days.",
      details: [
        "Crocheted in soft mercerized cotton.",
        "Made to order in sizes XS–XL.",
        "Choose your colorway at checkout via custom request.",
      ],
      price: 78,
      priceNote: "starting at",
      status: "made-to-order",
      images: [
        { id: "pi2", src: "/seed/swatch-sage.svg", alt: "Fernlight Summer Top in sage" },
      ],
      specs: [
        { label: "Fiber", value: "Mercerized cotton" },
        { label: "Sizes", value: "XS – XL" },
        { label: "Lead time", value: "2–3 weeks" },
      ],
      materials: ["Cotton"],
      tags: ["top", "summer", "lace"],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "p-oat-cardigan",
      slug: "golden-oat-cardigan",
      name: "Golden Oat Cardigan",
      category: "tops",
      tagline: "An heirloom granny-square cardigan in warm oat.",
      description:
        "A modern take on the classic granny-square cardigan, worked in warm oat and golden tones. Cozy, colorful, and made to be worn for years.",
      details: [
        "Hand-crocheted from hexagon motifs.",
        "Oversized, relaxed fit.",
        "Wool-cotton blend for warmth without the itch.",
      ],
      price: 165,
      priceNote: "starting at",
      status: "made-to-order",
      images: [{ id: "pi3", src: "/seed/swatch-oat.svg", alt: "Golden Oat Cardigan" }],
      specs: [
        { label: "Fiber", value: "Wool-cotton blend" },
        { label: "Fit", value: "Oversized" },
        { label: "Lead time", value: "4–5 weeks" },
      ],
      materials: ["Wool", "Cotton"],
      tags: ["cardigan", "granny-square"],
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "p-rust-scarf",
      slug: "rustwood-cable-scarf",
      name: "Rustwood Cable Scarf",
      category: "winter-wear",
      tagline: "A long cabled scarf in warm rustwood.",
      description:
        "Deeply cabled and wonderfully long, this scarf wraps twice with room to spare. Knit in a warm rustwood that glows against a winter coat.",
      price: 58,
      status: "available",
      images: [{ id: "pi4", src: "/seed/swatch-rust.svg", alt: "Rustwood Cable Scarf" }],
      specs: [
        { label: "Fiber", value: "Wool-alpaca blend" },
        { label: "Length", value: "72 in" },
      ],
      materials: ["Wool", "Alpaca"],
      tags: ["scarf", "cable", "winter"],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "p-bucket-hat",
      slug: "wildflower-bucket-hat",
      name: "Wildflower Bucket Hat",
      category: "hats",
      tagline: "A playful crochet bucket hat scattered with flowers.",
      description:
        "A cheerful crochet bucket hat dotted with tiny hand-stitched wildflowers. Structured enough to hold its shape, soft enough to pack in a bag.",
      price: 48,
      status: "available",
      images: [{ id: "pi5", src: "/seed/swatch-sage.svg", alt: "Wildflower Bucket Hat" }],
      materials: ["Cotton"],
      tags: ["bucket-hat", "summer", "floral"],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "p-market-bag",
      slug: "forager-market-bag",
      name: "Forager Market Bag",
      category: "accessories",
      tagline: "A stretchy net bag for market mornings.",
      description:
        "An endlessly stretchy crochet net bag that packs flat and holds a surprising amount of produce, yarn, or beach things.",
      price: 34,
      status: "available",
      images: [{ id: "pi6", src: "/seed/swatch-oat.svg", alt: "Forager Market Bag" }],
      materials: ["Cotton"],
      tags: ["bag", "market", "everyday"],
      createdAt: now,
      updatedAt: now,
    },
  ],
  gallery: [
    { id: "g1", image: { id: "gi1", src: "/seed/swatch-forest.svg", alt: "Finished evergreen beanie on a mossy log" }, title: "Mossy Hollow, finished", productSlug: "mossy-hollow-beanie", order: 1, createdAt: now },
    { id: "g2", image: { id: "gi2", src: "/seed/swatch-sage.svg", alt: "Fernlight top in soft light" }, title: "Fernlight in morning light", productSlug: "fernlight-summer-top", order: 2, createdAt: now },
    { id: "g3", image: { id: "gi3", src: "/seed/swatch-oat.svg", alt: "Golden oat cardigan draped on a chair" }, title: "Golden Oat, draped", productSlug: "golden-oat-cardigan", order: 3, createdAt: now },
    { id: "g4", image: { id: "gi4", src: "/seed/swatch-rust.svg", alt: "Rustwood scarf in the woods" }, title: "Rustwood in the wild", productSlug: "rustwood-cable-scarf", order: 4, createdAt: now },
    { id: "g5", image: { id: "gi5", src: "/seed/swatch-sage.svg", alt: "Wildflower bucket hat" }, title: "Wildflowers", productSlug: "wildflower-bucket-hat", order: 5, createdAt: now },
    { id: "g6", image: { id: "gi6", src: "/seed/swatch-oat.svg", alt: "Market bag full of yarn" }, title: "Foraging for yarn", productSlug: "forager-market-bag", order: 6, createdAt: now },
  ],
  testimonials: [
    { id: "t1", author: "Marisol R.", location: "Portland, OR", quote: "My Mossy Hollow beanie is the softest thing I own. I get compliments every single time I wear it.", rating: 5, featured: true, createdAt: now },
    { id: "t2", author: "Devon K.", location: "Asheville, NC", quote: "Pim made me a custom sweater for my partner and it fit perfectly. The whole process felt like working with a friend.", rating: 5, productSlug: "golden-oat-cardigan", featured: true, createdAt: now },
    { id: "t3", author: "Amara T.", location: "Seattle, WA", quote: "The detail on the wildflower hat is unreal. You can tell every stitch was made with care.", rating: 5, featured: true, createdAt: now },
  ],
  posts: [
    {
      id: "b1",
      slug: "why-i-knit-slow",
      title: "Why I knit slow (and why that's the point)",
      excerpt: "In a world of fast everything, handmade is a quiet rebellion. Here's what a slow stitch means to me.",
      body:
        "There's a moment, a few rows into a new piece, where the yarn stops being a ball and starts becoming a thing. I live for that moment.\n\n## The rhythm of it\nKnitting slow isn't about being inefficient. It's about paying attention — to tension, to color, to the way a fiber wants to move. Machines can't feel that.\n\n## Made to last\nWhen something takes weeks to make, you make it well. You weave in every end. You block it properly. You send it off hoping it outlives you.\n\nThat's the whole point.",
      coverImage: { id: "bc1", src: "/seed/swatch-forest.svg", alt: "Yarn and needles by a window" },
      tags: ["studio-notes", "slow-craft"],
      author: "Pim",
      published: true,
      publishedAt: now,
      updatedAt: now,
    },
    {
      id: "b2",
      slug: "colors-of-the-forest-floor",
      title: "Colors of the forest floor",
      excerpt: "How a walk in the woods becomes a colorway — from moss and oat to rustwood and cedar.",
      body:
        "Most of my palettes start on a walk. I'll crouch down over a patch of moss and just... stare.\n\n## Evergreen & moss\nThe base of everything. Deep, calm, endlessly wearable.\n\n## Oat & golden light\nThe way afternoon sun hits dry grass — that's golden oat.\n\n## Rustwood & cedar\nFallen bark, warm and grounding. A little bit of these makes a whole palette feel alive.",
      coverImage: { id: "bc2", src: "/seed/swatch-oat.svg", alt: "Forest floor colors" },
      tags: ["color", "inspiration"],
      author: "Pim",
      published: true,
      publishedAt: now,
      updatedAt: now,
    },
  ],
  contactMessages: [],
  quoteRequests: [],
};
