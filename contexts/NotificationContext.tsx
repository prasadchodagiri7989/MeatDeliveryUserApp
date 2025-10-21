import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationContextType {
  hasNotificationPermission: boolean;
  pushToken: string | null;
  requestPermissions: () => Promise<void>;
  scheduleTestNotification: () => Promise<void>;
  isRegistering: boolean;
  error: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const {
    expoPushToken,
    permissionStatus,
    isRegistering,
    error,
    requestPermissions,
    scheduleLocalNotification,
    clearError,
  } = useNotifications();

  const [hasShownPermissionRequest, setHasShownPermissionRequest] = useState(false);

  const handlePermissionRequest = useCallback(async () => {
    try {
      const result = await requestPermissions();
      if (result?.status === 'granted') {
        console.log('Notification permissions granted');
      } else if (result?.status === 'denied') {
        // Show explanation about notification benefits
        Alert.alert(
          'Notifications Disabled',
          'You can enable notifications in your device settings to receive order updates and special offers.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  }, [requestPermissions]);

  // Auto-request permissions on first app load
  useEffect(() => {
    if (!hasShownPermissionRequest && permissionStatus === 'undetermined') {
      setHasShownPermissionRequest(true);
      handlePermissionRequest();
    }
  }, [permissionStatus, hasShownPermissionRequest, handlePermissionRequest]);

  const scheduleTestNotification = async () => {
    try {
      await scheduleLocalNotification(
        'Test Notification 🧪',
        'This is a test notification from your Meat Delivery app!',
        { type: 'test', screen: 'categories' },
        5 // 5 seconds delay
      );
      
      Alert.alert(
        'Test Notification Scheduled',
        'You should receive a test notification in 5 seconds.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error scheduling test notification:', error);
      Alert.alert(
        'Error',
        'Failed to schedule test notification. Please check permissions.',
        [{ text: 'OK' }]
      );
    }
  };

  // Clear errors after showing them
  useEffect(() => {
    if (error) {
      console.error('Notification error:', error);
      // Auto-clear error after 10 seconds
      const timer = setTimeout(() => {
        clearError();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const contextValue: NotificationContextType = {
    hasNotificationPermission: permissionStatus === 'granted',
    pushToken: expoPushToken,
    requestPermissions: handlePermissionRequest,
    scheduleTestNotification,
    isRegistering,
    error,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}