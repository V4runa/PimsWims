"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useContent } from "@/context/content-context";
import { AdminHeader, Modal, EmptyState, Field } from "@/components/admin/admin-ui";
import ImageUploader from "@/components/image-uploader";
import SmartImage from "@/components/smart-image";
import { StatusBadge } from "@/components/ui";
import { formatPrice, slugify } from "@/lib/utils";
import { uid } from "@/lib/images";
import type { ImageRef, Product, ProductStatus } from "@/lib/types";

const STATUSES: ProductStatus[] = ["available", "made-to-order", "sold", "archived"];

function emptyProduct(): Product {
  const iso = new Date().toISOString();
  return {
    id: uid("p"),
    slug: "",
    name: "",
    category: "",
    tagline: "",
    description: "",
    details: [],
    price: undefined,
    priceNote: "",
    status: "available",
    images: [],
    specs: [],
    materials: [],
    tags: [],
    featured: false,
    createdAt: iso,
    updatedAt: iso,
  };
}

export default function AdminProducts() {
  const { content, upsertProduct, deleteProduct } = useContent();
  const [editing, setEditing] = useState<Product | null>(null);

  function openNew() {
    const p = emptyProduct();
    p.category = content.categories[0]?.slug ?? "";
    setEditing(p);
  }

  function save() {
    if (!editing) return;
    const finalized: Product = {
      ...editing,
      name: editing.name.trim() || "Untitled piece",
      slug: (editing.slug || slugify(editing.name)) || uid("piece"),
      updatedAt: new Date().toISOString(),
    };
    upsertProduct(finalized);
    setEditing(null);
  }

  return (
    <div>
      <AdminHeader
        title="Products"
        description="Add, edit, and organize the pieces in your shop."
        action={<button className="btn-primary" onClick={openNew}><Plus className="h-4 w-4" /> New product</button>}
      />

      {content.products.length === 0 ? (
        <EmptyState title="No products yet" hint="Add your first piece to start filling the shop." />
      ) : (
        <div className="overflow-hidden rounded-xl3 border border-oat/50 bg-paper">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-oat/50 bg-linen/60 text-xs uppercase tracking-wide text-moss">
              <tr>
                <th className="px-4 py-3">Piece</th>
                <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                <th className="hidden px-4 py-3 md:table-cell">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-oat/40">
              {content.products.map((p) => (
                <tr key={p.id} className="hover:bg-linen/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-12 w-12 overflow-hidden rounded-lg">
                        <SmartImage image={p.images[0]} className="h-full w-full" />
                      </span>
                      <div>
                        <p className="flex items-center gap-1 font-semibold text-ink">
                          {p.name}
                          {p.featured && <Star className="h-3.5 w-3.5 fill-oatgold text-oatgold" />}
                        </p>
                        <p className="text-xs text-moss">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 capitalize text-moss sm:table-cell">
                    {content.categories.find((c) => c.slug === p.category)?.name ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">{formatPrice(p.price, p.priceNote)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing({ ...p })} className="grid h-9 w-9 place-items-center rounded-full text-forest hover:bg-forest/10" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id); }}
                        className="grid h-9 w-9 place-items-center rounded-full text-rustwood hover:bg-rustwood/10"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.name ? `Edit · ${editing.name}` : "New product"} wide>
        {editing && (
          <div className="space-y-5">
            <Field label="Images">
              <ImageUploader
                value={editing.images}
                onChange={(images: ImageRef[]) => setEditing({ ...editing, images })}
                max={6}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input className="field" value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Slug" hint="Leave blank to auto-generate from the name.">
                <input className="field" value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
              </Field>
            </div>

            <Field label="Tagline">
              <input className="field" value={editing.tagline ?? ""}
                onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
            </Field>

            <Field label="Description">
              <textarea rows={4} className="field resize-none" value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>

            <Field label="Details" hint="One highlight per line.">
              <textarea rows={3} className="field resize-none" value={(editing.details ?? []).join("\n")}
                onChange={(e) => setEditing({ ...editing, details: e.target.value.split("\n").filter(Boolean) })} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Category">
                <select className="field" value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  {content.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Price (USD)">
                <input type="number" className="field" value={editing.price ?? ""}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value ? Number(e.target.value) : undefined })} />
              </Field>
              <Field label="Price note">
                <input className="field" placeholder="e.g. starting at" value={editing.priceNote ?? ""}
                  onChange={(e) => setEditing({ ...editing, priceNote: e.target.value })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <select className="field" value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as ProductStatus })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Tags" hint="Comma-separated.">
                <input className="field" value={(editing.tags ?? []).join(", ")}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
              </Field>
            </div>

            <Field label="Specs" hint="One per line as Label: Value (e.g. Fiber: Merino wool).">
              <textarea rows={3} className="field resize-none"
                value={(editing.specs ?? []).map((s) => `${s.label}: ${s.value}`).join("\n")}
                onChange={(e) => setEditing({
                  ...editing,
                  specs: e.target.value.split("\n").filter(Boolean).map((line) => {
                    const [label, ...rest] = line.split(":");
                    return { label: label.trim(), value: rest.join(":").trim() };
                  }),
                })} />
            </Field>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              <span className="text-sm font-semibold text-ink">Feature on the homepage</span>
            </label>

            <div className="flex justify-end gap-3 border-t border-oat/50 pt-4">
              <button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" onClick={save}>Save product</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
