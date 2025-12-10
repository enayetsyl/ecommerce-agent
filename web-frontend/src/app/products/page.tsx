"use client";

import { useState, useMemo } from "react";
import { useProducts, useProductsByVendor, useProductsByType, useProductsByTag } from "@/hooks/useProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { ProductPagination } from "@/components/products/ProductPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/api/products";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at" | "title" | "vendor">("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<{
    vendor?: string;
    type?: string;
    tag?: string;
    search?: string;
  }>({});

  // Determine which query to use based on active filters
  const queryParams = useMemo(
    () => ({
      page,
      limit,
      sortBy,
      order,
      ...(filters.search && { q: filters.search }),
    }),
    [page, limit, sortBy, order, filters.search]
  );

  const { data: allProductsData, isLoading: isLoadingAll } = useProducts(
    filters.vendor || filters.type || filters.tag ? undefined : queryParams
  );
  const { data: vendorProductsData, isLoading: isLoadingVendor } = useProductsByVendor(
    filters.vendor || "",
    filters.vendor ? queryParams : undefined
  );
  const { data: typeProductsData, isLoading: isLoadingType } = useProductsByType(
    filters.type || "",
    filters.type ? queryParams : undefined
  );
  const { data: tagProductsData, isLoading: isLoadingTag } = useProductsByTag(
    filters.tag || "",
    filters.tag ? queryParams : undefined
  );

  // Determine which data to use
  let productsData;
  let isLoading;

  if (filters.vendor) {
    productsData = vendorProductsData;
    isLoading = isLoadingVendor;
  } else if (filters.type) {
    productsData = typeProductsData;
    isLoading = isLoadingType;
  } else if (filters.tag) {
    productsData = tagProductsData;
    isLoading = isLoadingTag;
  } else {
    productsData = allProductsData;
    isLoading = isLoadingAll;
  }

  const products = useMemo(() => {
    if (!productsData?.data) return [];
    
    // Handle both paginated and array responses
    if (Array.isArray(productsData.data)) {
      return productsData.data;
    }
    // Handle paginated response
    if (productsData.data && "data" in productsData.data) {
      return productsData.data.data || [];
    }
    return [];
  }, [productsData]);

  const pagination = useMemo(() => {
    if (!productsData?.data) return null;
    
    // If it's an array, no pagination
    if (Array.isArray(productsData.data)) {
      return null;
    }
    
    // If it has pagination property
    if (productsData.data && "pagination" in productsData.data) {
      return productsData.data.pagination;
    }
    
    return null;
  }, [productsData]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of products
        </p>
      </div>

      <ProductFilters
        currentFilters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            "Loading..."
          ) : pagination ? (
            `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
              pagination.page * pagination.limit,
              pagination.total
            )} of ${pagination.total} products`
          ) : (
            `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`
          )}
        </div>
        <ProductSort
          sortBy={sortBy}
          order={order}
          onSortChange={setSortBy}
          onOrderChange={setOrder}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No products found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <ProductPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

