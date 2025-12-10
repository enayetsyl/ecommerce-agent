import api from "../axios";

export interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  vendor: string | null;
  product_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  published_at: string | null;
  tags: string[];
  raw_json: unknown;
  image?: {
    src: string;
    alt: string | null;
  } | null;
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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductsResponse {
  success: boolean;
  message?: string;
  data: PaginatedResponse<Product> | Product[];
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  data: ProductWithDetails;
}

export interface MetadataResponse {
  success: boolean;
  message?: string;
  data: string[];
}

export interface Variant {
  id: number;
  title: string | null;
  price: string | null;
  compare_at_price: string | null;
  sku: string | null;
  available: boolean | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
}

export interface VariantsResponse {
  success: boolean;
  message?: string;
  data: Variant[];
}

export interface VariantResponse {
  success: boolean;
  message?: string;
  data: Variant;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "updated_at" | "title" | "vendor";
  order?: "asc" | "desc";
  q?: string;
}

export const productsApi = {
  getAllProducts: async (
    params?: ProductQueryParams
  ): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.order) queryParams.append("order", params.order);
    if (params?.q) queryParams.append("q", params.q);

    const queryString = queryParams.toString();
    const url = `/products${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<ProductsResponse>(url);
    return response.data;
  },

  getProductById: async (id: number): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    return response.data;
  },

  getProductByHandle: async (handle: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(
      `/products/handle/${handle}`
    );
    return response.data;
  },

  getProductsByVendor: async (
    vendor: string,
    params?: Omit<ProductQueryParams, "q">
  ): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.order) queryParams.append("order", params.order);

    const queryString = queryParams.toString();
    const url = `/products/vendor/${vendor}${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await api.get<ProductsResponse>(url);
    return response.data;
  },

  getProductsByType: async (
    type: string,
    params?: Omit<ProductQueryParams, "q">
  ): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.order) queryParams.append("order", params.order);

    const queryString = queryParams.toString();
    const url = `/products/type/${type}${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<ProductsResponse>(url);
    return response.data;
  },

  getProductsByTag: async (
    tag: string,
    params?: Omit<ProductQueryParams, "q">
  ): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.order) queryParams.append("order", params.order);

    const queryString = queryParams.toString();
    const url = `/products/tag/${tag}${queryString ? `?${queryString}` : ""}`;
    const response = await api.get<ProductsResponse>(url);
    return response.data;
  },

  getAllVendors: async (): Promise<MetadataResponse> => {
    const response = await api.get<MetadataResponse>("/products/vendors");
    return response.data;
  },

  getAllProductTypes: async (): Promise<MetadataResponse> => {
    const response = await api.get<MetadataResponse>("/products/types");
    return response.data;
  },

  getAllTags: async (): Promise<MetadataResponse> => {
    const response = await api.get<MetadataResponse>("/products/tags");
    return response.data;
  },

  getProductVariants: async (productId: number): Promise<VariantsResponse> => {
    const response = await api.get<VariantsResponse>(
      `/products/${productId}/variants`
    );
    return response.data;
  },

  getProductVariantById: async (
    productId: number,
    variantId: number
  ): Promise<VariantResponse> => {
    const response = await api.get<VariantResponse>(
      `/products/${productId}/variants/${variantId}`
    );
    return response.data;
  },
};
