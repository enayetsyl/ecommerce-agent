import prisma from "../lib/prisma";
import { NotFoundError } from "../utils/errors";

export interface CreateOrderInput {
  userId?: string;
  items: Array<{
    productId: number;
    variantId?: number | null;
    productTitle: string;
    variantTitle?: string | null;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency?: string;
}

export interface Order {
  id: string;
  userId: string | null;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  status: string;
  totalAmount: number;
  currency: string;
  shippingAddress: unknown | null;
  billingAddress: unknown | null;
  createdAt: Date;
  updatedAt: Date;
  orderItems: Array<{
    id: string;
    productId: number;
    variantId: number | null;
    productTitle: string;
    variantTitle: string | null;
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
}

export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
  const { userId, items, totalAmount, currency = "usd" } = input;

  const order = await prisma.order.create({
    data: {
      user_id: userId || null,
      total_amount: totalAmount,
      currency,
      status: "pending",
      order_items: {
        create: items.map((item) => ({
          product_id: BigInt(item.productId),
          variant_id: item.variantId ? BigInt(item.variantId) : null,
          product_title: item.productTitle,
          variant_title: item.variantTitle || null,
          quantity: item.quantity,
          price: item.price,
          total_price: item.price * item.quantity,
        })),
      },
    },
    include: {
      order_items: true,
    },
  });

  return {
    id: order.id,
    userId: order.user_id,
    stripeSessionId: order.stripe_session_id,
    stripePaymentIntentId: order.stripe_payment_intent_id,
    status: order.status,
    totalAmount: Number(order.total_amount),
    currency: order.currency,
    shippingAddress: order.shipping_address,
    billingAddress: order.billing_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    orderItems: order.order_items.map((item) => ({
      id: item.id,
      productId: Number(item.product_id),
      variantId: item.variant_id ? Number(item.variant_id) : null,
      productTitle: item.product_title,
      variantTitle: item.variant_title,
      quantity: item.quantity,
      price: Number(item.price),
      totalPrice: Number(item.total_price),
    })),
  };
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      order_items: true,
    },
  });

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    userId: order.user_id,
    stripeSessionId: order.stripe_session_id,
    stripePaymentIntentId: order.stripe_payment_intent_id,
    status: order.status,
    totalAmount: Number(order.total_amount),
    currency: order.currency,
    shippingAddress: order.shipping_address,
    billingAddress: order.billing_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    orderItems: order.order_items.map((item) => ({
      id: item.id,
      productId: Number(item.product_id),
      variantId: item.variant_id ? Number(item.variant_id) : null,
      productTitle: item.product_title,
      variantTitle: item.variant_title,
      quantity: item.quantity,
      price: Number(item.price),
      totalPrice: Number(item.total_price),
    })),
  };
};

export const getOrderByStripeSessionId = async (
  sessionId: string
): Promise<Order | null> => {
  const order = await prisma.order.findUnique({
    where: { stripe_session_id: sessionId },
    include: {
      order_items: true,
    },
  });

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    userId: order.user_id,
    stripeSessionId: order.stripe_session_id,
    stripePaymentIntentId: order.stripe_payment_intent_id,
    status: order.status,
    totalAmount: Number(order.total_amount),
    currency: order.currency,
    shippingAddress: order.shipping_address,
    billingAddress: order.billing_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    orderItems: order.order_items.map((item) => ({
      id: item.id,
      productId: Number(item.product_id),
      variantId: item.variant_id ? Number(item.variant_id) : null,
      productTitle: item.product_title,
      variantTitle: item.variant_title,
      quantity: item.quantity,
      price: Number(item.price),
      totalPrice: Number(item.total_price),
    })),
  };
};

export const updateOrderStatus = async (
  id: string,
  status: string,
  stripePaymentIntentId?: string
): Promise<Order> => {
  const order = await prisma.order.update({
    where: { id },
    data: {
      status,
      ...(stripePaymentIntentId && {
        stripe_payment_intent_id: stripePaymentIntentId,
      }),
    },
    include: {
      order_items: true,
    },
  });

  return {
    id: order.id,
    userId: order.user_id,
    stripeSessionId: order.stripe_session_id,
    stripePaymentIntentId: order.stripe_payment_intent_id,
    status: order.status,
    totalAmount: Number(order.total_amount),
    currency: order.currency,
    shippingAddress: order.shipping_address,
    billingAddress: order.billing_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    orderItems: order.order_items.map((item) => ({
      id: item.id,
      productId: Number(item.product_id),
      variantId: item.variant_id ? Number(item.variant_id) : null,
      productTitle: item.product_title,
      variantTitle: item.variant_title,
      quantity: item.quantity,
      price: Number(item.price),
      totalPrice: Number(item.total_price),
    })),
  };
};

export const updateOrderStripeSession = async (
  id: string,
  stripeSessionId: string
): Promise<Order> => {
  const order = await prisma.order.update({
    where: { id },
    data: {
      stripe_session_id: stripeSessionId,
    },
    include: {
      order_items: true,
    },
  });

  return {
    id: order.id,
    userId: order.user_id,
    stripeSessionId: order.stripe_session_id,
    stripePaymentIntentId: order.stripe_payment_intent_id,
    status: order.status,
    totalAmount: Number(order.total_amount),
    currency: order.currency,
    shippingAddress: order.shipping_address,
    billingAddress: order.billing_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    orderItems: order.order_items.map((item) => ({
      id: item.id,
      productId: Number(item.product_id),
      variantId: item.variant_id ? Number(item.variant_id) : null,
      productTitle: item.product_title,
      variantTitle: item.variant_title,
      quantity: item.quantity,
      price: Number(item.price),
      totalPrice: Number(item.total_price),
    })),
  };
};

