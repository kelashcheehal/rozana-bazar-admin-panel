"use client";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Heart } from "lucide-react";

export default function ActionButtons({
  product,
  handleAddToCart,
  handleBuyNow,
  isFavorite,
  toggleFavorite,
}) {
  return (
    <div className="flex items-center gap-3 pt-2 border-b pb-5">
      <InteractiveHoverButton
        onClick={handleAddToCart}
        size="lg"
        className="font-medium w-full"
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
      </InteractiveHoverButton>

      <Button
        onClick={handleBuyNow}
        size="lg"
        variant="outline"
        className="flex-1 rounded-lg border bg-black text-white hover:bg-gray-900"
      >
        BUY NOW
      </Button>

      <Button
        onClick={toggleFavorite}
        size="lg"
        variant="outline"
        className="w-10 h-10 rounded-full border border-gray-400/50 flex items-center justify-center hover:bg-gray-50"
      >
        <Heart
          className={`h-5 w-5 ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-900"
          }`}
        />
      </Button>
    </div>
  );
}
