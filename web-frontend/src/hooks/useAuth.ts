"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { authApi, RegisterInput, LoginInput } from "@/lib/api/auth";
import { useAppContext } from "@/contexts/AppContext";
import { ApiErrorResponse } from "@/types";

export const useRegister = () => {
  const { setUser, setIsAuthenticated } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Store token
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Update context - set user first, then authentication state
        setUser({
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name || undefined,
        });
        setIsAuthenticated(true);

        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ["user"] });

        toast.success(response.message || "Registration successful!");

        // Use window.location for a hard navigation to ensure state is properly set
        window.location.href = "/dashboard";
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const useLogin = () => {
  const { setUser, setIsAuthenticated } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Store token
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Update context - set user first, then authentication state
        setUser({
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name || undefined,
        });
        setIsAuthenticated(true);

        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ["user"] });

        toast.success(response.message || "Login successful!");

        // Use window.location for a hard navigation to ensure state is properly set
        window.location.href = "/dashboard";
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    },
  });
};

export const useGetMe = () => {
  const { setUser, isAuthenticated } = useAppContext();

  const query = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const response = await authApi.getMe();
      return response.data;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Update user context when data is fetched
  React.useEffect(() => {
    if (query.data) {
      setUser({
        id: query.data.id,
        email: query.data.email,
        name: query.data.name || undefined,
      });
    }
  }, [query.data, setUser]);

  // Clear auth state on error
  React.useEffect(() => {
    if (query.isError) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setUser(null);
    }
  }, [query.isError, setUser]);

  return query;
};
