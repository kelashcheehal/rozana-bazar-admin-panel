// lib/useProducts.js
import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";

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

    return data || [];
  };

  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    select: selectProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection
    keepPreviousData: true,
    refetchOnWindowFocus: false, // Avoid refetch on window focus for better performance
  });
}

const selectProducts = (data) => {
  return data.map((p) => {
    let images = [];
    try {
      if (Array.isArray(p.image_urls)) {
        images = p.image_urls;
      } else if (typeof p.image_urls === "string") {
        try {
          images = JSON.parse(p.image_urls);
        } catch {
          // If parse fails, assume it might be a single URL string
          images = [p.image_urls].filter(Boolean);
        }
      }
    } catch (e) {
      console.warn("Failed to parse image_urls for product", p.id, e);
    }
    
    // Ensure it's a valid array of strings
    if (!Array.isArray(images)) images = [];
    images = images.filter((img) => typeof img === "string" && img.trim() !== "");

    const price = Number(p.price) || 0;
    const discount = Number(p.discount) || 0;
    const finalPrice = discount ? price - (price * discount) / 100 : price;

    // Mock 'sold' count if not present in DB, to populate Top Products
    const sold = p.sold !== undefined ? p.sold : Math.floor(Math.random() * 100) + 1;

    return { ...p, images, finalPrice, sold };
  });
};
