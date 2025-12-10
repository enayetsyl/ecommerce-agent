// Common types for the application

export interface User {
  id: string;
  email?: string;
  name?: string | null;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  meta?: {
    timestamp?: string;
    [key: string]: unknown;
  };
}
