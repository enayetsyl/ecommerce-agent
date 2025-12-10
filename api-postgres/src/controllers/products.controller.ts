import { Request, Response } from "express";
import {
  getAllProducts,
  getProductWithDetails,
  getProductByHandle,
  searchProducts,
  getProductsByVendor,
  getProductsByType,
  getProductsByTag,
  getAllVendors,
  getAllProductTypes,
  getAllTags,
  getProductVariants,
  getProductVariantById,
  PaginationOptions,
} from "../services/products.service";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/sendResponse";
import { BadRequestError } from "../utils/errors";

export const getAllProductsController = catchAsync(
  async (req: Request, res: Response) => {
    const searchQuery = req.query.q as string | undefined;
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const sortBy = req.query.sortBy as
      | "created_at"
      | "updated_at"
      | "title"
      | "vendor"
      | undefined;
    const order = req.query.order as "asc" | "desc" | undefined;

    let result;
    if (searchQuery) {
      // Search doesn't support pagination yet, return as array
      const products = await searchProducts(searchQuery);
      result = products;
    } else {
      const paginationOptions: PaginationOptions = {};
      if (page) paginationOptions.page = page;
      if (limit) paginationOptions.limit = limit;
      if (sortBy) paginationOptions.sortBy = sortBy;
      if (order) paginationOptions.order = order;

      result = await getAllProducts(paginationOptions);
    }

    sendSuccess(res, result, "Products retrieved successfully");
  }
);

export const getProductByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw new BadRequestError("Invalid product ID");
    }

    const product = await getProductWithDetails(id);
    sendSuccess(res, product, "Product retrieved successfully");
  }
);

export const getProductByHandleController = catchAsync(
  async (req: Request, res: Response) => {
    const handle = req.params.handle;

    const product = await getProductByHandle(handle);

    if (!product) {
      throw new BadRequestError("Product not found");
    }

    const productWithDetails = await getProductWithDetails(product.id);
    sendSuccess(res, productWithDetails, "Product retrieved successfully");
  }
);

// Filtering controllers
export const getProductsByVendorController = catchAsync(
  async (req: Request, res: Response) => {
    const vendor = req.params.vendor;
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const sortBy = req.query.sortBy as
      | "created_at"
      | "updated_at"
      | "title"
      | "vendor"
      | undefined;
    const order = req.query.order as "asc" | "desc" | undefined;

    const paginationOptions: PaginationOptions = {};
    if (page) paginationOptions.page = page;
    if (limit) paginationOptions.limit = limit;
    if (sortBy) paginationOptions.sortBy = sortBy;
    if (order) paginationOptions.order = order;

    const result = await getProductsByVendor(vendor, paginationOptions);
    sendSuccess(res, result, "Products retrieved successfully");
  }
);

export const getProductsByTypeController = catchAsync(
  async (req: Request, res: Response) => {
    const productType = req.params.type;
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const sortBy = req.query.sortBy as
      | "created_at"
      | "updated_at"
      | "title"
      | "vendor"
      | undefined;
    const order = req.query.order as "asc" | "desc" | undefined;

    const paginationOptions: PaginationOptions = {};
    if (page) paginationOptions.page = page;
    if (limit) paginationOptions.limit = limit;
    if (sortBy) paginationOptions.sortBy = sortBy;
    if (order) paginationOptions.order = order;

    const result = await getProductsByType(productType, paginationOptions);
    sendSuccess(res, result, "Products retrieved successfully");
  }
);

export const getProductsByTagController = catchAsync(
  async (req: Request, res: Response) => {
    const tag = req.params.tag;
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const sortBy = req.query.sortBy as
      | "created_at"
      | "updated_at"
      | "title"
      | "vendor"
      | undefined;
    const order = req.query.order as "asc" | "desc" | undefined;

    const paginationOptions: PaginationOptions = {};
    if (page) paginationOptions.page = page;
    if (limit) paginationOptions.limit = limit;
    if (sortBy) paginationOptions.sortBy = sortBy;
    if (order) paginationOptions.order = order;

    const result = await getProductsByTag(tag, paginationOptions);
    sendSuccess(res, result, "Products retrieved successfully");
  }
);

// Metadata controllers
export const getAllVendorsController = catchAsync(
  async (req: Request, res: Response) => {
    const vendors = await getAllVendors();
    sendSuccess(res, vendors, "Vendors retrieved successfully");
  }
);

export const getAllProductTypesController = catchAsync(
  async (req: Request, res: Response) => {
    const types = await getAllProductTypes();
    sendSuccess(res, types, "Product types retrieved successfully");
  }
);

export const getAllTagsController = catchAsync(
  async (req: Request, res: Response) => {
    const tags = await getAllTags();
    sendSuccess(res, tags, "Tags retrieved successfully");
  }
);

// Variant controllers
export const getProductVariantsController = catchAsync(
  async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      throw new BadRequestError("Invalid product ID");
    }

    const variants = await getProductVariants(productId);
    sendSuccess(res, variants, "Variants retrieved successfully");
  }
);

export const getProductVariantByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const variantId = parseInt(req.params.variantId);

    if (isNaN(productId) || isNaN(variantId)) {
      throw new BadRequestError("Invalid product ID or variant ID");
    }

    const variant = await getProductVariantById(productId, variantId);
    sendSuccess(res, variant, "Variant retrieved successfully");
  }
);
