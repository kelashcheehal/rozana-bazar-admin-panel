import { useState, useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Men", "Women", "Kids", "Accessories", "Footwear"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const MATERIALS = [
  "Cotton",
  "Polyester",
  "Wool",
  "Leather",
  "Denim",
  "Silk",
  "Linen",
  "Nylon",
  "Rayon",
  "Synthetic",
];

export function useAddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    sku: "",
    sizes: [],
    materials: [],
    colors: [],
    images: Array(6).fill(null), // for local File objects
    image_urls: [], // for uploaded URLs
    care_instructions: "",
    description: "",
  });

  const [previews, setPreviews] = useState(Array(6).fill(null));
  const [colorName, setColorName] = useState("");
  const [colorImage, setColorImage] = useState(null);
  const [colorPreview, setColorPreview] = useState(null);

  const uploadedImagesCount = useMemo(
    () => formData.images.filter(Boolean).length,
    [formData.images]
  );

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      previews.forEach((url) => url && URL.revokeObjectURL(url));
      if (colorPreview) URL.revokeObjectURL(colorPreview);
      formData.colors.forEach(
        (c) => c.preview && URL.revokeObjectURL(c.preview)
      );
    };
  }, [previews, colorPreview, formData.colors]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSizeChange = useCallback((size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }, []);

  const handleMaterialChange = useCallback((material) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material],
    }));
  }, []);

  const handleImageChange = useCallback((e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = file;
      return { ...prev, images: updatedImages };
    });

    setPreviews((prev) => {
      const updatedPreviews = [...prev];
      if (updatedPreviews[index]) URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews[index] = URL.createObjectURL(file);
      return updatedPreviews;
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
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
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
    setFormData((prev) => {
      const updatedColors = [...prev.colors];
      updatedColors.splice(index, 1);
      return { ...prev, colors: updatedColors };
    });
  }, []);

  const uploadFiles = useCallback(async (files, folder = "products") => {
    if (!files.length) return [];

    const uploadPromises = files.map(async (file) => {
      const fileName = `${folder}/${Date.now()}-${file.name.replace(
        /\s+/g,
        "_"
      )}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const { publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises); // returns array of URLs
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (uploadedImagesCount < 3) {
        alert("Upload at least 3 images");
        return;
      }

      setLoading(true);

      try {
        const generateSlug = (name) =>
          name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        const slug = generateSlug(formData.name);

        // Upload product images
        const imageUrls = await uploadFiles(
          formData.images.filter(Boolean),
          "products"
        );

        // Upload color images
        const colorsWithUrls = await Promise.all(
          formData.colors.map(async (c) => {
            const [url] = await uploadFiles([c.image], "colors");
            return { colorName: c.colorName, image: url };
          })
        );

        const price = Math.floor(Number(formData.price) * 100) / 100;
        const discount = Number(formData.discount) || 0;
        const discountPrice = Number(
          (price - (price * discount) / 100).toFixed(2)
        );

        const { error } = await supabase.from("products").insert([
          {
            ...formData,
            slug,
            price,
            discount,
            discount_price: discountPrice,
            colors: colorsWithUrls,
            image_urls: imageUrls,
          },
        ]);

        if (error) throw error;
        router.push(`/dashboard/products/${slug}`);
      } catch (err) {
        console.error(err);
        alert("Failed to add product");
      } finally {
        setLoading(false);
      }
    },
    [formData, uploadedImagesCount, uploadFiles, router]
  );

  return {
    formData,
    loading,
    previews,
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
    SIZE_OPTIONS,
    MATERIALS,
  };
}
