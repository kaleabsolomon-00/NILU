import { Suspense } from "react";
import Link from "next/link";
import Form from "next/form";
import { getVenueCards } from "@/lib/queries/discover";
import { getTags } from "@/lib/queries/tags";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import VenueCover from "@/components/venue-cover";
import { Button } from "@/components/button";
import { SearchIcon } from "@/components/icons";

type Filters = { category?: string; tag?: string; q?: string };
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// Builds a link to the same page with one thing changed
function buildHref(current: Filters, change: Partial<Filters>) {
  const next = { ...current, ...change };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.category) params.set("category", next.category);
  if (next.tag) params.set("tag", next.tag);
  const qs = params.toString();
  return qs ? `/venues?${qs}` : "/venues";
}

const chip = (active: boolean) =>
  `rounded-full border-2 px-4 py-1.5 text-sm font-medium transition ${
    active
      ? "border-brand bg-brand text-background"
      : "border-soft/80 bg-background/40 hover:border-brand hover:bg-white/40"
  }`;

async function Discovery({ searchParams }: Props) {
  const params = await searchParams;
  const tags = (await getTags()).filter((t) => t.sentiment === "positive");

  // Ignore any value we don't recognise, and tidy the search text
  const rawCategory = first(params.category);
  const rawTag = first(params.tag);
  const rawQuery = (first(params.q) ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);

  const category = CATEGORIES.some((c) => c.value === rawCategory)
    ? rawCategory
    : undefined;
  const tag = tags.some((t) => t.slug === rawTag) ? rawTag : undefined;
  const q = rawQuery || undefined;
  const current: Filters = { category, tag, q };

  const venues = await getVenueCards(current);
  const tagLabels = new Map(tags.map((t) => [t.slug, t.label]));

  return (
    <>
      <div className="mt-4 rounded-[2rem] border-2 border-soft/70 bg-white/25 p-5 md:p-6">
        <Form action="/venues" className="flex gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          {tag && <input type="hidden" name="tag" value={tag} />}
          <label htmlFor="venue-search" className="sr-only">
            Search places by name
          </label>
          <input
            id="venue-search"
            key={q ?? ""}
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name"
            maxLength={60}
            className="min-w-0 flex-1 rounded-full border-2 border-soft/80 bg-background/55 px-5 py-2.5 text-base focus:border-brand focus:bg-background focus:outline-none"
          />
          <Button type="submit" size="md">
            <SearchIcon /> <span className="hidden sm:inline">Search</span>
          </Button>
        </Form>

        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand/60">
              Browse by place
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref(current, { category: undefined })}
                scroll={false}
                className={chip(!category)}
              >
                All
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.value}
                  href={buildHref(current, {
                    category: category === c.value ? undefined : c.value,
                  })}
                  scroll={false}
                  className={chip(category === c.value)}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand/60">
              Browse by feeling
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t.id}
                  href={buildHref(current, {
                    tag: tag === t.slug ? undefined : t.slug,
                  })}
                  scroll={false}
                  className={chip(tag === t.slug)}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-ink/60">
          {venues.length} place{venues.length === 1 ? "" : "s"}
          {q ? ` matching “${q}”` : ""}
          {q && (
            <>
              {" · "}
              <Link
                href={buildHref(current, { q: undefined })}
                scroll={false}
                className="font-medium text-brand underline"
              >
                Clear search
              </Link>
            </>
          )}
        </p>
        {(category || tag) && (
          <Link
            href="/venues"
            scroll={false}
            className="text-sm font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
          >
            Reset filters
          </Link>
        )}
      </div>

      {venues.length === 0 ? (
        <div className="mt-4 rounded-3xl border-2 border-dashed border-soft p-8 text-center">
          <p className="font-display text-2xl font-bold text-brand">
            Nothing here yet.
          </p>
          <p className="mt-1 text-ink/60">
            No places match {q ? `“${q}”` : "these filters"} yet.{" "}
            <Link href="/venues" className="font-medium text-brand underline">
              Clear filters
            </Link>
          </p>
        </div>
      ) : (
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <li key={v.id}>
              <Link
                href={`/v/${v.slug}`}
                className="group block h-full overflow-hidden rounded-[1.5rem] border-2 border-soft/70 bg-white/25 transition duration-200 hover:-translate-y-1 hover:border-brand hover:bg-white/45 motion-reduce:transform-none"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <VenueCover
                    path={v.cover_path}
                    name={v.name}
                    sizes="(min-width: 1024px) 370px, (min-width: 640px) 45vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-night/35 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold leading-tight text-brand">
                        {v.name}
                      </h2>
                      <p className="mt-1 text-sm text-ink/60">
                        {categoryLabel(v.category)}
                        {v.area ? ` · ${v.area}` : ""}
                      </p>
                    </div>
                    <p className="shrink-0 text-right">
                      {v.review_count > 0 ? (
                        <>
                          <span className="text-accent">★</span>{" "}
                          <span className="font-semibold">
                            {Number(v.average_rating).toFixed(1)}
                          </span>{" "}
                          <span className="text-sm text-ink/60">
                            · {v.review_count}
                          </span>
                        </>
                      ) : (
                        <span className="rounded-full bg-soft/55 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                          New
                        </span>
                      )}
                    </p>
                  </div>
                  {v.tag_slugs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {v.tag_slugs.slice(0, 3).map((slug) => (
                        <span
                          key={slug}
                          className="rounded-full border-2 border-soft/80 px-2.5 py-0.5 text-xs"
                        >
                          {tagLabels.get(slug) ?? slug}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function VenuesPage({ searchParams }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-5 md:px-6 md:py-7">
      <Suspense fallback={<p className="mt-6">Loading places...</p>}>
        <Discovery searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
