import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/button";
import {
  ArrowRightIcon,
  DownloadIcon,
  PencilIcon,
  SearchIcon,
} from "@/components/icons";

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
    </main>
  );
}
