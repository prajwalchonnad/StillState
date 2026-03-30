import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { startHealthEnforcement, stopHealthEnforcement } from '../src/services/healthEnforcement';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { theme } from '../src/theme';
import { useAuthStore } from '../src/stores/useAuthStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, initialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // In a real app we would load fonts here too
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      stopHealthEnforcement();
      router.replace('/auth');
    } else if (isAuthenticated && inAuthGroup) {
      startHealthEnforcement();
      router.replace('/(tabs)');
    } else if (isAuthenticated && !inAuthGroup) {
      // Starting just in case
      startHealthEnforcement();
    }
  }, [isAuthenticated, initialized, segments]);

  if (!initialized) {
    return null; // Keep showing splash screen
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="tasks" options={{ headerShown: false }} />
        <Stack.Screen name="analytics" options={{ headerShown: true, title: 'Analytics', headerStyle: { backgroundColor: theme.colors.surfaceElevated }, headerTintColor: theme.colors.text }} />
        <Stack.Screen name="rewards" options={{ headerShown: true, title: 'Rewards', headerStyle: { backgroundColor: theme.colors.surfaceElevated }, headerTintColor: theme.colors.text }} />
      </Stack>
    </>
  );
}
