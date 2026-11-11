
import type { IGDBGame } from "@/types/igdb";

const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_URL = "https://api.igdb.com/v4/games";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET in .env.local"
    );
  }

  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with Twitch.");
  }

  const data = await response.json();

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60_000;

  return cachedToken!;
}

export type IGDBOrdering =
  | "popularity"
  | "rating"
  | "released"
  | "metacritic"
  | "name";

const SORTS: Record<IGDBOrdering, string> = {
  popularity: "total_rating_count desc",
  rating: "rating desc",
  released: "first_release_date desc",
  metacritic: "aggregated_rating desc",
  name: "name asc",
};

function escapeSearch(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export async function getIGDBGames(options: {
  search?: string;
  page?: number;
  pageSize?: number;
  ordering?: IGDBOrdering;
}) {
  const {
    search = "",
    page = 1,
    pageSize = 20,
    ordering = "popularity",
  } = options;

  const token = await getAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID!;

  const offset = (page - 1) * pageSize;

  const searchQuery = search.trim()
    ? `search "${escapeSearch(search.trim())}";`
    : "";

  const commonQuery = `${searchQuery}
    where version_parent = null;
  `;

  const fields = `
    fields
      id,
      name,
      cover.image_id,
      rating,
      total_rating_count,
      first_release_date,
      genres.id,
      genres.name,
      platforms.id,
      platforms.name,
      aggregated_rating;
  `;

  const gamesQuery = `
    ${fields}
    ${commonQuery}
    sort ${SORTS[ordering]};
    limit ${pageSize};
    offset ${offset};
  `;

  const countQuery = `
    ${commonQuery}
  `;

  const headers = {
    "Client-ID": clientId,
    Authorization: `Bearer ${token}`,
    "Content-Type": "text/plain",
  };

  const [gamesResponse, countResponse] = await Promise.all([
    fetch(IGDB_URL, {
      method: "POST",
      headers,
      body: gamesQuery,
      cache: "no-store",
    }),
    fetch(`${IGDB_URL}/count`, {
      method: "POST",
      headers,
      body: countQuery,
      cache: "no-store",
    }),
  ]);

  if (!gamesResponse.ok || !countResponse.ok) {
    const errorText = !gamesResponse.ok
      ? await gamesResponse.text()
      : await countResponse.text();

    console.error("IGDB API error:", errorText);

    throw new Error("IGDB could not return game data.");
  }

  const [rawGames, countData] = await Promise.all([
    gamesResponse.json() as Promise<IGDBGame[]>,
    countResponse.json() as Promise<{ count: number }>,
  ]);

  const results = rawGames.map((game) => ({
    id: game.id,
    slug: String(game.id),
    name: game.name,
    background_image: game.cover?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : null,
    rating: game.rating ? game.rating / 20 : 0,
    ratings_count: game.total_rating_count ?? 0,
    released: game.first_release_date
      ? new Date(game.first_release_date * 1000)
          .toISOString()
          .slice(0, 10)
      : null,
    metacritic: game.aggregated_rating
      ? Math.round(game.aggregated_rating)
      : null,
    genres: game.genres ?? [],
    platforms: (game.platforms ?? []).map((platform) => ({
      platform,
    })),
  }));

  return {
    count: countData.count ?? 0,
    results,
  };
}


export interface IGDBGameDetails {
  id: number;
  name: string;
  summary?: string;
  storyline?: string;
  cover?: {
    image_id: string;
  };
  artworks?: {
    image_id: string;
  }[];
  screenshots?: {
    image_id: string;
  }[];
  first_release_date?: number;
  rating?: number;
  aggregated_rating?: number;
  genres?: {
    id: number;
    name: string;
  }[];
  platforms?: {
    id: number;
    name: string;
  }[];
  involved_companies?: {
    developer?: boolean;
    publisher?: boolean;
    company?: {
      name: string;
    };
  }[];
  game_modes?: {
    name: string;
  }[];
  themes?: {
    name: string;
  }[];
  player_perspectives?: {
    name: string;
  }[];
  videos?: {
    video_id: string;
  }[];
  similar_games?: {
    id: number;
    name: string;
    cover?: {
      image_id: string;
    };
    rating?: number;
  }[];
}

export async function getIGDBGameDetails(
  gameId: number
): Promise<IGDBGameDetails | null> {
  const token = await getAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID!;

  const query = `
    fields
      id,
      name,
      summary,
      storyline,
      cover.image_id,
      artworks.image_id,
      screenshots.image_id,
      first_release_date,
      rating,
      aggregated_rating,
      genres.id,
      genres.name,
      platforms.id,
      platforms.name,
      involved_companies.developer,
      involved_companies.publisher,
      involved_companies.company.name,
      game_modes.name,
      themes.name,
      player_perspectives.name,
      videos.video_id,
      similar_games.id,
      similar_games.name,
      similar_games.cover.image_id,
      similar_games.rating;
    where id = ${gameId};
  `;

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: query,
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("IGDB game details error:", errorText);
    throw new Error("Unable to fetch game details from IGDB.");
  }

  const games =
    (await response.json()) as IGDBGameDetails[];

  return games[0] ?? null;
}
