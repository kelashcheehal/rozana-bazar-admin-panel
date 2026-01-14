"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function RelatedProducts({ relatedProducts }) {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">You May Also Like</h2>
        <Button variant="ghost" className="rounded-full">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden rounded-lg hover:shadow-md transition-shadow"
          >
            <CardContent className="p-0">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                {product.image_urls[0] && (
                  <Image
                    src={product.image_urls[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}

                {product.discount > 0 && (
                  <Badge className="absolute top-2 left-2 rounded-full bg-red-500 text-white">
                    -{Math.round(product.discount)}%
                  </Badge>
                )}
                {product.customizable && (
                  <Badge className="absolute top-2 right-2 rounded-full bg-blue-500 text-white">
                    Customisable
                  </Badge>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900">
                    Rs{" "}
                    {product.discount_price?.toFixed(2) ||
                      product.price.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Colors Preview */}
                <div className="flex gap-2">
                  {product.colors.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{
                        backgroundColor: getColorHex(color.colorName),
                      }}
                      title={color.colorName}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper function to map color names to hex
function getColorHex(name) {
  const lower = name.toLowerCase();
  if (lower.includes("white")) return "#f3f4f6";
  if (lower.includes("black")) return "#000";
  if (lower.includes("blue")) return "#3b82f6";
  if (lower.includes("green")) return "#10b981";
  if (lower.includes("pink")) return "#ec4899";
  if (lower.includes("navy")) return "#1e3a8a";
  if (lower.includes("grey")) return "#6b7280";
  return "#f3f4f6";
}
