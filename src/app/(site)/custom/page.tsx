import { Suspense } from "react";
import CustomClient from "./custom-client";

export const metadata = {
  title: "Make Me Something — Custom Requests",
  description: "Commission a one-of-a-kind handmade piece from Pim.",
};

export default function CustomPage() {
  return (
    <Suspense fallback={<div className="container-wide py-24 text-center text-moss">Loading…</div>}>
      <CustomClient />
    </Suspense>
  );
}
