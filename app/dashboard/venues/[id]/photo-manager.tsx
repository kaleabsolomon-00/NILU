"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { compressImage } from "@/lib/compress-image";
import { uploadPhoto, deletePhoto } from "./actions";

type Photo = { id: string; position: number; url: string };

export default function PhotoManager({
  venueId,
  photos,
}: {
  venueId: string;
  photos: Photo[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    setError("");
    setBusy(true);
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.set("venueId", venueId);
      formData.set("photo", compressed);

      const result = await uploadPhoto(formData);
      if (result.error) setError(result.error);
      else router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
      input.value = "";
    }
  }

  async function onDelete(photoId: string) {
    if (!window.confirm("Delete this photo?")) return;
    setError("");
    setBusy(true);
    try {
      const result = await deletePhoto(venueId, photoId);
      if (result.error) setError(result.error);
      else router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((p, i) => (
          <div
            key={p.id}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-soft"
          >
            <Image
              src={p.url}
              alt={`Venue photo ${i + 1}`}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover"
            />
            {i === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-background">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => onDelete(p.id)}
              disabled={busy}
              className="absolute right-2 top-2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-red-700 disabled:opacity-40"
            >
              Delete
            </button>
          </div>
        ))}

        {photos.length < 3 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-soft text-sm font-medium text-brand disabled:opacity-40"
          >
            {busy ? "Working..." : "+ Add photo"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {error && (
        <p role="alert" className="mt-3 font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
