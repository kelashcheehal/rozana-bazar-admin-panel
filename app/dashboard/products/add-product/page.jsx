// app/products/add/page.jsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";

import { useProductForm } from "@/hooks/useProductForm";

import AdminBreadcrumb from "@/components/breadcrumb";

export default function AddProductPage() {
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
    handleRemoveImage,
    handleSubmit,
    CATEGORIES,
    SIZE_OPTIONS,
    MATERIALS,
  } = useProductForm();

  const uploadedImagesCount = previews.filter(Boolean).length;

  const resetForm = () => {
    // Optional: implement manual reset if needed, or rely on navigation
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <AdminBreadcrumb
          items={[
            { label: "Products", href: "/dashboard/products" },
            { label: "Add Product" },
          ]}
        />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">
            Fill in all the product details below
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Product Information</span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.status === "active"}
                    onCheckedChange={(checked) =>
                      handleSelectChange("status", checked ? "active" : "draft")
                    }
                  />
                  <span className="text-sm font-medium">
                    {formData.status === "active" ? "Active" : "Draft"}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Enter SKU"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pricing & Stock
                </h3>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Attributes
                </h3>

                {/* Materials */}
                <div className="space-y-3">
                  <Label>Materials</Label>
                  <div className="flex flex-wrap gap-2">
                    {MATERIALS.map((material) => (
                      <button
                        key={material}
                        type="button"
                        onClick={() => handleMaterialChange(material)}
                        className={`px-4 py-2 rounded-full border transition-colors ${formData.materials.includes(material)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                  {formData.materials.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        Selected: {formData.materials.length}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formData.materials.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        className={`px-4 py-2 rounded-full border transition-colors ${formData.sizes.includes(size)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {formData.sizes.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        Selected: {formData.sizes.length}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formData.sizes.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Care Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="care_instructions">Care Instructions</Label>
                  <Textarea
                    id="care_instructions"
                    name="care_instructions"
                    value={formData.care_instructions}
                    onChange={handleInputChange}
                    placeholder="Enter care instructions"
                    rows={3}
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Product Images
                  </h3>
                  <span className="text-sm text-gray-500">
                    {uploadedImagesCount}/6 images
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, index)}
                        />
                        <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors overflow-hidden bg-gray-50 flex items-center justify-center">
                          {preview ? (
                            <>
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                <Upload className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <ImagePlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <span className="text-xs text-gray-500">
                                Upload
                              </span>
                            </div>
                          )}
                        </div>
                      </label>
                      {preview && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Colors</h3>

                {/* Add Color Form */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="color-name">Color Name</Label>
                      <Input
                        id="color-name"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                        placeholder="e.g., Midnight Black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Color Image</Label>
                      <div className="relative">
                        <input
                          type="file"
                          id="color-image"
                          accept="image/*"
                          className="hidden"
                          onChange={handleColorImageChange}
                        />
                        <label htmlFor="color-image" className="cursor-pointer">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                            {colorPreview ? (
                              <div className="relative">
                                <img
                                  src={colorPreview}
                                  alt="Color preview"
                                  className="h-20 w-20 mx-auto object-cover rounded"
                                />
                                <Badge className="absolute -top-2 -right-2 bg-blue-500">
                                  Change
                                </Badge>
                              </div>
                            ) : (
                              <>
                                <ImagePlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <span className="text-sm text-gray-500">
                                  Upload color image
                                </span>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={handleAddColor}
                        className="w-full"
                        disabled={!colorName.trim() || !colorPreview}
                      >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Add Color
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Display Added Colors */}
                {formData.colors.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Added Colors ({formData.colors.length})</Label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {formData.colors.map((color, index) => (
                        <div
                          key={index}
                          className="relative group border rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-square mb-2 rounded overflow-hidden">
                            <img
                              src={color.preview}
                              alt={color.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <span className="text-sm font-medium truncate block">
                              {color.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
                <div>
                  <p className="text-sm text-gray-500">* Required fields</p>
                  {formData.status === "active" && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      Product will be published immediately
                    </Badge>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-[140px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Product"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
