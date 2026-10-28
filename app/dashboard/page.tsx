import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { logout } from "../login/actions";
import VenuePanel from "./venue-panel";
import { Button } from "@/components/button";
import { LogOutIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";

export const metadata: Metadata = {
  title: "Dashboard | NILU",
  robots: { index: false, follow: false },
};

async function DashboardContent() {
  await connection();
  const supabase = await createClient();

  // Check again here: the proxy is a first gate, not the only one
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  const { data: venues, error } = await supabase
    .from("venues")
    .select("id, slug, name, category")
    .eq("owner_id", claims.sub);

  if (error) {
    return (
      <p className="mt-8 rounded-2xl border border-red-700/20 bg-red-700/5 px-4 py-3 font-medium text-red-700">
        Could not load your venues: {error.message}
      </p>
    );
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b-2 border-soft/70 pb-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand/70">
            Owner space
          </p>
          <p className="mt-1 text-base text-ink/65">
            Signed in as{" "}
            <span className="font-bold text-ink">{claims.email}</span>
          </p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm">
            <LogOutIcon /> Sign out
          </Button>
        </form>
      </div>

      {venues && venues.length > 0 ? (
        venues.map((v) => (
          <VenuePanel key={v.id} venue={v} ownerId={claims.sub} />
        ))
      ) : (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-soft bg-white/25 p-8 text-center">
          <LogoMark className="mx-auto h-14 w-14 opacity-30" />
          <p className="mt-4 text-lg font-bold text-brand">
            No venue is linked to your account yet.
          </p>
          <p className="mt-1 text-ink/60">
            Contact the NILU team to get your owner page set up.
          </p>
        </div>
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-night px-6 py-8 text-background shadow-2xl shadow-night/10 md:px-10 md:py-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-background/10" />
        <div className="absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-brand/40 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.22em] text-sun">
            <span className="h-2 w-2 rounded-full bg-sun" aria-hidden="true" />
            NILU dashboard
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[0.98] tracking-tight md:text-6xl">
            A clearer read on
            <span className="block text-sun">your place.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-background/80 md:text-xl">
            Manage your venue, view your data, and get the most out of NILU.
          </p>
        </div>
      </div>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
