import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboard/steps" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="auth/otp" />
      <Stack.Screen name="auth/success" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="other/notifications" />
    </Stack>
  );
}
