
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, Store } from 'lucide-react-native';

import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setError('');

    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      setIsLoading(true);

      await login(email, password);

      router.replace('/(tabs)/profile');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">

          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="mb-10 self-start"
          >
            <Text className="font-semibold text-green-700">
              ← Continuer en tant qu'invité
            </Text>
          </Pressable>

          <View className="mb-8 items-center">
            <View className="h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
              <Store size={38} color="#15803d" />
            </View>

            <Text className="mt-5 text-3xl font-bold text-gray-900">
              Bienvenue sur Hannout
            </Text>

            <Text className="mt-2 text-center text-gray-500">
              Connectez-vous pour accéder à votre compte.
            </Text>
          </View>

          <View>
            <Text className="mb-2 font-semibold text-gray-800">
              Adresse e-mail
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="exemple@email.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900"
            />

            <Text className="mb-2 mt-5 font-semibold text-gray-800">
              Mot de passe
            </Text>

            <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Votre mot de passe"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
                className="flex-1 py-4 text-gray-900"
              />

              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={10}
              >
                {showPassword ? (
                  <EyeOff size={21} color="#6B7280" />
                ) : (
                  <Eye size={21} color="#6B7280" />
                )}
              </Pressable>
            </View>

            {error ? (
              <Text className="mt-4 text-sm text-red-600">
                {error}
              </Text>
            ) : null}

            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              className="mt-7 items-center rounded-xl bg-green-700 py-4"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-bold text-white">
                  Se connecter
                </Text>
              )}
            </Pressable>
          </View>

          <View className="mt-7 flex-row justify-center">
            <Text className="text-gray-500">
              Vous n'avez pas de compte ?{' '}
            </Text>

            <Link
              href="/(auth)/register"
              className="font-bold text-green-700"
            >
              S'inscrire
            </Link>
          </View>

          <View className="mt-8 rounded-xl bg-gray-50 p-4">
            <Text className="font-semibold text-gray-800">
              Compte de démonstration
            </Text>

            <Text className="mt-2 text-sm text-gray-600">
              Email : ahmed.store@example.com
            </Text>

            <Text className="mt-1 text-sm text-gray-600">
              Mot de passe : password123
            </Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
