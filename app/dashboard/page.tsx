import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { logout } from "../login/actions";
import { connection } from "next/server";

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
      <p className="mt-4 font-medium text-red-700">
        Could not load your venues: {error.message}
      </p>
    );
  }

  return (
    <>
      <p className="mt-2 text-ink/70">Signed in as {claims.email}</p>

      {venues && venues.length > 0 ? (
        <ul className="mt-6 space-y-2">
          {venues.map((v) => (
            <li
              key={v.id}
              className="rounded-2xl border-2 border-soft p-4 font-medium text-brand"
            >
              {v.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6">No venue is linked to your account yet.</p>
      )}

      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="rounded-full border-2 border-brand px-6 py-2 font-medium text-brand"
        >
          Sign out
        </button>
      </form>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold text-brand">Dashboard</h1>
      <Suspense fallback={<p className="mt-4">Loading...</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
