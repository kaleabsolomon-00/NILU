import { supabase } from "@/lib/supabase";

export async function getTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("id, label, sentiment")
    .order("id");

  if (error) throw new Error(error.message);
  return data;
}
