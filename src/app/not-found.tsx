import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="kicker justify-center">Lost in the woods</p>
        <h1 className="mt-3 text-5xl">404</h1>
        <p className="mt-3 max-w-sm text-moss">
          This little path doesn&apos;t lead anywhere. Let&apos;s get you back to the studio.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">Back home</Link>
          <Link href="/shop" className="btn-secondary">Browse the shop</Link>
        </div>
      </div>
    </div>
  );
}
