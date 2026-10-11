import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVenueByQrToken } from "@/lib/queries/qr";
import ReviewForm from "./review-form";
import { getTags } from "@/lib/queries/tags";

export const metadata: Metadata = {
  title: "Rate your visit | NILU",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ token: string }> };

async function ReviewGate({ params }: Props) {
  const { token } = await params;
  const [venue, tags] = await Promise.all([
    getVenueByQrToken(token),
    getTags(),
  ]);

  if (!venue) notFound();

  return (
    <>
      <p className="text-center text-sm text-ink/70">You are rating</p>
      <h1 className="text-center text-3xl font-bold text-brand">
        {venue.name}
      </h1>
      <ReviewForm token={token} venueSlug={venue.slug} tags={tags} />
    </>
  );
}
export default function ReviewPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-md p-6 md:my-12 md:rounded-3xl md:border-2 md:border-soft md:p-10">
      {" "}
      <Suspense fallback={<p>Loading...</p>}>
        <ReviewGate params={params} />
      </Suspense>
    </main>
  );
}
