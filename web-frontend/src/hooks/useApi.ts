import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AxiosResponse } from "axios";

// Custom hook for GET requests
export function useApiQuery<TData = any, TError = any>(
  queryKey: string[],
  url: string,
  options?: Omit<
    UseQueryOptions<AxiosResponse<TData>, TError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<AxiosResponse<TData>, TError>({
    queryKey,
    queryFn: () => api.get<TData>(url),
    ...options,
  });
}

// Custom hook for POST/PUT/DELETE mutations
export function useApiMutation<TData = any, TVariables = any, TError = any>(
  mutationFn: (variables: TVariables) => Promise<AxiosResponse<TData>>,
  options?: UseMutationOptions<AxiosResponse<TData>, TError, TVariables>
) {
  return useMutation<AxiosResponse<TData>, TError, TVariables>({
    mutationFn,
    ...options,
  });
}

// Example usage:
// const { data, isLoading } = useApiQuery(['products'], '/products');
// const mutation = useApiMutation((data) => api.post('/products', data));
