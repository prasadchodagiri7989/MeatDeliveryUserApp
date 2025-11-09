import { getCurrentConfig } from '../config/api';
import { authService } from './authService';

const API_BASE_URL = getCurrentConfig().API_URL;

export interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  isDefault: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface AddAddressRequest {
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  isDefault?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface AddressResponse {
  success: boolean;
  message?: string;
  addresses?: Address[];
  address?: Address;
  count?: number;
  errors?: any[];
}

class AddressService {
  private async getAuthHeaders() {
    try {
      // Use cached token from authService when available
      const token = await authService.getToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      return headers;
    } catch (error) {
      console.error('Error getting auth headers:', error);
      return {
        'Content-Type': 'application/json'
      };
    }
  }

  // Get all saved addresses
  async getSavedAddresses(): Promise<Address[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'GET',
        headers,
      });

      const data: AddressResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch addresses');
      }

      return data.addresses || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  // Add new address
  async addAddress(addressData: AddAddressRequest): Promise<Address> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(addressData),
      });

      const data: AddressResponse = await response.json();

      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Failed to add address');
      }

      return data.address!;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  // Update existing address
  async updateAddress(addressId: string, addressData: AddAddressRequest): Promise<Address> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(addressData),
      });

      const data: AddressResponse = await response.json();

      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Failed to update address');
      }

      return data.address!;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  // Delete address
  async deleteAddress(addressId: string): Promise<Address[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
        method: 'DELETE',
        headers,
      });

      const data: AddressResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete address');
      }

      return data.addresses || [];
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  // Set default address
  async setDefaultAddress(addressId: string): Promise<Address[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/addresses/${addressId}/default`, {
        method: 'PATCH',
        headers,
      });

      const data: AddressResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to set default address');
      }

      return data.addresses || [];
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  // Get default address
  async getDefaultAddress(): Promise<Address | null> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/addresses/default`, {
        method: 'GET',
        headers,
      });

      const data: AddressResponse = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No default address found
        }
        throw new Error(data.message || 'Failed to fetch default address');
      }

      return data.address || null;
    } catch (error) {
      console.error('Error fetching default address:', error);
      throw error;
    }
  }
}

export const addressService = new AddressService();