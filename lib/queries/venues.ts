import { supabase } from "@/lib/supabase";

export async function getVenueBySlug(slug: string) {
  const { data, error } = await supabase
    .from("venues")
    .select(
      "id, slug, name, category, description, area, address, opening_hours, cover_image_url",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data; // the venue, or null if none matches
}
