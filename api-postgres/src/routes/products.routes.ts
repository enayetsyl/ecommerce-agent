import { Router } from "express";
import {
  getAllProductsController,
  getProductByIdController,
  getProductByHandleController,
  getProductsByVendorController,
  getProductsByTypeController,
  getProductsByTagController,
  getAllVendorsController,
  getAllProductTypesController,
  getAllTagsController,
  getProductVariantsController,
  getProductVariantByIdController,
} from "../controllers/products.controller";
import { validate } from "../middleware/validate";
import {
  getProductByIdSchema,
  getProductByHandleSchema,
  searchProductsSchema,
  getProductsByVendorSchema,
  getProductsByTypeSchema,
  getProductsByTagSchema,
  getProductVariantsSchema,
  getProductVariantByIdSchema,
} from "../validations/products.validation";

const router = Router();

// Metadata routes (no params, should come first)
router.get("/vendors", getAllVendorsController);
router.get("/types", getAllProductTypesController);
router.get("/tags", getAllTagsController);

// Filtering routes (specific paths before generic)
router.get(
  "/vendor/:vendor",
  validate(getProductsByVendorSchema),
  getProductsByVendorController
);
router.get(
  "/type/:type",
  validate(getProductsByTypeSchema),
  getProductsByTypeController
);
router.get(
  "/tag/:tag",
  validate(getProductsByTagSchema),
  getProductsByTagController
);

// Variant routes (specific paths before generic product routes)
router.get(
  "/:id/variants/:variantId",
  validate(getProductVariantByIdSchema),
  getProductVariantByIdController
);
router.get(
  "/:id/variants",
  validate(getProductVariantsSchema),
  getProductVariantsController
);

// Product routes (order matters: more specific routes must come before generic ones)
router.get("/", validate(searchProductsSchema), getAllProductsController);
router.get(
  "/handle/:handle",
  validate(getProductByHandleSchema),
  getProductByHandleController
);
router.get("/:id", validate(getProductByIdSchema), getProductByIdController);

export default router;
