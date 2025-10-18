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

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image: string;
  category: string;
  rating: number;
  deliveryTime: string;
  isActive: boolean;
  availability: {
    inStock: boolean;
    quantity: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Products API functions
export const productService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiCall('/products');
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId: string): Promise<Product> => {
    const response = await apiCall(`/products/${productId}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiCall(`/products/category/${category}`);
    return response.data;
  },

  // Get suggested products (you might also like)
  getSuggestedProducts: async (limit: number = 10): Promise<Product[]> => {
    const response = await apiCall(`/products/suggested?limit=${limit}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await apiCall(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};