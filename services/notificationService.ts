import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get API URL from app configuration
const getApiUrl = () => {
  const extra = Constants.expoConfig?.extra;
  
  if (__DEV__) {
    // Development mode - use local server
    const apiHost = extra?.apiHost || '192.168.1.4';
    const apiPort = extra?.apiPort || '5000';
    return `http://${apiHost}:${apiPort}/api`;
  } else {
    // Production mode - use production URL
    return extra?.productionApiUrl || 'https://meat-delivery-backend-bowm.vercel.app/api';
  }
};

const API_BASE_URL = getApiUrl();

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'delivery' | 'product' | 'payment' | 'welcome' | 'system_announcement';
  category?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    orderId?: {
      orderNumber: string;
      status: string;
    };
    productId?: {
      name: string;
      price: number;
    };
    couponId?: {
      code: string;
      discount: number;
    };
  };
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notifications: NotificationItem[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}

class NotificationService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  private async handleResponse(response: Response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  }

  /**
   * Get user notifications with pagination and filtering
   */
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    category?: string;
    isRead?: boolean;
    type?: string;
  }): Promise<NotificationResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());
      if (params?.type) queryParams.append('type', params.type);

      const response = await fetch(
        `${API_BASE_URL}/notifications?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: await this.getAuthHeaders(),
        }
      );

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get a specific notification by ID
   */
  async getNotification(id: string): Promise<{ success: boolean; message: string; data: NotificationItem }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<{ success: boolean; message: string; data: NotificationItem }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean; message: string; data: { modifiedCount: number } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<{ success: boolean; message: string; data: { modifiedCount: number } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/clear-all`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: any): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(preferences),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();