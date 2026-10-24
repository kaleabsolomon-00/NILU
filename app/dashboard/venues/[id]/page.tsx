import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { photoUrl } from "@/lib/photo-url";
import { isUuid } from "@/lib/uuid";
import DetailsForm from "./details-form";
import PhotoManager from "./photo-manager";
import { ButtonLink } from "@/components/button";
import { ArrowLeftIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Edit your place | NILU",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

async function EditContent({ params }: Props) {
  await connection();
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const claims = auth?.claims;
  if (!claims) redirect("/login");

  // Only the owner's own venue can be loaded here
  const { data: venue, error } = await supabase
    .from("venues")
    .select("id, name, description, address, area, opening_hours")
    .eq("id", id)
    .eq("owner_id", claims.sub)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!venue) notFound();

  const { data: photoRows, error: photoError } = await supabase
    .from("venue_photos")
    .select("id, path, position")
    .eq("venue_id", venue.id)
    .order("position");
  if (photoError) throw new Error(photoError.message);

  const photos = (photoRows ?? []).map((p) => ({
    id: p.id,
    position: p.position,
    url: photoUrl(p.path),
  }));

  return (
    <>
      <ButtonLink href="/dashboard" variant="ghost" size="sm">
        <ArrowLeftIcon /> Back to dashboard
      </ButtonLink>
      <h1 className="mt-2 text-3xl font-bold text-brand">{venue.name}</h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-brand">Photos</h2>
        <p className="mt-1 text-sm text-ink/70">
          Add up to 3 clear photos of your place. The first one is your cover
          photo.
        </p>
        <PhotoManager venueId={venue.id} photos={photos} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-brand">Details</h2>
        <DetailsForm
          venueId={venue.id}
          initial={{
            description: venue.description ?? "",
            address: venue.address ?? "",
            area: venue.area ?? "",
            openingHours: venue.opening_hours ?? "",
          }}
        />
      </section>
    </>
  );
}

export default function EditVenuePage({ params }: Props) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Suspense fallback={<p>Loading...</p>}>
        <EditContent params={params} />
      </Suspense>
    </main>
  );
}
