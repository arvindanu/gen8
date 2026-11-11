
"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import WishlistButton from "@/components/wishlist/wishlist-button";
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
  X,
  ChevronDown,
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

interface FilterOption {
  id: number;
  name: string;
}

interface FilterOptionsResponse {
  genres: FilterOption[];
  platforms: FilterOption[];
}

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity" },
  { label: "Highest rated", value: "rating" },
  { label: "Newest releases", value: "released" },
  { label: "IGDB score", value: "metacritic" },
  { label: "Name: A–Z", value: "name" },
];

const RATING_OPTIONS = [
  { label: "Any rating", value: "" },
  { label: "2.0+ / 5", value: "2" },
  { label: "3.0+ / 5", value: "3" },
  { label: "3.5+ / 5", value: "3.5" },
  { label: "4.0+ / 5", value: "4" },
  { label: "4.5+ / 5", value: "4.5" },
];

function formatDate(date: string | null) {
  if (!date) return "Release date TBA";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Release date TBA";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function GameCard({
  game,
  index,
}: {
  game: Game;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.035, 0.3),
      }}
      className="group relative min-w-0 h-full overflow-hidden rounded-2xl border border-[#e9e9ec] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#d71920]/30 hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
    >
      <Link
        href={`/games/${game.id}`}
        className="block"
        aria-label={`View details for ${game.name}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#ededf0]">
          {game.background_image ? (
            <div
              role="img"
              aria-label={`${game.name} cover artwork`}
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url("${game.background_image}")`,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#a0a0a8]">
              <Gamepad2 size={38} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {game.metacritic !== null && (
            <div className="absolute right-3 top-3 rounded-lg bg-black/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
              IGDB {game.metacritic}
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/65 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <Star
              size={13}
              className="fill-[#f5c451] text-[#f5c451]"
            />
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
      </Link>

      <div className="absolute left-3 top-3 z-10">
        <WishlistButton
          game={game}
          className="h-9 w-9 border-white/20 bg-black/65 p-0 hover:bg-black/85"
        />
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

  const [ordering, setOrdering] = useState("popularity");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Advanced filter state
  const [filterOptions, setFilterOptions] =
    useState<FilterOptionsResponse>({
      genres: [],
      platforms: [],
    });

  const [filterOptionsLoading, setFilterOptionsLoading] =
    useState(true);

  const [filterOptionsError, setFilterOptionsError] =
    useState(false);

  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("");

  const [filtersOpen, setFiltersOpen] = useState(false);

  const pageSize = 20;

  const totalPages = Math.max(
    1,
    Math.ceil(count / pageSize)
  );

  const activeFilterCount = [
    genre,
    platform,
    year,
    minRating,
  ].filter(Boolean).length;

  // Load available genres and platforms from IGDB
  useEffect(() => {
    const controller = new AbortController();

    async function loadFilterOptions() {
      setFilterOptionsLoading(true);
      setFilterOptionsError(false);

      try {
        const response = await fetch("/api/games/filters", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load filter options.");
        }

        const data: FilterOptionsResponse = await response.json();

        setFilterOptions({
          genres: data.genres ?? [],
          platforms: data.platforms ?? [],
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Filter options error:", err);
        setFilterOptionsError(true);
      } finally {
        if (!controller.signal.aborted) {
          setFilterOptionsLoading(false);
        }
      }
    }

    void loadFilterOptions();

    return () => controller.abort();
  }, []);

  // Load games using search, sorting and advanced filters
  const loadGames = useCallback(
    async (signal: AbortSignal) => {
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

        if (genre) {
          params.set("genre", genre);
        }

        if (platform) {
          params.set("platform", platform);
        }

        if (year) {
          params.set("year", year);
        }

        if (minRating) {
          params.set("minRating", minRating);
        }

        const response = await fetch(
          `/api/games?${params.toString()}`,
          { signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load games. Please try again.");
        }

        const data: GamesResponse = await response.json();

        setGames(data.results ?? []);
        setCount(data.count ?? 0);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

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
    },
    [page, ordering, search, genre, platform, year, minRating]
  );

  useEffect(() => {
    const controller = new AbortController();

    void loadGames(controller.signal);

    return () => controller.abort();
  }, [loadGames]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleSort(value: string) {
    setOrdering(value);
    setPage(1);
  }

  function clearFilters() {
    setGenre("");
    setPlatform("");
    setYear("");
    setMinRating("");
    setPage(1);
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);

    document.getElementById("game-discovery")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function retryLoading() {
    const controller = new AbortController();
    void loadGames(controller.signal);
  }

  const currentYear = new Date().getFullYear();

  const releaseYears = Array.from(
    { length: currentYear - 1979 },
    (_, index) => currentYear - index
  );

  return (
    <section id="game-discovery" className="scroll-mt-24">
      {/* Discovery heading and search */}
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
            <Search
              size={17}
              className="shrink-0 text-[#92929a]"
            />

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

      {/* Advanced filters */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#e9e9ec] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setFiltersOpen((current) => !current)}
            aria-expanded={filtersOpen}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#242427] transition-colors hover:text-[#d71920]"
          >
            <SlidersHorizontal size={17} />

            Advanced filters

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d71920] px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}

            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                filtersOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#d71920] transition-colors hover:text-[#b9151b]"
              >
                <X size={13} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {filtersOpen && (
          <div className="border-t border-[#f0f0f1] px-4 pb-5 pt-5 sm:px-5">
            {filterOptionsError && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
                <p className="text-xs text-[#b9151b]">
                  Unable to load genres and platforms.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="text-xs font-bold text-[#b9151b] underline"
                >
                  Reload page
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Genre */}
              <label className="flex flex-col gap-2 text-xs font-semibold text-[#77777f]">
                Genre

                <select
                  value={genre}
                  onChange={(event) => {
                    setGenre(event.target.value);
                    setPage(1);
                  }}
                  disabled={filterOptionsLoading}
                  className="h-11 rounded-xl border border-[#e7e7ea] bg-white px-3 text-sm font-medium text-[#242427] outline-none transition-colors focus:border-[#d71920] disabled:cursor-wait disabled:bg-[#f7f7f8] disabled:text-[#a0a0a8]"
                >
                  <option value="">
                    {filterOptionsLoading
                      ? "Loading genres..."
                      : "All genres"}
                  </option>

                  {filterOptions.genres.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Platform */}
              <label className="flex flex-col gap-2 text-xs font-semibold text-[#77777f]">
                Platform

                <select
                  value={platform}
                  onChange={(event) => {
                    setPlatform(event.target.value);
                    setPage(1);
                  }}
                  disabled={filterOptionsLoading}
                  className="h-11 rounded-xl border border-[#e7e7ea] bg-white px-3 text-sm font-medium text-[#242427] outline-none transition-colors focus:border-[#d71920] disabled:cursor-wait disabled:bg-[#f7f7f8] disabled:text-[#a0a0a8]"
                >
                  <option value="">
                    {filterOptionsLoading
                      ? "Loading platforms..."
                      : "All platforms"}
                  </option>

                  {filterOptions.platforms.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Release year */}
              <label className="flex flex-col gap-2 text-xs font-semibold text-[#77777f]">
                Release year

                <select
                  value={year}
                  onChange={(event) => {
                    setYear(event.target.value);
                    setPage(1);
                  }}
                  className="h-11 rounded-xl border border-[#e7e7ea] bg-white px-3 text-sm font-medium text-[#242427] outline-none transition-colors focus:border-[#d71920]"
                >
                  <option value="">Any year</option>

                  {releaseYears.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              {/* Minimum rating */}
              <label className="flex flex-col gap-2 text-xs font-semibold text-[#77777f]">
                Minimum rating

                <select
                  value={minRating}
                  onChange={(event) => {
                    setMinRating(event.target.value);
                    setPage(1);
                  }}
                  className="h-11 rounded-xl border border-[#e7e7ea] bg-white px-3 text-sm font-medium text-[#242427] outline-none transition-colors focus:border-[#d71920]"
                >
                  {RATING_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-[#92929a]">
                Combine filters to narrow down your game discovery.
              </p>

              {activeFilterCount > 0 && (
                <span className="text-xs font-semibold text-[#d71920]">
                  {activeFilterCount} active{" "}
                  {activeFilterCount === 1 ? "filter" : "filters"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results count and sorting */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[#85858d]">
          {loading ? (
            "Finding games..."
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-[#242427]">
                {games.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#242427]">
                {count.toLocaleString()}
              </span>{" "}
              games
            </>
          )}

          {search && (
            <span className="ml-1">
              for{" "}
              <span className="font-semibold text-[#242427]">
                &quot;{search}&quot;
              </span>
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

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-[#b9151b]">{error}</p>

          <button
            onClick={retryLoading}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#d71920] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b9151b]"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      )}

      {/* Loading state */}
      {!error && loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!error && !loading && games.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#dedee2] bg-white px-5 py-16 text-center">
          <Gamepad2
            className="mx-auto text-[#b7b7be]"
            size={38}
          />

          <h3 className="mt-4 text-lg font-bold text-[#242427]">
            No games found
          </h3>

          <p className="mt-2 text-sm text-[#85858d]">
            Try changing your search or adjusting your filters.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {(search || activeFilterCount > 0) && (
              <button
                onClick={() => {
                  clearSearch();
                  clearFilters();
                }}
                className="rounded-lg bg-[#242427] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3c3c41]"
              >
                Clear search and filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Game grid and pagination */}
      {!error && !loading && games.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
              />
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
              Page{" "}
              <span className="font-bold text-[#242427]">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#242427]">
                {totalPages}
              </span>
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
