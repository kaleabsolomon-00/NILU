function MarkShapes() {
  return (
    <>
      <path d="M12 12H40A42 48 0 0 1 40 108H12Z" />
      <path d="M108 12H80A42 48 0 0 0 80 108H108Z" />
      <path d="M50 80Q77.9 68.9 70 40Q42.1 51.1 50 80Z" />
      <path d="M53 74L67 46" strokeWidth={3} />
    </>
  );
}

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="8 8 104 104"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <MarkShapes />
    </svg>
  );
}

export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="8 8 358 104"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="NILU"
    >
      <MarkShapes />
      <path d="M151 88V32L195 88V32" />
      <path d="M225 32V88" />
      <path d="M255 32V88H291" />
      <path d="M317 32V64A22 24 0 0 0 361 64V32" />
    </svg>
  );
}
