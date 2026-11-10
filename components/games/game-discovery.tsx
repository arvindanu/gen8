
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Gamepad2,
  RefreshCw,
} from "lucide-react";

interface Game {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  rating: number;
  ratings_count: number;
  released: string | null;
  metacritic: number | null;
  genres: { id: number; name: string }[];
  platforms: {
    platform: { id: number; name: string };
  }[];
}

interface GamesResponse {
  count: number;
  results: Game[];
}

const SORT_OPTIONS = [
  { label: "Popularity", value: "-added" },
  { label: "Highest rated", value: "-rating" },
  { label: "Newest releases", value: "-released" },
  { label: "Metacritic score", value: "-metacritic" },
  { label: "Name: A–Z", value: "name" },
];

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

function GameCard({ game, index }: { game: Game; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.3) }}
      className="group min-w-0 overflow-hidden rounded-2xl border border-[#e9e9ec] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#d71920]/30 hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#ededf0]">
        {game.background_image ? (
          <div
            role="img"
            aria-label={`${game.name} cover artwork`}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url("${game.background_image}")` }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#a0a0a8]">
            <Gamepad2 size={38} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {game.metacritic !== null && (
          <div className="absolute right-3 top-3 rounded-lg bg-black/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
            MC {game.metacritic}
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/65 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <Star size={13} className="fill-[#f5c451] text-[#f5c451]" />
          {game.rating ? game.rating.toFixed(1) : "N/A"}
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-[15px] font-bold text-[#242427] transition-colors group-hover:text-[#d71920]">
          {game.name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-xs text-[#85858d]">
          <CalendarDays size={13} />
          <span>{formatDate(game.released)}</span>
        </div>

        <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">
          {game.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre.id}
              className="rounded-md bg-[#f4f4f5] px-2 py-1 text-[10px] font-medium text-[#66666e]"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <div className="mt-3 border-t border-[#f0f0f1] pt-3">
          <p className="line-clamp-1 text-[11px] text-[#92929a]">
            {game.platforms
              ?.slice(0, 3)
              .map((item) => item.platform.name)
              .join(" · ") || "Platforms unavailable"}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function GameCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9e9ec] bg-white">
      <div className="aspect-[16/10] animate-pulse bg-[#ededf0]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#ededf0]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[#ededf0]" />
        <div className="h-5 w-2/5 animate-pulse rounded bg-[#ededf0]" />
        <div className="border-t border-[#f0f0f1] pt-3">
          <div className="h-3 w-4/5 animate-pulse rounded bg-[#ededf0]" />
        </div>
      </div>
    </div>
  );
}

export default function GameDiscovery() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-added");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const loadGames = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        ordering,
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(`/api/games?${params.toString()}`, {
        signal,
      });

      if (!response.ok) {
        throw new Error("Unable to load games. Please try again.");
      }

      const data: GamesResponse = await response.json();

      setGames(data.results ?? []);
      setCount(data.count ?? 0);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading games."
      );
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [page, ordering, search]);

  useEffect(() => {
    const controller = new AbortController();
    loadGames(controller.signal);

    return () => controller.abort();
  }, [loadGames]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleSort(value: string) {
    setOrdering(value);
    setPage(1);
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return;

    setPage(nextPage);
    document.getElementById("game-discovery")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section id="game-discovery" className="scroll-mt-24">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d71920]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d71920]" />
            The game library
          </div>

          <h2 className="text-2xl font-black tracking-tight text-[#242427] sm:text-3xl">
            Explore games<span className="text-[#d71920]">.</span>
          </h2>

          <p className="mt-2 text-sm text-[#85858d]">
            Discover your next favourite game from across the gaming universe.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex w-full gap-2 lg:max-w-md"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e7e7ea] bg-white px-3.5 transition-colors focus-within:border-[#d71920]">
            <Search size={17} className="shrink-0 text-[#92929a]" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search games..."
              aria-label="Search games"
              className="h-11 w-full min-w-0 bg-transparent text-sm text-[#242427] outline-none placeholder:text-[#a0a0a8]"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#d71920] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#b9151b]"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[#85858d]">
          {loading ? (
            "Finding games..."
          ) : (
            <>
              Showing <span className="font-semibold text-[#242427]">{games.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-[#242427]">
                {count.toLocaleString()}
              </span>{" "}
              games
            </>
          )}
          {search && (
            <span className="ml-1">
              for <span className="font-semibold text-[#242427]">"{search}"</span>
            </span>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-[#77777f]">
          <SlidersHorizontal size={15} />
          <span>Sort by</span>
          <select
            value={ordering}
            onChange={(event) => handleSort(event.target.value)}
            className="rounded-lg border border-[#e7e7ea] bg-white px-3 py-2 text-sm font-semibold text-[#242427] outline-none focus:border-[#d71920]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-[#b9151b]">{error}</p>
          <button
            onClick={() => {
              const controller = new AbortController();
              void loadGames(controller.signal);
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#d71920] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b9151b]"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      )}

      {!error && loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!error && !loading && games.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#dedee2] bg-white px-5 py-16 text-center">
          <Gamepad2 className="mx-auto text-[#b7b7be]" size={38} />
          <h3 className="mt-4 text-lg font-bold text-[#242427]">
            No games found
          </h3>
          <p className="mt-2 text-sm text-[#85858d]">
            Try another search term or explore the full game library.
          </p>
          <button
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="mt-5 rounded-lg bg-[#242427] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3c3c41]"
          >
            Clear search
          </button>
        </div>
      )}

      {!error && !loading && games.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7e7ea] bg-white text-[#55555d] transition-colors hover:border-[#d71920] hover:text-[#d71920] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-medium text-[#77777f]">
              Page <span className="font-bold text-[#242427]">{page}</span> of{" "}
              <span className="font-bold text-[#242427]">{totalPages}</span>
            </span>

            <button
              onClick={() => changePage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7e7ea] bg-white text-[#55555d] transition-colors hover:border-[#d71920] hover:text-[#d71920] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
