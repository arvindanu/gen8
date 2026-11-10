
export interface IGDBGame {
  id: number;
  name: string;
  cover?: {
    image_id: string;
  };
  rating?: number;
  total_rating_count?: number;
  first_release_date?: number;
  genres?: {
    id: number;
    name: string;
  }[];
  platforms?: {
    id: number;
    name: string;
  }[];
  aggregated_rating?: number;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  rating: number;
  ratings_count: number;
  released: string | null;
  metacritic: number | null;
  genres: {
    id: number;
    name: string;
  }[];
  platforms: {
    platform: {
      id: number;
      name: string;
    };
  }[];
}

export interface GamesResponse {
  count: number;
  results: Game[];
}
