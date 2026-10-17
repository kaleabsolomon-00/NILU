import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVenueByQrToken } from "@/lib/queries/qr";
import ReviewForm from "./review-form";
import { getTags } from "@/lib/queries/tags";
import VenueCover from "@/components/venue-cover";
import { getVenuePhotoPaths } from "@/lib/queries/photos";

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

  const photoPaths = await getVenuePhotoPaths(venue.id);

  return (
    <>
      <div className="relative aspect-[2/1] overflow-hidden rounded-3xl md:aspect-[16/9]">
        <VenueCover
          path={photoPaths[0] ?? null}
          name={venue.name}
          sizes="(min-width: 768px) 448px, 100vw"
          hero
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-sm text-background/80">You are rating</p>
          <h1 className="text-3xl font-bold text-background">{venue.name}</h1>
        </div>
      </div>
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
