/** 6 iOS-style Memoji face images — locally bundled. */
export type MemojiOption = {
  id: string;
  label: string;
  src: string;
};

export const MEMOJIS: MemojiOption[] = [
  { id: "face1", label: "Young man", src: "/memoji/face1.png" },
  { id: "face2", label: "Young woman", src: "/memoji/face2.png" },
  { id: "face3", label: "Bearded man", src: "/memoji/face3.png" },
  { id: "face4", label: "Older woman", src: "/memoji/face4.png" },
  { id: "face5", label: "Curly hair", src: "/memoji/face5.png" },
  { id: "face6", label: "Red hair", src: "/memoji/face6.png" },
];

export function memojiById(id: string | null | undefined): MemojiOption {
  if (!id) return MEMOJIS[0]!;
  return MEMOJIS.find((m) => m.id === id) ?? MEMOJIS[0]!;
}

/**
 * Pixel-accurate MasterCard logo — two overlapping circles.
 * viewBox sized for clean scaling at any dimension.
 */
export function MasterCardLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 131.39 86.9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Red circle */}
      <circle cx="43.45" cy="43.45" r="43.45" fill="#EB001B" />
      {/* Orange circle */}
      <circle cx="87.94" cy="43.45" r="43.45" fill="#F79E1B" />
      {/* Overlap — the "petal" intersection */}
      <path
        d="M65.7 12.35a43.33 43.33 0 0 0-16.2 31.1 43.33 43.33 0 0 0 16.2 31.1 43.33 43.33 0 0 0 16.2-31.1 43.33 43.33 0 0 0-16.2-31.1Z"
        fill="#FF5F00"
      />
    </svg>
  );
}
