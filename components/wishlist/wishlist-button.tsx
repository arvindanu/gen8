"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "./wishlist-provider";
import type { WishlistGame } from "@/types/wishlist";

interface WishlistButtonProps {
  game: WishlistGame;
  showLabel?: boolean;
  className?: string;
}

export default function WishlistButton({
  game,
  showLabel = false,
  className = "",
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist, isLoaded } = useWishlist();
  const saved = isWishlisted(game.id);

  return (
    <button
      type="button"
      disabled={!isLoaded}
      onClick={() => toggleWishlist(game)}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      title={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:border-red-400 hover:bg-black/80 disabled:opacity-50 ${className}`}
    >
      <Heart
        size={17}
        className={saved ? "fill-red-500 text-red-500" : "text-white"}
      />
      {showLabel && (saved ? "Wishlisted" : "Add to wishlist")}
    </button>
  );
}