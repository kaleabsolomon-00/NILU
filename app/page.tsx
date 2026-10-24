import Form from "next/form";
import { Button, ButtonLink } from "@/components/button";
import { ArrowRightIcon, SearchIcon } from "@/components/icons";

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
        <Button type="submit" size="lg">
          <SearchIcon /> Search
        </Button>
      </Form>

      <ButtonLink href="/venues" variant="secondary" size="lg" className="mt-6">
        Browse all places <ArrowRightIcon />
      </ButtonLink>
    </main>
  );
}
