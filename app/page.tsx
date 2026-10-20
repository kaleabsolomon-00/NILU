import Link from "next/link";
import Form from "next/form";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-brand">NILU</h1>
      <p className="mt-4 text-xl text-ink/80">
        Discover the best-rated places to spend your time, reviewed by people
        who were really there.
      </p>

      <Form action="/venues" className="mt-8 flex w-full max-w-md gap-2">
        <input
          type="search"
          name="q"
          placeholder="Search for a place"
          aria-label="Search places by name"
          maxLength={60}
          className="min-w-0 flex-1 rounded-full border-2 border-soft bg-transparent px-5 py-3 focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-3 font-semibold text-background"
        >
          Search
        </button>
      </Form>

      <Link href="/venues" className="mt-6 font-medium text-brand underline">
        or browse all places
      </Link>
    </main>
  );
}
