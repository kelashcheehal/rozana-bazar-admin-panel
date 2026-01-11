"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Static data outside component for performance
const CATEGORIES = ["Men", "Women", "Kids", "Accessories", "Footwear"];
const MATERIALS = [
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
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Consolidated form state - images now store objects with url, file, and preview
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    sku: "",
    materials: [],
    description: "",
    price: "",
    discount: "",
    category: "",
    stock: "",
    sizes: [],
    colors: [],
    images: Array(6).fill(null), // Will be array of { url?, file?, preview? }
  });

  // Color input state
  const [colorName, setColorName] = useState("");
  const [colorImage, setColorImage] = useState(null);
  const [colorPreview, setColorPreview] = useState(null);

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        router.push("/dashboard/products");
        return;
      }

      // Parse JSON fields if needed
      const parsedMaterials = Array.isArray(data.materials)
        ? data.materials
        : JSON.parse(data.materials || "[]");
      const parsedSizes = Array.isArray(data.sizes)
        ? data.sizes
        : JSON.parse(data.sizes || "[]");
      const parsedColors = Array.isArray(data.colors)
        ? data.colors
        : JSON.parse(data.colors || "[]");
      const parsedImages = Array.isArray(data.image_urls)
        ? data.image_urls
        : JSON.parse(data.image_urls || "[]");

      // Set images with url for existing
      const images = Array(6).fill(null);
      parsedImages.forEach((url, idx) => {
        if (idx < 6) images[idx] = { url };
      });

      setFormData({
        name: data.name || "",
        brand: data.brand || "",
        sku: data.sku || "",
        materials: parsedMaterials,
        description: data.description || "",
        price: data.price || 0,
        discount: data.discount || 0,
        category: data.category || "",
        stock: data.stock,
        sizes: parsedSizes,
        colors: parsedColors.map((c) => ({ ...c, preview: c.image })), // Add preview for existing
        images,
      });

      setInitialLoading(false);
    };

    fetchProduct();
  }, [id, router]);

  // Memoized count for validation
  const uploadedImagesCount = useMemo(
    () => formData.images.filter((img) => img && (img.url || img.file)).length,
    [formData.images]
  );

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      formData.images.forEach((img) => {
        if (img && img.preview) URL.revokeObjectURL(img.preview);
      });
      formData.colors.forEach((color) => {
        if (color.preview && color.image instanceof File)
          URL.revokeObjectURL(color.preview);
      });
      if (colorPreview) URL.revokeObjectURL(colorPreview);
    };
  }, [formData.images, formData.colors, colorPreview]);

  // Handlers with useCallback for optimization
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSizeChange = useCallback((size, checked) => {
    setFormData((prev) => ({
      ...prev,
      sizes: checked
        ? [...prev.sizes, size]
        : prev.sizes.filter((s) => s !== size),
    }));
  }, []);

  const handleMaterialChange = useCallback((material, checked) => {
    setFormData((prev) => ({
      ...prev,
      materials: checked
        ? [...prev.materials, material]
        : prev.materials.filter((m) => m !== material),
    }));
  }, []);

  const handleImageChange = useCallback((e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = { file, preview };
      return { ...prev, images: updatedImages };
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

  // Upload files in parallel
  const uploadFiles = useCallback(async (files, folder = "products") => {
    const uploadPromises = files.map(async (file) => {
      if (!file) return null;
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      return data.publicUrl;
    });
    return await Promise.all(uploadPromises);
  }, []);

  // Submit with validation - upload only new files
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (uploadedImagesCount < 4) {
        alert("Please upload at least 4 product images.");
        return;
      }
      if (!formData.colors.length) {
        alert("Please add at least one color.");
        return;
      }

      setLoading(true);
      try {
        // Collect all image URLs - upload new files, keep existing URLs
        const imageUrls = [];
        const filesToUpload = [];
        formData.images.forEach((img) => {
          if (img) {
            if (img.file) {
              filesToUpload.push(img.file);
            } else if (img.url) {
              imageUrls.push(img.url);
            }
          }
        });
        const uploadedUrls = await uploadFiles(filesToUpload, "products");
        imageUrls.push(...uploadedUrls.filter(Boolean));

        // Handle colors - upload new files, keep existing
        const colorsWithUrls = [];
        const colorFilesToUpload = [];
        formData.colors.forEach((color) => {
          if (color.image instanceof File) {
            colorFilesToUpload.push(color.image);
          } else {
            colorsWithUrls.push({
              colorName: color.colorName,
              image: color.image,
            });
          }
        });
        const uploadedColorUrls = await uploadFiles(
          colorFilesToUpload,
          "colors"
        );
        let colorIndex = 0;
        formData.colors.forEach((color) => {
          if (color.image instanceof File) {
            colorsWithUrls.push({
              colorName: color.colorName,
              image: uploadedColorUrls[colorIndex++],
            });
          }
        });

        const price = Number(formData.price);
        const discount = Number(formData.discount) || 0;
        const discountPrice = price - (price * discount) / 100;

        const { error } = await supabase
          .from("products")
          .update({
            name: formData.name,
            description: formData.description,
            brand: formData.brand,
            sku: formData.sku,
            price,
            discount,
            discount_price: discountPrice,
            category: formData.category,
            stock: formData.stock,
            sizes: formData.sizes,
            colors: colorsWithUrls,
            materials: formData.materials,
            image_urls: imageUrls,
          })
          .eq("id", id);

        if (error) throw error;
        router.push("/dashboard/products");
      } catch (err) {
        console.error("Submit Error:", err);
        alert("Failed to update product. Check console for details.");
      } finally {
        setLoading(false);
      }
    },
    [formData, uploadedImagesCount, uploadFiles, router, id]
  );

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name and Brand */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="font-medium">Title</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product title"
                required
              />
            </div>
            <div>
              <label className="font-medium">Brand</label>
              <Input
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter product brand"
                required
              />
            </div>
          </div>

          {/* Price, Discount, Stock */}
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <Input
              name="discount"
              type="number"
              placeholder="Discount %"
              min={0}
              max={100}
              value={formData.discount}
              onChange={handleInputChange}
            />
            <Input
              name="stock"
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Category and SKU */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="font-medium mb-1 block">Category</label>
              <Select
                onValueChange={(value) => handleSelectChange("category", value)}
                value={formData.category}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-medium">SKU</label>
              <Input
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Enter product SKU"
                required
              />
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="font-medium">Materials</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {MATERIALS.map((mat) => (
                <Button
                  key={mat}
                  type="button"
                  variant={
                    formData.materials.includes(mat) ? "default" : "outline"
                  }
                  className="rounded-full"
                  onClick={() => handleMaterialChange(mat)}
                >
                  {mat}
                </Button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="font-medium">Sizes</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SIZE_OPTIONS.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={
                    formData.sizes.includes(size) ? "default" : "outline"
                  }
                  className="rounded-full"
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Images */}
          <div>
            <label className="font-medium">
              Product Images (4-6) - {uploadedImagesCount}/6 uploaded
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              {Array.from({ length: 6 }).map((_, idx) => {
                const img = formData.images[idx];
                return (
                  <div
                    key={idx}
                    className="relative flex h-28 w-28 items-center justify-center border border-dashed rounded cursor-pointer hover:border-gray-400"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleImageChange(e, idx)}
                    />
                    {img && (img.preview || img.url) ? (
                      <img
                        src={img.preview || img.url}
                        className="h-full w-full object-cover rounded"
                        alt={`Preview ${idx + 1}`}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <ImagePlus className="h-8 w-8 mb-1" />
                        <span>Upload</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="font-medium">Colors</label>
            <div className="flex gap-2 items-center mt-1">
              <Input
                placeholder="Color name"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleColorImageChange}
                />
                <div className="h-10 w-10 border rounded flex items-center justify-center cursor-pointer">
                  {colorPreview ? (
                    <img
                      src={colorPreview}
                      className="h-full w-full object-cover rounded"
                      alt="Color preview"
                    />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              <Button type="button" onClick={handleAddColor}>
                Add Color
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {formData.colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 border rounded p-1"
                >
                  <img
                    src={c.preview}
                    className="h-6 w-6 object-cover rounded"
                    alt={c.colorName}
                  />
                  <span>{c.colorName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-medium">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
