"use client";

import { useState } from "react";
import { Mail, MapPin, Instagram, CheckCircle2 } from "lucide-react";
import { useContent } from "@/context/content-context";
import { Kicker } from "@/components/ui";

export default function ContactPage() {
  const { content, addContactMessage } = useContent();
  const { contact } = content.settings;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addContactMessage(form);
    setSent(true);
  }

  return (
    <div className="container-wide py-14">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <Kicker className="mb-3">Contact</Kicker>
          <h1 className="text-4xl sm:text-5xl">Let&apos;s talk yarn</h1>
          <p className="mt-3 max-w-md text-moss">
            Questions about a piece, a collaboration, or just want to say hi? I read every message
            myself and usually reply within a few days.
          </p>

          <div className="mt-8 space-y-4">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-ink hover:text-heading">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-forest/10 text-forest">
                <Mail className="h-5 w-5" />
              </span>
              {contact.email}
            </a>
            {contact.location && (
              <div className="flex items-center gap-3 text-ink">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-forest/10 text-forest">
                  <MapPin className="h-5 w-5" />
                </span>
                {contact.location}
              </div>
            )}
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ink hover:text-heading">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-forest/10 text-forest">
                  <Instagram className="h-5 w-5" />
                </span>
                Follow on Instagram
              </a>
            )}
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="h-14 w-14 text-forest" />
              <h2 className="mt-4 text-2xl">Message sent!</h2>
              <p className="mt-2 max-w-sm text-moss">
                Thank you for reaching out, {form.name.split(" ")[0] || "friend"}. Pim will be in touch soon.
              </p>
              <a href={`mailto:${contact.email}?subject=${encodeURIComponent(form.subject || "Hello Pim")}`} className="btn-secondary mt-6">
                Also email directly
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="name">Name</label>
                  <input id="name" required className="field" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="email">Email</label>
                  <input id="email" type="email" required className="field" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="subject">Subject</label>
                <input id="subject" className="field" value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="message">Message</label>
                <textarea id="message" required rows={6} className="field resize-none" value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary w-full">Send message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
