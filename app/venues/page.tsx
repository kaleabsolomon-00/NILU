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
  `rounded-full border-2 px-4 py-1.5 text-sm transition ${
    active
      ? "border-brand bg-brand text-background"
      : "border-soft hover:border-brand"
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
      <Form action="/venues" className="mt-6 flex gap-2">
        {category && <input type="hidden" name="category" value={category} />}
        {tag && <input type="hidden" name="tag" value={tag} />}
        <input
          key={q ?? ""}
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name"
          aria-label="Search places by name"
          maxLength={60}
          className="min-w-0 flex-1 rounded-full border-2 border-soft bg-transparent px-4 py-2 focus:border-brand focus:outline-none"
        />
        <Button type="submit">
          <SearchIcon /> Search
        </Button>
      </Form>

      <div className="mt-4 space-y-3">
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

      <p className="mt-6 text-sm text-ink/60">
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

      {venues.length === 0 ? (
        <p className="mt-4">
          No places match {q ? `“${q}”` : "these filters"} yet.{" "}
          <Link href="/venues" className="font-medium text-brand underline">
            Clear filters
          </Link>
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {venues.map((v) => (
            <li key={v.id}>
              <Link
                href={`/v/${v.slug}`}
                className="block h-full overflow-hidden rounded-2xl border-2 border-soft transition hover:border-brand"
              >
                <div className="relative aspect-[16/9]">
                  <VenueCover
                    path={v.cover_path}
                    name={v.name}
                    sizes="(min-width: 768px) 400px, 100vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-brand">
                        {v.name}
                      </h2>
                      <p className="text-sm text-ink/60">
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
                            ({v.review_count})
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-ink/60">New</span>
                      )}
                    </p>
                  </div>
                  {v.tag_slugs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {v.tag_slugs.slice(0, 3).map((slug) => (
                        <span
                          key={slug}
                          className="rounded-full border-2 border-soft px-2 py-0.5 text-xs"
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
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold text-brand">Explore</h1>
      <p className="mt-1 text-ink/70">Find your next destination.</p>
      <Suspense fallback={<p className="mt-6">Loading places...</p>}>
        <Discovery searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
