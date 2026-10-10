"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitReview, type ReviewState } from "./actions";

type Tag = { id: number; label: string };

const initialState: ReviewState = { status: "idle" };

export default function ReviewForm({
  token,
  venueSlug,
  tags,
}: {
  token: string;
  venueSlug: string;
  tags: Tag[];
}) {
  const [state, formAction, pending] = useActionState(
    submitReview,
    initialState,
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

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
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Thank you!</h2>
        <p className="mt-2">Your review has been posted.</p>
        <Link href={`/v/${venueSlug}`} className="mt-4 inline-block underline">
          See the venue page
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <p className="font-medium">How was your visit?</p>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              className={`text-4xl ${n <= rating ? "text-yellow-500" : "text-gray-300"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-medium">What was it good for? (optional)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => (
            <label
              key={t.id}
              className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${
                selected.includes(t.id) ? "bg-black text-white" : ""
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

      <div>
        <label htmlFor="comment" className="font-medium">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={4}
          className="mt-2 w-full rounded border p-2"
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || rating === 0}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
