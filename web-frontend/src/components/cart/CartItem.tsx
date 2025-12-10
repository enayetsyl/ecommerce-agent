"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { CartItem as CartItemType } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <Link
            href={`/products/${item.productId}`}
            className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0"
          >
            {item.product.image?.src ? (
              <Image
                src={item.product.image.src}
                alt={item.product.image.alt || item.product.title}
                fill
                className="object-contain"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </Link>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <Link href={`/products/${item.productId}`}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                {item.product.title}
              </h3>
            </Link>
            {item.variant && (
              <p className="text-sm text-muted-foreground mt-1">
                {item.variant.title}
              </p>
            )}
            {item.product.vendor && (
              <p className="text-xs text-muted-foreground mt-1">
                {item.product.vendor}
              </p>
            )}

            {/* Quantity Controls */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => decreaseQuantity(item.id)}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => increaseQuantity(item.id)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Price */}
              <div className="ml-auto text-right">
                <p className="font-semibold text-lg">
                  ${item.totalPrice.toFixed(2)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => removeFromCart(item.id)}
            aria-label="Remove from cart"
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

