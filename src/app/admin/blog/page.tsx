"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useContent } from "@/context/content-context";
import { AdminHeader, Modal, EmptyState, Field } from "@/components/admin/admin-ui";
import ImageUploader from "@/components/image-uploader";
import SmartImage from "@/components/smart-image";
import { formatDate, slugify } from "@/lib/utils";
import { uid } from "@/lib/images";
import type { BlogPost, ImageRef } from "@/lib/types";

function emptyPost(): BlogPost {
  const iso = new Date().toISOString();
  return {
    id: uid("b"), slug: "", title: "", excerpt: "", body: "",
    tags: [], author: "Pim", published: false, publishedAt: iso, updatedAt: iso,
  };
}

export default function AdminBlog() {
  const { content, upsertPost, deletePost } = useContent();
  const [editing, setEditing] = useState<BlogPost | null>(null);

  function save() {
    if (!editing) return;
    upsertPost({
      ...editing,
      title: editing.title.trim() || "Untitled",
      slug: editing.slug || slugify(editing.title) || uid("post"),
      updatedAt: new Date().toISOString(),
    });
    setEditing(null);
  }

  return (
    <div>
      <AdminHeader
        title="Journal"
        description="Write stories, studio notes, and updates."
        action={<button className="btn-primary" onClick={() => setEditing(emptyPost())}><Plus className="h-4 w-4" /> New post</button>}
      />

      {content.posts.length === 0 ? (
        <EmptyState title="No posts yet" hint="Share your first studio note." />
      ) : (
        <div className="space-y-3">
          {[...content.posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl2 border border-oat/50 bg-paper p-3">
              <span className="h-16 w-24 shrink-0 overflow-hidden rounded-lg"><SmartImage image={p.coverImage} className="h-full w-full" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-display text-lg text-evergreen">{p.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? "bg-fern/15 text-fern" : "bg-ink/10 text-ink/60"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="truncate text-sm text-moss">{p.excerpt}</p>
                <p className="text-xs text-moss">{formatDate(p.publishedAt)}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => upsertPost({ ...p, published: !p.published })} className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest/10" aria-label="Toggle publish">
                  {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditing({ ...p })} className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest/10"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => { if (confirm(`Delete "${p.title}"?`)) deletePost(p.id); }} className="grid h-9 w-9 place-items-center rounded-full text-rustwood hover:bg-rustwood/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.title ? `Edit · ${editing.title}` : "New post"} wide>
        {editing && (
          <div className="space-y-5">
            <Field label="Cover image">
              <ImageUploader value={editing.coverImage ? [editing.coverImage] : []} multiple={false} max={1}
                onChange={(imgs: ImageRef[]) => setEditing({ ...editing, coverImage: imgs[0] })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input className="field" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </Field>
              <Field label="Slug" hint="Auto-generated if blank.">
                <input className="field" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
              </Field>
            </div>
            <Field label="Excerpt">
              <textarea rows={2} className="field resize-none" value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </Field>
            <Field label="Body" hint="Use blank lines for paragraphs, ## for headings, and - for bullet lists.">
              <textarea rows={10} className="field resize-none font-mono text-sm" value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
            </Field>
            <Field label="In-post gallery (optional)">
              <ImageUploader value={editing.gallery ?? []} max={8}
                onChange={(imgs: ImageRef[]) => setEditing({ ...editing, gallery: imgs })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Author">
                <input className="field" value={editing.author ?? ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
              </Field>
              <Field label="Publish date">
                <input type="date" className="field" value={editing.publishedAt.slice(0, 10)}
                  onChange={(e) => setEditing({ ...editing, publishedAt: new Date(e.target.value).toISOString() })} />
              </Field>
              <Field label="Tags" hint="Comma-separated.">
                <input className="field" value={(editing.tags ?? []).join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
              </Field>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
              <span className="text-sm font-semibold text-ink">Published (visible on the site)</span>
            </label>
            <div className="flex justify-end gap-3 border-t border-oat/50 pt-4">
              <button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" onClick={save}>Save post</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
