"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = useCallback(
    (id) => {
      router.push(`/dashboard/products/edit-product/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete product.");
    } finally {
      setDeleteLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("products")
        .select()
        .order("created_at", { ascending: true })
        .range(from, to);

      if (!cancelled) {
        if (error) {
          setError("Failed to fetch products");
        } else {
          // Parse data here to avoid re-parsing on render
          const parsed = (data || []).map((p) => {
            let images = [];
            try {
              images = p.image_urls ? JSON.parse(p.image_urls) : [];
            } catch {}

            const price = Number(p.price) || 0;
            const discount = Number(p.discount) || 0;
            const finalPrice = discount
              ? price - (price * discount) / 100
              : price;

            return {
              ...p,
              images,
              finalPrice,
            };
          });
          setProducts(parsed);
        }
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [page]);

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
          className="bg-[#2C1810] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
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

            <tbody className="divide-y">
              {loading && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              )}

              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}

              {!loading &&
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          className="h-10 w-10 rounded-lg object-cover"
                          alt={product.name}
                        />
                        <span className="font-medium text-[#2C1810]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-[#2C1810]">
                      {product.discount ? (
                        <>
                          <span className="line-through text-sm text-red-400 mr-2">
                            {Number(product.price).toFixed(2)}
                          </span>
                          <span>${product.finalPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span>${product.finalPrice.toFixed(2)}</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {product.stock?.qty || product.stock} units
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Eye
                          size={18}
                          className="text-gray-400 cursor-pointer hover:text-blue-500"
                          onClick={() => handleEdit(product.id)}
                        />
                        <Edit
                          size={18}
                          className="text-gray-400 cursor-pointer hover:text-blue-500"
                          onClick={() => handleEdit(product.id)}
                        />
                        <Trash2
                          size={18}
                          className="text-gray-400 cursor-pointer hover:text-red-500"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteLoading}
                        />
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
              disabled={page === 0 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={products.length < PAGE_SIZE || loading}
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
