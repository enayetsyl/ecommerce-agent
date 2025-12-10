import { Product, ProductWithDetails } from "@/lib/api/products";

export interface CartItem {
  id: string; // Unique cart item ID (productId-variantId or productId if no variant)
  productId: number;
  product: {
    id: number;
    title: string;
    handle: string;
    image?: {
      src: string;
      alt: string | null;
    } | null;
    vendor: string | null;
  };
  variantId: number | null;
  variant: {
    id: number;
    title: string | null;
    price: string | null;
    sku: string | null;
    available: boolean | null;
  } | null;
  quantity: number;
  price: number; // Price per unit
  totalPrice: number; // Price * quantity
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

