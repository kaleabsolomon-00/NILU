import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/button";
import {
  ArrowRightIcon,
  DownloadIcon,
  PencilIcon,
  SearchIcon,
} from "@/components/icons";
import { Logo, LogoMark } from "@/components/logo";

export const metadata: Metadata = {
  title: "Style guide | NILU",
  robots: { index: false, follow: false },
};

export default function StyleGuide() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 p-6">
      <h1 className="text-3xl font-bold text-brand">Style guide</h1>

      <section className="space-y-3">
        <h2 className="font-semibold">Variants</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">With icons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <SearchIcon /> Search
          </Button>
          <Button variant="secondary">
            <PencilIcon /> Edit details
          </Button>
          <ButtonLink href="/venues" size="lg">
            Browse all places <ArrowRightIcon />
          </ButtonLink>
          <Button variant="secondary" size="sm">
            <DownloadIcon /> Download
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Disabled</h2>
        <Button disabled>Disabled</Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Logo</h2>
        <div className="flex flex-wrap items-center gap-8">
          <Logo className="h-10 w-auto text-brand" />
          <LogoMark className="h-10 w-10 text-brand" />
          <div className="rounded-2xl bg-brand p-4">
            <Logo className="h-10 w-auto" variant="cream" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Typography</h2>
        <p className="font-display text-4xl font-bold">
          Places worth your time
        </p>
        <p className="font-display text-2xl italic">your time &amp; money.</p>
        <p>Real reviews from people who were really there.</p>
        <p className="text-2xl font-medium">★ 4.8 (1,240) · 0123456789</p>
        <p>ሰላም! እንኳን ደህና መጡ። (Amharic test)</p>
      </section>
    </main>
  );
}
