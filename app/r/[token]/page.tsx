import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVenueByQrToken } from "@/lib/queries/qr";

export const metadata: Metadata = {
  title: "Rate your visit | NILU",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ token: string }> };

async function ReviewGate({ params }: Props) {
  const { token } = await params;
  const venue = await getVenueByQrToken(token);

  if (!venue) notFound();

  return (
    <>
      <p className="text-sm text-gray-500">You are rating</p>
      <h1 className="text-3xl font-bold">{venue.name}</h1>
      <p className="mt-6 text-gray-500">The review form goes here next.</p>
    </>
  );
}

export default function ReviewPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-md p-6">
      <Suspense fallback={<p>Loading...</p>}>
        <ReviewGate params={params} />
      </Suspense>
    </main>
  );
}
