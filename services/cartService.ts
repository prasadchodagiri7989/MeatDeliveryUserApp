import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentConfig } from '../config/api';

const API_BASE_URL = getCurrentConfig().API_URL;

// Helper function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Extract specific error message from backend response
      const errorMessage = data.message || data.error || 'Something went wrong';
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    price: number;
    discountedPrice?: number;
    image?: string; // Legacy support
    images?: {
      url: string;
      alt: string;
      _id: string;
    }[];
    weight?: {
      value: number;
      unit: string;
    };
    availability: {
      inStock: boolean;
      quantity: number;
    };
    discount?: {
      percentage: number;
    };
    ratings?: {
      average: number;
      count: number;
    };
    preparationMethod?: string;
    tags?: string[];
    isActive: boolean;
    deliveryTime?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  quantity: number;
  priceAtTime: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  appliedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  subtotal?: number;
  discountAmount?: number;
  finalAmount?: number;
  formattedTotal: string;
  appliedCoupon?: AppliedCoupon;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  itemCount: number;
  totalAmount: number;
  formattedTotal: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    priceAtTime: number;
    subtotal: number;
  }[];
}

// Cart API functions
export const cartService = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await apiCall('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    return response.data;
  },

  // Update item quantity in cart
  updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await apiCall(`/cart/update/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<Cart> => {
    const response = await apiCall(`/cart/remove/${itemId}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Clear entire cart
  clearCart: async (): Promise<Cart> => {
    const response = await apiCall('/cart/clear', {
      method: 'DELETE',
    });
    return response.data;
  },

  // Apply coupon to cart
  applyCoupon: async (code: string): Promise<Cart> => {
    const response = await apiCall('/cart/apply-coupon', {
      method: 'POST',
      body: JSON.stringify({ code: code.toUpperCase() }),
    });
    return response.data;
  },

  // Remove coupon from cart
  removeCoupon: async (): Promise<Cart> => {
    try {
      const response = await apiCall('/cart/remove-coupon', {
        method: 'DELETE',
      });
      return response.data;
    } catch (error: any) {
      // Handle the specific toFixed error that occurs in the backend
      if (error.message && error.message.includes('toFixed')) {
        // If this error occurs, the coupon was likely removed but there's a formatting issue
        // Fetch the cart again to get the updated state
        const cartResponse = await apiCall('/cart');
        return cartResponse.data;
      }
      throw error;
    }
  },

  // Get cart summary
  getCartSummary: async (): Promise<CartSummary> => {
    const response = await apiCall('/cart/summary');
    return response.data;
  },
};

// Error handling types
export interface ApiError {
  message: string;
  status?: number;
}