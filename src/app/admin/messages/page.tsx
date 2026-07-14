"use client";

import { useState } from "react";
import { Trash2, Mail, Check, Archive, Reply } from "lucide-react";
import { useContent } from "@/context/content-context";
import { AdminHeader, EmptyState } from "@/components/admin/admin-ui";
import SmartImage from "@/components/smart-image";
import { cn, formatDate } from "@/lib/utils";
import type { SubmissionStatus } from "@/lib/types";

type Tab = "quotes" | "contact";

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  new: "bg-rustwood/15 text-rustwood",
  read: "bg-oat/40 text-cedar",
  replied: "bg-fern/15 text-fern",
  archived: "bg-ink/10 text-ink/50",
};

export default function AdminMessages() {
  const { content, setSubmissionStatus, deleteSubmission } = useContent();
  const [tab, setTab] = useState<Tab>("quotes");
  const [selected, setSelected] = useState<string | null>(null);

  const quotes = content.quoteRequests;
  const messages = content.contactMessages;
  const kind = tab === "quotes" ? "quote" : "contact";

  const activeQuote = quotes.find((q) => q.id === selected);
  const activeMsg = messages.find((m) => m.id === selected);

  function open(id: string) {
    setSelected(id);
    setSubmissionStatus(kind, id, "read");
  }

  const newQuotes = quotes.filter((q) => q.status === "new").length;
  const newMsgs = messages.filter((m) => m.status === "new").length;

  return (
    <div>
      <AdminHeader title="Inbox" description="Custom requests and contact messages from your customers." />

      <div className="mb-6 flex gap-2">
        <button onClick={() => { setTab("quotes"); setSelected(null); }}
          className={cn("rounded-full px-4 py-2 text-sm font-semibold", tab === "quotes" ? "bg-evergreen text-cream" : "bg-paper text-ink/70 border border-oat/60")}>
          Custom requests {newQuotes > 0 && <span className="ml-1 rounded-full bg-oatgold px-1.5 text-xs text-cedar">{newQuotes}</span>}
        </button>
        <button onClick={() => { setTab("contact"); setSelected(null); }}
          className={cn("rounded-full px-4 py-2 text-sm font-semibold", tab === "contact" ? "bg-evergreen text-cream" : "bg-paper text-ink/70 border border-oat/60")}>
          Contact messages {newMsgs > 0 && <span className="ml-1 rounded-full bg-oatgold px-1.5 text-xs text-cedar">{newMsgs}</span>}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* List */}
        <div className="space-y-2">
          {tab === "quotes" && (quotes.length === 0
            ? <EmptyState title="No custom requests yet" />
            : quotes.map((q) => (
              <button key={q.id} onClick={() => open(q.id)}
                className={cn("w-full rounded-xl2 border p-4 text-left transition", selected === q.id ? "border-forest bg-forest/5" : "border-oat/50 bg-paper hover:border-forest/50")}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">{q.name}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_STYLE[q.status])}>{q.status}</span>
                </div>
                <p className="mt-1 text-sm text-moss">{q.projectType}</p>
                <p className="text-xs text-moss">{formatDate(q.createdAt)}</p>
              </button>
            )))}

          {tab === "contact" && (messages.length === 0
            ? <EmptyState title="No messages yet" />
            : messages.map((m) => (
              <button key={m.id} onClick={() => open(m.id)}
                className={cn("w-full rounded-xl2 border p-4 text-left transition", selected === m.id ? "border-forest bg-forest/5" : "border-oat/50 bg-paper hover:border-forest/50")}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">{m.name}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_STYLE[m.status])}>{m.status}</span>
                </div>
                <p className="mt-1 truncate text-sm text-moss">{m.subject || m.message}</p>
                <p className="text-xs text-moss">{formatDate(m.createdAt)}</p>
              </button>
            )))}
        </div>

        {/* Detail */}
        <div className="rounded-xl3 border border-oat/50 bg-paper p-6">
          {tab === "quotes" && activeQuote ? (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl text-heading">{activeQuote.projectType}</h2>
                  <p className="text-moss">from {activeQuote.name} · {formatDate(activeQuote.createdAt)}</p>
                </div>
                <SubmissionActions kind="quote" id={activeQuote.id} status={activeQuote.status}
                  email={activeQuote.email} subject={`Your custom request: ${activeQuote.projectType}`}
                  onDelete={() => { deleteSubmission("quote", activeQuote.id); setSelected(null); }}
                  setStatus={setSubmissionStatus} />
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl2 bg-linen/60 p-4 text-sm">
                <Info label="Email" value={activeQuote.email} />
                <Info label="Phone" value={activeQuote.phone} />
                <Info label="Colors" value={activeQuote.colors} />
                <Info label="Size" value={activeQuote.size} />
                <Info label="Budget" value={activeQuote.budget} />
                <Info label="Timeline" value={activeQuote.timeline} />
              </dl>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wide text-moss">Description</p>
                <p className="mt-1 whitespace-pre-wrap text-ink/85">{activeQuote.description}</p>
              </div>

              {activeQuote.references && activeQuote.references.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wide text-moss">Inspiration images</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {activeQuote.references.map((img) => (
                      <span key={img.id} className="h-24 w-24 overflow-hidden rounded-xl2"><SmartImage image={img} className="h-full w-full" /></span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : tab === "contact" && activeMsg ? (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl text-heading">{activeMsg.subject || "Message"}</h2>
                  <p className="text-moss">from {activeMsg.name} · {formatDate(activeMsg.createdAt)}</p>
                </div>
                <SubmissionActions kind="contact" id={activeMsg.id} status={activeMsg.status}
                  email={activeMsg.email} subject={`Re: ${activeMsg.subject || "your message"}`}
                  onDelete={() => { deleteSubmission("contact", activeMsg.id); setSelected(null); }}
                  setStatus={setSubmissionStatus} />
              </div>
              <p className="mt-2 text-sm text-moss">{activeMsg.email}</p>
              <p className="mt-6 whitespace-pre-wrap text-ink/85">{activeMsg.message}</p>
            </div>
          ) : (
            <div className="grid h-full place-items-center py-20 text-center text-moss">
              <div>
                <Mail className="mx-auto h-10 w-10 opacity-40" />
                <p className="mt-3">Select an item to read it.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-moss">{label}</dt>
      <dd className="text-ink">{value || "—"}</dd>
    </div>
  );
}

function SubmissionActions({
  kind, id, status, email, subject, onDelete, setStatus,
}: {
  kind: "quote" | "contact";
  id: string;
  status: SubmissionStatus;
  email: string;
  subject: string;
  onDelete: () => void;
  setStatus: (kind: "quote" | "contact", id: string, status: SubmissionStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}`} className="btn-secondary px-3 py-2 text-xs">
        <Reply className="h-4 w-4" /> Reply
      </a>
      <button onClick={() => setStatus(kind, id, "replied")} className="btn-secondary px-3 py-2 text-xs" disabled={status === "replied"}>
        <Check className="h-4 w-4" /> Mark replied
      </button>
      <button onClick={() => setStatus(kind, id, "archived")} className="btn-secondary px-3 py-2 text-xs">
        <Archive className="h-4 w-4" /> Archive
      </button>
      <button onClick={onDelete} className="btn-secondary border-rustwood/40 px-3 py-2 text-xs text-rustwood hover:bg-rustwood/10">
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </div>
  );
}
