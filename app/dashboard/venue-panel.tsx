import { getVenueRating, getVenueReviews } from "@/lib/queries/reviews";
import { getVenueTagCounts, type TagCount } from "@/lib/queries/dashboard";
import { getQrTokenForOwner } from "@/lib/queries/qr";
import { categoryLabel } from "@/lib/categories";
import { ButtonLink, buttonClasses } from "@/components/button";
import { PencilIcon, ExternalIcon, DownloadIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";

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
              className={`h-2 rounded-full ${
                items[0]?.sentiment === "positive" ? "bg-accent" : "bg-brand"
              }`}
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
    <section className="mt-8 overflow-hidden rounded-[2rem] border-2 border-soft/70 bg-white/35 shadow-xl shadow-night/5">
      <div className="border-b-2 border-soft/70 bg-white/30 p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-brand p-3 shadow-lg shadow-brand/15">
              <LogoMark className="h-9 w-9 brightness-0 invert" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand/60">
                Your place
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold leading-none text-brand">
                {venue.name}
              </h2>
              <p className="mt-2 text-sm text-ink/60">
                {categoryLabel(venue.category)}
              </p>
            </div>
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
      </div>

      <div className="p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl bg-brand p-6 text-background">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-background/60">
              Current signal
            </p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <p className="font-display text-5xl font-bold leading-none">
                {rating.count > 0 ? (
                  <>
                    <span className="text-sun">★</span>{" "}
                    {rating.average.toFixed(1)}
                  </>
                ) : (
                  "–"
                )}
              </p>
              <p className="max-w-32 text-right text-sm leading-snug text-background/65">
                Based on what visitors are saying lately.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border-2 border-soft/70 bg-background/45 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-ink/50">
              Reviews received
            </p>
            <p className="mt-5 font-display text-5xl font-bold leading-none text-ink">
              {rating.count}
            </p>
            <p className="mt-2 text-sm text-ink/60">
              {rating.count === 1 ? "visitor has" : "visitors have"} shared a
              perspective.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t-2 border-soft/60 pt-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand/60">
              Listen closely
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-brand">
              What to improve
            </h3>
            <TagBars items={improve} empty="Nothing reported yet." />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand/60">
              Keep this
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-brand">
              What people love
            </h3>
            <TagBars items={loved} empty="No tags yet." />
          </div>
        </div>

        <details className="group mt-12 border-t-2 border-soft/60 pt-8">
          <summary className="flex cursor-pointer list-none items-end justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand/60">
                In their words
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-brand">
                Latest reviews
              </h3>
            </div>
            <span className="flex items-center gap-2 text-sm text-ink/50">
              <span className="hidden sm:inline">
                {reviews.length > 0 ? `${reviews.length} newest` : "None yet"}
              </span>
              <span
                aria-hidden="true"
                className="text-2xl leading-none transition-transform group-open:rotate-45"
              >
                +
              </span>
            </span>
          </summary>
          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-ink/60">No reviews yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border-2 border-soft/70 bg-background/60 p-4 transition-colors hover:border-brand/40"
                >
                  <div className="flex items-center justify-between">
                    <span aria-label={`${r.rating} out of 5`}>
                      <span className="text-accent">
                        {"★".repeat(r.rating)}
                      </span>
                      <span className="text-soft">
                        {"★".repeat(5 - r.rating)}
                      </span>
                    </span>
                    <time
                      className="text-sm text-ink/60"
                      dateTime={r.created_at}
                    >
                      {new Date(r.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  {r.comment && (
                    <p className="mt-3 font-display text-lg leading-snug text-ink">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  )}
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
        </details>

        {qrToken && (
          <div className="relative mt-12 flex flex-wrap items-center gap-6 overflow-hidden rounded-3xl bg-night p-5 text-background md:p-6">
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border border-background/10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/qr/${qrToken}`}
              alt={`QR code for ${venue.name}`}
              width={160}
              height={160}
              className="rounded-xl border-4 border-background bg-white"
            />
            <div className="relative max-w-sm">
              <h3 className="mt-2 font-display text-xl font-bold text-background">
                Your QR code
              </h3>
              <p className="mt-1 text-sm text-background/70">
                Print it and place it where customers will see it, like on
                tables or at the counter.
              </p>
              <a
                href={`/api/qr/${qrToken}`}
                download={`nilu-qr-${venue.slug}.png`}
                className={`${buttonClasses({ size: "sm", variant: "light" })} mt-4`}
              >
                <DownloadIcon /> Download QR code
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
