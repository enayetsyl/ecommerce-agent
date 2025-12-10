import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/sendResponse";
import {
  constructWebhookEvent,
  retrieveCheckoutSession,
} from "../services/checkout.service";
import {
  getOrderByStripeSessionId,
  updateOrderStatus,
} from "../services/orders.service";

export const handleStripeWebhook = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      return res.status(400).send("Missing stripe-signature header");
    }

    let event;
    try {
      event = constructWebhookEvent(req.body, signature);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const order = await getOrderByStripeSessionId(session.id);

        if (order) {
          await updateOrderStatus(
            order.id,
            "paid",
            session.payment_intent as string
          );
          console.log(`Order ${order.id} marked as paid`);
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as any;
        const order = await getOrderByStripeSessionId(session.id);

        if (order) {
          await updateOrderStatus(
            order.id,
            "paid",
            session.payment_intent as string
          );
          console.log(`Order ${order.id} marked as paid (async)`);
        }
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as any;
        const order = await getOrderByStripeSessionId(session.id);

        if (order) {
          await updateOrderStatus(order.id, "failed");
          console.log(`Order ${order.id} marked as failed`);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        console.log("PaymentIntent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;
        console.log("PaymentIntent failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    sendSuccess(res, { received: true }, "Webhook processed", 200);
  }
);

