"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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

// Static data moved outside component to avoid re-creation on renders
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

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Consolidated form state to reduce re-renders
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    material: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    stock: "",
    sizes: [],
    colors: [],
    images: Array(6).fill(null),
  });

  const [previews, setPreviews] = useState(Array(6).fill(null));

  // Color input state
  const [colorName, setColorName] = useState("");
  const [colorImage, setColorImage] = useState(null);
  const [colorPreview, setColorPreview] = useState(null);

  // Memoize uploaded images count for validation
  const uploadedImagesCount = useMemo(
    () => formData.images.filter(Boolean).length,
    [formData.images]
  );

  // Cleanup object URLs on unmount or when previews change
  useEffect(() => {
    return () => {
      previews.forEach((url) => url && URL.revokeObjectURL(url));
      if (colorPreview) URL.revokeObjectURL(colorPreview);
    };
  }, [previews, colorPreview]);

  // Generic input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Select change handler
  const handleSelectChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Size checkbox change handler
  const handleSizeChange = useCallback((size, checked) => {
    setFormData((prev) => ({
      ...prev,
      sizes: checked
        ? [...prev.sizes, size]
        : prev.sizes.filter((s) => s !== size),
    }));
  }, []);

  // Image change handler with preview update
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

  // Color image change handler
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

  // Add color handler
  const handleAddColor = useCallback(() => {
    if (!colorName.trim() || !colorImage) return;
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        { colorName: colorName.trim(), image: colorImage },
      ],
    }));
    setColorName("");
    setColorImage(null);
    setColorPreview(null);
  }, [colorName, colorImage]);

  // Upload files to Supabase
  const uploadFiles = useCallback(async (files, folder = "products") => {
    const urls = [];
    for (const file of files) {
      if (!file) continue;
      const fileName = `${folder}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      urls.push(data.publicUrl);
    }
    return urls;
  }, []);

  // Form submission with validation
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
        // Upload product images
        const imageUrls = await uploadFiles(
          formData.images.filter(Boolean),
          "products"
        );

        // Upload color images
        const colorsWithUrls = [];
        for (const color of formData.colors) {
          const [url] = await uploadFiles([color.image], "colors");
          colorsWithUrls.push({ colorName: color.colorName, image: url });
        }

        const price = Number(formData.price);
        const discount = Number(formData.discount) || 0;
        const discountPrice = price - (price * discount) / 100;

        const { error } = await supabase.from("products").insert([
          {
            name: formData.name,
            description: formData.description,
            price,
            materials: formData.material,
            brand: formData.brand,
            discount,
            discount_price: discountPrice,
            category: formData.category,
            stock: Number(formData.stock),
            sizes: (formData.sizes),
            colors: (colorsWithUrls),
            image_urls: (imageUrls),
          },
        ]);

        if (error) throw error;
        router.push("/dashboard/products");
      } catch (err) {
        console.error("Submit Error:", err);
        alert("Failed to add product. Check console for details.");
      } finally {
        setLoading(false);
      }
    },
    [formData, uploadedImagesCount, uploadFiles, router]
  );

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

          {/* Category and Material */}
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
              <label className="font-medium mb-1 block">Material</label>
              <Select
                onValueChange={(value) => handleSelectChange("material", value)}
                value={formData.material}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a material" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIALS.map((mat) => (
                    <SelectItem key={mat} value={mat}>
                      {mat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="font-medium">Sizes</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {SIZE_OPTIONS.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={size}
                    checked={formData.sizes.includes(size)}
                    onCheckedChange={(checked) =>
                      handleSizeChange(size, checked)
                    }
                  />
                  <label htmlFor={size} className="text-sm font-medium">
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Product Images */}
          <div>
            <label className="font-medium">
              Product Images (4-6) - {uploadedImagesCount}/6 uploaded
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              {Array.from({ length: 6 }).map((_, idx) => (
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
                  {previews[idx] ? (
                    <img
                      src={previews[idx]}
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
              ))}
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
                    src={
                      c.image instanceof File
                        ? URL.createObjectURL(c.image)
                        : c.image
                    }
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
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
