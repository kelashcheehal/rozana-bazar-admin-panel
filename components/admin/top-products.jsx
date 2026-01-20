"use client";

import { useProducts } from "@/lib/useProducts";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function TopProducts() {
  const route = useRouter();
  const { data: products, isLoading, error } = useProducts(); // hook se data

  const navigateAllProducts = () => {
    route.push("/dashboard/products");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;

  // top 4 selling products
  const topProducts = products
    .sort((a, b) => b.sold - a.sold) // sold descending
    .slice(0, 4);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-bold text-[#2C1810] mb-1">Top Products</h3>
      <p className="text-sm text-gray-500 mb-6">
        Best selling items this month
      </p>

      <div className="space-y-4">
        {topProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
            onClick={() => route.push(`/dashboard/products/${product.slug}`)}
          >
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
              <Image
                src={product.image_urls[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="48px"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#2C1810] text-sm truncate">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500 truncate">{product.category}</p>
            </div>
            <div className="text-right whitespace-nowrap">
              <p className="font-bold text-[#D4A574] text-sm">
                PKR {Number(product.finalPrice || product.price).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">{product.sold} sold</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="w-full mt-6 py-2.5 text-sm font-medium text-[#2C1810] border border-gray-200 rounded-lg hover:bg-[#2C1810] hover:text-[#D4A574] hover:border-[#2C1810] transition-all duration-300"
        onClick={navigateAllProducts}
      >
        View All Products
      </button>
    </div>
  );
}
