import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-brand">NILU</h1>
      <p className="mt-4 text-xl text-ink/80">
        Discover the best-rated places to spend your time, reviewed by people
        who were really there.
      </p>
      <Link
        href="/venues"
        className="mt-8 rounded-full bg-brand px-8 py-3 text-lg font-semibold text-background"
      >
        Explore places
      </Link>
    </main>
  );
}
