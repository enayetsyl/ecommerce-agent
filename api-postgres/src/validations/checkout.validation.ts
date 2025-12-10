import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          variantId: z.number().int().positive().nullable().optional(),
          productTitle: z.string().min(1),
          variantTitle: z.string().nullable().optional(),
          quantity: z.number().int().positive(),
          price: z.number().positive(),
        })
      )
      .min(1, "Cart must have at least one item"),
    userId: z.string().uuid().optional().nullable(),
    currency: z.string().length(3).optional().default("usd"),
  }),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionSchema
>["body"];

