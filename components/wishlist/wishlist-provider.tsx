"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { WishlistGame } from "@/types/wishlist";

const STORAGE_KEY = "gen8-wishlist-v1";

interface WishlistContextValue {
  games: WishlistGame[];
  isLoaded: boolean;
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (game: WishlistGame) => void;
  removeFromWishlist: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<WishlistGame[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setGames(parsed);
        }
      }
    } catch {
      console.error("Could not load GEN8 wishlist.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch {
      console.error("Could not save GEN8 wishlist.");
    }
  }, [games, isLoaded]);

  const isWishlisted = useCallback(
    (id: number) => games.some((game) => game.id === id),
    [games]
  );

  const toggleWishlist = useCallback((game: WishlistGame) => {
    setGames((current) => {
      const exists = current.some((item) => item.id === game.id);

      return exists
        ? current.filter((item) => item.id !== game.id)
        : [game, ...current];
    });
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    setGames((current) => current.filter((game) => game.id !== id));
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        games,
        isLoaded,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider.");
  }

  return context;
}