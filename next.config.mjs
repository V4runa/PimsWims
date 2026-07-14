/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Content images are stored as compressed data URLs in the browser
    // (IndexedDB), so remote optimization is unnecessary. Unsplash is only
    // used for a handful of seed/editorial fallbacks.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
