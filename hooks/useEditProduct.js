"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

export const CATEGORIES = ["Men", "Women", "Kids", "Accessories", "Footwear"];
export const MATERIALS = [
  "Cotton",
  "Polyester",
  "Wool",
  "Leather",
  "Denim",
  "Silk",
  "Linen",
  "Synthetic",
  "Nylon",
  "Rayon",
];
export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const safeParse = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

export function useEditProduct(productId) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    sku: "",
    category: "",
    price: 0,
    discount: 0,
    stock: 0,
    description: "",
    materials: [],
    sizes: [],
    colors: [],
    images: Array(6).fill(null), // { file?, url?, preview? }
  });

  const [colorName, setColorName] = useState("");
  const [colorImage, setColorImage] = useState(null);
  const [colorPreview, setColorPreview] = useState(null);

  // ---------------- FETCH PRODUCT ----------------
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error(error);
        setInitialLoading(false);
        return;
      }

      const images = Array(6).fill(null);
      safeParse(data.image_urls).forEach((url, i) => {
        if (i < 6) images[i] = { url };
      });

      setFormData({
        name: data.name || "",
        brand: data.brand || "",
        sku: data.sku || "",
        category: data.category || "",
        price: Number(data.price) || 0,
        discount: Number(data.discount) || 0,
        stock: Number(data.stock) || 0,
        description: data.description || "",
        materials: safeParse(data.materials),
        sizes: safeParse(data.sizes),
        colors: safeParse(data.colors).map((c) => ({
          ...c,
          preview: c.image,
        })),
        images,
      });

      setInitialLoading(false);
    };

    fetchProduct();
  }, [productId]);

  // ---------------- HELPERS ----------------
  const uploadedImagesCount = useMemo(
    () => formData.images.filter((i) => i?.file || i?.url).length,
    [formData.images]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]:
        name === "price" || name === "discount"
          ? Number(value) || 0
          : name === "stock"
          ? Math.floor(Number(value)) || 0
          : value,
    }));
  }, []);

  const handleSelectChange = useCallback(
    (key, value) => setFormData((p) => ({ ...p, [key]: value })),
    []
  );

  const handleSizeChange = useCallback((size) => {
    setFormData((p) => ({
      ...p,
      sizes: p.sizes.includes(size)
        ? p.sizes.filter((s) => s !== size)
        : [...p.sizes, size],
    }));
  }, []);

  const handleMaterialChange = useCallback((mat) => {
    setFormData((p) => ({
      ...p,
      materials: p.materials.includes(mat)
        ? p.materials.filter((m) => m !== mat)
        : [...p.materials, mat],
    }));
  }, []);

  const handleImageChange = useCallback((e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);

    setFormData((p) => {
      const images = [...p.images];
      images[index] = { file, preview };
      return { ...p, images };
    });
  }, []);

  const handleColorImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (colorPreview) URL.revokeObjectURL(colorPreview);
      setColorImage(file);
      setColorPreview(URL.createObjectURL(file));
    },
    [colorPreview]
  );

  const handleAddColor = useCallback(() => {
    if (!colorName.trim() || !colorImage) return;
    setFormData((p) => ({
      ...p,
      colors: [
        ...p.colors,
        {
          colorName: colorName.trim(),
          image: colorImage,
          preview: colorPreview,
        },
      ],
    }));
    setColorName("");
    setColorImage(null);
    setColorPreview(null);
  }, [colorName, colorImage, colorPreview]);

  const handleRemoveColor = useCallback((index) => {
    setFormData((p) => ({
      ...p,
      colors: p.colors.filter((_, i) => i !== index),
    }));
  }, []);

  // ---------------- UPLOAD ----------------
  const uploadFiles = async (files, folder) => {
    return Promise.all(
      files.map(async (file) => {
        const path = `${folder}/${Date.now()}_${file.name}`;
        await supabase.storage.from("product-images").upload(path, file);
        return supabase.storage.from("product-images").getPublicUrl(path).data
          .publicUrl;
      })
    );
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = useCallback(
    async (router) => {
      if (uploadedImagesCount < 3) {
        alert("Upload at least 3 images");
        return;
      }

      setLoading(true);
      try {
        // Images
        const existingUrls = [];
        const newFiles = [];
        formData.images.forEach((img) => {
          if (img?.url) existingUrls.push(img.url);
          if (img?.file) newFiles.push(img.file);
        });

        const uploadedUrls = await uploadFiles(newFiles, "products");
        const image_urls = [...existingUrls, ...uploadedUrls];

        // Colors
        const colorFiles = [];
        const colorsFinal = [];
        formData.colors.forEach((c) => {
          if (c.image instanceof File) colorFiles.push(c.image);
          else colorsFinal.push({ colorName: c.colorName, image: c.image });
        });

        const uploadedColorUrls = await uploadFiles(colorFiles, "colors");
        let i = 0;
        formData.colors.forEach((c) => {
          if (c.image instanceof File) {
            colorsFinal.push({
              colorName: c.colorName,
              image: uploadedColorUrls[i++],
            });
          }
        });

        const slug = generateSlug(formData.name);
        const discount_price = Number(
          (formData.price - (formData.price * formData.discount) / 100).toFixed(
            2
          )
        );

        await supabase
          .from("products")
          .update({
            ...formData,
            slug,
            discount_price,
            image_urls,
            colors: colorsFinal,
          })
          .eq("id", productId);

        router.push("/dashboard/products");
      } catch (err) {
        console.error(err);
        alert("Update failed");
      } finally {
        setLoading(false);
      }
    },
    [formData, uploadedImagesCount, productId]
  );

  return {
    formData,
    loading,
    initialLoading,
    colorName,
    setColorName,
    colorPreview,
    handleInputChange,
    handleSelectChange,
    handleSizeChange,
    handleMaterialChange,
    handleImageChange,
    handleColorImageChange,
    handleAddColor,
    handleRemoveColor,
    handleSubmit,
    uploadedImagesCount,
    CATEGORIES,
    MATERIALS,
    SIZE_OPTIONS,
  };
}
