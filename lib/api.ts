// API utility functions for SolStore
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Determine API URL based on environment with fallbacks
const getApiBaseUrl = () => {
  // Check if we're in production
  if (process.env.NODE_ENV === "production") {
    // Use production URL if available, otherwise fallback
    return (
      process.env.NEXT_PUBLIC_API_URL_PRODUCTION ||
      "https://web-store-api-3.onrender.com/v1"
    );
  }

  // Development environment
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";
};

const FINAL_API_BASE_URL = getApiBaseUrl();

// Debug logging for API URL configuration
console.log("API Configuration Debug:", {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL_PRODUCTION: process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  FINAL_API_BASE_URL: FINAL_API_BASE_URL,
  isProduction: process.env.NODE_ENV === "production",
});

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiError extends Error {
  constructor(public code: string, message: string, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: FINAL_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log API configuration for debugging
if (typeof window !== "undefined") {
  console.log("API Configuration:", {
    environment: process.env.NODE_ENV,
    baseURL: FINAL_API_BASE_URL,
    production: process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
    development: process.env.NEXT_PUBLIC_API_URL,
  });
}

// Request interceptor - adds auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Check if the response has the expected API format
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data
    ) {
      if (!response.data.success) {
        throw new ApiError(
          response.data.error?.code || "API_ERROR",
          response.data.error?.message || "An error occurred",
          response.data.error?.details
        );
      }
      return response;
    }

    // If response doesn't match expected format, return as is
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      throw new ApiError(
        "NETWORK_ERROR",
        "Cannot connect to backend server. Please ensure your backend is running."
      );
    }

    if (error.code === "ECONNABORTED") {
      throw new ApiError(
        "TIMEOUT_ERROR",
        "Request timed out. Please try again."
      );
    }

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as ApiResponse;

      if (status === 401) {
        // Clear invalid token
        localStorage.removeItem("auth_token");
        throw new ApiError(
          "UNAUTHORIZED",
          "Authentication required. Please connect your wallet."
        );
      }

      if (status === 403) {
        throw new ApiError(
          "FORBIDDEN",
          "Access denied. You don't have permission to perform this action."
        );
      }

      if (status === 404) {
        throw new ApiError(
          "NOT_FOUND",
          "The requested resource was not found."
        );
      }

      if (status >= 500) {
        throw new ApiError(
          "SERVER_ERROR",
          "Server error. Please try again later."
        );
      }

      // Use error from response if available
      if (data && data.error) {
        throw new ApiError(
          data.error.code || "API_ERROR",
          data.error.message || "An error occurred",
          data.error.details
        );
      }
    }

    // Generic network error
    throw new ApiError(
      "NETWORK_ERROR",
      "Failed to connect to server. Please check your connection."
    );
  }
);

// Generic API request function using axios
async function apiRequest<T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      url: endpoint,
      ...config,
    });

    return response.data.data as T;
  } catch (error) {
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle unexpected errors
    throw new ApiError("UNKNOWN_ERROR", "An unexpected error occurred");
  }
}

// Health check API function
export const healthApi = {
  async checkHealth() {
    try {
      const response = await apiClient.get("/health");
      return { available: true, data: response.data };
    } catch (error) {
      console.error("API Health Check Failed:", error);
      return {
        available: false,
        error: error instanceof ApiError ? error.message : "Unknown error",
        details: error,
      };
    }
  },
};

// Auth API functions
export const authApi = {
  async connectWallet(
    walletAddress: string,
    signature: string,
    message: string
  ) {
    return apiRequest<{
      token: string;
      user: {
        id: string;
        walletAddress: string;
        email?: string;
        createdAt: string;
      };
    }>("/auth/wallet/connect", {
      method: "POST",
      data: {
        walletAddress,
        signature,
        message,
      },
    });
  },

  async verifyToken() {
    return apiRequest<{
      valid: boolean;
      user: {
        id: string;
        walletAddress: string;
      };
    }>("/auth/verify", {
      method: "GET",
    });
  },
};

// Store API functions
export const storeApi = {
  async createStore(storeData: {
    storeName: string;
    storeSlug: string;
    storeIcon?: string;
    storeBanner?: string;
    description?: string;
  }) {
    return apiRequest<{
      id: string;
      name: string;
      slug: string;
      description?: string;
      icon?: string;
      banner?: string;
      ownerId: string;
      status: string;
      createdAt: string;
    }>("/stores", {
      method: "POST",
      data: storeData,
    });
  },

  async getUserStores() {
    return apiRequest<
      Array<{
        id: string;
        name: string;
        slug: string;
        description?: string;
        revenue: string;
        orders: number;
        products: number;
        status: string;
        icon?: string;
        createdAt: string;
      }>
    >("/stores", {
      method: "GET",
    });
  },

  async getStoreBySlug(slug: string) {
    return apiRequest<{
      id: string;
      name: string;
      slug: string;
      description?: string;
      icon?: string;
      banner?: string;
      settings: unknown;
      owner: {
        walletAddress: string;
      };
    }>(`/stores/${slug}`, {
      method: "GET",
    });
  },

  async getStoreAnalytics(storeId: string, period: string = "30d") {
    return apiRequest<{
      revenue: {
        total: string;
        currency: string;
        change: string;
      };
      orders: {
        total: number;
        change: string;
      };
      products: {
        total: number;
        active: number;
        draft: number;
      };
      customers: {
        total: number;
        change: string;
      };
      topProducts: Array<{
        name: string;
        sales: number;
        revenue: string;
      }>;
      recentOrders: Array<{
        id: string;
        customer: string;
        product: string;
        amount: string;
        status: string;
      }>;
    }>(`/stores/${storeId}/analytics`, {
      method: "GET",
      params: { period },
    });
  },

  async getStoreProducts(
    storeId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      search?: string;
    }
  ) {
    return apiRequest<{
      products: Array<{
        id: string;
        name: string;
        description: string | null;
        price: string;
        currency: string;
        sales: number;
        revenue: string;
        status: "active" | "draft" | "inactive";
        category: string | null;
        stock: number | "unlimited";
        images: string[];
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/stores/${storeId}/products`, {
      method: "GET",
      params,
    });
  },

  async getProduct(storeId: string, productId: string) {
    return apiRequest<{
      id: string;
      name: string;
      description: string | null;
      price: string;
      currency: string;
      category: string | null;
      stock: number | "unlimited";
      images: string[];
      metadata: object;
      status: "active" | "draft" | "inactive";
      sales: number;
      store: {
        name: string;
        slug: string;
      };
      createdAt: string;
    }>(`/stores/${storeId}/products/${productId}`, {
      method: "GET",
    });
  },

  async getStoreProductsBySlug(
    storeSlug: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      search?: string;
    }
  ) {
    // First get store by slug to get store ID
    const store = await this.getStoreBySlug(storeSlug);
    return this.getStoreProducts(store.id, params);
  },

  async getStoreOrders(
    storeId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }
  ) {
    return apiRequest<{
      orders: Array<{
        id: string;
        orderId: string; // Changed from orderNumber to orderId to match API response
        customer: {
          wallet: string;
          email?: string;
        };
        product: {
          id: string;
          name: string;
        };
        amount: string; // Changed from totalAmount to amount to match API response
        currency: string;
        status: string;
        paymentTxHash?: string | null;
        createdAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/stores/${storeId}/orders`, {
      method: "GET",
      params,
    });
  },

  async updateOrderStatus(
    storeId: string,
    orderId: string,
    data: {
      status: string;
      paymentTxHash?: string;
    }
  ) {
    return apiRequest<{
      id: string;
      orderNumber: string;
      status: string;
      paymentTxHash?: string;
      updatedAt: string;
    }>(`/stores/${storeId}/orders/${orderId}`, {
      method: "PUT",
      data,
    });
  },

  async createProduct(
    storeId: string,
    productData: {
      name: string;
      description?: string;
      price: number;
      currency?: "SOL" | "USDC";
      category?: string;
      stock?: number | "unlimited";
      images?: string[];
      status?: "active" | "draft" | "inactive";
      metadata?: Record<string, unknown>;
    }
  ) {
    return apiRequest<{
      id: string;
      name: string;
      description: string | null;
      price: string;
      currency: string;
      category: string | null;
      stock: number | "unlimited";
      sales: number;
      revenue: string;
      status: "active" | "draft" | "inactive";
      images: string[];
      createdAt: string;
    }>(`/stores/${storeId}/products`, {
      method: "POST",
      data: productData,
    });
  },

  async updateProduct(
    storeId: string,
    productId: string,
    productData: {
      name?: string;
      description?: string;
      price?: number;
      currency?: "SOL" | "USDC";
      category?: string;
      stock?: number | "unlimited";
      images?: string[];
      status?: "active" | "draft" | "inactive";
      metadata?: Record<string, unknown>;
    }
  ) {
    return apiRequest<{
      id: string;
      name: string;
      description: string | null;
      price: string;
      currency: string;
      category: string | null;
      stock: number | "unlimited";
      status: "active" | "draft" | "inactive";
      images: string[];
      updatedAt: string;
    }>(`/stores/${storeId}/products/${productId}`, {
      method: "PUT",
      data: productData,
    });
  },

  async deleteProduct(storeId: string, productId: string) {
    return apiRequest<{
      message: string;
    }>(`/stores/${storeId}/products/${productId}`, {
      method: "DELETE",
    });
  },

  async updateStore(
    storeId: string,
    storeData: {
      name?: string;
      description?: string;
      iconUrl?: string;
      bannerUrl?: string;
      settings?: {
        currency?: string;
        language?: string;
        timezone?: string;
        theme?: string;
        notifications?: {
          email?: boolean;
          sms?: boolean;
          push?: boolean;
        };
        privacy?: {
          storeVisible?: boolean;
          requireLogin?: boolean;
        };
      };
    }
  ) {
    return apiRequest<{
      id: string;
      name: string;
      slug: string;
      description?: string;
      icon?: string;
      banner?: string;
      settings: Record<string, unknown>;
      updatedAt: string;
    }>(`/stores/${storeId}`, {
      method: "PUT",
      data: storeData,
    });
  },

  async deleteStore(storeId: string) {
    return apiRequest<{
      message: string;
    }>(`/stores/${storeId}`, {
      method: "DELETE",
    });
  },

  // Checkout & Payment API functions
  async createCheckoutSession(
    storeId: string,
    checkoutData: {
      productId: string;
      quantity?: number;
      customerWallet: string;
      customerEmail?: string;
      currency?: "SOL" | "USDC";
    }
  ) {
    return apiRequest<{
      orderId: string;
      orderNumber: string;
      paymentURL: string;
      qrCode: string;
      amount: string;
      currency: string;
      reference: string;
      expiresAt: string;
      product: {
        id: string;
        name: string;
        price: string;
      };
      store: {
        id: string;
        name: string;
      };
    }>(`/stores/${storeId}/checkout`, {
      method: "POST",
      data: {
        productId: checkoutData.productId,
        quantity: checkoutData.quantity || 1,
        customerWallet: checkoutData.customerWallet,
        customerEmail: checkoutData.customerEmail,
        currency: checkoutData.currency || "SOL",
      },
    });
  },

  async verifyPayment(
    storeId: string,
    verificationData: {
      orderId: string;
      signature?: string;
    }
  ) {
    return apiRequest<{
      orderId: string;
      orderNumber: string;
      status: string;
      paymentConfirmed: boolean;
      transactionSignature?: string;
      paidAmount?: string;
      paidAt?: string;
      message?: string;
    }>(`/stores/${storeId}/checkout/verify`, {
      method: "POST",
      data: {
        orderId: verificationData.orderId,
        signature: verificationData.signature,
      },
    });
  },

  async getCheckoutStatus(storeId: string, orderId: string) {
    return apiRequest<{
      orderId: string;
      orderNumber: string;
      status: "pending" | "completed" | "failed";
      amount: string;
      currency: string;
      paymentURL: string;
      expiresAt: string;
      transactionSignature?: string | null;
      items: Array<{
        product: {
          id: string;
          name: string;
          price: string;
        };
        quantity: number;
        price: string;
      }>;
      createdAt: string;
      updatedAt: string;
    }>(`/stores/${storeId}/checkout/${orderId}/status`, {
      method: "GET",
    });
  },
};

// Upload API functions
export const uploadApi = {
  async uploadStoreIcon(file: File) {
    const formData = new FormData();
    formData.append("icon", file);

    return apiRequest<{
      url: string;
      key: string;
      name: string;
      size: number;
    }>("/upload/store-icon", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async uploadStoreBanner(file: File) {
    const formData = new FormData();
    formData.append("banner", file);

    return apiRequest<{
      url: string;
      key: string;
      name: string;
      size: number;
    }>("/upload/store-banner", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async uploadProductImages(files: File[]) {
    const formData = new FormData();

    // Append each file to the FormData with the key 'images'
    files.forEach((file) => {
      formData.append("images", file);
    });

    return apiRequest<{
      files: Array<{
        url: string;
        key: string;
        name: string;
        size: number;
      }>;
      count: number;
    }>("/upload/product-images", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async deleteFile(fileKey: string) {
    return apiRequest<{
      message: string;
    }>(`/upload/file/${fileKey}`, {
      method: "DELETE",
    });
  },
};
