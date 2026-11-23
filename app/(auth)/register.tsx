
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

export default function RegisterScreen() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    setError('');

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setIsLoading(true);

      await register(name, email, phone, password);

      router.replace('/(tabs)/profile');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de l’inscription.'
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
        <View className="flex-1 px-6 py-10">

          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="mb-8 self-start"
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
              Créer un compte
            </Text>

            <Text className="mt-2 text-center text-gray-500">
              Rejoignez la communauté Hannout.
            </Text>
          </View>

          <Text className="mb-2 font-semibold text-gray-800">
            Nom complet
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Votre nom complet"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            editable={!isLoading}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900"
          />

          <Text className="mb-2 mt-5 font-semibold text-gray-800">
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
            Téléphone
          </Text>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="06XXXXXXXX"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
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
              placeholder="8 caractères minimum"
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

          <Text className="mb-2 mt-5 font-semibold text-gray-800">
            Confirmer le mot de passe
          </Text>

          <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmez votre mot de passe"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              editable={!isLoading}
              className="flex-1 py-4 text-gray-900"
            />

            <Pressable
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              hitSlop={10}
            >
              {showConfirmPassword ? (
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
            onPress={handleRegister}
            disabled={isLoading}
            className="mt-7 items-center rounded-xl bg-green-700 py-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-bold text-white">
                Créer mon compte
              </Text>
            )}
          </Pressable>

          <View className="mb-6 mt-7 flex-row justify-center">
            <Text className="text-gray-500">
              Vous avez déjà un compte ?{' '}
            </Text>

            <Link
              href="/(auth)/login"
              className="font-bold text-green-700"
            >
              Se connecter
            </Link>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
