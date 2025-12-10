import { z } from "zod";

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().refine(
      (val) => !isNaN(Number(val)),
      { error: "Product ID must be a valid number" }
    ),
  }),
});

export const getProductByHandleSchema = z.object({
  params: z.object({
    handle: z.string().min(1, { error: "Handle is required" }),
  }),
});

export const searchProductsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    page: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        { error: "Page must be a positive number" }
      ),
    limit: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        { error: "Limit must be a positive number" }
      ),
    sortBy: z
      .enum(["created_at", "updated_at", "title", "vendor"])
      .optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});

export const getProductsByVendorSchema = z.object({
  params: z.object({
    vendor: z.string().min(1, { error: "Vendor is required" }),
  }),
  query: z.object({
    page: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        { error: "Page must be a positive number" }
      ),
    limit: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        { error: "Limit must be a positive number" }
      ),
    sortBy: z
      .enum(["created_at", "updated_at", "title", "vendor"])
      .optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});

export const getProductsByTypeSchema = z.object({
  params: z.object({
    type: z.string().min(1, { error: "Product type is required" }),
  }),
  query: z.object({
    page: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        { error: "Page must be a positive number" }
      ),
    limit: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        { error: "Limit must be a positive number" }
      ),
    sortBy: z
      .enum(["created_at", "updated_at", "title", "vendor"])
      .optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});

export const getProductsByTagSchema = z.object({
  params: z.object({
    tag: z.string().min(1, { error: "Tag is required" }),
  }),
  query: z.object({
    page: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        { error: "Page must be a positive number" }
      ),
    limit: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        { error: "Limit must be a positive number" }
      ),
    sortBy: z
      .enum(["created_at", "updated_at", "title", "vendor"])
      .optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});

export const getProductVariantsSchema = z.object({
  params: z.object({
    id: z.string().refine(
      (val) => !isNaN(Number(val)),
      { error: "Product ID must be a valid number" }
    ),
  }),
});

export const getProductVariantByIdSchema = z.object({
  params: z.object({
    id: z.string().refine(
      (val) => !isNaN(Number(val)),
      { error: "Product ID must be a valid number" }
    ),
    variantId: z.string().refine(
      (val) => !isNaN(Number(val)),
      { error: "Variant ID must be a valid number" }
    ),
  }),
});

