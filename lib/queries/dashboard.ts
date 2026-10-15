import { createClient } from "@/lib/supabase-server";

export type TagCount = {
  tag_id: number;
  label: string;
  sentiment: "positive" | "negative";
  times_used: number;
};

export async function getVenueTagCounts(venueId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("venue_tag_counts")
    .select("tag_id, label, sentiment, times_used")
    .eq("venue_id", venueId)
    .order("times_used", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((t) => ({
    ...t,
    times_used: Number(t.times_used),
  })) as TagCount[];
}
