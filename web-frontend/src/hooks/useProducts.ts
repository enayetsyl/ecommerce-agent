"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi, ProductQueryParams } from "@/lib/api/products";

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getAllProducts(params),
  });
};

export const useProductById = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getProductById(id),
    enabled: enabled && !!id,
  });
};

export const useProductByHandle = (handle: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["product", "handle", handle],
    queryFn: () => productsApi.getProductByHandle(handle),
    enabled: enabled && !!handle,
  });
};

export const useProductsByVendor = (
  vendor: string,
  params?: Omit<ProductQueryParams, "q">
) => {
  return useQuery({
    queryKey: ["products", "vendor", vendor, params],
    queryFn: () => productsApi.getProductsByVendor(vendor, params),
    enabled: !!vendor,
  });
};

export const useProductsByType = (
  type: string,
  params?: Omit<ProductQueryParams, "q">
) => {
  return useQuery({
    queryKey: ["products", "type", type, params],
    queryFn: () => productsApi.getProductsByType(type, params),
    enabled: !!type,
  });
};

export const useProductsByTag = (
  tag: string,
  params?: Omit<ProductQueryParams, "q">
) => {
  return useQuery({
    queryKey: ["products", "tag", tag, params],
    queryFn: () => productsApi.getProductsByTag(tag, params),
    enabled: !!tag,
  });
};

export const useVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => productsApi.getAllVendors(),
  });
};

export const useProductTypes = () => {
  return useQuery({
    queryKey: ["productTypes"],
    queryFn: () => productsApi.getAllProductTypes(),
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => productsApi.getAllTags(),
  });
};

export const useProductVariants = (productId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["product", productId, "variants"],
    queryFn: () => productsApi.getProductVariants(productId),
    enabled: enabled && !!productId,
  });
};

export const useProductVariantById = (
  productId: number,
  variantId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["product", productId, "variant", variantId],
    queryFn: () => productsApi.getProductVariantById(productId, variantId),
    enabled: enabled && !!productId && !!variantId,
  });
};

