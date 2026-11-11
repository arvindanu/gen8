"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Gamepad2, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

function formatDate(date: string | null) {
  if (!date) return "Release date TBA";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Release date TBA";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WishlistPage() {
  const { games, removeFromWishlist, isLoaded } = useWishlist();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-red-500" />
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            <Heart size={16} />
            Your personal library
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            My Wishlist
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Keep track of the games you want to play next.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Saved games
          </p>
          <p className="mt-1 text-2xl font-bold text-zinc-950">
            {games.length}
          </p>
        </div>
      </section>

      {games.length === 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Heart size={30} />
          </div>

          <h2 className="text-xl font-bold text-zinc-900">
            Your wishlist is empty
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            Explore the game catalogue and save the games you're excited to
            play. They'll appear here.
          </p>

          <Link
            href="/discover"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Discover games
            <ArrowRight size={16} />
          </Link>
        </motion.section>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game, index) => (
            <motion.article
              key={game.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.3) }}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Link
                href={`/games/${game.id}`}
                className="relative block aspect-[16/9] overflow-hidden bg-zinc-100"
              >
                {game.background_image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("${game.background_image}")`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                    <Gamepad2 size={40} />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <span className="absolute bottom-4 left-4 text-xs font-medium text-white/80">
                  {formatDate(game.released)}
                </span>
              </Link>

              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/games/${game.id}`}
                    className="min-w-0"
                  >
                    <h2 className="line-clamp-1 font-bold text-zinc-900 transition hover:text-red-500">
                      {game.name}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      {game.genres?.slice(0, 2).map((genre) => genre.name).join(" · ") ||
                        "Game"}
                    </p>
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(game.id)}
                    aria-label={`Remove ${game.name} from wishlist`}
                    title="Remove from wishlist"
                    className="shrink-0 rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                  <span className="text-xs text-zinc-400">
                    {game.platforms?.length || 0} platforms
                  </span>

                  <Link
                    href={`/games/${game.id}`}
                    className="text-xs font-semibold text-red-500 transition hover:text-red-600"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </section>
      )}
    </main>
  );
}