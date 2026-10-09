import { Suspense } from "react";
import { supabase } from "@/lib/supabase";

async function VenueList() {
  const { data: venues, error } = await supabase
    .from("venues")
    .select("id, slug, name, category, area")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="mt-4">Something went wrong: {error.message}</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {venues.map((v) => (
        <li key={v.id}>
          {v.name} ({v.category}) in {v.area}
        </li>
      ))}
    </ul>
  );
}

export default function VenuesPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Venues</h1>
      <Suspense fallback={<p className="mt-4">Loading venues...</p>}>
        <VenueList />
      </Suspense>
    </main>
  );
}
