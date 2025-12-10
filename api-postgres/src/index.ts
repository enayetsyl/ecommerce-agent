import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import responseTime from "response-time";
import {
  getAllProducts,
  getProductById,
  getProductByHandle,
  getProductWithDetails,
  searchProducts,
} from "./services/products.service";
import authRoutes from "./routes/auth.routes";
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

// CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  sendSuccess(res, { status: "ok" }, "Server is healthy");
});

// API Routes
app.use("/api/auth", authRoutes);

// Get all products
app.get("/products", async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.q as string | undefined;

    let products;
    if (searchQuery) {
      products = await searchProducts(searchQuery);
    } else {
      products = await getAllProducts();
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await getProductWithDetails(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Get product by handle (slug)
app.get("/products/handle/:handle", async (req: Request, res: Response) => {
  try {
    const handle = req.params.handle;
    const product = await getProductByHandle(handle);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productWithDetails = await getProductWithDetails(product.id);
    res.json(productWithDetails);
  } catch (error) {
    console.error("Error fetching product by handle:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
