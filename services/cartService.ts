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
      throw new Error(data.message || 'Something went wrong');
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
    name: string;
    price: number;
    discountedPrice?: number;
    image: string;
    deliveryTime: string;
    category: string;
    availability: {
      inStock: boolean;
      quantity: number;
    };
  };
  quantity: number;
  priceAtTime: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  formattedTotal: string;
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