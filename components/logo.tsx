import Image from "next/image";

type LogoVariant = "brand" | "cream";

const logoSources: Record<LogoVariant, string> = {
  brand: "/nilu-logo.svg",
  cream: "/nilu-logo-cream.svg",
};

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <Image
      src="/nilu-mark.svg"
      alt=""
      width={124}
      height={124}
      className={className}
    >
    </Image>
  );
}

export function Logo({
  className = "h-10 w-auto",
  variant = "brand",
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  return (
    <Image
      src={logoSources[variant]}
      alt="NILU"
      width={370}
      height={124}
      className={className}
    />
  );
}
