"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { useProductById, useProductVariants } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = parseInt(id);

  const { data: productData, isLoading, isError } = useProductById(
    productId,
    !isNaN(productId)
  );
  const { data: variantsData } = useProductVariants(productId, !isNaN(productId));
  const { addToCart, isInCart } = useCart();

  // All hooks must be called before any conditional returns
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  // Get images from product data (safe to use even if productData is undefined)
  const images = productData?.data?.images || [];

  // Reset image index when product changes
  useEffect(() => {
    if (productData?.data) {
      setSelectedImageIndex(0);
      setLightboxImageIndex(0);
      // Set default variant to first available variant
      const firstAvailableVariant = productData.data.variants?.find(
        (v) => v.available !== false
      );
      setSelectedVariantId(firstAvailableVariant?.id ?? null);
    }
  }, [productData?.data?.id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen || images.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setLightboxImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, images.length]);

  if (isNaN(productId)) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Invalid product ID</p>
            <Link href="/products">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !productData?.data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Product not found</p>
            <Link href="/products">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const product = productData.data;
  const selectedImage = images[selectedImageIndex];

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleMainImageClick = () => {
    setLightboxImageIndex(selectedImageIndex);
    setIsLightboxOpen(true);
  };

  const handleLightboxPrevious = () => {
    setLightboxImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleLightboxNext = () => {
    setLightboxImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Check if variant is required and selected
    if (product.variants && product.variants.length > 0 && !selectedVariantId) {
      toast.error("Please select a variant");
      return;
    }

    // Check if selected variant is available
    if (selectedVariantId) {
      const variant = product.variants?.find((v) => v.id === selectedVariantId);
      if (variant && variant.available === false) {
        toast.error("This variant is out of stock");
        return;
      }
    }

    addToCart(product, selectedVariantId, 1);
    toast.success("Added to cart!");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/products">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div 
                className="relative w-full h-96 bg-muted flex items-center justify-center overflow-hidden rounded-lg cursor-pointer group"
                onClick={handleMainImageClick}
              >
                {selectedImage ? (
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt || product.title}
                    fill
                    className="object-contain group-hover:opacity-90 transition-opacity pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <ShoppingCart className="h-24 w-24 text-muted-foreground/50" />
                )}
                {selectedImage && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                      Click to enlarge
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative w-full h-20 bg-muted rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Lightbox Dialog */}
          {images.length > 0 && (
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
              <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-none">
                <div className="relative w-full h-[90vh] flex items-center justify-center">
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="absolute top-4 right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-2 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handleLightboxPrevious}
                        className="absolute left-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-3 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={handleLightboxNext}
                        className="absolute right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white p-3 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <Image
                      src={images[lightboxImageIndex].src}
                      alt={images[lightboxImageIndex].alt || product.title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>

                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setLightboxImageIndex(index)}
                          className={`h-2 rounded-full transition-all ${
                            lightboxImageIndex === index
                              ? "w-8 bg-white"
                              : "w-2 bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.vendor && (
                <Badge variant="secondary">{product.vendor}</Badge>
              )}
              {product.product_type && (
                <Badge variant="outline">{product.product_type}</Badge>
              )}
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {product.body_html && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.body_html }}
                />
              </CardContent>
            </Card>
          )}

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Variant</CardTitle>
                <CardDescription>Choose an option for this product</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedVariantId?.toString() || ""}
                  onValueChange={(value) => setSelectedVariantId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem
                        key={variant.id}
                        value={variant.id.toString()}
                        disabled={variant.available === false}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {variant.title || `Variant ${variant.id}`}
                            {variant.available === false && " (Out of Stock)"}
                          </span>
                          {variant.price && (
                            <span className="ml-4 font-semibold">
                              ${parseFloat(variant.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedVariantId && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    {(() => {
                      const variant = product.variants?.find(
                        (v) => v.id === selectedVariantId
                      );
                      return variant ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {variant.title || `Variant ${variant.id}`}
                            </span>
                            {variant.price && (
                              <span className="font-semibold">
                                ${parseFloat(variant.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                          {variant.sku && (
                            <p className="text-xs text-muted-foreground">
                              SKU: {variant.sku}
                            </p>
                          )}
                          {variant.available !== null && (
                            <Badge
                              variant={variant.available ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {variant.available ? "Available" : "Out of Stock"}
                            </Badge>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Price Display */}
          {(() => {
            const variant = selectedVariantId
              ? product.variants?.find((v) => v.id === selectedVariantId)
              : product.variants?.[0];
            const price = variant?.price
              ? parseFloat(variant.price)
              : product.variants?.[0]?.price
              ? parseFloat(product.variants[0].price)
              : null;

            return price !== null ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${price.toFixed(2)}</span>
                    {variant?.compare_at_price &&
                      parseFloat(variant.compare_at_price) > price && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${parseFloat(variant.compare_at_price).toFixed(2)}
                        </span>
                      )}
                  </div>
                </CardContent>
              </Card>
            ) : null;
          })()}

          {/* Options */}
          {product.options && product.options.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.options.map((option, index) => (
                    <div key={index}>
                      <p className="font-medium mb-2">{option.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value, valueIndex) => (
                          <Badge key={valueIndex} variant="outline">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={
              (product.variants && product.variants.length > 0 && !selectedVariantId) ||
              (selectedVariantId &&
                product.variants?.find((v) => v.id === selectedVariantId)?.available ===
                  false)
            }
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isInCart(product.id, selectedVariantId)
              ? "Already in Cart"
              : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

