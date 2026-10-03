export type CardVariant = {
  id: string;
  name: string;
  gradient: string;
};

export const CARD_VARIANTS: CardVariant[] = [
  {
    id: "midnight",
    name: "Midnight",
    gradient: "from-[#131316] via-[#232329] to-[#3c3c44]",
  },
  {
    id: "ocean",
    name: "Ocean",
    gradient: "from-[#0a84ff] via-[#2f6bff] to-[#5e5ce6]",
  },
  {
    id: "sunset",
    name: "Sunset",
    gradient: "from-[#ff9f0a] via-[#ff6482] to-[#ff375f]",
  },
  {
    id: "orchid",
    name: "Orchid",
    gradient: "from-[#bf5af2] via-[#a259ff] to-[#ff2d55]",
  },
  {
    id: "mint",
    name: "Mint",
    gradient: "from-[#30d158] via-[#28c39a] to-[#0a84ff]",
  },
  {
    id: "slate",
    name: "Slate",
    gradient: "from-[#48484f] via-[#63636b] to-[#8e8e96]",
  },
];

export function variantById(id: string): CardVariant {
  return CARD_VARIANTS.find((v) => v.id === id) ?? CARD_VARIANTS[0]!;
}

export function ChipSvg() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="orbit-chip" x1="0" y1="0" x2="34" y2="26">
          <stop offset="0" stopColor="#f6e7c1" />
          <stop offset="0.5" stopColor="#d9b978" />
          <stop offset="1" stopColor="#b08d4f" />
        </linearGradient>
      </defs>
      <rect
        x="0.75"
        y="0.75"
        width="32.5"
        height="24.5"
        rx="5.25"
        fill="url(#orbit-chip)"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="0.5"
      />
      <path
        d="M0.75 9.5h10.4a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H0.75M33.25 9.5H22.9a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h10.35M17 0.75v6.5M17 18.75v6.5"
        stroke="rgba(70,50,10,0.45)"
        strokeWidth="1"
      />
    </svg>
  );
}

export function ContactlessSvg() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="text-white/80"
    >
      <path d="M8.5 9a5.4 5.4 0 0 1 0 6" />
      <path d="M11.5 6.4a9.6 9.6 0 0 1 0 11.2" />
      <path d="M14.5 3.9a13.6 13.6 0 0 1 0 16.2" />
      <path d="M17.5 1.6a17.4 17.4 0 0 1 0 20.8" />
    </svg>
  );
}
