"use client";

import React, { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/contexts/AppContext";
import { CartProvider } from "@/contexts/CartContext";
import { queryClient } from "@/lib/query-client";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <CartProvider>{children}</CartProvider>
      </AppProvider>
      <Toaster />
    </QueryClientProvider>
  );
};
