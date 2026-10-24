import Link from "next/link";
import type { TodaysReview } from "@/lib/queries/qr";
import { LocalTime } from "./reviewed-today-client";

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-6 w-6 shrink-0 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function ReviewedToday({
  review,
  venueSlug,
}: {
  review: TodaysReview;
  venueSlug: string;
}) {
  const tags = review.review_tags.flatMap((rt) =>
    rt.tags ? [rt.tags.label] : [],
  );

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border-2 border-accent/50 bg-accent/10 p-4">
        <div className="flex gap-3">
          <ClockIcon />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-brand">
                You have already rated this place today
              </p>
              <span className="rounded-full bg-accent/30 px-2 py-0.5 text-xs font-semibold tracking-wide text-ink">
                DAILY LIMIT
              </span>
            </div>
            <p className="mt-1 text-sm text-ink/80">
              To keep reviews fair, each visitor can rate a place once a day.
              Come back tomorrow to rate again.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-soft p-4">
        <div className="flex items-center justify-between text-sm text-ink/60">
          <span>Your rating today</span>
          <LocalTime iso={review.created_at} />
        </div>

        <p
          className="mt-3 text-center text-4xl"
          aria-label={`${review.rating} out of 5 stars`}
        >
          <span className="text-accent">{"★".repeat(review.rating)}</span>
          <span className="text-soft">{"★".repeat(5 - review.rating)}</span>
        </p>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {tags.map((label) => (
              <span
                key={label}
                className="rounded-full border-2 border-soft px-3 py-1 text-xs"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        <p className="mt-3 rounded-xl bg-soft/30 p-3 text-center text-sm italic text-ink/70">
          {review.comment
            ? `\u201C${review.comment}\u201D`
            : "No comment left."}
        </p>

        <button
          type="button"
          disabled
          className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-soft/60 py-3 font-semibold text-ink/50"
        >
          <LockIcon />
          Rating locked until tomorrow
        </button>
      </div>

      <p className="text-center">
        <Link
          href={`/v/${venueSlug}`}
          className="font-medium text-brand underline"
        >
          See what others said
        </Link>
      </p>
    </div>
  );
}
