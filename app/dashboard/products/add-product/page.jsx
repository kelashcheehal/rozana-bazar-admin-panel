"use client";

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

import { useAddProduct } from "@/hooks/useAddProduct";

export default function AddProduct() {
  const {
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
  } = useAddProduct();

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Brand */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Product Title"
              required
            />
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Brand"
              required
            />
          </div>

          {/* Price, Discount, Stock */}
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              required
            />
            <Input
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="Discount %"
            />
            <Input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Stock"
              required
            />
          </div>

          {/* Category & SKU */}
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              onValueChange={(v) => handleSelectChange("category", v)}
              value={formData.category}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="SKU"
              required
            />
          </div>

          {/* Sizes */}
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
                      : "bg-white text-black border-gray-300"
                  } transition-colors duration-200`}
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
                      : "bg-white text-black border-gray-300"
                  } transition-colors duration-200`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Product Images */}
          <div>
            <label>
              Product Images (3-6) - {uploadedImagesCount}/6 uploaded
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative h-28 w-28 border border-dashed rounded cursor-pointer flex items-center justify-center hover:border-gray-400"
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
                      alt={`Preview ${idx}`}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImagePlus className="h-8 w-8 mb-1" />
                      Upload
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
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
                  <span className="text-gray-400">+</span>
                )}
              </div>
            </div>
            <Button type="button" onClick={handleAddColor}>
              Add Color
            </Button>
          </div>

          {/* List of added colors */}
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
                <button
                  type="button"
                  onClick={() => handleRemoveColor(i)}
                  className="text-red-500 ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Care Instructions */}
          <div>
            <label>Care Instructions</label>
            <Textarea
              name="care_instructions"
              value={formData.care_instructions}
              onChange={handleInputChange}
              placeholder="E.g. Machine wash cold, do not bleach"
            />
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product description"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Save Product"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
