"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEditProduct } from "@/hooks/useEditProduct";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();

  const {
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
    SIZE_OPTIONS,
    MATERIALS,
  } = useEditProduct(id);

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6 md:p-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(router);
          }}
          className="space-y-6"
        >
          {/* Name / Brand / SKU */}
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Product name"
              required
            />
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Brand"
            />
            <Input
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="SKU"
            />
          </div>

          {/* Price / Discount / Stock */}
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
            />
            <Input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="Discount %"
            />
            <Input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Stock"
            />
          </div>

          {/* Category */}
          <Select
            value={formData.category}
            onValueChange={(v) => handleSelectChange("category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Materials */}
          <div>
            <label className="font-medium">Materials</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {MATERIALS.map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => handleMaterialChange(mat)}
                  className={`px-4 py-1 rounded-full border ${
                    formData.materials.includes(mat)
                      ? "bg-black text-white border-black"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="font-medium">Sizes</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`px-4 py-1 rounded-full border ${
                    formData.sizes.includes(size)
                      ? "bg-black text-white border-black"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <p className="text-sm font-medium mb-2">
              Images ({uploadedImagesCount}/6)
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {formData.images.map((img, i) => (
                <label
                  key={i}
                  className="relative h-24 border rounded flex items-center justify-center cursor-pointer"
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, i)}
                  />
                  {img?.preview || img?.url ? (
                    <img
                      src={img.preview || img.url}
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-gray-400" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <p className="text-sm font-medium mb-2">Colors</p>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Color name"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
              />
              <div className="relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleColorImageChange}
                />
                <div className="h-10 w-10 border rounded flex items-center justify-center">
                  {colorPreview ? (
                    <img
                      src={colorPreview}
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              <Button type="button" onClick={handleAddColor}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border rounded px-2 py-1"
                >
                  <img
                    src={c.preview}
                    className="h-6 w-6 object-cover rounded"
                  />
                  <span className="text-sm">{c.colorName}</span>
                  <button type="button" onClick={() => handleRemoveColor(i)}>
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product description"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
