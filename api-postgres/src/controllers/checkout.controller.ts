import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess, sendError } from "../utils/sendResponse";
import { createCheckoutSession } from "../services/checkout.service";
import { BadRequestError } from "../utils/errors";
import { getUserIdFromRequest } from "../middleware/auth.middleware";

export const createCheckout = catchAsync(
  async (req: Request, res: Response) => {
    const { items, currency } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestError("Cart items are required");
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    if (totalAmount <= 0) {
      throw new BadRequestError("Total amount must be greater than 0");
    }

    // Get user ID from request if authenticated
    const userId = getUserIdFromRequest(req);

    // Get frontend URL from environment or use default
    const frontendUrl =
      process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

    const { sessionId, url, orderId } = await createCheckoutSession({
      orderInput: {
        userId: userId || undefined,
        items,
        totalAmount,
        currency: currency || "usd",
      },
      successUrl: `${frontendUrl}/checkout/success`,
      cancelUrl: `${frontendUrl}/checkout/cancel`,
    });

    sendSuccess(res, { sessionId, url, orderId }, "Checkout session created", 201);
  }
);

