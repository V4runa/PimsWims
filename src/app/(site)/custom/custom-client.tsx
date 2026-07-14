"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, Palette, Ruler, CalendarClock } from "lucide-react";
import { useContent } from "@/context/content-context";
import ImageUploader from "@/components/image-uploader";
import { Kicker } from "@/components/ui";
import type { ImageRef } from "@/lib/types";

const PROJECT_TYPES = [
  "Sweater / Cardigan",
  "Hat / Beanie",
  "Scarf / Cowl",
  "Blanket / Throw",
  "Top / Tank",
  "Amigurumi / Toy",
  "Bag / Accessory",
  "Something else",
];

const STEPS = [
  { icon: Sparkles, title: "Share your idea", text: "Tell me what you're dreaming of — the more detail, the better." },
  { icon: Palette, title: "We refine it", text: "I'll reply with fiber and color ideas, timing, and a fair price." },
  { icon: Ruler, title: "I make it", text: "Once we're both excited, I cast on and keep you posted with progress." },
  { icon: CalendarClock, title: "It's yours", text: "Your one-of-a-kind piece ships with a care card, made just for you." },
];

export default function CustomClient() {
  const { content, addQuoteRequest } = useContent();
  const params = useSearchParams();
  const prefillPiece = params.get("piece") ?? "";

  const [sent, setSent] = useState(false);
  const [references, setReferences] = useState<ImageRef[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: prefillPiece ? "Something else" : PROJECT_TYPES[0],
    description: prefillPiece ? `I'm interested in something like the "${prefillPiece}".\n\n` : "",
    budget: "",
    timeline: "",
    colors: "",
    size: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addQuoteRequest({ ...form, references });
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="py-14">
      {/* Hero */}
      <div className="container-wide">
        <div className="grid items-center gap-8 rounded-xl3 bg-evergreen p-8 text-cream sm:p-12 lg:grid-cols-2">
          <div>
            <Kicker className="mb-3 text-oatgold">Make me something</Kicker>
            <h1 className="text-4xl text-cream sm:text-5xl">Commission a one-of-a-kind piece</h1>
            <p className="mt-4 max-w-lg text-cream/85">
              This is where the magic starts. Whether it&apos;s a sweater in your favorite forest
              green or an amigurumi of your pet, tell me about it and let&apos;s make it real.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.title} className="rounded-xl2 bg-cream/10 p-4">
                <s.icon className="h-6 w-6 text-oatgold" />
                <p className="mt-2 font-display text-lg text-cream">{s.title}</p>
                <p className="text-sm text-cream/75">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container-page mt-12 max-w-3xl">
        {sent ? (
          <div className="card flex flex-col items-center px-6 py-16 text-center">
            <CheckCircle2 className="h-16 w-16 text-forest" />
            <h2 className="mt-5 text-3xl">Request received!</h2>
            <p className="mt-3 max-w-md text-moss">
              Thank you, {form.name.split(" ")[0] || "friend"}! Your custom request is in Pim&apos;s
              studio queue. You&apos;ll hear back within a few days to talk through the details.
            </p>
            <a
              href={`mailto:${content.settings.contact.email}?subject=${encodeURIComponent("Custom request: " + form.projectType)}`}
              className="btn-secondary mt-6"
            >
              Send a copy to Pim&apos;s inbox
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="card space-y-6 p-6 sm:p-8">
            <div>
              <h2 className="text-2xl">Tell me about your dream piece</h2>
              <p className="mt-1 text-sm text-moss">Fields marked with * are required.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">Your name *</label>
                <input id="name" required className="field" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="email">Email *</label>
                <input id="email" type="email" required className="field" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone (optional)</label>
                <input id="phone" className="field" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="projectType">What are we making? *</label>
                <select id="projectType" className="field" value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}>
                  {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="description">Describe your idea *</label>
              <textarea id="description" required rows={5} className="field resize-none" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Style, vibe, who it's for, any special details…" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="colors">Colors / palette</label>
                <input id="colors" className="field" value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  placeholder="e.g. mossy greens & oat" />
              </div>
              <div>
                <label className="label" htmlFor="size">Size / measurements</label>
                <input id="size" className="field" value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  placeholder="e.g. Women's M, or chest 38in" />
              </div>
              <div>
                <label className="label" htmlFor="budget">Budget range</label>
                <input id="budget" className="field" value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="e.g. $80–$150" />
              </div>
              <div>
                <label className="label" htmlFor="timeline">Timeline / deadline</label>
                <input id="timeline" className="field" value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  placeholder="e.g. by December" />
              </div>
            </div>

            <div>
              <label className="label">Inspiration images (optional)</label>
              <ImageUploader value={references} onChange={setReferences} max={5} label="Add" />
            </div>

            <button type="submit" className="btn-primary w-full">Send my request</button>
          </form>
        )}
      </div>
    </div>
  );
}
