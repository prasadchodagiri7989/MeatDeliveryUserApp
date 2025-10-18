import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboard/steps" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/otp" />
        <Stack.Screen name="auth/success" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="other/notifications" />
        <Stack.Screen name="other/personal-info" />
        <Stack.Screen name="other/my-orders" />
        <Stack.Screen name="other/order-details" />
        <Stack.Screen name="other/address-management" />
        <Stack.Screen name="other/privacy-security" />
        <Stack.Screen name="other/settings" />
        <Stack.Screen name="other/help-support" />
      </Stack>
    </AuthProvider>
  );
}
