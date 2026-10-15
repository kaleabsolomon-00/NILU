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
