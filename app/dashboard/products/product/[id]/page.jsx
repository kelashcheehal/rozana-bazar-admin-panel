"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { HeartCrack } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import {
  Check,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pincode, setPincode] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        // Parse JSON fields
        const parsedProduct = {
          ...data,
          materials: Array.isArray(data.materials)
            ? data.materials
            : JSON.parse(data.materials || "[]"),
          sizes: Array.isArray(data.sizes)
            ? data.sizes
            : JSON.parse(data.sizes || "[]"),
          colors: Array.isArray(data.colors)
            ? data.colors
            : JSON.parse(data.colors || "[]"),
          image_urls: Array.isArray(data.image_urls)
            ? data.image_urls
            : JSON.parse(data.image_urls || "[]"),
        };

        setProduct(parsedProduct);
        setSelectedColor(parsedProduct.colors[0]?.colorName || "");
        setSelectedSize(parsedProduct.sizes[0] || "");

        // Fetch related products (same category)
        await fetchRelatedProducts(parsedProduct.category);

        // Fetch reviews
        await fetchReviews(id);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  const fetchRelatedProducts = async (category) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", id)
        .limit(4);

      if (error) throw error;

      const parsedProducts = data.map((product) => ({
        ...product,
        materials: Array.isArray(product.materials)
          ? product.materials
          : JSON.parse(product.materials || "[]"),
        sizes: Array.isArray(product.sizes)
          ? product.sizes
          : JSON.parse(product.sizes || "[]"),
        colors: Array.isArray(product.colors)
          ? product.colors
          : JSON.parse(product.colors || "[]"),
        image_urls: Array.isArray(product.image_urls)
          ? product.image_urls
          : JSON.parse(product.image_urls || "[]"),
      }));

      setRelatedProducts(parsedProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      // Mock reviews for now
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
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

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
      `/checkout?product=${id}&size=${selectedSize}&color=${selectedColor}&quantity=${quantity}`
    );
  }, [product, selectedSize, selectedColor, quantity, router, id]);

  const toggleFavorite = useCallback(() => {
    setIsFavorite(!isFavorite);
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

  const selectedColorData = product.colors.find(
    (c) => c.colorName === selectedColor
  );
  const discountPercentage =
    product.discount > 0 ? Math.round(product.discount) : 0;
  const discountedPrice = product.discount_price || product.price;

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/category/${product.category.toLowerCase()}`}
          className="hover:text-gray-900"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/brand/${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
          className="hover:text-gray-900"
        >
          {product.brand}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="">
          {/* Main Image */}
          <div className="relative overflow-hidden bg-gray-50 aspect-square">
            {product.image_urls[selectedImageIndex] ? (
              <Image
                src={product.image_urls[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400">No image available</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white px-3 py-1 rounded-full">
                  -{discountPercentage}% OFF
                </Badge>
              )}
              {product.customizable && (
                <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full">
                  Customisable
                </Badge>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* Thumbnail Images */}
          <div className="">
            {product.image_urls.map((image, index) => (
              <div
                key={index}
                className="relative w-full h-screen overflow-hidden bg-gray-50"
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 relative">
          <div className="space-y-6 sticky top-24">
            {/* Brand and Title */}
            <div className=" space-y-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium rounded bg-[#f5f5f5] px-3 py-1 text-gray-500">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    <span className="text-sm text-gray-600 ml-1">
                      {averageRating} ({reviews.length})
                    </span>
                    {[1].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= averageRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <h1 className="text-xl  text-gray-900 mb-2">{product.name}</h1>

              {/* Pricing */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-md text-gray-900">
                  <span className="text-sm text-gray-500">Rs</span>
                  {discountedPrice.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      PKR{product.price.toFixed(2)}
                    </span>
                    <Badge className="rounded-full bg-red-500 text-white px-2 text-xs">
                      Save {discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3 border-t py-5 border-b">
              <h3 className="text-gray-900 text-lg">Color Options:</h3>

              <div className="flex flex-wrap gap-4">
                {product.colors.map((color) => (
                  <div
                    key={color.colorName}
                    onClick={() => setSelectedColor(color.colorName)}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {/* IMAGE BLOCK (same as before) */}
                    <div
                      className={`rounded-xl p-1 border ${
                        selectedColor === color.colorName
                          ? "border-gray-300 bg-gray-100/50 "
                          : "border-gray-200 hover:border-gray-300 text-gray-900"
                      }`}
                    >
                      {color.image && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={color.image}
                            alt={color.colorName}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                    </div>

                    <span className="mt-1 text-sm text-gray-600">
                      {color.colorName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-900 text-lg font-medium">
                  Select Standard Size
                </h3>
                <button className="text-sm text-gray-600 hover:underline font-medium">
                  SIZE GUIDE
                </button>
              </div>

              <div className="grid grid-cols-8 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 w-12 rounded-2xl border text-sm transition  ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 border-b pb-5">
              <InteractiveHoverButton
                onClick={handleAddToCart}
                size="lg"
                className="font-medium w-full"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
              </InteractiveHoverButton>

              <Button
                onClick={handleBuyNow}
                size="lg"
                variant="outline"
                className="flex-1 rounded-lg border  hover:bg-gray-50"
                disabled={product.stock === 0}
              >
                BUY NOW
              </Button>

              {/* WISHLIST */}
              <Button
                onClick={toggleFavorite}
                size="lg"
                variant="outline"
                className="w-10 h-10 rounded-full border border-gray-400/50 flex items-center justify-center hover:bg-gray-50"
                disabled={product.stock === 0}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-900"
                  }`}
                />
              </Button>
            </div>

            {/* Design Details */}
            <Accordion
              type="single"
              collapsible
              className="w-full"
              // defaultValue="item-1"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>Product Details</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Materials */}
                  {product.materials && product.materials.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Materials</h4>

                      <div className="flex flex-wrap gap-2">
                        {product.materials.map((material, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm rounded-full border border-gray-300 bg-gray-50 text-gray-700"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Shipping Details</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>
                    We offer worldwide shipping through trusted courier
                    partners. Standard delivery takes 3-5 business days, while
                    express shipping ensures delivery within 1-2 business days.
                  </p>
                  <p>
                    All orders are carefully packaged and fully insured. Track
                    your shipment in real-time through our dedicated tracking
                    portal.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Return Policy</AccordionTrigger>
                <AccordionContent className="flex flex-col text-balance">
                  <p>
                    We stand behind our products with a comprehensive 30-day
                    return policy. If you&apos;re not completely satisfied,
                    simply return the item in its original condition.
                  </p>
                  <p>
                    Our hassle-free return process includes free return shipping
                    and full refunds processed within 48 hours of receiving the
                    returned item.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <Button variant="ghost" className="rounded-full">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group overflow-hidden rounded-lg hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    {relatedProduct.image_urls[0] && (
                      <Image
                        src={relatedProduct.image_urls[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                    {relatedProduct.discount > 0 && (
                      <Badge className="absolute top-2 left-2 rounded-full bg-red-500 text-white">
                        -{Math.round(relatedProduct.discount)}%
                      </Badge>
                    )}
                    {relatedProduct.customizable && (
                      <Badge className="absolute top-2 right-2 rounded-full bg-blue-500 text-white">
                        Customisable
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {relatedProduct.brand}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-gray-900">
                        ₹
                        {relatedProduct.discount_price?.toFixed(2) ||
                          relatedProduct.price.toFixed(2)}
                      </span>
                      {relatedProduct.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{relatedProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Colors Preview */}
                    <div className="flex gap-2">
                      {relatedProduct.colors.slice(0, 4).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{
                            backgroundColor: color.colorName
                              .toLowerCase()
                              .includes("white")
                              ? "#f3f4f6"
                              : color.colorName.toLowerCase().includes("black")
                              ? "#000"
                              : color.colorName.toLowerCase().includes("blue")
                              ? "#3b82f6"
                              : color.colorName.toLowerCase().includes("green")
                              ? "#10b981"
                              : color.colorName.toLowerCase().includes("pink")
                              ? "#ec4899"
                              : color.colorName.toLowerCase().includes("navy")
                              ? "#1e3a8a"
                              : color.colorName.toLowerCase().includes("grey")
                              ? "#6b7280"
                              : "#f3f4f6",
                          }}
                          title={color.colorName}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {/* Brand Stats */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">2M+</div>
            <div className="text-gray-600">Garments Produced</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">150+</div>
            <div className="text-gray-600">Countries Shipped</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">11</div>
            <div className="text-gray-600">Exclusive Stores</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">100%</div>
            <div className="text-gray-600">Fit Guarantee</div>
          </div>
        </div>
      </div>

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
              />
            </div>
            <Button className="rounded-lg px-6">FIND STORE</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
