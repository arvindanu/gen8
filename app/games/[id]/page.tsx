
import GameMedia from "@/components/games/game-media";
import WishlistButton from "@/components/wishlist/wishlist-button";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Gamepad2,
  Monitor,
  Star,
  Building2,
} from "lucide-react";

import { getIGDBGameDetails } from "@/lib/igdb";
import type { WishlistGame } from "@/types/wishlist";

function getImageUrl(imageId: string, size = "t_1080p") {
  return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
}

function formatReleaseDate(timestamp?: number) {
  if (!timestamp) return "Release date unavailable";

  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);

  if (!Number.isInteger(gameId) || gameId <= 0) {
    notFound();
  }

  const game = await getIGDBGameDetails(gameId);

  if (!game) {
    notFound();
  }

  const heroImage =
    game.artworks?.[0]?.image_id ||
    game.cover?.image_id;

  const developers =
    game.involved_companies
      ?.filter((company) => company.developer)
      .map((company) => company.company?.name)
      .filter(Boolean) ?? [];

  const publishers =
    game.involved_companies
      ?.filter((company) => company.publisher)
      .map((company) => company.company?.name)
      .filter(Boolean) ?? [];

  const screenshots = game.screenshots ?? [];
  const similarGames = game.similar_games ?? [];

  // Convert IGDB details into the shared wishlist format.
  const wishlistGame: WishlistGame = {
    id: game.id,
    name: game.name,
    slug: String(game.id),
    background_image: heroImage
      ? getImageUrl(heroImage)
      : null,
    rating:
      typeof game.rating === "number"
        ? game.rating / 20
        : 0,
    ratings_count: 0,
    released: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString()
      : null,
    metacritic: game.aggregated_rating ?? null,
    genres: game.genres?.map((genre) => ({
      id: genre.id,
      name: genre.name,
    })) ?? [],
    platforms: game.platforms?.map((platform) => ({
      platform: {
        id: platform.id,
        name: platform.name,
      },
    })) ?? [],
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-20">

      {/* Hero section */}
      <section className="relative min-h-[480px] overflow-hidden bg-[#111114]">
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={{
              backgroundImage: `url(${getImageUrl(heroImage)})`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#111114] via-[#111114]/85 to-[#111114]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-black/20" />

        <div className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="mb-14 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to discovery
          </Link>

          <div className="flex max-w-3xl flex-col gap-6">
            <span className="w-fit rounded-full border border-[#ff343b]/40 bg-[#ff343b]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff555b]">
              Game details
            </span>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              {game.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-white/65">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {formatReleaseDate(game.first_release_date)}
              </span>

              {game.rating !== undefined && (
                <span className="flex items-center gap-2">
                  <Star size={16} className="fill-[#ffb547] text-[#ffb547]" />
                  {Math.round(game.rating)}/100 IGDB rating
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {game.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Wishlist button */}
            <div>
              <WishlistButton
                game={wishlistGame}
                showLabel
                className="border-white/20 bg-white/10 px-5 py-3 text-white hover:border-[#ff555b] hover:bg-white/15"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_320px] lg:px-12">

        {/* Main column */}
        <div className="min-w-0 space-y-12">

          {/* About */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-7 w-1 rounded-full bg-[#f13b43]" />
              <h2 className="text-xl font-bold text-[#202024]">
                About this game
              </h2>
            </div>

            <div className="rounded-2xl border border-[#e9e9ec] bg-white p-6 shadow-sm">
              <p className="whitespace-pre-line text-sm leading-8 text-[#65656d]">
                {game.summary ||
                  "No game description is currently available."}
              </p>

              {game.storyline && (
                <div className="mt-6 border-t border-[#eeeeef] pt-6">
                  <h3 className="mb-3 text-sm font-bold text-[#242429]">
                    Storyline
                  </h3>

                  <p className="whitespace-pre-line text-sm leading-8 text-[#65656d]">
                    {game.storyline}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Interactive screenshots and trailer */}
          <GameMedia
            screenshots={screenshots}
            videoId={game.videos?.[0]?.video_id}
            gameName={game.name}
          />

          {/* Similar games */}
          {similarGames.length > 0 && (
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-7 w-1 rounded-full bg-[#f13b43]" />
                <h2 className="text-xl font-bold text-[#202024]">
                  You might also like
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {similarGames.slice(0, 8).map((similar) => (
                  <Link
                    key={similar.id}
                    href={`/games/${similar.id}`}
                    className="group overflow-hidden rounded-xl border border-[#e9e9ec] bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-[3/4] bg-[#e9e9ec]">
                      {similar.cover?.image_id && (
                        <div
                          className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${getImageUrl(
                              similar.cover.image_id,
                              "t_cover_big"
                            )})`,
                          }}
                        />
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="line-clamp-2 text-sm font-bold text-[#242429]">
                        {similar.name}
                      </h3>

                      {similar.rating !== undefined && (
                        <p className="mt-2 text-xs text-[#777780]">
                          ★ {Math.round(similar.rating)}/100
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar information */}
        <aside className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-[#e9e9ec] bg-white shadow-sm">

            {game.cover?.image_id && (
              <div
                className="aspect-[3/4] bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getImageUrl(
                    game.cover.image_id,
                    "t_cover_big"
                  )})`,
                }}
              />
            )}

            <div className="space-y-5 p-5">
              <h2 className="text-sm font-bold text-[#242429]">
                Game information
              </h2>

              {/* Platforms */}
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9999a1]">
                  <Monitor size={14} />
                  Platforms
                </p>

                <div className="flex flex-wrap gap-2">
                  {game.platforms?.length ? (
                    game.platforms.map((platform) => (
                      <span
                        key={platform.id}
                        className="rounded-md bg-[#f4f4f5] px-2.5 py-1.5 text-xs text-[#55555d]"
                      >
                        {platform.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#888]">
                      Not available
                    </span>
                  )}
                </div>
              </div>

              {/* Developer */}
              <div className="border-t border-[#eeeeef] pt-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9999a1]">
                  <Building2 size={14} />
                  Developer
                </p>

                <p className="text-sm text-[#55555d]">
                  {developers.join(", ") || "Not available"}
                </p>
              </div>

              {/* Publisher */}
              <div className="border-t border-[#eeeeef] pt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9999a1]">
                  Publisher
                </p>

                <p className="text-sm text-[#55555d]">
                  {publishers.join(", ") || "Not available"}
                </p>
              </div>

              {/* Game modes */}
              {game.game_modes && game.game_modes.length > 0 && (
                <div className="border-t border-[#eeeeef] pt-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9999a1]">
                    <Gamepad2 size={14} />
                    Game modes
                  </p>

                  <p className="text-sm text-[#55555d]">
                    {game.game_modes.map((mode) => mode.name).join(", ")}
                  </p>
                </div>
              )}

              {/* Themes */}
              {game.themes && game.themes.length > 0 && (
                <div className="border-t border-[#eeeeef] pt-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9999a1]">
                    Themes
                  </p>

                  <p className="text-sm text-[#55555d]">
                    {game.themes.map((theme) => theme.name).join(", ")}
                  </p>
                </div>
              )}

              {/* Player perspectives */}
              {game.player_perspectives &&
                game.player_perspectives.length > 0 && (
                  <div className="border-t border-[#eeeeef] pt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9999a1]">
                      Player perspectives
                    </p>

                    <p className="text-sm text-[#55555d]">
                      {game.player_perspectives
                        .map((perspective) => perspective.name)
                        .join(", ")}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
