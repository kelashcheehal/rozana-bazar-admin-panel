"use client";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Heart } from "lucide-react";

export default function MainImage({
  product,
  selectedColor,
  selectedImageIndex,
  setSelectedImageIndex,
  isFavorite,
  toggleFavorite,
}) {
  const discountPercentage =
    product.discount > 0 ? Math.round(product.discount) : 0;

  const mainImage =
    selectedColor?.image_url || product?.image_urls?.[selectedImageIndex];
  return (
    <div className="hidden lg:block">
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img src={mainImage} alt={product.name} className="object-cover" />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 text-white px-3 py-1 rounded-full">
              -{discountPercentage}% OFF
            </Badge>
          )}
          {product.customizable && (
            <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full">
              Customisable
            </Badge>
          )}
        </div>

        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>
      <div className="lg:hidden -mx-4 mb-8">
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth">
          {product.image_urls.map((image, index) => {
            // Show selected color image if it's the first image
            const displayImage =
              index === 0 && selectedColor?.image ? selectedColor.image : image;

            return (
              <div
                key={index}
                className="relative min-w-full h-[90vw] overflow-hidden snap-center bg-gray-50"
              >
                <img
                  src={displayImage}
                  alt={`${product.name} ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* Vertical Images */}
      <div>
        {product.image_urls.map((image, index) => (
          <div
            key={index}
            className="relative w-full bg-gray-50 cursor-pointer"
            onClick={() => setSelectedImageIndex(index)}
          >
            <img src={image} alt={`${product.name} ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
