import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingService } from '../utils/onboardingService';
import { cleanupExpiredSessions } from '../utils/sessionManager';

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Clean up any expired sessions first
      await cleanupExpiredSessions();
      
      // Check onboarding status
      const completed = await OnboardingService.hasCompletedOnboarding();
      setHasCompletedOnboarding(completed);
    } catch (error) {
      console.error('Error initializing app:', error);
      // If there's an error, default to showing onboarding
      setHasCompletedOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth or onboarding status
  if (isLoading || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#D13635" />
      </View>
    );
  }

  // If user is authenticated, go to main app
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // If not authenticated, check onboarding status
  return <Redirect href={hasCompletedOnboarding ? "/auth/login" : "/onboard/steps"} />;
}