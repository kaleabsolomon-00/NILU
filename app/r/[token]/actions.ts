"use server";
import { tagSentimentForRating } from "@/lib/rating";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getVenueByQrToken } from "@/lib/queries/qr";
import { DEVICE_COOKIE, hashDeviceId } from "@/lib/device";

//shows an already reviewed error if the same device tries to review the same venue on the same day
export type ReviewState = {
  status: "idle" | "success" | "error";
  message?: string;
  code?: "already_reviewed";
};

//submits a review to the database, returns a ReviewState object with status and message
export async function submitReview(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const token = String(formData.get("token") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();
  const tagIds = [...new Set(formData.getAll("tags").map(Number))];

  // 1. Validate the input
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Please choose a star rating." };
  }
  if (comment.length > 1000) {
    return {
      status: "error",
      message: "Your comment is too long (1000 characters max).",
    };
  }
  if (tagIds.length > 5 || tagIds.some((id) => !Number.isInteger(id))) {
    return { status: "error", message: "Invalid tag selection." };
  }

  // 2. Validate the QR token and find the venue from it
  const venue = await getVenueByQrToken(token);
  if (!venue) {
    return { status: "error", message: "This QR code is not valid." };
  }
  // 2b. Tags must exist and must match the rating
  if (tagIds.length > 0) {
    const { data: tagRows, error: tagLookupError } = await supabaseAdmin
      .from("tags")
      .select("id, sentiment")
      .in("id", tagIds);

    const expected = tagSentimentForRating(rating);
    if (
      tagLookupError ||
      !tagRows ||
      tagRows.length !== tagIds.length ||
      tagRows.some((t) => t.sentiment !== expected)
    ) {
      return {
        status: "error",
        message: "Those tags don't match your rating. Please try again.",
      };
    }
  }

  // 3. Identify the device (cookie), then hash it
  const jar = await cookies();
  let deviceId = jar.get(DEVICE_COOKIE)?.value;
  if (!deviceId) {
    deviceId = randomUUID();
    jar.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  const deviceHash = hashDeviceId(deviceId);

  // 4. Save the review
  const { data: review, error } = await supabaseAdmin
    .from("reviews")
    .insert({
      venue_id: venue.id,
      rating,
      comment: comment || null,
      device_hash: deviceHash,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      // unique constraint: same device, same venue, same day
      return {
        status: "error",
        code: "already_reviewed",
        message: "You have already reviewed this place today.",
      };
    }
    console.error(error);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // 5. Save the tags
  if (tagIds.length > 0) {
    const { error: tagError } = await supabaseAdmin
      .from("review_tags")
      .insert(tagIds.map((tag_id) => ({ review_id: review.id, tag_id })));

    if (tagError) {
      // Undo the review so we never keep half a submission
      await supabaseAdmin.from("reviews").delete().eq("id", review.id);
      console.error(tagError);
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }
  }

  return { status: "success" };
}
