"use client";

export default function ColorSelector({
  product,
  selectedColor,
  setSelectedColor,
  setSelectedImageIndex,
}) {
  if (!product?.colors?.length) return null;

  return (
    <div className="space-y-4 border-y py-5">
      <h3 className="text-base sm:text-lg font-medium text-gray-900">
        Color Options
      </h3>

      <div className="flex flex-wrap gap-4">
        {product.colors.map((color) => {
          const isActive = selectedColor?.name === color.name;

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => {
                setSelectedColor(color);
                setSelectedImageIndex(0);
              }}
              className="flex flex-col items-center"
            >
              <div
                className={`rounded-xl p-1 border transition ${
                  isActive
                    ? "border-gray-900 bg-gray-100"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={color.image_url}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <span
                className={`mt-1 text-sm ${
                  isActive ? "text-gray-900 font-medium" : "text-gray-500"
                }`}
              >
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
