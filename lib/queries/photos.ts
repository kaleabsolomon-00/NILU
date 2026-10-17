import { supabase } from "@/lib/supabase";

// Photo paths for a venue, cover first
export async function getVenuePhotoPaths(venueId: string) {
  const { data, error } = await supabase
    .from("venue_photos")
    .select("path")
    .eq("venue_id", venueId)
    .order("position");

  if (error) throw new Error(error.message);
  return (data ?? []).map((p) => p.path as string);
}
