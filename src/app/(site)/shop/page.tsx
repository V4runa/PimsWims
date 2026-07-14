import { Suspense } from "react";
import ShopClient from "./shop-client";

export const metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-wide py-24 text-center text-moss">Loading the shop…</div>}>
      <ShopClient />
    </Suspense>
  );
}
