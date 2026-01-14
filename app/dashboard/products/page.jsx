"use client";

import { useState, useCallback } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { XCircle } from "lucide-react";
const PAGE_SIZE = 25;

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [deletingIds, setDeletingIds] = useState(new Set()); // Track deleting products by ID
  const queryClient = useQueryClient();

  const handleView = useCallback(
    (slug) => router.push(`/dashboard/products/${slug}`),
    [router]
  );

  const handleEdit = useCallback(
    (id) => router.push(`/dashboard/products/edit-product/${id}`),
    [router]
  );

  const handleDelete = useCallback(
    async (productId) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this product? This action cannot be undone."
        )
      )
        return;

      setDeletingIds((prev) => new Set(prev).add(productId));
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);
        if (error) throw error;

        // Invalidate and refetch queries
        queryClient.invalidateQueries(["products"]);
        queryClient.invalidateQueries(["productStats"]);
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete product. Please try again.");
      } finally {
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    },
    [queryClient]
  );

  // Fetch product stats (total, low stock, out of stock) from all products
  const fetchProductStats = async () => {
    const { data, error } = await supabase.from("products").select("stock");

    if (error) throw error;

    const totalProducts = data.filter((p) => p.stock >=0).length;
    const lowStock = data.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = data.filter((p) => p.stock === 0).length;

    return { totalProducts, lowStock, outOfStock };
  };

  const { data: stats = { totalProducts: 0, lowStock: 0, outOfStock: 0 } } =
    useQuery({
      queryKey: ["productStats"],
      queryFn: fetchProductStats,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

  // Fetch products using TanStack Query
  const fetchProducts = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }) // Changed to descending for latest first
      .range(from, to);

    if (error) throw error;

    return (data || []).map((p) => {
      let images = [];
      try {
        images = p.image_urls ? JSON.parse(p.image_urls) : [];
      } catch (e) {
        console.warn("Failed to parse image_urls for product", p.id, e);
      }

      const price = Number(p.price) || 0;
      const discount = Number(p.discount) || 0;
      const finalPrice = discount ? price - (price * discount) / 100 : price;

      return { ...p, images, finalPrice };
    });
  };

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Link
          href="/dashboard/products/add-product"
          className="bg-[#f5f5f5] text-black text-sm px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 p-4 overflow-x-auto min-w-ful flex-wrap md:flex-nowrap bg-gray-50">
        <div className="flex items-center gap-1">
          <span
            className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium whitespace-nowrap"
            aria-label={`${stats.totalProducts} live products`}
          >
            <Package className="h-4 w-4 text-green-600" />
            {stats.totalProducts} Live Products
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium whitespace-nowrap"
            aria-label={`${stats.lowStock} products with low stock`}
          >
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            {stats.lowStock} Low Stock
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium whitespace-nowrap"
            aria-label={`${stats.outOfStock} products out of stock`}
          >
            <XCircle className="h-4 w-4 text-red-600" />
            {stats.outOfStock} Out of Stock
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-[1600px] max-h-[70vh] overflow-y-auto ">
        <div>
          <table className="w-full border-separate border-spacing-y-2">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                  Price (PKR)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-red-500">
                    Failed to fetch products:{" "}
                    {error?.message || "Unknown error"}
                  </td>
                </tr>
              )}

              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}

              {products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleView(product.slug)}
                >
                  {/* Product Info */}
                  <td className="px-3 py-2 text-right rounded">
                    <div className="flex gap-3">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        className="h-10 w-10 rounded object-cover"
                        alt={product.name}
                        loading="lazy"
                      />
                      <div className="flex flex-col text-left max-w-[280px] pr-5">
                        <span className="text-sm text-[#2C1810] w-full truncate">
                          {product.name}
                        </span>
                        <span className="text-xs w-full text-gray-500 truncate">
                          {product.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600 md:table-cell">
                    <span className="px-2 py-1 bg-[#ffffff] rounded text-xs">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap">
                    {product.discount ? (
                      <div className="flex flex-col leading-tight">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span className="line-through">
                            PKR {Number(product.price).toFixed(2)}
                          </span>
                          <span className="text-red-400">
                            (-{Number(product.discount)}%)
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[#2C1810]">
                          PKR {product.finalPrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-[#2C1810]">
                        PKR {product.finalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-600 md:table-cell">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center gap-1 px-2 py-1 rounded text-xs whitespace-nowrap",
                        product.stock === 0
                          ? "bg-red-200 text-red-600"
                          : product.stock <= 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      )}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : product.stock <= 10
                        ? `Only ${product.stock} left`
                        : "In Stock"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      {product.status || "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right rounded">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(product.slug);
                        }}
                        className="p-2 text-gray-400 hover:text-[#D4A574] rounded cursor-pointer hover:bg-[#D4A574]/10 transition-colors"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(product.id);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 rounded cursor-pointer hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 rounded cursor-pointer hover:bg-red-50 transition-colors"
                        title="Delete"
                        disabled={deletingIds.has(product.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {page * PAGE_SIZE + 1} to{" "}
            {page * PAGE_SIZE + products.length}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0 || isLoading}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 text-sm tracking-wider py-1 bg-[#ffffff] cursor-pointer rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={products.length < PAGE_SIZE || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 text-sm tracking-wider py-1 bg-[#ffffff] cursor-pointer rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
