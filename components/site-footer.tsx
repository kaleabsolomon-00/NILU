import Link from "next/link";
import { Logo } from "@/components/logo";

export default function SiteFooter() {
  return (
    <footer className="mx-3 mb-3 mt-3 overflow-hidden rounded-[2rem] bg-night text-background md:mx-5 md:mb-5 md:mt-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-12 md:flex-row md:justify-between md:px-10 md:pt-16">
        <p className="max-w-xs font-display text-2xl leading-snug">
          Places worth your time, reviewed by people who were really there.
        </p>
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-14 gap-y-3 text-background/80"
        >
          <Link href="/#how" className="hover:text-background">
            How it works
          </Link>
          <Link href="/#faq" className="hover:text-background">
            FAQ
          </Link>
        </nav>
      </div>

      <p className="mx-auto mt-10 max-w-6xl px-6 text-sm text-background/50 md:px-10">
        &copy; 2026 NILU. All rights reserved.
      </p>

      {/* The giant wordmark, cropped by the bottom edge */}
      <div aria-hidden="true" className="mt-6 px-4 md:px-8">
        <div className="aspect-[358/68] overflow-hidden">
          <Logo className="h-auto w-full text-brand" />
        </div>
      </div>
    </footer>
  );
}
