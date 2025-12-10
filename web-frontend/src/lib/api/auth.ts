import api from "../axios";

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string | null;
      createdAt: string;
    };
    token: string;
  };
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    email: string;
    name: string | null;
    created_at: string;
    updated_at: string;
  };
}

export const authApi = {
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/register", data);
    return response.data;
  },

  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/login", data);
    return response.data;
  },

  getMe: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>("/api/auth/me");
    return response.data;
  },
};
