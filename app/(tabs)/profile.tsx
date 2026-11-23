
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

import {
  UserRound,
  Mail,
  Phone,
  Package,
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  ChevronRight,
  Store,
} from 'lucide-react-native';

import { useAuth } from '@/contexts/auth-context';

export default function ProfileScreen() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  function navigateToLogin() {
    router.push('/(auth)/login');
  }

  function navigateToRegister() {
    router.push('/(auth)/register');
  }

  function ProfileAction({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress: () => void;
  }) {
    return (
      <Pressable
        onPress={onPress}
        className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-4"
      >
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-green-50">
          {icon}
        </View>

        <View className="ml-3 flex-1">
          <Text className="font-semibold text-gray-900">
            {title}
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            {subtitle}
          </Text>
        </View>

        <ChevronRight size={20} color="#9CA3AF" />
      </Pressable>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#15803d" />

        <Text className="mt-3 text-gray-500">
          Chargement du profil...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-5 pb-10 pt-16">

        <Text className="text-3xl font-bold text-gray-900">
          Mon profil
        </Text>

        <Text className="mt-2 text-gray-500">
          Gérez votre compte Hannout.
        </Text>

        {isAuthenticated && user ? (
          <>
            {/* Informations utilisateur */}
            <View className="mt-7 rounded-2xl bg-white p-5">
              <View className="items-center">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-green-50">
                  <UserRound size={38} color="#15803d" />
                </View>

                <Text className="mt-4 text-xl font-bold text-gray-900">
                  {user.name}
                </Text>

                <Text className="mt-1 text-sm text-green-700">
                  Membre Hannout
                </Text>
              </View>

              <View className="mt-6 border-t border-gray-100 pt-5">
                <View className="mb-4 flex-row items-center">
                  <Mail size={19} color="#15803d" />

                  <View className="ml-3">
                    <Text className="text-xs text-gray-400">
                      Adresse e-mail
                    </Text>

                    <Text className="mt-1 font-medium text-gray-800">
                      {user.email}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <Phone size={19} color="#15803d" />

                  <View className="ml-3">
                    <Text className="text-xs text-gray-400">
                      Téléphone
                    </Text>

                    <Text className="mt-1 font-medium text-gray-800">
                      {user.phone}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Actions */}
            <Text className="mb-4 mt-8 text-lg font-bold text-gray-900">
              Mon activité
            </Text>

            <ProfileAction
              icon={<Package size={21} color="#15803d" />}
              title="Mes produits"
              subtitle="Consulter et gérer mes annonces"
              onPress={() => router.push('/(tabs)/my-products')}
            />

            <ProfileAction
              icon={<Heart size={21} color="#15803d" />}
              title="Mes favoris"
              subtitle="Retrouver mes produits enregistrés"
              onPress={() => router.push('/(tabs)/favorites')}
            />

            {/* Déconnexion */}
            <Pressable
              onPress={handleLogout}
              disabled={isLoggingOut}
              className="mt-7 flex-row items-center justify-center rounded-xl border border-red-100 bg-white py-4"
            >
              {isLoggingOut ? (
                <ActivityIndicator color="#DC2626" />
              ) : (
                <>
                  <LogOut size={19} color="#DC2626" />

                  <Text className="ml-2 font-bold text-red-600">
                    Se déconnecter
                  </Text>
                </>
              )}
            </Pressable>
          </>
        ) : (
          <>
            {/* Mode invité */}
            <View className="mt-8 items-center rounded-2xl bg-white px-6 py-10">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-green-50">
                <Store size={38} color="#15803d" />
              </View>

              <Text className="mt-5 text-xl font-bold text-gray-900">
                Bienvenue sur Hannout
              </Text>

              <Text className="mt-3 text-center leading-6 text-gray-500">
                Connectez-vous pour publier vos produits,
                gérer vos favoris et accéder à votre espace personnel.
              </Text>

              <Pressable
                onPress={navigateToLogin}
                className="mt-7 w-full flex-row items-center justify-center rounded-xl bg-green-700 py-4"
              >
                <LogIn size={19} color="#FFFFFF" />

                <Text className="ml-2 font-bold text-white">
                  Se connecter
                </Text>
              </Pressable>

              <Pressable
                onPress={navigateToRegister}
                className="mt-3 w-full flex-row items-center justify-center rounded-xl border border-green-700 py-4"
              >
                <UserPlus size={19} color="#15803d" />

                <Text className="ml-2 font-bold text-green-700">
                  Créer un compte
                </Text>
              </Pressable>
            </View>
          </>
        )}

        <Text className="mt-10 text-center text-xs text-gray-400">
          Hannout · Votre marché local
        </Text>

      </View>
    </ScrollView>
  );
}
