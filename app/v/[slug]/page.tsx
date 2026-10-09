import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getVenueBySlug } from "@/lib/queries/venues";

type Props = { params: Promise<{ slug: string }> };

async function VenueDetails({ params }: Props) {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);

  if (!venue) notFound();

  return (
    <>
      <h1 className="text-3xl font-bold">{venue.name}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {venue.category.replace("_", " ")}
        {venue.area ? ` · ${venue.area}` : ""}
      </p>
      {venue.description && <p className="mt-4">{venue.description}</p>}
      {venue.address && <p className="mt-2 text-sm">{venue.address}</p>}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {/* Placeholder: real reviews come in the next steps */}
        <p className="mt-2 text-gray-500">No reviews yet.</p>
      </section>
    </>
  );
}

export default function VenuePage({ params }: Props) {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <Suspense fallback={<p>Loading venue...</p>}>
        <VenueDetails params={params} />
      </Suspense>
    </main>
  );
}
