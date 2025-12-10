import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import responseTime from "response-time";
import authRoutes from "./routes/auth.routes";
import productsRoutes from "./routes/products.routes";
import checkoutRoutes from "./routes/checkout.routes";
import { errorHandler } from "./middleware/errorHandler";
import { sendSuccess } from "./utils/sendResponse";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware - should be applied early
app.use(helmet());

// HTTP Parameter Pollution protection - should come before body parsing
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Response time tracking
app.use(responseTime());

// CORS
app.use(cors());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  sendSuccess(res, { status: "ok" }, "Server is healthy");
});

// Checkout webhook route (must be before JSON parsing middleware for raw body)
import { handleStripeWebhook } from "./controllers/webhook.controller";
app.post(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// JSON parsing (after webhook route)
app.use(express.json());

// Checkout routes (session creation - excludes webhook)
app.use("/api/checkout", checkoutRoutes);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/products", productsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
