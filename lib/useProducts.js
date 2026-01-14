// lib/useProducts.js
import { supabase } from "./supabaseClient";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all products
 */
export function useProducts() {
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }); // latest first

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

  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });
}
