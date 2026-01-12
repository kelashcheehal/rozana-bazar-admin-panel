"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductDetail() {
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false since we're using fake data immediately

  // Fake product data
  const fakeProduct = {
    id: id || "prod_001",
    name: "Premium Wooden Dining Chair",
    description:
      "Handcrafted premium wooden dining chair featuring solid wood construction with a beautiful walnut finish. Perfect for modern dining rooms, this chair combines elegance with comfort. Designed for durability and style.",
    price: 29999,
    discount: 15,
    stock: 25,
    sku: "WDC-001-WAL",
    rating: 4.8,
    review_count: 128,
    weight: "12.5 kg",
    dimensions: '18" W × 22" D × 32" H',
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&q=80",
    ],
    features: [
      "Solid wood construction for durability",
      "Ergonomic curved backrest design",
      "Water-resistant finish",
      "Easy to clean and maintain",
      "Supports up to 300 lbs",
      "Available in multiple finishes",
      "Assembly required (tools included)",
    ],
    specifications: {
      material: "Solid Walnut Wood & Premium Fabric",
      style: "Modern Contemporary",
      assembly_required: "Yes (20-30 minutes)",
      care_instructions: "Wipe clean with damp cloth, avoid harsh chemicals",
      warranty: "5 years limited warranty",
      country_of_origin: "Pakistan",
      package_dimensions: '24" × 24" × 36"',
      package_weight: "14 kg",
    },
    categories: { name: "Dining Chairs" },
    colors: [
      { id: "color_1", name: "Walnut", hex_code: "#3E2723" },
      { id: "color_2", name: "Oak", hex_code: "#8D6E63" },
      { id: "color_3", name: "Maple", hex_code: "#A1887F" },
      { id: "color_4", name: "Ebony", hex_code: "#212121" },
    ],
    sizes: [
      { id: "size_1", name: "Small" },
      { id: "size_2", name: "Medium" },
      { id: "size_3", name: "Large" },
    ],
  };

  // Calculate final price
  const price = Number(fakeProduct.price) || 0;
  const discount = Number(fakeProduct.discount) || 0;
  const finalPrice = discount ? price - (price * discount) / 100 : price;

  // Process fake product data
  useEffect(() => {
    // Simulate loading delay
    setLoading(true);
    setTimeout(() => {
      setProduct({
        ...fakeProduct,
        finalPrice,
        price,
        discount,
      });
      // Set default selections
      if (fakeProduct.colors && fakeProduct.colors.length > 0) {
        setSelectedColor(fakeProduct.colors[0].id);
      }
      if (fakeProduct.sizes && fakeProduct.sizes.length > 0) {
        setSelectedSize(fakeProduct.sizes[0].id);
      }
      setLoading(false);
    }, 300);
  }, [id]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!product) return;

    try {
      const cartItem = {
        product_id: product.id,
        product_name: product.name,
        quantity,
        color_id: selectedColor,
        color_name:
          product.colors.find((c) => c.id === selectedColor)?.name || "",
        size_id: selectedSize,
        size_name: product.sizes.find((s) => s.id === selectedSize)?.name || "",
        price: product.finalPrice,
        image: product.images[0],
        added_at: new Date().toISOString(),
      };

      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Check if item already exists
      const existingIndex = existingCart.findIndex(
        (item) =>
          item.product_id === cartItem.product_id &&
          item.color_id === cartItem.color_id &&
          item.size_id === cartItem.size_id
      );

      if (existingIndex >= 0) {
        // Update quantity if exists
        existingCart[existingIndex].quantity += quantity;
      } else {
        // Add new item
        existingCart.push(cartItem);
      }

      // Save back to localStorage
      localStorage.setItem("cart", JSON.stringify(existingCart));

      // Show success message
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);

      // Optional: Dispatch cart update event for other components
      window.dispatchEvent(new Event("cartUpdated"));

      // Log for debugging
      console.log("Added to cart:", cartItem);
      console.log("Cart total items:", existingCart.length);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding to cart. Please try again.");
    }
  };

  // Get selected color and size names for display
  const selectedColorName =
    product?.colors?.find((c) => c.id === selectedColor)?.name || "";
  const selectedSizeName =
    product?.sizes?.find((s) => s.id === selectedSize)?.name || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4a574] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Product not found</p>
          <Link
            href="/products"
            className="px-6 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#d4a574] transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Spacing */}
      <div className="pt-8 pb-4 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm">
          <Link
            href="/"
            className="text-gray-600 hover:text-[#d4a574] transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href="/products"
            className="text-gray-600 hover:text-[#d4a574] transition-colors"
          >
            {product.categories?.name || "Furniture"}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-[#d4a574] font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={product.images[selectedImage]?.includes(
                    "unsplash.com"
                  )}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-[#d4a574] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-[#d4a574] scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`View ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                      unoptimized={img?.includes("unsplash.com")}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and SKU */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                SKU: {product.sku || "N/A"}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(product.rating)
                        ? "text-[#d4a574]"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-700 font-medium">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-gray-500 text-sm">
                ({product.review_count} reviews)
              </span>
            </div>

            {/* Price Section */}
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  PKR {product.finalPrice.toLocaleString()}
                </span>

                {product.discount > 0 && (
                  <>
                    <span className="text-lg line-through text-gray-400">
                      PKR {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-green-600 font-semibold">
                      Save PKR{" "}
                      {(product.price - product.finalPrice).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              <p
                className={`text-sm ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `✓ In Stock (${product.stock} available)`
                  : "✗ Out of Stock"}
              </p>
            </div>

            {/* Description */}
            <div className="text-gray-700 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Color: {selectedColorName}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`relative w-10 h-10 rounded-full border-3 transition-all ${
                      selectedColor === color.id
                        ? "scale-110 ring-2 ring-offset-2 ring-[#d4a574]"
                        : "hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: color.hex_code || "#ccc",
                    }}
                    title={color.name}
                  >
                    {selectedColor === color.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Size: {selectedSizeName}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm border-2 ${
                      selectedSize === size.id
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={product.stock <= 0}
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold text-gray-900 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={product.stock <= 0}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                  product.stock <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : addedToCart
                    ? "bg-green-600"
                    : "bg-gray-900 hover:bg-[#d4a574] hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {product.stock <= 0
                  ? "Out of Stock"
                  : addedToCart
                  ? "✓ Added to Cart"
                  : `Add to Cart - PKR ${(
                      product.finalPrice * quantity
                    ).toLocaleString()}`}
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900">
                    {product.categories?.name || "Furniture"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-semibold text-gray-900">
                    {product.weight}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Dimensions</p>
                  <p className="font-semibold text-gray-900">
                    {product.dimensions}
                  </p>
                </div>
              </div>
            </div>

            {/* Cart Notification */}
            {addedToCart && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                ✓ Added {quantity} × {product.name} ({selectedColorName},{" "}
                {selectedSizeName}) to cart!
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 md:gap-8 mb-8 border-b border-gray-200">
            {[
              { id: "overview", label: "Overview" },
              { id: "specifications", label: "Specifications" },
              { id: "features", label: "Features" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 font-bold transition-all relative ${
                  activeTab === tab.id
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4a574] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pb-12">
            {activeTab === "overview" && product.description && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "specifications" && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-3">
                    <span className="font-semibold text-gray-900 capitalize block">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "features" && product.features && (
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-[#d4a574] mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Customer Reviews
                    </h3>
                    <span className="text-[#d4a574] font-semibold">
                      {product.rating}/5
                    </span>
                  </div>

                  {/* Fake Reviews */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div
                        key={review}
                        className="border-b border-gray-200 pb-4 last:border-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {
                                [
                                  "John Smith",
                                  "Sarah Johnson",
                                  "Michael Brown",
                                ][review - 1]
                              }
                            </p>
                            <p className="text-sm text-gray-500">
                              {
                                ["2 weeks ago", "1 month ago", "3 days ago"][
                                  review - 1
                                ]
                              }
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < [5, 4, 5][review - 1]
                                    ? "text-[#d4a574]"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">
                          {
                            [
                              "This chair is absolutely beautiful and very sturdy. The craftsmanship is outstanding!",
                              "Very satisfied with the purchase. Arrived well packaged and on time.",
                              "Excellent quality, exceeded my expectations. Highly recommended!",
                            ][review - 1]
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
