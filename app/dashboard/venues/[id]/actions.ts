"use server";

import { createClient } from "@/lib/supabase-server";
import { isUuid } from "@/lib/uuid";

export type DetailsState = {
  status: "idle" | "saved" | "error";
  message?: string;
};
type Result = { error?: string };

const MAX_PHOTO_BYTES = 900 * 1024;

export async function updateDetails(
  _prev: DetailsState,
  formData: FormData,
): Promise<DetailsState> {
  const venueId = String(formData.get("venueId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const openingHours = String(formData.get("openingHours") ?? "").trim();

  if (!isUuid(venueId)) return { status: "error", message: "Invalid request." };
  if (description.length > 1000)
    return {
      status: "error",
      message: "The description is too long (1000 characters max).",
    };
  if (address.length > 200)
    return {
      status: "error",
      message: "The address is too long (200 characters max).",
    };
  if (area.length > 100)
    return {
      status: "error",
      message: "The area is too long (100 characters max).",
    };
  if (openingHours.length > 300)
    return {
      status: "error",
      message: "Opening hours are too long (300 characters max).",
    };

  const supabase = await createClient({ allowCookieWrites: true });
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims)
    return { status: "error", message: "Please sign in again." };

  const { data, error } = await supabase
    .from("venues")
    .update({
      description: description || null,
      address: address || null,
      area: area || null,
      opening_hours: openingHours || null,
    })
    .eq("id", venueId)
    .select("id");

  if (error) {
    console.error(error);
    return { status: "error", message: "Could not save. Please try again." };
  }
  // The database silently skips rows you don't own, so check we really changed one
  if (!data || data.length === 0) {
    return { status: "error", message: "You can't edit this venue." };
  }
  return { status: "saved", message: "Saved." };
}

export async function uploadPhoto(formData: FormData): Promise<Result> {
  const venueId = String(formData.get("venueId") ?? "");
  const file = formData.get("photo");

  if (!isUuid(venueId)) return { error: "Invalid request." };
  if (!(file instanceof File)) return { error: "No photo received." };
  if (file.size === 0 || file.size > MAX_PHOTO_BYTES) {
    return { error: "That photo is too large. Please try another one." };
  }

  // A real JPEG always starts with these three bytes
  const bytes = new Uint8Array(await file.arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isJpeg) return { error: "Only JPEG photos are accepted." };

  const supabase = await createClient({ allowCookieWrites: true });
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { error: "Please sign in again." };

  // Find a free slot (1 to 3)
  const { data: existing, error: listError } = await supabase
    .from("venue_photos")
    .select("position")
    .eq("venue_id", venueId);
  if (listError) {
    console.error(listError);
    return { error: "Something went wrong. Please try again." };
  }
  const taken = new Set((existing ?? []).map((p) => p.position));
  const position = [1, 2, 3].find((n) => !taken.has(n));
  if (!position)
    return { error: "You can add up to 3 photos. Delete one first." };

  const path = `${venueId}/${crypto.randomUUID()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("venue-photos")
    .upload(path, bytes, { contentType: "image/jpeg", upsert: false });
  if (uploadError) {
    console.error(uploadError);
    return { error: "Upload failed. Please try again." };
  }

  const { error: insertError } = await supabase
    .from("venue_photos")
    .insert({ venue_id: venueId, path, position });
  if (insertError) {
    // Undo the upload so we never keep a file with no record
    await supabase.storage.from("venue-photos").remove([path]);
    console.error(insertError);
    return { error: "Could not save the photo. Please try again." };
  }
  return {};
}

export async function deletePhoto(
  venueId: string,
  photoId: string,
): Promise<Result> {
  if (!isUuid(venueId) || !isUuid(photoId))
    return { error: "Invalid request." };

  const supabase = await createClient({ allowCookieWrites: true });
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { error: "Please sign in again." };

  const { data: photo } = await supabase
    .from("venue_photos")
    .select("id, path")
    .eq("id", photoId)
    .eq("venue_id", venueId)
    .maybeSingle();
  if (!photo) return { error: "Photo not found." };

  const { data: deleted, error } = await supabase
    .from("venue_photos")
    .delete()
    .eq("id", photo.id)
    .select("id");
  if (error || !deleted || deleted.length === 0) {
    return { error: "You can't delete this photo." };
  }

  const { error: removeError } = await supabase.storage
    .from("venue-photos")
    .remove([photo.path]);
  if (removeError) console.error(removeError); // harmless leftover file

  return {};
}
