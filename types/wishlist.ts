export interface WishlistGame {
  id: number;
  name: string;
  slug: string;
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