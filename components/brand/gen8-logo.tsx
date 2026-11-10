
import Link from "next/link";

export function Gen8Logo({
  compact = false
}: {
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="GEN8 home"
      className="inline-flex items-center gap-2.5"
    >
      <svg
        viewBox="0 0 48 48"
        role="img"
        aria-label="GEN8 logo"
        className="h-10 w-10 shrink-0"
      >
        <path
          d="M25 5H17C9 5 4 10 4 18v12c0 8 5 13 13 13h8c3 0 6-1 8-3l-6-6c-1 1-2 1-3 1h-7c-4 0-6-2-6-7V19c0-4 2-7 6-7h7c2 0 4 1 5 2l6-6c-3-2-6-3-10-3Z"
          fill="#27272A"
        />
        <path
          d="M29 13h7c5 0 8 3 8 8 0 2-1 4-3 5 2 1 3 3 3 5 0 5-3 8-8 8h-7c-5 0-8-3-8-8v-2h8v2c0 1 1 1 2 1h5c1 0 2-1 2-2s-1-2-2-2h-7v-7h7c1 0 2-1 2-2s-1-2-2-2h-5c-1 0-2 1-2 2v2h-8v-2c0-5 3-8 8-8Z"
          fill="#D71920"
        />
      </svg>

      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[21px] font-black tracking-[-1.5px] text-gen8-ink">
            GEN<span className="text-gen8-red">8</span>
          </span>
          <span className="mt-1 text-[8px] font-bold tracking-[2px] text-gen8-muted">
            DISCOVER · EXPLORE · PLAY
          </span>
        </span>
      )}
    </Link>
  );
}
