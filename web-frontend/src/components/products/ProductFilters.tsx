"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { useVendors, useProductTypes, useTags } from "@/hooks/useProducts";

interface ProductFiltersProps {
  onFilterChange: (filters: {
    vendor?: string;
    type?: string;
    tag?: string;
    search?: string;
  }) => void;
  currentFilters: {
    vendor?: string;
    type?: string;
    tag?: string;
    search?: string;
  };
}

export function ProductFilters({
  onFilterChange,
  currentFilters,
}: ProductFiltersProps) {
  const { data: vendorsData } = useVendors();
  const { data: typesData } = useProductTypes();
  const { data: tagsData } = useTags();

  // Filter out empty strings to prevent SelectItem errors
  const vendors = (vendorsData?.data || []).filter((v) => v && v.trim() !== "");
  const types = (typesData?.data || []).filter((t) => t && t.trim() !== "");
  const tags = (tagsData?.data || []).filter((tag) => tag && tag.trim() !== "");

  const [searchQuery, setSearchQuery] = useState(currentFilters.search || "");

  const handleFilterChange = (key: "vendor" | "type" | "tag", value: string) => {
    // Don't allow empty strings - convert to undefined
    const filterValue = value && value !== "all" ? value : undefined;
    onFilterChange({
      ...currentFilters,
      [key]: filterValue,
    });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onFilterChange({
      ...currentFilters,
      search: value || undefined,
    });
  };

  const clearFilter = (key: "vendor" | "type" | "tag") => {
    const newFilters = { ...currentFilters };
    delete newFilters[key];
    onFilterChange(newFilters);
  };

  const clearAll = () => {
    setSearchQuery("");
    onFilterChange({});
  };

  const hasActiveFilters =
    currentFilters.vendor || currentFilters.type || currentFilters.tag || currentFilters.search;

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => handleSearch("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select
          value={currentFilters.vendor || undefined}
          onValueChange={(value) => handleFilterChange("vendor", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Vendors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            {vendors.map((vendor) => (
              <SelectItem key={vendor} value={vendor}>
                {vendor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.type || undefined}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.tag || undefined}
          onValueChange={(value) => handleFilterChange("tag", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {currentFilters.vendor && (
            <Badge variant="secondary" className="gap-1">
              Vendor: {currentFilters.vendor}
              <button
                onClick={() => clearFilter("vendor")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.type && (
            <Badge variant="secondary" className="gap-1">
              Type: {currentFilters.type}
              <button
                onClick={() => clearFilter("type")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.tag && (
            <Badge variant="secondary" className="gap-1">
              Tag: {currentFilters.tag}
              <button
                onClick={() => clearFilter("tag")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {currentFilters.search}
              <button
                onClick={() => handleSearch("")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

