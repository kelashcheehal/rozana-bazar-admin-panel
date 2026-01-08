"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("walnut")
  const [selectedSize, setSelectedSize] = useState("medium")
  const [activeTab, setActiveTab] = useState("overview")
  const [addedToCart, setAddedToCart] = useState(false)

  const product = {
    id: 1,
    name: "Premium Wooden Dining Chair",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 128,
    sku: "WDC-001-WAL",
    availability: "In Stock",
    images: [
      "/wooden-dining-chair-front-view.jpg",
      "/wooden-dining-chair-side-view.jpg",
      "/wooden-dining-chair-detail.jpg",
      "/wooden-dining-chair-back-view.jpg",
    ],
    colors: [
      { name: "walnut", hex: "#3E2723", label: "Walnut" },
      { name: "oak", hex: "#8D6E63", label: "Oak" },
      { name: "maple", hex: "#A1887F", label: "Maple" },
    ],
    sizes: ["small", "medium", "large"],
    description:
      "Handcrafted premium wooden dining chair featuring solid wood construction with a beautiful walnut finish. Perfect for modern dining rooms, this chair combines elegance with comfort.",
    features: [
      "Solid wood construction for durability",
      "Comfortable curved backrest",
      "Non-slip foot pads",
      "Easy to clean and maintain",
      "Supports up to 300 lbs",
      "Available in multiple finishes",
    ],
    specifications: {
      material: "Solid Walnut Wood",
      dimensions: '18" W × 22" D × 32" H',
      weight: "12 lbs",
      finish: "Hand-applied natural oil",
      warranty: "5 years",
      care: "Wipe clean with damp cloth, dry immediately",
    },
    reviews_data: [
      {
        id: 1,
        author: "John Smith",
        rating: 5,
        date: "2 weeks ago",
        title: "Excellent quality!",
        comment: "This chair is absolutely beautiful and very sturdy. The craftsmanship is outstanding.",
      },
      {
        id: 2,
        author: "Sarah Johnson",
        rating: 4,
        date: "1 month ago",
        title: "Great value for money",
        comment: "Very satisfied with the purchase. Arrived well packaged and on time.",
      },
    ],
    relatedProducts: [
      {
        id: 2,
        name: "Modern Coffee Table",
        price: 449,
        image: "/wooden-coffee-table-modern.jpg",
        rating: 4.7,
      },
      {
        id: 3,
        name: "Elegant Side Table",
        price: 199,
        image: "/wooden-side-table-elegant.jpg",
        rating: 4.9,
      },
      {
        id: 4,
        name: "Vintage Bookshelf",
        price: 599,
        image: "/wooden-bookshelf-vintage.jpg",
        rating: 4.6,
      },
    ],
  }

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Spacing for Admin Layout */}
      <div className="pt-8 pb-4 px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-[#d4a574]"
            style={{ color: "var(--primary-dark)" }}
          >
            Home
          </Link>
          <span style={{ color: "var(--primary-dark)" }}>/</span>
          <Link
            href="/products"
            className="text-sm font-medium transition-colors hover:text-[#d4a574]"
            style={{ color: "var(--primary-dark)" }}
          >
            Furniture
          </Link>
          <span style={{ color: "var(--primary-dark)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--primary-gold)" }}>
            {product.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-in fade-in duration-600">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative w-full aspect-square bg-[#f9f7f4] rounded-2xl overflow-hidden group transition-all duration-500 hover:shadow-2xl"
              style={{ backgroundColor: "var(--bg-light)" }}
            >
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                priority
              />
              <div
                className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "var(--primary-gold)" }}
              >
                Sale
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                    selectedImage === idx ? "border-[#d4a574] scale-105" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image src={img || "/placeholder.svg"} alt={`View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-700 delay-200">
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--primary-dark)" }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="text-lg"
                      style={{
                        color: i < Math.floor(product.rating) ? "var(--primary-gold)" : "#ddd",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--primary-dark)" }}>
                  {product.rating}
                </span>
                <span className="text-sm" style={{ color: "#666" }}>
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-700 delay-300">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold" style={{ color: "var(--primary-gold)" }}>
                  ${product.price}
                </span>
                <span className="text-lg line-through" style={{ color: "#999" }}>
                  ${product.originalPrice}
                </span>
                <span
                  className="text-sm font-semibold px-3 py-1 rounded-full"
                  style={{ color: "white", backgroundColor: "var(--primary-gold)" }}
                >
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
              <p className="text-sm" style={{ color: "#00a86b" }}>
                ✓ {product.availability}
              </p>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed" style={{ color: "#555" }}>
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="animate-in fade-in slide-in-from-left-2 duration-700 delay-400">
              <label className="block text-sm font-semibold mb-3" style={{ color: "var(--primary-dark)" }}>
                Color
              </label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      selectedColor === color.name ? "scale-110" : ""
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      borderColor: selectedColor === color.name ? "var(--primary-gold)" : "#ddd",
                      borderWidth: selectedColor === color.name ? "3px" : "2px",
                    }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="animate-in fade-in slide-in-from-left-2 duration-700 delay-500">
              <label className="block text-sm font-semibold mb-3" style={{ color: "var(--primary-dark)" }}>
                Size
              </label>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm border-2 ${
                      selectedSize === size ? "border-white scale-105" : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{
                      backgroundColor: selectedSize === size ? "var(--primary-dark)" : "white",
                      color: selectedSize === size ? "white" : "var(--primary-dark)",
                    }}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="animate-in fade-in slide-in-from-left-2 duration-700 delay-600 flex gap-4 pt-4">
              <div
                className="flex items-center border-2 rounded-lg overflow-hidden"
                style={{ borderColor: "var(--primary-dark)", backgroundColor: "var(--bg-light)" }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 transition-colors hover:bg-gray-200"
                  style={{ color: "var(--primary-dark)" }}
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold" style={{ color: "var(--primary-dark)" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 transition-colors hover:bg-gray-200"
                  style={{ color: "var(--primary-dark)" }}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                  addedToCart ? "ring-2" : ""
                }`}
                style={{
                  backgroundColor: addedToCart ? "#00a86b" : "var(--primary-dark)",
                  color: "white",
                  ringColor: "var(--primary-gold)",
                }}
              >
                {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>
            </div>

            {/* SKU and Other Info */}
            <div
              className="pt-4 border-t-2 animate-in fade-in slide-in-from-left-2 duration-700 delay-700"
              style={{ borderColor: "var(--bg-light)" }}
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p style={{ color: "#666" }}>SKU</p>
                  <p className="font-semibold" style={{ color: "var(--primary-dark)" }}>
                    {product.sku}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#666" }}>Category</p>
                  <p className="font-semibold" style={{ color: "var(--primary-dark)" }}>
                    Furniture
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t-2" style={{ borderColor: "var(--bg-light)" }}>
          <div className="flex gap-8 mb-8 border-b-2" style={{ borderColor: "var(--bg-light)" }}>
            {["overview", "specifications", "reviews", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-bold transition-all duration-300 relative ${
                  activeTab === tab ? "text-white" : "text-gray-600"
                }`}
                style={{
                  color: activeTab === tab ? "var(--primary-dark)" : "#999",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                    style={{ backgroundColor: "var(--primary-gold)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in duration-500 pb-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "var(--primary-dark)" }}>
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span style={{ color: "var(--primary-gold)" }}>✓</span>
                        <span style={{ color: "#555" }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b pb-3"
                    style={{ borderColor: "var(--bg-light)" }}
                  >
                    <span className="font-semibold capitalize" style={{ color: "var(--primary-dark)" }}>
                      {key}
                    </span>
                    <span style={{ color: "#666" }}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {product.reviews_data.map((review) => (
                  <div key={review.id} className="pb-6 border-b" style={{ borderColor: "var(--bg-light)" }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold" style={{ color: "var(--primary-dark)" }}>
                          {review.author}
                        </p>
                        <p className="text-sm" style={{ color: "#999" }}>
                          {review.date}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="text-lg"
                            style={{
                              color: i < review.rating ? "var(--primary-gold)" : "#ddd",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="font-semibold mb-1" style={{ color: "var(--primary-dark)" }}>
                      {review.title}
                    </p>
                    <p style={{ color: "#666" }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: "var(--primary-dark)" }}>
                    Shipping Information
                  </h4>
                  <p style={{ color: "#666" }}>
                    Free shipping on orders over $50. Standard delivery takes 5-7 business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: "var(--primary-dark)" }}>
                    Return Policy
                  </h4>
                  <p style={{ color: "#666" }}>30-day money-back guarantee. Items must be in original condition.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pb-12">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--primary-dark)" }}>
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((related, idx) => (
              <div
                key={related.id}
                className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className="relative aspect-square rounded-xl overflow-hidden bg-[#f9f7f4] mb-4 transition-all duration-500 hover:shadow-xl"
                  style={{ backgroundColor: "var(--bg-light)" }}
                >
                  <Image
                    src={related.image || "/placeholder.svg"}
                    alt={related.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3
                  className="font-semibold text-sm mb-2 group-hover:text-[#d4a574] transition-colors"
                  style={{ color: "var(--primary-dark)" }}
                >
                  {related.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold" style={{ color: "var(--primary-gold)" }}>
                    ${related.price}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="text-xs"
                        style={{
                          color: i < Math.floor(related.rating) ? "var(--primary-gold)" : "#ddd",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
