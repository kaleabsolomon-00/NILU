import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import HeaderNav from "@/components/header-nav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-soft/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          aria-label="NILU home"
          className="rounded-lg text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <Logo className="h-10 w-auto" loading="eager" />
        </Link>
        <Suspense fallback={null}>
          <HeaderNav />
        </Suspense>
      </div>
    </header>
  );
}
