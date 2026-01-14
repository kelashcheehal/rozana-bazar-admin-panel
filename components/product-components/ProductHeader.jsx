"use client";

import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function ProductHeader({
  product,
  averageRating,
  reviews,
  discountedPrice,
  discountPercentage,
}) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Brand + Rating */}
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs sm:text-sm font-medium text-gray-600">
          {product.brand}
        </span>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{averageRating}</span>
          <span className="text-xs text-gray-400">({reviews.length})</span>
        </div>
      </div>

      {/* Product Title */}
      <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 leading-snug">
        {product.name}
      </h1>

      {/* Pricing */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-gray-500">Rs</span>
          <span className="text-lg sm:text-xl font-semibold text-gray-900">
            {discountedPrice.toFixed(2)}
          </span>
        </div>

        {discountPercentage > 0 && (
          <>
            <span className="text-sm text-gray-400 line-through">
              Rs {product.price.toFixed(2)}
            </span>

            <Badge className="rounded-full bg-red-500 text-white px-2 py-0.5 text-xs">
              Save {discountPercentage}%
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
