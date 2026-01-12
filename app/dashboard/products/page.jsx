"use client";

import { useState, useCallback } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleView = useCallback(
    (id) => router.push(`/dashboard/products/product/${id}`),
    [router]
  );

  const handleEdit = useCallback(
    (id) => router.push(`/dashboard/products/edit-product/${id}`),
    [router]
  );

  const handleDelete = useCallback(
    async (productId) => {
      if (!window.confirm("Are you sure you want to delete this product?"))
        return;

      setDeleteLoading(true);
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);
        if (error) throw error;

        // Refetch will handle updating the list
        queryClient.invalidateQueries(["products", page]);
      } catch (err) {
        console.error(err);
        alert("Failed to delete product.");
      } finally {
        setDeleteLoading(false);
      }
    },
    [page]
  );

  // Fetch products using TanStack Query
  const fetchProducts = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("products")
      .select()
      .order("created_at", { ascending: true })
      .range(from, to);

    if (error) throw error;

    return (data || []).map((p) => {
      let images = [];
      try {
        images = p.image_urls ? JSON.parse(p.image_urls) : [];
      } catch {}

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
    refetch,
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
          className="bg-[#2C1810] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={20} /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden max-w-full">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#ffffff]">
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
                    Failed to fetch products: {error.message}
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
                  className="bg-[#fefefe] rounded cursor-pointer"
                  onClick={() => handleView(product.id)}
                >
                  {/* Product Info */}
                  <td className="px-2 py-2 text-right rounded">
                    <div className="flex gap-3">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        className="h-10 w-10 rounded object-cover"
                        alt={product.name}
                        loading="lazy"
                      />
                      <div className="flex flex-col text-left max-w-[260px] pr-5">
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
                    <span className="px-2 py-1 bg-[#f5f5f5] rounded text-xs">
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
                    <span className="px-2 py-1 bg-[#f5f5f5] rounded text-xs">
                      {product.stock || 0} Units
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      {product.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right rounded">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(product.id);
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
                        disabled={deleteLoading}
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
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={products.length < PAGE_SIZE || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
