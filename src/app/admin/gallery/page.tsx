"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useContent } from "@/context/content-context";
import { AdminHeader, Modal, EmptyState, Field } from "@/components/admin/admin-ui";
import ImageUploader from "@/components/image-uploader";
import SmartImage from "@/components/smart-image";
import { uid } from "@/lib/images";
import type { GalleryItem, ImageRef } from "@/lib/types";

function emptyItem(): GalleryItem {
  return { id: uid("g"), image: { id: uid("gi"), src: "", alt: "" }, title: "", tags: [], order: 99, createdAt: new Date().toISOString() };
}

export default function AdminGallery() {
  const { content, upsertGalleryItem, deleteGalleryItem } = useContent();
  const [editing, setEditing] = useState<GalleryItem | null>(null);

  function save() {
    if (!editing || !editing.image?.src) return;
    upsertGalleryItem(editing);
    setEditing(null);
  }

  return (
    <div>
      <AdminHeader
        title="Gallery"
        description="Showcase finished pieces out in the world."
        action={<button className="btn-primary" onClick={() => setEditing(emptyItem())}><Plus className="h-4 w-4" /> Add photo</button>}
      />

      {content.gallery.length === 0 ? (
        <EmptyState title="No gallery photos yet" />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...content.gallery].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((g) => (
            <div key={g.id} className="group relative overflow-hidden rounded-xl2 border border-oat/50">
              <div className="aspect-square"><SmartImage image={g.image} className="h-full w-full" /></div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-pine/90 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                <span className="truncate text-xs text-cream">{g.title || "Untitled"}</span>
                <div className="flex gap-1">
                  <button onClick={() => setEditing({ ...g })} className="grid h-8 w-8 place-items-center rounded-full bg-cream/20 text-cream hover:bg-cream/40"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => { if (confirm("Delete this photo?")) deleteGalleryItem(g.id); }} className="grid h-8 w-8 place-items-center rounded-full bg-cream/20 text-cream hover:bg-rustwood"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Gallery photo">
        {editing && (
          <div className="space-y-5">
            <Field label="Photo">
              <ImageUploader value={editing.image?.src ? [editing.image] : []} multiple={false} max={1}
                onChange={(imgs: ImageRef[]) => setEditing({ ...editing, image: imgs[0] ?? { id: uid("gi"), src: "", alt: "" } })} />
            </Field>
            <Field label="Title / caption">
              <input className="field" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Link to product (slug)" hint="Optional.">
                <select className="field" value={editing.productSlug ?? ""} onChange={(e) => setEditing({ ...editing, productSlug: e.target.value || undefined })}>
                  <option value="">None</option>
                  {content.products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                </select>
              </Field>
              <Field label="Tags" hint="Comma-separated.">
                <input className="field" value={(editing.tags ?? []).join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
              </Field>
            </div>
            <Field label="Display order">
              <input type="number" className="field" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
            </Field>
            <div className="flex justify-end gap-3 border-t border-oat/50 pt-4">
              <button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" onClick={save} disabled={!editing.image?.src}>Save</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
