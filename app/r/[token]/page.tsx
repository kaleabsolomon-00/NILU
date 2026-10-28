import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVenueByQrToken } from "@/lib/queries/qr";
import ReviewForm from "./review-form";
import { getTags } from "@/lib/queries/tags";
import VenueCover from "@/components/venue-cover";
import { getVenuePhotoPaths } from "@/lib/queries/photos";
import { cookies } from "next/headers";
import { DEVICE_COOKIE, hashDeviceId } from "@/lib/device";
import { getTodaysReviewForDevice } from "@/lib/queries/qr";
import ReviewedToday from "./reviewed-today";
import { LogoMark } from "@/components/logo";

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

  const jar = await cookies();
  const deviceId = jar.get(DEVICE_COOKIE)?.value;

  const [photoPaths, todaysReview] = await Promise.all([
    getVenuePhotoPaths(venue.id),
    deviceId
      ? getTodaysReviewForDevice(venue.id, hashDeviceId(deviceId))
      : Promise.resolve(null),
  ]);

  return (
    <>
      <div className="relative aspect-[5/3] overflow-hidden rounded-[2rem] md:aspect-[16/9]">
        <VenueCover
          path={photoPaths[0] ?? null}
          name={venue.name}
          sizes="(min-width: 768px) 448px, 100vw"
          hero
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sun">
            <LogoMark className="h-5 w-5 brightness-0 invert" />
            Your visit
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold leading-none text-background">
            {venue.name}
          </h1>
        </div>
      </div>

      {todaysReview ? (
        <ReviewedToday review={todaysReview} venueSlug={venue.slug} />
      ) : (
        <ReviewForm token={token} venueSlug={venue.slug} tags={tags} />
      )}
    </>
  );
}

export default function ReviewPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-lg px-4 py-4 md:my-8 md:px-8 md:py-8">
      <Suspense fallback={<p>Loading...</p>}>
        <ReviewGate params={params} />
      </Suspense>
    </main>
  );
}
