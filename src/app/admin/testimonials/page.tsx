"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useContent } from "@/context/content-context";
import { AdminHeader, Modal, EmptyState, Field } from "@/components/admin/admin-ui";
import ImageUploader from "@/components/image-uploader";
import { StarRating } from "@/components/ui";
import { uid } from "@/lib/images";
import type { ImageRef, Testimonial } from "@/lib/types";

function emptyTestimonial(): Testimonial {
  return { id: uid("t"), author: "", location: "", quote: "", rating: 5, featured: true, createdAt: new Date().toISOString() };
}

export default function AdminTestimonials() {
  const { content, upsertTestimonial, deleteTestimonial } = useContent();
  const [editing, setEditing] = useState<Testimonial | null>(null);

  function save() {
    if (!editing) return;
    upsertTestimonial({ ...editing, author: editing.author.trim() || "Anonymous" });
    setEditing(null);
  }

  return (
    <div>
      <AdminHeader
        title="Testimonials"
        description="Share kind words from happy makers and wearers."
        action={<button className="btn-primary" onClick={() => setEditing(emptyTestimonial())}><Plus className="h-4 w-4" /> New testimonial</button>}
      />

      {content.testimonials.length === 0 ? (
        <EmptyState title="No testimonials yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.testimonials.map((t) => (
            <div key={t.id} className="flex flex-col rounded-xl2 border border-oat/50 bg-paper p-5">
              <div className="flex items-center justify-between">
                <StarRating value={t.rating ?? 5} />
                {t.featured && <Star className="h-4 w-4 fill-oatgold text-oatgold" />}
              </div>
              <p className="mt-3 flex-1 font-display italic text-evergreen">“{t.quote}”</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{t.author}</p>
                  {t.location && <p className="text-xs text-moss">{t.location}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing({ ...t })} className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest/10"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => { if (confirm("Delete this testimonial?")) deleteTestimonial(t.id); }} className="grid h-9 w-9 place-items-center rounded-full text-rustwood hover:bg-rustwood/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.author ? `Edit · ${editing.author}` : "New testimonial"}>
        {editing && (
          <div className="space-y-5">
            <Field label="Quote">
              <textarea rows={4} className="field resize-none" value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Author">
                <input className="field" value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
              </Field>
              <Field label="Location">
                <input className="field" value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Rating (1–5)">
                <input type="number" min={1} max={5} className="field" value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
              </Field>
              <Field label="Related product (optional)">
                <select className="field" value={editing.productSlug ?? ""} onChange={(e) => setEditing({ ...editing, productSlug: e.target.value || undefined })}>
                  <option value="">None</option>
                  {content.products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Photo (optional)">
              <ImageUploader value={editing.image ? [editing.image] : []} multiple={false} max={1}
                onChange={(imgs: ImageRef[]) => setEditing({ ...editing, image: imgs[0] })} />
            </Field>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              <span className="text-sm font-semibold text-ink">Feature on the homepage</span>
            </label>
            <div className="flex justify-end gap-3 border-t border-oat/50 pt-4">
              <button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
