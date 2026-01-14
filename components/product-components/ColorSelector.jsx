"use client";
import Image from "next/image";

export default function ColorSelector({
  product,
  selectedColor,
  setSelectedColor,
  setSelectedImageIndex,
}) {
  return (
    <div className="space-y-4 border-y py-5">
      <h3 className="text-base sm:text-lg font-medium text-gray-900">
        Color Options
      </h3>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {product.colors.map((color) => {
          const isActive = selectedColor?.colorName === color.colorName;
          return (
            <button
              key={color.colorName}
              onClick={() => {
                setSelectedColor(color);
                setSelectedImageIndex(0);
              }}
              className="flex flex-col items-center focus:outline-none"
            >
              <div
                className={`rounded-xl p-1 border transition ${
                  isActive
                    ? "border-gray-900 bg-gray-100"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-50">
                  {color.image && (
                    <Image
                      src={color.image}
                      alt={color.colorName}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              </div>
              <span
                className={`mt-1 text-xs sm:text-sm transition ${
                  isActive ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                {color.colorName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
