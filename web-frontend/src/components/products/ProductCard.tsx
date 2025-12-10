"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/api/products";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="relative w-full h-64 bg-muted flex items-center justify-center overflow-hidden rounded-t-lg">
            {product.vendor ? (
              <div className="absolute top-2 left-2 z-10">
                <Badge variant="secondary">{product.vendor}</Badge>
              </div>
            ) : null}
            {product.image?.src ? (
              <Image
                src={product.image.src}
                alt={product.image.alt || product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {product.product_type && (
            <p className="text-sm text-muted-foreground mb-2">
              {product.product_type}
            </p>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm text-muted-foreground">
            View Details →
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}

