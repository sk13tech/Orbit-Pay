/** The Orbit Pay logo — uses the custom uploaded brand mark everywhere. */
export function OrbitLogo({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/orbit-logo.png"
      alt="Orbit Pay"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
