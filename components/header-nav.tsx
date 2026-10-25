"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/button";

export default function HeaderNav() {
  const pathname = usePathname();

  // The QR review page stays focused on rating, so it only shows the logo
  if (pathname.startsWith("/r/")) return null;

  return (
    <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
      <ButtonLink href="/venues" variant="ghost" size="sm">
        Explore
      </ButtonLink>
      <ButtonLink href="/login" variant="secondary" size="sm">
        <span className="sm:hidden">Login</span>
        <span className="hidden sm:inline">Owner login</span>
      </ButtonLink>
    </nav>
  );
}
