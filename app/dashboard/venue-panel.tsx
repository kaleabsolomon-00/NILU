import Link from "next/link";
import { getVenueRating, getVenueReviews } from "@/lib/queries/reviews";
import { getVenueTagCounts, type TagCount } from "@/lib/queries/dashboard";
import { getQrTokenForOwner } from "@/lib/queries/qr";
import { categoryLabel } from "@/lib/categories";
import { ButtonLink, buttonClasses } from "@/components/button";
import { PencilIcon, ExternalIcon, DownloadIcon } from "@/components/icons";

type Venue = { id: string; slug: string; name: string; category: string };

function TagBars({ items, empty }: { items: TagCount[]; empty: string }) {
  if (items.length === 0) {
    return <p className="mt-3 text-sm text-ink/60">{empty}</p>;
  }
  const max = Math.max(...items.map((i) => i.times_used));

  return (
    <ul className="mt-3 space-y-3">
      {items.map((t) => (
        <li key={t.tag_id}>
          <div className="flex justify-between text-sm">
            <span>{t.label}</span>
            <span className="text-ink/60">{t.times_used}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-soft">
            <div
              className="h-2 rounded-full bg-brand"
              style={{ width: `${(t.times_used / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function VenuePanel({
  venue,
  ownerId,
}: {
  venue: Venue;
  ownerId: string;
}) {
  const [rating, reviews, tagCounts, qrToken] = await Promise.all([
    getVenueRating(venue.id),
    getVenueReviews(venue.id, 10),
    getVenueTagCounts(venue.id),
    getQrTokenForOwner(venue.id, ownerId),
  ]);

  const improve = tagCounts
    .filter((t) => t.sentiment === "negative")
    .slice(0, 5);
  const loved = tagCounts.filter((t) => t.sentiment === "positive").slice(0, 5);

  return (
    <section className="mt-10 rounded-3xl border-2 border-soft p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-brand">{venue.name}</h2>
          <p className="text-sm text-ink/60">{categoryLabel(venue.category)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink
            href={`/dashboard/venues/${venue.id}`}
            variant="secondary"
            size="sm"
          >
            <PencilIcon /> Edit details &amp; photos
          </ButtonLink>
          <ButtonLink href={`/v/${venue.slug}`} variant="ghost" size="sm">
            View public page <ExternalIcon />
          </ButtonLink>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-soft/40 p-4">
          <p className="text-sm text-ink/60">Average rating</p>
          <p className="mt-1 text-3xl font-bold">
            {rating.count > 0 ? (
              <>
                <span className="text-accent">★</span>{" "}
                {rating.average.toFixed(1)}
              </>
            ) : (
              "–"
            )}
          </p>
        </div>
        <div className="rounded-2xl bg-soft/40 p-4">
          <p className="text-sm text-ink/60">Reviews</p>
          <p className="mt-1 text-3xl font-bold">{rating.count}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-semibold text-brand">What to improve</h3>
          <TagBars items={improve} empty="Nothing reported yet." />
        </div>
        <div>
          <h3 className="font-semibold text-brand">What people love</h3>
          <TagBars items={loved} empty="No tags yet." />
        </div>
      </div>

      <h3 className="mt-8 font-semibold text-brand">Latest reviews</h3>
      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-ink/60">No reviews yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border-2 border-soft p-4">
              <div className="flex items-center justify-between">
                <span aria-label={`${r.rating} out of 5`}>
                  <span className="text-accent">{"★".repeat(r.rating)}</span>
                  <span className="text-soft">{"★".repeat(5 - r.rating)}</span>
                </span>
                <time className="text-sm text-ink/60" dateTime={r.created_at}>
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
                        className="rounded-full border-2 border-soft px-2 py-0.5 text-xs"
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
      )}

      {qrToken && (
        <div className="mt-8 flex flex-wrap items-center gap-6 border-t-2 border-soft pt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/qr/${qrToken}`}
            alt={`QR code for ${venue.name}`}
            width={160}
            height={160}
            className="rounded-xl border-2 border-soft bg-white"
          />
          <div>
            <h3 className="font-semibold text-brand">Your QR code</h3>
            <p className="mt-1 max-w-sm text-sm text-ink/70">
              Print it and place it where customers will see it, like on tables
              or at the counter. Scanning it opens the review page for your
              place.
            </p>
            <a
              href={`/api/qr/${qrToken}`}
              download={`nilu-qr-${venue.slug}.png`}
              className={`${buttonClasses({ size: "sm" })} mt-3`}
            >
              <DownloadIcon /> Download QR code
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
