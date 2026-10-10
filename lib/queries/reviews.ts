import { supabase } from "@/lib/supabase";

export type VenueReview = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  review_tags: { tags: { label: string } | null }[];
};

// Latest reviews, each with its tags attached
export async function getVenueReviews(venueId: string, limit = 20) {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, review_tags(tags(label))")
    .eq("venue_id", venueId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as VenueReview[];
}

// Temporary: a simple average. Step 5 replaces this with a proper weighted score.
export async function getReviewStats(venueId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("venue_id", venueId);

  if (error) throw new Error(error.message);
  const count = data.length;
  const average =
    count === 0 ? 0 : data.reduce((sum, r) => sum + r.rating, 0) / count;
  return { count, average };
}
