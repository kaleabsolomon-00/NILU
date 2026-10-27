import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import hero from "@/assets/hero.jpg";
import { Button, ButtonLink, buttonClasses } from "@/components/button";
import { ArrowRightIcon, SearchIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import SiteFooter from "@/components/site-footer";
import { CATEGORIES } from "@/lib/categories";

// How owners can reach you. Leave empty to hide the button.
// Examples: "mailto:you@example.com" or "https://t.me/yourname"
const OWNER_CONTACT_HREF = "";

const VIBES = [
  { label: "Date spot", slug: "date-spot" },
  { label: "Study-friendly", slug: "study-friendly" },
  { label: "Good for groups", slug: "good-for-groups" },
  { label: "Family-friendly", slug: "family-friendly" },
  { label: "Quiet", slug: "quiet" },
  { label: "Great view", slug: "great-view" },
];

const STEPS = [
  {
    n: "01",
    title: "Scan at the venue",
    text: "Every NILU place has its own QR code. Scanning it is how we know you were really there.",
    tone: "bg-brand text-background",
  },
  {
    n: "02",
    title: "Rate in a minute",
    text: "Pick your stars, tap what you liked or what could be better, and add a comment if you want. No account needed.",
    tone: "bg-soft text-ink",
  },
  {
    n: "03",
    title: "Discover with confidence",
    text: "Places are ranked by what real visitors said, so the best ones rise to the top.",
    tone: "bg-night text-background",
  },
];

const TRUST_POINTS = [
  {
    title: "Verified visits",
    text: "A review can only be left by scanning the QR code at the venue, so the people rating a place have really been there.",
  },
  {
    title: "No names, no noise",
    text: "Reviews are posted without your name, and each device can rate a place once a day.",
  },
  {
    title: "Fair rankings",
    text: "New places don't shoot to the top on a single review. Rankings weigh how many people reviewed and how recent the reviews are.",
  },
  {
    title: "Made to improve places",
    text: "Tags show what people loved and what could be better, so owners know exactly what to work on.",
  },
];

function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] ${
        light ? "text-background/70" : "text-ink/60"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </p>
  );
}

// A slowly turning round badge, like a stamp
function SealBadge() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-5 top-5 hidden h-28 w-28 items-center justify-center md:flex lg:right-8 lg:top-8 lg:h-36 lg:w-36"
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full animate-[spin_30s_linear_infinite] motion-reduce:animate-none"
      >
        <defs>
          <path id="seal-circle" d="M14 60a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
        </defs>
        <circle
          cx="60"
          cy="60"
          r="59"
          className="fill-background"
          fillOpacity="0.94"
        />
        <text className="fill-brand" fontSize="10.5" fontWeight="700">
          <textPath href="#seal-circle" textLength="286" lengthAdjust="spacing">
            REAL VISITS • REAL REVIEWS •{" "}
          </textPath>
        </text>
      </svg>
      <LogoMark className="relative h-12 w-12 text-brand lg:h-14 lg:w-14" />
    </div>
  );
}

function Hero() {
  return (
    <section className="px-3 pt-3 md:px-5 md:pt-4">
      <div className="relative isolate overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        <Image
          src={hero}
          alt=""
          fill
          sizes="100vw"
          quality={60}
          placeholder="blur"
          loading="eager"
          fetchPriority="high"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-night/60" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-night/70 via-transparent to-night/30" />

        <SealBadge />

        <div className="relative flex min-h-[calc(100svh-6.5rem)] flex-col items-center justify-center px-5 py-20 text-center md:px-10">
          <h1 className="max-w-5xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-background [text-shadow:0_2px_30px_rgb(0_0_0/0.35)] sm:text-6xl md:text-7xl lg:text-8xl">
            Discover places worth
            <span className="mt-1 block font-medium italic text-sun">
              your time &amp; money.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-background/90 sm:text-xl">
            Real reviews from people who were really there.
          </p>

          <ButtonLink
            href="/venues"
            variant="light"
            size="xl"
            className="group mt-10 shadow-[0_12px_40px_-8px_rgb(227_185_100/0.55)]"
          >
            Explore places
            <ArrowRightIcon className="h-6 w-6 transition-transform group-hover:translate-x-1 sm:h-7 sm:w-7" />
          </ButtonLink>

          <div className="mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            <span className="mr-1 w-full text-xs font-bold uppercase tracking-[0.22em] text-background/70 sm:w-auto">
              Or start with a vibe
            </span>
            {VIBES.map((v) => (
              <Link
                key={v.slug}
                href={`/venues?tag=${v.slug}`}
                className="rounded-full bg-background/90 px-4 py-1.5 text-sm font-semibold text-brand transition hover:-translate-y-0.5 hover:bg-background motion-reduce:transform-none"
              >
                {v.label}
              </Link>
            ))}
          </div>

          <Form
            action="/venues"
            className="mt-10 flex w-full max-w-xs items-center gap-2 rounded-full bg-background/90 p-1.5 pl-5 focus-within:ring-2 focus-within:ring-background"
          >
            <label htmlFor="home-q" className="sr-only">
              Search places by name
            </label>
            <input
              id="home-q"
              type="search"
              name="q"
              maxLength={60}
              placeholder="Know a place? Search by name"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink/60 focus:outline-none"
            />
            <Button type="submit" size="sm" aria-label="Search places">
              <SearchIcon />
            </Button>
          </Form>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="how"
      className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:px-8 md:py-28"
    >
      <Eyebrow>How it works</Eyebrow>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-4xl font-bold text-brand md:text-6xl">
        Three steps to a review you can trust
      </h2>
      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className={`flex min-h-64 flex-col justify-between rounded-[2rem] p-7 ${s.tone}`}
          >
            <span className="font-display text-7xl font-bold opacity-30">
              {s.n}
            </span>
            <div>
              <h3 className="font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 opacity-90">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ExploreByType() {
  const categories = CATEGORIES.filter((c) => c.value !== "other");
  const tile =
    "group flex min-h-28 items-end justify-between rounded-3xl p-5 font-display text-xl font-bold transition hover:-translate-y-1 motion-reduce:transform-none";

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
      <Eyebrow>Find your kind of place</Eyebrow>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-4xl font-bold text-brand md:text-6xl">
        Where do you feel like going?
      </h2>
      <ul className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <li>
          <Link
            href="/venues"
            className={`${tile} bg-brand text-background hover:bg-night`}
          >
            All places
            <ArrowRightIcon className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.value}>
            <Link
              href={`/venues?category=${c.value}`}
              className={`${tile} bg-soft/50 text-brand hover:bg-brand hover:text-background`}
            >
              {c.label}
              <ArrowRightIcon className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Trust() {
  return (
    <section className="mx-3 rounded-[2rem] bg-night p-7 text-background md:mx-5 md:p-14">
      <Eyebrow light>Why NILU</Eyebrow>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-4xl font-bold md:text-6xl">
        Honest by design
      </h2>
      <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {TRUST_POINTS.map((p) => (
          <li key={p.title} className="border-t border-background/20 pt-5">
            <h3 className="font-display text-2xl font-bold">{p.title}</h3>
            <p className="mt-2 text-background/80">{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Owners() {
  return (
    <section className="relative mx-3 mt-3 overflow-hidden rounded-[2rem] bg-brand p-7 text-background md:mx-5 md:mt-5 md:p-14">
      <LogoMark className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 text-background/10 md:h-96 md:w-96" />
      <div className="relative max-w-2xl">
        <Eyebrow light>For venue owners</Eyebrow>
        <h2 className="mt-4 text-balance font-display text-4xl font-bold md:text-6xl">
          Own a place? Get your own NILU page and QR code.
        </h2>
        <p className="mt-4 text-lg text-background/90">
          Show your best photos, put your QR code on the tables, and see in one
          dashboard what customers love and what to improve.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/login" variant="light" size="lg">
            Owner login
          </ButtonLink>
          {OWNER_CONTACT_HREF && (
            <a
              href={OWNER_CONTACT_HREF}
              className={buttonClasses({ variant: "outlineLight", size: "lg" })}
            >
              Talk to us
            </a>
          )}
        </div>
        <p className="mt-4 text-sm text-background/70">
          Owner accounts are set up personally by the NILU team.
        </p>
      </div>
    </section>
  );
}

function FaqItem({
  n,
  q,
  children,
}: {
  n: string;
  q: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-3xl border-2 border-soft px-5 py-4 transition-colors open:border-brand open:bg-brand open:text-background">
      <summary className="flex cursor-pointer list-none items-center gap-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-normal opacity-60">/{n}</span>
        <span className="flex-1">{q}</span>
        <span
          aria-hidden="true"
          className="text-2xl leading-none transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mt-3 pl-10 pr-2 opacity-90">{children}</p>
    </details>
  );
}

function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28"
    >
      <div>
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="mt-4 text-balance font-display text-4xl font-bold text-brand md:text-6xl">
          Your questions, our answers
        </h2>
      </div>
      <div className="space-y-3">
        <FaqItem n="01" q="How do I know a review is real?">
          Reviews can only be left by scanning the QR code at the venue, and
          each device can review a place once a day. We use a small cookie on
          your device to enforce that. It doesn't make cheating impossible, but
          it makes it much harder than on open review sites.
        </FaqItem>
        <FaqItem n="02" q="Do I need an account to leave a review?">
          No. Scan the code, pick your stars, tap a few tags, and add a comment
          if you like. Reviews are posted without your name.
        </FaqItem>
        <FaqItem n="03" q="How are places ranked?">
          By a score that looks at how many people reviewed a place and how
          recent the reviews are. A single glowing review won&apos;t push a new
          place to the top.
        </FaqItem>
        <FaqItem n="04" q="What do the tags mean?">
          They are what visitors picked: what they loved at higher ratings, and
          what could be improved at lower ones. A place only shows a tag once at
          least two different visitors have chosen it.
        </FaqItem>
        <FaqItem n="05" q="I own a place. How do I join?">
          We set venues up personally. You get a page with your photos and
          details, a printable QR code for your tables, and a dashboard showing
          ratings and what to improve. If you already have an account, use the
          owner login.
        </FaqItem>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <HowItWorks />
        <ExploreByType />
        <Trust />
        <Owners />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
