"use client";

import Link from "next/link";
import { Package, Images, Newspaper, Inbox, MessageSquareQuote, ArrowRight, AlertTriangle } from "lucide-react";
import { useContent } from "@/context/content-context";
import { AdminHeader } from "@/components/admin/admin-ui";
import { timeAgo } from "@/lib/utils";

export default function AdminDashboard() {
  const { content, saveError } = useContent();

  const newMessages = content.contactMessages.filter((m) => m.status === "new").length;
  const newQuotes = content.quoteRequests.filter((q) => q.status === "new").length;

  const stats = [
    { label: "Products", value: content.products.length, href: "/admin/products", icon: Package },
    { label: "Gallery items", value: content.gallery.length, href: "/admin/gallery", icon: Images },
    { label: "Journal posts", value: content.posts.length, href: "/admin/blog", icon: Newspaper },
    { label: "Testimonials", value: content.testimonials.length, href: "/admin/testimonials", icon: MessageSquareQuote },
  ];

  const recent = [
    ...content.quoteRequests.map((q) => ({ kind: "Quote" as const, id: q.id, name: q.name, detail: q.projectType, at: q.createdAt, status: q.status })),
    ...content.contactMessages.map((m) => ({ kind: "Message" as const, id: m.id, name: m.name, detail: m.subject || "General enquiry", at: m.createdAt, status: m.status })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  return (
    <div>
      <AdminHeader title="Welcome back, Pim" description="Here's what's happening in your studio." />

      {saveError && (
        <div className="mb-6 flex items-center gap-3 rounded-xl2 border border-rustwood/40 bg-rustwood/10 p-4 text-sm text-rustwood">
          <AlertTriangle className="h-5 w-5 shrink-0" /> {saveError}
        </div>
      )}

      {(newMessages > 0 || newQuotes > 0) && (
        <Link href="/admin/messages" className="mb-6 flex items-center justify-between rounded-xl2 bg-evergreen p-5 text-cream">
          <div className="flex items-center gap-3">
            <Inbox className="h-6 w-6 text-oatgold" />
            <div>
              <p className="font-display text-lg">You have new messages</p>
              <p className="text-sm text-cream/80">
                {newQuotes} custom {newQuotes === 1 ? "request" : "requests"} · {newMessages} contact {newMessages === 1 ? "message" : "messages"}
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-xl2 border border-oat/50 bg-paper p-5 transition hover:shadow-soft">
            <div className="flex items-center justify-between">
              <s.icon className="h-6 w-6 text-forest" />
              <ArrowRight className="h-4 w-4 text-moss opacity-0 transition group-hover:opacity-100" />
            </div>
            <p className="mt-4 font-display text-3xl text-evergreen">{s.value}</p>
            <p className="text-sm text-moss">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl3 border border-oat/50 bg-paper p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-evergreen">Recent activity</h2>
          <Link href="/admin/messages" className="text-sm font-semibold text-forest hover:text-evergreen">View inbox</Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-6 text-sm text-moss">No submissions yet. When customers reach out, they&apos;ll appear here.</p>
        ) : (
          <ul className="mt-4 divide-y divide-oat/40">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.kind === "Quote" ? "bg-oatgold/30 text-cedar" : "bg-forest/10 text-forest"}`}>
                    {r.kind}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{r.name}</p>
                    <p className="text-xs text-moss">{r.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {r.status === "new" && <span className="h-2 w-2 rounded-full bg-rustwood" />}
                  <span className="text-xs text-moss">{timeAgo(r.at)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
