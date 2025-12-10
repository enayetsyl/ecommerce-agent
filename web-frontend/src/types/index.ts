// Common types for the application

export interface User {
  id: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
