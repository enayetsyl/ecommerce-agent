import api from "../axios";
import { CartItem } from "@/types/cart";

export interface CreateCheckoutSessionRequest {
  items: Array<{
    productId: number;
    variantId?: number | null;
    productTitle: string;
    variantTitle?: string | null;
    quantity: number;
    price: number;
  }>;
  userId?: string | null;
  currency?: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    url: string;
    orderId: string;
  };
  message?: string;
}

export const checkoutApi = {
  createCheckoutSession: async (
    cartItems: CartItem[]
  ): Promise<CreateCheckoutSessionResponse> => {
    const items = cartItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      productTitle: item.product.title,
      variantTitle: item.variant?.title || null,
      quantity: item.quantity,
      price: item.price,
    }));

    const response = await api.post<CreateCheckoutSessionResponse>(
      "/api/checkout/session",
      {
        items,
        currency: "usd",
      }
    );
    return response.data;
  },
};

