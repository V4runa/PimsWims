"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useContent } from "@/context/content-context";
import SmartImage from "@/components/smart-image";
import Prose from "@/components/prose";
import { formatDate } from "@/lib/utils";

export default function BlogPostPage() {
  const { content, ready } = useContent();
  const params = useParams<{ slug: string }>();
  const post = content.posts.find((p) => p.slug === params.slug && p.published);

  if (!ready) return <div className="container-page py-24 text-center text-moss">Loading…</div>;
  if (!post) return notFound();

  return (
    <article className="py-10">
      <div className="container-page max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-moss hover:text-evergreen">
          <ArrowLeft className="h-4 w-4" /> Back to journal
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-moss">
          <span>{formatDate(post.publishedAt)}</span>
          {post.author && <span>· by {post.author}</span>}
          {post.tags?.map((t) => (
            <span key={t} className="rounded-full bg-forest/10 px-2 py-0.5 text-forest">#{t}</span>
          ))}
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-xl text-moss">{post.excerpt}</p>
      </div>

      {post.coverImage && (
        <div className="container-wide mt-10">
          <div className="aspect-[16/9] overflow-hidden rounded-xl3">
            <SmartImage image={post.coverImage} className="h-full w-full" priority />
          </div>
        </div>
      )}

      <div className="container-page mt-12 max-w-3xl">
        <Prose text={post.body} />

        {post.gallery && post.gallery.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {post.gallery.map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-xl2">
                <SmartImage image={img} className="h-full w-full" />
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
