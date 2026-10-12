import { supabase } from "@/lib/supabase";

export type VenueCard = {
  id: string;
  slug: string;
  name: string;
  category: string;
  area: string | null;
  review_count: number;
  average_rating: number;
  score: number;
  tag_slugs: string[];
};

export async function getVenueCards({
  category,
  tag,
}: {
  category?: string;
  tag?: string;
}) {
  let query = supabase
    .from("venue_cards")
    .select(
      "id, slug, name, category, area, review_count, average_rating, score, tag_slugs",
    )
    .order("score", { ascending: false })
    .order("review_count", { ascending: false })
    .limit(50);

  if (category) query = query.eq("category", category);
  if (tag) query = query.contains("tag_slugs", [tag]);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as VenueCard[];
}
