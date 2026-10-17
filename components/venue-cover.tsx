import Image from "next/image";
import { photoUrl } from "@/lib/photo-url";

// Shows a venue photo, or a placeholder when there is none.
// The parent supplies the size and shape (see the usage below).
export default function VenueCover({
  path,
  name,
  sizes,
  hero = false,
}: {
  path: string | null;
  name: string;
  sizes: string;
  hero?: boolean;
}) {
  if (!path) {
    return (
      <div
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center bg-soft/60 text-5xl font-bold text-brand/60"
      >
        {name.trim().charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={photoUrl(path)}
      alt={`Photo of ${name}`}
      fill
      sizes={sizes}
      loading={hero ? "eager" : "lazy"}
      className="object-cover"
    />
  );
}
