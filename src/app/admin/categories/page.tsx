"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useContent } from "@/context/content-context";
import { AdminHeader, Modal, EmptyState, Field } from "@/components/admin/admin-ui";
import ImageUploader from "@/components/image-uploader";
import SmartImage from "@/components/smart-image";
import { slugify } from "@/lib/utils";
import { uid } from "@/lib/images";
import type { Category, ImageRef } from "@/lib/types";

function emptyCategory(): Category {
  return { id: uid("cat"), slug: "", name: "", description: "", order: 99 };
}

export default function AdminCategories() {
  const { content, upsertCategory, deleteCategory } = useContent();
  const [editing, setEditing] = useState<Category | null>(null);

  function save() {
    if (!editing) return;
    upsertCategory({
      ...editing,
      name: editing.name.trim() || "Untitled",
      slug: editing.slug || slugify(editing.name) || uid("cat"),
    });
    setEditing(null);
  }

  return (
    <div>
      <AdminHeader
        title="Categories"
        description="Group your pieces into collections shoppers can browse."
        action={<button className="btn-primary" onClick={() => setEditing(emptyCategory())}><Plus className="h-4 w-4" /> New category</button>}
      />

      {content.categories.length === 0 ? (
        <EmptyState title="No categories yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...content.categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((c) => (
            <div key={c.id} className="overflow-hidden rounded-xl2 border border-oat/50 bg-paper">
              <div className="aspect-[3/2]"><SmartImage image={c.image} className="h-full w-full" /></div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg text-heading">{c.name}</p>
                    <p className="text-xs text-moss">/{c.slug} · {content.products.filter((p) => p.category === c.slug).length} pieces</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing({ ...c })} className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest/10"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { if (confirm(`Delete "${c.name}"?`)) deleteCategory(c.id); }} className="grid h-9 w-9 place-items-center rounded-full text-rustwood hover:bg-rustwood/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                {c.description && <p className="mt-2 text-sm text-moss">{c.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.name ? `Edit · ${editing.name}` : "New category"}>
        {editing && (
          <div className="space-y-5">
            <Field label="Cover image">
              <ImageUploader value={editing.image ? [editing.image] : []} multiple={false} max={1}
                onChange={(imgs: ImageRef[]) => setEditing({ ...editing, image: imgs[0] })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input className="field" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Slug" hint="Auto-generated if blank.">
                <input className="field" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
              </Field>
            </div>
            <Field label="Description">
              <textarea rows={2} className="field resize-none" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Field label="Display order">
              <input type="number" className="field" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
            </Field>
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
