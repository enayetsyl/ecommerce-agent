import { Router } from "express";
import { createCheckout } from "../controllers/checkout.controller";
import { validate } from "../middleware/validate";
import { createCheckoutSessionSchema } from "../validations/checkout.validation";

const router = Router();

// Checkout session creation
router.post(
  "/session",
  validate(createCheckoutSessionSchema),
  createCheckout
);

export default router;

