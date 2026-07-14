"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/context/content-context";
import SmartImage from "@/components/smart-image";
import Reveal from "@/components/reveal";
import { Kicker } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function BlogPage() {
  const { content } = useContent();
  const posts = content.posts
    .filter((p) => p.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const [featured, ...rest] = posts;

  return (
    <div className="container-wide py-14">
      <header className="max-w-2xl">
        <Kicker className="mb-3">The journal</Kicker>
        <h1 className="text-4xl sm:text-5xl">Studio notes & slow-craft stories</h1>
        <p className="mt-3 text-moss">
          Thoughts on color, fiber, and the quiet joy of making things by hand.
        </p>
      </header>

      {posts.length === 0 && (
        <p className="mt-16 text-center text-moss">No stories yet — check back soon.</p>
      )}

      {featured && (
        <Reveal className="mt-12">
          <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-xl3 border border-oat/40 bg-paper/70 shadow-soft lg:grid-cols-2">
            <div className="aspect-[16/10] lg:aspect-auto">
              <SmartImage image={featured.coverImage} className="h-full w-full" imgClassName="group-hover:scale-105 transition-transform duration-500" priority />
            </div>
            <div className="flex flex-col justify-center gap-3 p-8 lg:p-12">
              <span className="text-xs uppercase tracking-widest text-moss">{formatDate(featured.publishedAt)}</span>
              <h2 className="text-3xl">{featured.title}</h2>
              <p className="text-moss">{featured.excerpt}</p>
              <span className="mt-2 inline-flex items-center gap-1 font-semibold text-forest">
                Read the story <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>
      )}

      {rest.length > 0 && (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.id} delay={i * 70}>
              <Link href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-xl2 border border-oat/40 bg-paper/70 shadow-soft">
                <div className="aspect-[16/10] overflow-hidden">
                  <SmartImage image={post.coverImage} className="h-full w-full" imgClassName="group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-xs uppercase tracking-widest text-moss">{formatDate(post.publishedAt)}</span>
                  <h3 className="font-display text-xl text-evergreen">{post.title}</h3>
                  <p className="line-clamp-3 text-sm text-moss">{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
