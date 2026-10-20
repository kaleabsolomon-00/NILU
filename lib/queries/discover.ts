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
  cover_path: string | null;
};

export async function getVenueCards({
  category,
  tag,
  q,
}: {
  category?: string;
  tag?: string;
  q?: string;
}) {
  let query = supabase
    .from("venue_cards")
    .select(
      "id, slug, name, category, area, review_count, average_rating, score, tag_slugs, cover_path",
    )
    .order("score", { ascending: false })
    .order("review_count", { ascending: false })
    .limit(50);

  if (category) query = query.eq("category", category);
  if (tag) query = query.contains("tag_slugs", [tag]);
  if (q) {
    // Escape LIKE wildcards so typing % or _ can't match everything
    const escaped = q.replace(/[\\%_]/g, "\\$&");
    query = query.ilike("name", `%${escaped}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as VenueCard[];
}
