
import '@/global.css';

import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from 'uniwind';

import { initializeStorage } from '@/services/storage/initialize-storage';
import { AuthProvider } from '@/contexts/auth-context';

export {
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { theme } = useUniwind();

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startInitialization = useCallback(async () => {
    try {
      setError(null);
      setIsReady(false);

      await initializeStorage();

      setIsReady(true);
    } catch (err) {
      console.error('Storage initialization error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors du chargement.'
      );
    }
  }, []);

  useEffect(() => {
    startInitialization();
  }, [startInitialization]);

  return (
    <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      {isReady ? (
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </AuthProvider>
      ) : (
        <View className="flex-1 items-center justify-center bg-white px-6">
          {error ? (
            <>
              <Text className="text-xl font-bold text-red-600">
                Erreur de démarrage
              </Text>

              <Text className="mt-3 text-center text-gray-600">
                {error}
              </Text>

              <Pressable
                onPress={startInitialization}
                className="mt-6 rounded-xl bg-green-700 px-6 py-3"
              >
                <Text className="font-semibold text-white">
                  Réessayer
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color="#15803d" />

              <Text className="mt-4 text-base font-medium text-gray-600">
                Préparation de Hannout...
              </Text>
            </>
          )}
        </View>
      )}

      <PortalHost />
    </ThemeProvider>
  );
}
