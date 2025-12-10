import Stripe from "stripe";
import { createOrder, CreateOrderInput } from "./orders.service";
import { updateOrderStripeSession } from "./orders.service";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});

export interface CreateCheckoutSessionInput {
  orderInput: CreateOrderInput;
  successUrl: string;
  cancelUrl: string;
}

export const createCheckoutSession = async (
  input: CreateCheckoutSessionInput
): Promise<{ sessionId: string; url: string; orderId: string }> => {
  const { orderInput, successUrl, cancelUrl } = input;

  // Create order first
  const order = await createOrder(orderInput);

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: orderInput.items.map((item) => ({
      price_data: {
        currency: orderInput.currency || "usd",
        product_data: {
          name: item.productTitle,
          ...(item.variantTitle && { description: item.variantTitle }),
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      orderId: order.id,
    },
    customer_email: orderInput.userId ? undefined : undefined, // Can add user email if available
  });

  // Update order with Stripe session ID
  await updateOrderStripeSession(order.id, session.id);

  return {
    sessionId: session.id,
    url: session.url || "",
    orderId: order.id,
  };
};

export const retrieveCheckoutSession = async (
  sessionId: string
): Promise<Stripe.Checkout.Session> => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};

export const constructWebhookEvent = (
  payload: string | Buffer,
  signature: string
): Stripe.Event => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
};

