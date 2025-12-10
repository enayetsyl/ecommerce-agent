import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // We handle credentials manually via localStorage
});

// Request interceptor - Add auth token from localStorage
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Get cookies from localStorage and add them to headers
    const cookies =
      typeof window !== "undefined" ? localStorage.getItem("cookies") : null;
    if (cookies && config.headers) {
      try {
        const parsedCookies = JSON.parse(cookies);
        // If cookies is an object, convert to cookie string format
        if (typeof parsedCookies === "object") {
          const cookieString = Object.entries(parsedCookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; ");
          config.headers.Cookie = cookieString;
        } else if (typeof parsedCookies === "string") {
          config.headers.Cookie = parsedCookies;
        }
      } catch (error) {
        // If parsing fails, use as string
        if (config.headers) {
          config.headers.Cookie = cookies;
        }
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle cookies and tokens from response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Extract cookies from response headers and store in localStorage
    if (typeof window !== "undefined") {
      const setCookieHeader = response.headers["set-cookie"];
      if (setCookieHeader) {
        // Handle array of cookies
        const cookies = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];
        const cookieObject: Record<string, string> = {};

        cookies.forEach((cookie: string) => {
          const [keyValue] = cookie.split(";");
          const [key, value] = keyValue.split("=");
          if (key && value) {
            cookieObject[key.trim()] = value.trim();
          }
        });

        // Merge with existing cookies
        const existingCookies = localStorage.getItem("cookies");
        if (existingCookies) {
          try {
            const existing = JSON.parse(existingCookies);
            Object.assign(cookieObject, existing);
          } catch {
            // If parsing fails, use new cookies
          }
        }

        localStorage.setItem("cookies", JSON.stringify(cookieObject));
      }

      // Extract token from response if present
      const token = response.data?.token || response.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - clear auth data
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("cookies");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
