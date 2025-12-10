"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface ProductSortProps {
  sortBy: "created_at" | "updated_at" | "title" | "vendor";
  order: "asc" | "desc";
  onSortChange: (sortBy: "created_at" | "updated_at" | "title" | "vendor") => void;
  onOrderChange: (order: "asc" | "desc") => void;
}

export function ProductSort({
  sortBy,
  order,
  onSortChange,
  onOrderChange,
}: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Date Created</SelectItem>
          <SelectItem value="updated_at">Last Updated</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="vendor">Vendor</SelectItem>
        </SelectContent>
      </Select>

      <Select value={order} onValueChange={onOrderChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

