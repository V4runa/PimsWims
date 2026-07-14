"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Images,
  MessageSquareQuote,
  Newspaper,
  Inbox,
  Settings,
  FolderTree,
  LogOut,
  Lock,
  ExternalLink,
} from "lucide-react";
import { useContent } from "@/context/content-context";
import { cn } from "@/lib/utils";

const PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "pimstudio";
const SESSION_KEY = "pims-wims:admin-auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/blog", label: "Journal", icon: Newspaper },
  { href: "/admin/messages", label: "Inbox", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { content } = useContent();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const newCount =
    content.contactMessages.filter((m) => m.status === "new").length +
    content.quoteRequests.filter((q) => q.status === "new").length;

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === "1");
    setChecked(true);
  }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (code === PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  if (!checked) return null;

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-pine px-5">
        <form onSubmit={login} className="w-full max-w-sm rounded-xl3 bg-cream p-8 shadow-lift">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-evergreen text-cream">
              <Lock className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl">Studio login</h1>
            <p className="mt-1 text-sm text-moss">Enter your passcode to manage the site.</p>
          </div>
          <input
            type="password"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Passcode"
            className="field text-center"
          />
          {error && <p className="mt-2 text-center text-sm text-rustwood">That passcode didn&apos;t match.</p>}
          <button type="submit" className="btn-primary mt-4 w-full">Enter studio</button>
          <Link href="/" className="mt-4 block text-center text-sm text-moss hover:text-evergreen">
            ← Back to site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-linen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-oat/50 bg-pine p-4 text-cream/80 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-evergreen font-display text-lg">P</span>
          <span className="font-display text-lg text-cream">Studio CMS</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm font-semibold transition-colors",
                  active ? "bg-cream/15 text-cream" : "hover:bg-cream/10 hover:text-cream"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.href === "/admin/messages" && newCount > 0 && (
                  <span className="rounded-full bg-oatgold px-2 py-0.5 text-xs font-bold text-cedar">{newCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 space-y-1 border-t border-cream/10 pt-4">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm hover:bg-cream/10 hover:text-cream">
            <ExternalLink className="h-5 w-5" /> View site
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm hover:bg-cream/10 hover:text-cream">
            <LogOut className="h-5 w-5" /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-oat/50 bg-pine p-2 no-scrollbar lg:hidden">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold",
                  active ? "bg-cream text-evergreen" : "text-cream/80"
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </div>
        <div className="min-w-0 flex-1 p-5 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
