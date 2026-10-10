import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getVenueBySlug } from "@/lib/queries/venues";
import { getVenueReviews, getReviewStats } from "@/lib/queries/reviews";

type Props = { params: Promise<{ slug: string }> };

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span aria-label={`${value.toFixed(1)} out of 5`}>
      <span className="text-yellow-500">{"★".repeat(full)}</span>
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

async function VenueDetails({ params }: Props) {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);

  if (!venue) notFound();

  const [reviews, stats] = await Promise.all([
    getVenueReviews(venue.id),
    getReviewStats(venue.id),
  ]);

  return (
    <>
      <h1 className="text-3xl font-bold">{venue.name}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {venue.category.replace("_", " ")}
        {venue.area ? ` · ${venue.area}` : ""}
      </p>
      {venue.description && <p className="mt-4">{venue.description}</p>}
      {venue.address && <p className="mt-2 text-sm">{venue.address}</p>}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Reviews</h2>

        {stats.count > 0 ? (
          <p className="mt-2 flex items-center gap-2">
            <Stars value={stats.average} />
            <span className="font-medium">{stats.average.toFixed(1)}</span>
            <span className="text-gray-500">
              ({stats.count} review{stats.count === 1 ? "" : "s"})
            </span>
          </p>
        ) : (
          <p className="mt-2 text-gray-500">
            No reviews yet. Scan the QR code at the venue to leave the first
            one.
          </p>
        )}

        <ul className="mt-4 space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <Stars value={r.rating} />
                <time className="text-sm text-gray-500" dateTime={r.created_at}>
                  {new Date(r.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              {r.comment && <p className="mt-2">{r.comment}</p>}
              {r.review_tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.review_tags.map((rt) =>
                    rt.tags ? (
                      <span
                        key={rt.tags.label}
                        className="rounded-full border px-2 py-0.5 text-xs"
                      >
                        {rt.tags.label}
                      </span>
                    ) : null,
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function VenuePage({ params }: Props) {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <Suspense fallback={<p>Loading venue...</p>}>
        <VenueDetails params={params} />
      </Suspense>
    </main>
  );
}
