import prisma from "../lib/prisma";
import { NotFoundError } from "../utils/errors";

export interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  vendor: string | null;
  product_type: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  published_at: Date | null;
  tags: string[];
  raw_json: unknown;
}

export interface ProductWithDetails extends Product {
  images?: Array<{
    id: number;
    src: string;
    alt: string | null;
    position: number | null;
  }>;
  variants?: Array<{
    id: number;
    title: string | null;
    price: string | null;
    compare_at_price: string | null;
    sku: string | null;
    available: boolean | null;
  }>;
  options?: Array<{
    name: string;
    values: string[];
  }>;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "updated_at" | "title" | "vendor";
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const mapProduct = (product: any): Product => ({
  id: Number(product.id),
  title: product.title,
  handle: product.handle,
  body_html: product.body_html,
  vendor: product.vendor,
  product_type: product.product_type,
  created_at: product.created_at,
  updated_at: product.updated_at,
  published_at: product.published_at,
  tags: product.tags,
  raw_json: product.raw_json,
});

export const getAllProducts = async (
  options?: PaginationOptions
): Promise<PaginatedResponse<Product>> => {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;
  const sortBy = options?.sortBy || "created_at";
  const order = options?.order || "desc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.product.count(),
  ]);

  return {
    data: products.map(mapProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const product = await prisma.product.findUnique({
    where: { id: BigInt(id) },
  });

  if (!product) {
    return null;
  }

  return mapProduct(product);
};

export const getProductByHandle = async (
  handle: string
): Promise<Product | null> => {
  const product = await prisma.product.findUnique({
    where: { handle },
  });

  if (!product) {
    return null;
  }

  return mapProduct(product);
};

export const getProductWithDetails = async (
  id: number
): Promise<ProductWithDetails> => {
  const product = await prisma.product.findUnique({
    where: { id: BigInt(id) },
    include: {
      images: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          src: true,
          alt: true,
          position: true,
        },
      },
      variants: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          price: true,
          compare_at_price: true,
          sku: true,
          available: true,
        },
      },
      options: {
        orderBy: { position: "asc" },
        select: {
          name: true,
          values: true,
        },
      },
    },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return {
    id: Number(product.id),
    title: product.title,
    handle: product.handle,
    body_html: product.body_html,
    vendor: product.vendor,
    product_type: product.product_type,
    created_at: product.created_at,
    updated_at: product.updated_at,
    published_at: product.published_at,
    tags: product.tags,
    raw_json: product.raw_json,
    images: product.images.map((img) => ({
      id: Number(img.id),
      src: img.src,
      alt: img.alt,
      position: img.position,
    })),
    variants: product.variants.map((variant) => ({
      id: Number(variant.id),
      title: variant.title,
      price: variant.price?.toString() || null,
      compare_at_price: variant.compare_at_price?.toString() || null,
      sku: variant.sku,
      available: variant.available,
    })),
    options: product.options.map((option) => ({
      name: option.name,
      values: option.values,
    })),
  };
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const searchTerm = query.toLowerCase();

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { vendor: { contains: searchTerm, mode: "insensitive" } },
        { product_type: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    orderBy: { created_at: "desc" },
  });

  return products.map(mapProduct);
};

// Filtering functions
export const getProductsByVendor = async (
  vendor: string,
  options?: PaginationOptions
): Promise<PaginatedResponse<Product>> => {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;
  const sortBy = options?.sortBy || "created_at";
  const order = options?.order || "desc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        vendor: {
          equals: vendor,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.product.count({
      where: {
        vendor: {
          equals: vendor,
          mode: "insensitive",
        },
      },
    }),
  ]);

  return {
    data: products.map(mapProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductsByType = async (
  productType: string,
  options?: PaginationOptions
): Promise<PaginatedResponse<Product>> => {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;
  const sortBy = options?.sortBy || "created_at";
  const order = options?.order || "desc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        product_type: {
          equals: productType,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.product.count({
      where: {
        product_type: {
          equals: productType,
          mode: "insensitive",
        },
      },
    }),
  ]);

  return {
    data: products.map(mapProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductsByTag = async (
  tag: string,
  options?: PaginationOptions
): Promise<PaginatedResponse<Product>> => {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;
  const sortBy = options?.sortBy || "created_at";
  const order = options?.order || "desc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        tags: {
          has: tag,
        },
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.product.count({
      where: {
        tags: {
          has: tag,
        },
      },
    }),
  ]);

  return {
    data: products.map(mapProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Metadata functions
export const getAllVendors = async (): Promise<string[]> => {
  const products = await prisma.product.findMany({
    select: { vendor: true },
    where: {
      vendor: {
        not: null,
      },
    },
    distinct: ["vendor"],
  });

  return products
    .map((p) => p.vendor)
    .filter((v): v is string => v !== null)
    .sort();
};

export const getAllProductTypes = async (): Promise<string[]> => {
  const products = await prisma.product.findMany({
    select: { product_type: true },
    where: {
      product_type: {
        not: null,
      },
    },
    distinct: ["product_type"],
  });

  return products
    .map((p) => p.product_type)
    .filter((t): t is string => t !== null)
    .sort();
};

export const getAllTags = async (): Promise<string[]> => {
  const products = await prisma.product.findMany({
    select: { tags: true },
  });

  const tagSet = new Set<string>();
  products.forEach((product) => {
    product.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
};

// Variant functions
export const getProductVariants = async (
  productId: number
): Promise<
  Array<{
    id: number;
    title: string | null;
    price: string | null;
    compare_at_price: string | null;
    sku: string | null;
    available: boolean | null;
    option1: string | null;
    option2: string | null;
    option3: string | null;
  }>
> => {
  const product = await prisma.product.findUnique({
    where: { id: BigInt(productId) },
    select: { id: true },
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const variants = await prisma.variant.findMany({
    where: { product_id: BigInt(productId) },
    orderBy: { position: "asc" },
  });

  return variants.map((variant) => ({
    id: Number(variant.id),
    title: variant.title,
    price: variant.price?.toString() || null,
    compare_at_price: variant.compare_at_price?.toString() || null,
    sku: variant.sku,
    available: variant.available,
    option1: variant.option1,
    option2: variant.option2,
    option3: variant.option3,
  }));
};

export const getProductVariantById = async (
  productId: number,
  variantId: number
): Promise<{
  id: number;
  title: string | null;
  price: string | null;
  compare_at_price: string | null;
  sku: string | null;
  available: boolean | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
}> => {
  const variant = await prisma.variant.findFirst({
    where: {
      id: BigInt(variantId),
      product_id: BigInt(productId),
    },
  });

  if (!variant) {
    throw new NotFoundError("Variant not found");
  }

  return {
    id: Number(variant.id),
    title: variant.title,
    price: variant.price?.toString() || null,
    compare_at_price: variant.compare_at_price?.toString() || null,
    sku: variant.sku,
    available: variant.available,
    option1: variant.option1,
    option2: variant.option2,
    option3: variant.option3,
  };
};
