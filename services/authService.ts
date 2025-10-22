
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentConfig } from '../config/api';

// Helper to get the full auth session (for login screen session check)
export const getAuthSession = async (): Promise<SessionData | null> => {
  try {
    const sessionData = await AsyncStorage.getItem('authSession');
    if (!sessionData) return null;
    const session: SessionData = JSON.parse(sessionData);
    const now = Date.now();
    if (now > session.expiresAt) {
      await removeAuthSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

const API_BASE_URL = getCurrentConfig().API_URL;

// Session constants
const SESSION_DURATION = 20 * 24 * 60 * 60 * 1000; // 20 days in milliseconds

// Interface for session data
interface SessionData {
  token: string;
  expiresAt: number;
  userId: string;
}

// Helper function to get auth token with expiration check
const getAuthToken = async (): Promise<string | null> => {
  try {
    const sessionData = await AsyncStorage.getItem('authSession');
    if (!sessionData) {
      return null;
    }

    const session: SessionData = JSON.parse(sessionData);
    const now = Date.now();

    // Check if session has expired
    if (now > session.expiresAt) {
      console.log('Session expired, clearing auth data');
      await removeAuthSession();
      return null;
    }

    return session.token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to set auth token with expiration
const setAuthToken = async (token: string, userId: string): Promise<void> => {
  try {
    const expiresAt = Date.now() + SESSION_DURATION;
    const sessionData: SessionData = {
      token,
      expiresAt,
      userId
    };
    
    await AsyncStorage.setItem('authSession', JSON.stringify(sessionData));
    console.log(`Session set for user ${userId}, expires at ${new Date(expiresAt).toISOString()}`);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

// Helper function to remove auth session
const removeAuthSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authSession');
    await AsyncStorage.removeItem('authToken'); // Remove legacy token if exists
  } catch (error) {
    console.error('Error removing auth session:', error);
  }
};

// Helper function to check if session is valid
export const isSessionValid = async (): Promise<boolean> => {
  try {
    const sessionData = await AsyncStorage.getItem('authSession');
    if (!sessionData) {
      return false;
    }

    const session: SessionData = JSON.parse(sessionData);
    const now = Date.now();

    return now <= session.expiresAt;
  } catch (error) {
    console.error('Error checking session validity:', error);
    return false;
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
  phone?: string; // Optional phone field for phone-based login
}

export interface LoginPinData {
  identifier: string; // email or phone
  pin: string;
}

export interface SetPinData {
  pin: string;
  confirmPin: string;
}

export interface ForgotPinData {
  identifier: string; // email or phone
}

export interface ResetPinData {
  identifier: string;
  otp: string;
  newPin: string;
  confirmPin: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  pin: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    landmark?: string;
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
  token: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    savedAddresses?: {
      label: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      landmark?: string;
      isDefault: boolean;
      _id: string;
    }[];
    role: string;
    isActive: boolean;
    otpIsVerified: boolean;
    otpAttempts: number;
    phoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
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
    
    if (response.success && response.token && response.user) {
      await setAuthToken(response.token, response.user._id);
    }
    
    return response;
  },

  // Register new user
  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
    
    if (response.success && response.token && response.user) {
      await setAuthToken(response.token, response.user._id);
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
    const user = response.data?.user || (response as any).user;
    
    if (response.success && token && user) {
      await setAuthToken(token, user._id);
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

  // Login with PIN
  loginWithPin: async (loginPinData: LoginPinData): Promise<AuthResponse> => {
    const response = await apiCall('/auth/login-pin', {
      method: 'POST',
      body: JSON.stringify(loginPinData),
    });
    
    if (response.success && response.token && response.user) {
      await setAuthToken(response.token, response.user._id);
    }
    
    return response;
  },

  // Set PIN
  setPin: async (pinData: SetPinData): Promise<{ success: boolean; message: string }> => {
    const response = await apiCall('/auth/set-pin', {
      method: 'POST',
      body: JSON.stringify(pinData),
    });
    return response;
  },

  // Forgot PIN - Request OTP
  forgotPin: async (forgotPinData: ForgotPinData): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiCall('/auth/forgot-pin', {
      method: 'POST',
      body: JSON.stringify(forgotPinData),
    });
    return response;
  },

  // Reset PIN with OTP
  resetPin: async (resetPinData: ResetPinData): Promise<{ success: boolean; message: string }> => {
    const response = await apiCall('/auth/reset-pin', {
      method: 'POST',
      body: JSON.stringify(resetPinData),
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
    await removeAuthSession();
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    return await isSessionValid();
  },

  // Get current user token
  getToken: getAuthToken,

  // Set auth token (for manual token setting if needed)
  setToken: (token: string, userId: string) => setAuthToken(token, userId),

  // Check session validity
  isSessionValid: isSessionValid,
};