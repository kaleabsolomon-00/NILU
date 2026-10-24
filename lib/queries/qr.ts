import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getVenueByQrToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from("venues")
    .select("id, slug, name, category")
    .eq("qr_token", token)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data; // null if the token matches nothing
}

export async function getQrTokenForOwner(venueId: string, ownerId: string) {
  const { data, error } = await supabaseAdmin
    .from("venues")
    .select("qr_token")
    .eq("id", venueId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.qr_token ?? null;
}

export type TodaysReview = {
  rating: number;
  comment: string | null;
  created_at: string;
  review_tags: { tags: { label: string } | null }[];
};

// This device's review for this venue today, or null
export async function getTodaysReviewForDevice(
  venueId: string,
  deviceHash: string,
) {
  const today = new Date().toISOString().slice(0, 10); // the database's day is in UTC

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("rating, comment, created_at, review_tags(tags(label))")
    .eq("venue_id", venueId)
    .eq("device_hash", deviceHash)
    .eq("visit_date", today)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as unknown as TodaysReview | null;
}
