"use client";

import { useRef, useState } from "react";
import { Save, Download, Upload, RotateCcw, Plus, Trash2, Check } from "lucide-react";
import { useContent } from "@/context/content-context";
import { AdminHeader, Field } from "@/components/admin/admin-ui";
import ImageUploader from "@/components/image-uploader";
import { exportAllImages, importImages } from "@/lib/images";
import type { ContentData, ImageRef, SiteSettings } from "@/lib/types";

export default function AdminSettings() {
  const { content, updateSettings, replaceAll, reset } = useContent();
  const [draft, setDraft] = useState<SiteSettings>(content.settings);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function patch<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function save() {
    updateSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function exportBackup() {
    const images = await exportAllImages();
    const payload = { exportedAt: new Date().toISOString(), content, images };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pims-wims-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importBackup(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as { content: ContentData; images?: Record<string, string> };
      if (parsed.images) await importImages(parsed.images);
      if (parsed.content) {
        replaceAll(parsed.content);
        setDraft(parsed.content.settings);
      }
      alert("Backup imported successfully.");
    } catch {
      alert("That file couldn't be read. Make sure it's a Pim's Wims backup.");
    }
  }

  return (
    <div className="max-w-3xl">
      <AdminHeader
        title="Settings"
        description="Your brand, story, and contact details."
        action={<button className="btn-primary" onClick={save}>{saved ? <><Check className="h-4 w-4" /> Saved</> : <><Save className="h-4 w-4" /> Save changes</>}</button>}
      />

      <div className="space-y-8">
        <Section title="Brand">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand name"><input className="field" value={draft.brandName} onChange={(e) => patch("brandName", e.target.value)} /></Field>
            <Field label="Tagline"><input className="field" value={draft.tagline} onChange={(e) => patch("tagline", e.target.value)} /></Field>
          </div>
          <Field label="Announcement bar" hint="Leave blank to hide the bar.">
            <input className="field" value={draft.announcement ?? ""} onChange={(e) => patch("announcement", e.target.value)} />
          </Field>
        </Section>

        <Section title="Homepage hero">
          <Field label="Hero image">
            <ImageUploader value={draft.heroImage ? [draft.heroImage] : []} multiple={false} max={1}
              onChange={(imgs: ImageRef[]) => patch("heroImage", imgs[0])} />
          </Field>
          <Field label="Headline"><input className="field" value={draft.heroHeadline} onChange={(e) => patch("heroHeadline", e.target.value)} /></Field>
          <Field label="Subcopy"><textarea rows={3} className="field resize-none" value={draft.heroSubcopy} onChange={(e) => patch("heroSubcopy", e.target.value)} /></Field>
        </Section>

        <Section title="About">
          <Field label="Portrait">
            <ImageUploader value={draft.about.portrait ? [draft.about.portrait] : []} multiple={false} max={1}
              onChange={(imgs: ImageRef[]) => patch("about", { ...draft.about, portrait: imgs[0] })} />
          </Field>
          <Field label="Headline"><input className="field" value={draft.about.headline} onChange={(e) => patch("about", { ...draft.about, headline: e.target.value })} /></Field>
          <Field label="Story" hint="Blank lines separate paragraphs."><textarea rows={6} className="field resize-none" value={draft.about.story} onChange={(e) => patch("about", { ...draft.about, story: e.target.value })} /></Field>
        </Section>

        <Section title="Contact & social">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email"><input className="field" value={draft.contact.email} onChange={(e) => patch("contact", { ...draft.contact, email: e.target.value })} /></Field>
            <Field label="Phone"><input className="field" value={draft.contact.phone ?? ""} onChange={(e) => patch("contact", { ...draft.contact, phone: e.target.value })} /></Field>
            <Field label="Location"><input className="field" value={draft.contact.location ?? ""} onChange={(e) => patch("contact", { ...draft.contact, location: e.target.value })} /></Field>
            <Field label="Instagram URL"><input className="field" value={draft.contact.instagram ?? ""} onChange={(e) => patch("contact", { ...draft.contact, instagram: e.target.value })} /></Field>
            <Field label="TikTok URL"><input className="field" value={draft.contact.tiktok ?? ""} onChange={(e) => patch("contact", { ...draft.contact, tiktok: e.target.value })} /></Field>
            <Field label="YouTube URL"><input className="field" value={draft.contact.youtube ?? ""} onChange={(e) => patch("contact", { ...draft.contact, youtube: e.target.value })} /></Field>
          </div>
        </Section>

        <Section title="FAQs">
          <div className="space-y-3">
            {(draft.faqs ?? []).map((f, i) => (
              <div key={i} className="rounded-xl2 border border-oat/50 bg-paper p-4">
                <div className="flex gap-2">
                  <input className="field" placeholder="Question" value={f.question}
                    onChange={(e) => {
                      const faqs = [...(draft.faqs ?? [])];
                      faqs[i] = { ...faqs[i], question: e.target.value };
                      patch("faqs", faqs);
                    }} />
                  <button onClick={() => patch("faqs", (draft.faqs ?? []).filter((_, j) => j !== i))}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl2 text-rustwood hover:bg-rustwood/10"><Trash2 className="h-4 w-4" /></button>
                </div>
                <textarea rows={2} className="field mt-2 resize-none" placeholder="Answer" value={f.answer}
                  onChange={(e) => {
                    const faqs = [...(draft.faqs ?? [])];
                    faqs[i] = { ...faqs[i], answer: e.target.value };
                    patch("faqs", faqs);
                  }} />
              </div>
            ))}
            <button className="btn-secondary" onClick={() => patch("faqs", [...(draft.faqs ?? []), { question: "", answer: "" }])}>
              <Plus className="h-4 w-4" /> Add FAQ
            </button>
          </div>
        </Section>

        <Section title="Backup & data">
          <p className="text-sm text-moss">
            Your content lives in this browser. Export a backup regularly, and use it to move your
            content to another device or restore it later.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary" onClick={exportBackup}><Download className="h-4 w-4" /> Export backup</button>
            <button className="btn-secondary" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Import backup</button>
            <button className="btn-secondary border-rustwood/40 text-rustwood hover:bg-rustwood/10"
              onClick={() => { if (confirm("Reset all content back to the original demo? This cannot be undone.")) { reset(); setDraft(content.settings); } }}>
              <RotateCcw className="h-4 w-4" /> Reset to demo
            </button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])} />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl3 border border-oat/50 bg-paper/70 p-6">
      <h2 className="mb-4 font-display text-xl text-heading">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
