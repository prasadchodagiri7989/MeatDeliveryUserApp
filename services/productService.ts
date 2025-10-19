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
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  images?: {
    _id: string;
    url: string;
    alt: string;
  }[];
  category: string;
  subcategory?: string;
  rating?: number;
  ratings?: {
    average: number;
    count: number;
  };
  deliveryTime?: string;
  isActive: boolean;
  availability: {
    inStock: boolean;
    quantity: number;
  };
  weight?: {
    value: number;
    unit: string;
  };
  discount?: {
    percentage: number;
    validUntil?: string;
  };
  preparationMethod?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Products API functions
export const productService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiCall('/products');
    // Handle nested data structure: response.data.data contains the products array
    return response.data?.data || response.data || [];
  },

  // Get product by ID
  getProductById: async (productId: string): Promise<Product> => {
    const response = await apiCall(`/products/${productId}`);
    // Handle nested data structure: response.data.data or response.data contains the product
    return response.data?.data || response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiCall(`/products/category/${category}`);
    // Handle nested data structure: response.data.data contains the products array
    return response.data?.data || response.data || [];
  },

  // Get suggested products (you might also like)
  getSuggestedProducts: async (limit: number = 10): Promise<Product[]> => {
    const response = await apiCall(`/products/suggested?limit=${limit}`);
    // Handle nested data structure: response.data.data
    return response.data?.data || response.data || [];
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      // Try alternative search endpoints
      
      // Method 1: Try using products endpoint with search parameter
      try {
        const response = await apiCall(`/products?search=${encodeURIComponent(query)}`);
        // Handle nested data structure: response.data.data contains the products array
        return response.data?.data || response.data || [];
      } catch (method1Error) {
        console.log('Method 1 failed, trying method 2...', method1Error);
        
        // Method 2: Try the original search endpoint
        try {
          const response = await apiCall(`/products/search?q=${encodeURIComponent(query)}`);
          // Handle nested data structure: response.data.data contains the products array
          return response.data?.data || response.data || [];
        } catch (method2Error) {
          console.log('Method 2 failed, using fallback...');
          throw method2Error;
        }
      }
    } catch (searchError) {
      console.log('Search endpoints failed, trying alternative approach...', searchError);
      // Fallback: use getAllProducts and filter on frontend
      try {
        const allProducts = await productService.getAllProducts();
        const filteredProducts = allProducts.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
        );
        return filteredProducts;
      } catch (fallbackError) {
        console.error('All search methods failed:', fallbackError);
        throw new Error('Search failed. Please try again.');
      }
    }
  },
};