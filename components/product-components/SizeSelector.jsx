export default function SizeSelector({
  product,
  selectedSize,
  setSelectedSize,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-medium text-gray-900">
          Select Size
        </h3>
        <button className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline transition">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
        {product.sizes.map((size) => {
          const isActive = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-11 w-12 sm:h-12 rounded-xl border text-sm font-medium transition ${isActive
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}