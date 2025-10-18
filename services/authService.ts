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

// Helper function to set auth token
const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

// Helper function to remove auth token
const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing auth token:', error);
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

// Auth interfaces
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  role?: string;
}

export interface OTPRequestData {
  phone: string;
}

export interface OTPVerifyData {
  phone: string;
  otp: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address?: string;
      role: string;
      isActive: boolean;
      phoneVerified: boolean;
      lastLogin?: string;
    };
    token: string;
  };
}

export interface OTPResponse {
  success: boolean;
  message: string;
  data: {
    phone: string;
    expiresIn: string;
  };
}

// Auth API functions
export const authService = {
  // Login with email/password
  login: async (loginData: LoginData): Promise<AuthResponse> => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    
    if (response.success && response.data.token) {
      await setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Register new user
  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
    
    if (response.success && response.data.token) {
      await setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Request OTP for phone login
  requestOTP: async (otpRequestData: OTPRequestData): Promise<OTPResponse> => {
    const response = await apiCall('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify(otpRequestData),
    });
    return response;
  },

  // Verify OTP and login
  verifyOTP: async (otpVerifyData: OTPVerifyData): Promise<AuthResponse> => {
    const response = await apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(otpVerifyData),
    });
    
    // Handle both response structures - nested data or direct properties
    const token = response.data?.token || (response as any).token;
    
    if (response.success && token) {
      await setAuthToken(token);
    }
    
    return response;
  },

  // Get current user profile
  getMe: async (): Promise<AuthResponse> => {
    const response = await apiCall('/auth/me');
    return response;
  },

  // Update user profile
  updateProfile: async (profileData: UpdateProfileData): Promise<AuthResponse> => {
    const response = await apiCall('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response;
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiCall('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Continue logout even if API call fails
      console.error('Logout API error:', error);
    }
    await removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const token = await getAuthToken();
    return !!token;
  },

  // Get current user token
  getToken: getAuthToken,

  // Set auth token (for manual token setting if needed)
  setToken: setAuthToken,
};