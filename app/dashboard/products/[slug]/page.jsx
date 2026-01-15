"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import AdminBreadcrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

import MainImage from "@/components/product-components/MainImage";
import ProductHeader from "@/components/product-components/ProductHeader";
import ColorSelector from "@/components/product-components/ColorSelector";
import SizeSelector from "@/components/product-components/SizeSelector";
import ActionButtons from "@/components/product-components/ActionButtons";
import ProductDetailsAccordion from "@/components/product-components/DescriptionAccordian";
import BrandStats from "@/components/product-components/BrandStats";
import RelatedProducts from "@/components/product-components/RelatedProducts";

import { useProducts } from "@/lib/useProducts";

export default function ProductDetailPage() {
  const { data: products } = useProducts();
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (!products) return;

    const foundProduct = products.find((p) => String(p.slug) === String(slug));
    if (!foundProduct) {
      toast.error("Product not found");
      router.push("/products");
      return;
    }

    // Parse JSON fields
    const parsedProduct = {
      ...foundProduct,
      materials: Array.isArray(foundProduct.materials)
        ? foundProduct.materials
        : JSON.parse(foundProduct.materials || "[]"),
      sizes: Array.isArray(foundProduct.sizes)
        ? foundProduct.sizes
        : JSON.parse(foundProduct.sizes || "[]"),
      colors: Array.isArray(foundProduct.colors)
        ? foundProduct.colors
        : JSON.parse(foundProduct.colors || "[]"),
      image_urls: Array.isArray(foundProduct.image_urls)
        ? foundProduct.image_urls
        : JSON.parse(foundProduct.image_urls || "[]"),
      price: Number(foundProduct.price),
      discount_price: Number(foundProduct.discount_price),
      discount: Number(foundProduct.discount),
    };

    setProduct(parsedProduct);
    setSelectedColor(parsedProduct.colors[0] || {});
    setSelectedSize(parsedProduct.sizes[0] || "");

    // Related products (same category, excluding this product)
    const related = products
      .filter(
        (p) =>
          p.category === parsedProduct.category && p.slug !== parsedProduct.slug
      )
      .slice(0, 4)
      .map((p) => ({
        ...p,
        materials: Array.isArray(p.materials)
          ? p.materials
          : JSON.parse(p.materials || "[]"),
        sizes: Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes || "[]"),
        colors: Array.isArray(p.colors)
          ? p.colors
          : JSON.parse(p.colors || "[]"),
        image_urls: Array.isArray(p.image_urls)
          ? p.image_urls
          : JSON.parse(p.image_urls || "[]"),
        price: Number(p.price),
        discount_price: Number(p.discount_price),
        discount: Number(p.discount),
      }));

    setRelatedProducts(related);

    // Mock reviews
    const mockReviews = [
      {
        id: 1,
        user_name: "Vasudevan T",
        rating: 5,
        comment:
          "Excellent fabric and perfect fit. The custom sizing option worked perfectly for me.",
        date: "2024-01-15",
        verified: true,
      },
      {
        id: 2,
        user_name: "Rajesh Kumar",
        rating: 5,
        comment:
          "Premium quality cotton. Worth every penny. The attention to detail is impressive.",
        date: "2024-01-10",
        verified: true,
      },
      {
        id: 3,
        user_name: "Priya Sharma",
        rating: 4,
        comment: "Beautiful shirt, but delivery took longer than expected.",
        date: "2024-01-05",
        verified: false,
      },
    ];
    setReviews(mockReviews);

    setLoading(false);
  }, [products, slug, router]);

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    toast.success(`${quantity} × ${product.name} added to cart`);
  }, [product, selectedSize, quantity]);

  const handleBuyNow = useCallback(() => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    router.push(
      `/checkout?product=${id}&size=${selectedSize}&color=${selectedColor.colorName}&quantity=${quantity}`
    );
  }, [slug, router, selectedSize, selectedColor, quantity]);

  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  }, [isFavorite]);

  const checkDelivery = useCallback(() => {
    if (!pincode || pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    toast.success(`Delivery available to ${pincode} in 3-5 business days`);
  }, [pincode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">
          Product not found
        </h2>
        <p className="text-gray-500 mt-2">
          The product you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const discountPercentage =
    product.discount > 0 ? Math.round(product.discount) : 0;
  const discountedPrice = product.discount_price || product.price;
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 bg-white">
      <AdminBreadcrumb
        items={[
          { label: "Products", href: "/dashboard/products" },
          { label: product.name },
        ]}
      />

      {/* MOBILE IMAGE CAROUSEL */}
      <div className="lg:hidden -mx-4 mb-8">
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth">
          {product.image_urls.map((image, index) => (
            <div
              key={index}
              className="relative min-w-full h-[90vw] overflow-hidden snap-center bg-gray-50"
            >
              <img
                src={
                  index === 0 && selectedColor.image
                    ? selectedColor.image
                    : image
                }
                alt={`${product.name} ${index + 1}`}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Desktop Images */}
        <div className="hidden lg:block">
          <MainImage
            product={product}
            selectedColor={selectedColor}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6 relative">
          <div className="space-y-6 sticky top-24">
            <ProductHeader
              product={product}
              reviews={reviews}
              averageRating={averageRating}
              discountedPrice={discountedPrice}
              discountPercentage={discountPercentage}
            />

            <ColorSelector
              product={product}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              setSelectedImageIndex={setSelectedImageIndex}
            />

            <SizeSelector
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />

            <ActionButtons
              product={product}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />

            <ProductDetailsAccordion product={product} />
          </div>
        </div>
      </div>

      <RelatedProducts relatedProducts={relatedProducts} />

      <BrandStats product={product} />

      {/* Find Store Section */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Find your nearest store
            </h3>
            <p className="text-gray-600">
              Experience our products in person at our exclusive stores
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Pincode or City"
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <Button onClick={checkDelivery} className="rounded-lg px-6">
              FIND STORE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
