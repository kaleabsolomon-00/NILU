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

// to calculate a real weighted rating score

export async function getVenueRating(venueId: string) {
  const { data, error } = await supabase
    .from("venue_ratings")
    .select("review_count, average_rating, score")
    .eq("venue_id", venueId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return {
    count: Number(data?.review_count ?? 0),
    average: Number(data?.average_rating ?? 0),
    score: Number(data?.score ?? 0),
  };
}
