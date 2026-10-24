"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitReview, type ReviewState } from "./actions";
import {
  RATING_LABELS,
  tagSentimentForRating,
  type TagSentiment,
} from "@/lib/rating";
import { Button } from "@/components/button";

type Tag = { id: number; label: string; sentiment: TagSentiment };

const initialState: ReviewState = { status: "idle" };
const GROUPS: TagSentiment[] = ["positive", "negative"];

export default function ReviewForm({
  token,
  venueSlug,
  tags,
}: {
  token: string;
  venueSlug: string;
  tags: Tag[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    submitReview,
    initialState,
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const sentiment = rating > 0 ? tagSentimentForRating(rating) : null;

  // If the server says this device already reviewed today, show the read-only view
  useEffect(() => {
    if (state.code === "already_reviewed") router.refresh();
  }, [state, router]);

  function chooseRating(n: number) {
    // Moving between the "liked" and "improve" groups makes earlier picks invalid
    if (
      rating > 0 &&
      tagSentimentForRating(n) !== tagSentimentForRating(rating)
    ) {
      setSelected([]);
    }
    setRating(n);
  }

  function toggleTag(id: number) {
    setSelected((cur) =>
      cur.includes(id)
        ? cur.filter((t) => t !== id)
        : cur.length < 5
          ? [...cur, id]
          : cur,
    );
  }

  if (state.status === "success") {
    return (
      <div className="mt-12 text-center">
        <p className="text-5xl text-accent">★</p>
        <h2 className="mt-4 text-2xl font-bold text-brand">Thank you!</h2>
        <p className="mt-2">Your review has been posted.</p>
        <Link
          href={`/v/${venueSlug}`}
          className="mt-6 inline-block font-medium text-brand underline"
        >
          See the venue page
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 pb-40 md:pb-0">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="rating" value={rating} />

      <p className="text-center font-medium">How was your visit?</p>
      <div className="mt-4 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => chooseRating(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-pressed={n === rating}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl text-background transition ${
              n <= rating ? "bg-accent" : "bg-soft"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="mt-2 h-6 text-center font-medium text-brand">
        {rating > 0 ? RATING_LABELS[rating - 1] : "Tap a star"}
      </p>

      {/* Both tag groups share one grid cell, so the area is always as tall as the
          taller group. Only the matching group is visible, so nothing below moves. */}
      <div className="mt-8 grid">
        {GROUPS.map((group) => {
          const active = sentiment === group;
          return (
            <div
              key={group}
              aria-hidden={!active}
              className={`[grid-area:1/1] transition-[opacity,visibility] duration-300 ${
                active ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <p className="text-center font-medium">
                {group === "positive"
                  ? "What did you like?"
                  : "What can we improve?"}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {tags
                  .filter((t) => t.sentiment === group)
                  .map((t) => (
                    <label
                      key={t.id}
                      className={`cursor-pointer rounded-full border-2 px-4 py-1.5 text-sm transition ${
                        selected.includes(t.id)
                          ? "border-brand bg-brand text-background"
                          : "border-soft"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="tags"
                        value={t.id}
                        checked={selected.includes(t.id)}
                        onChange={() => toggleTag(t.id)}
                        className="sr-only"
                      />
                      {t.label}
                    </label>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <label htmlFor="comment" className="sr-only">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Add a comment (optional)"
          className="w-full rounded-2xl border-2 border-soft bg-transparent p-3 placeholder:text-ink/50 focus:border-brand focus:outline-none"
        />
        <p className="mt-2 text-center text-sm text-ink/60">
          Posted without your name.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-background/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur md:static md:mt-8 md:bg-transparent md:p-0 md:backdrop-blur-none">
        {state.status === "error" && (
          <p
            role="alert"
            className="mx-auto mb-2 max-w-md text-center text-sm font-medium text-red-700"
          >
            {state.message}
          </p>
        )}
        <div className="mx-auto max-w-md">
          <Button
            type="submit"
            size="lg"
            full
            disabled={pending || rating === 0}
          >
            {pending ? "Submitting..." : "Submit review"}
          </Button>
        </div>
      </div>
    </form>
  );
}
