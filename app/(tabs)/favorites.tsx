
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  Heart,
  RefreshCw,
  Trash2,
  Package,
  MapPin,
  Store,
  ArrowRight,
} from 'lucide-react-native';

import { useRouter } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';
import { getProducts } from '@/services/products/product-storage';
import {
  getFavorites,
  removeFavorite,
} from '@/services/favorites/favorite-storage';

import type { Product } from '@/types/product';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const [favoriteIds, allProducts] = await Promise.all([
        getFavorites(user.id),
        getProducts(),
      ]);

      const favoriteProducts = allProducts.filter(
        (product) =>
          favoriteIds.includes(product.id) &&
          product.status !== 'HIDDEN'
      );

      setProducts(favoriteProducts);
    } catch (err) {
      console.error('Loading favorites error:', err);
      setError('Impossible de charger vos favoris.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading) {
      loadFavorites();
    }
  }, [isAuthLoading, loadFavorites]);

  const removeProduct = async (productId: string) => {
    if (!user) return;

    try {
      setRemovingId(productId);

      await removeFavorite(user.id, productId);

      setProducts((previous) =>
        previous.filter((product) => product.id !== productId)
      );
    } catch (err) {
      console.error('Remove favorite error:', err);

      Alert.alert(
        'Erreur',
        'Impossible de retirer ce produit des favoris.'
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleRemoveFavorite = (product: Product) => {
    Alert.alert(
      'Retirer des favoris',
      `Voulez-vous retirer "${product.title}" de vos favoris ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => {
            void removeProduct(product.id);
          },
        },
      ]
    );
  };

  if (isAuthLoading || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8F5]">
        <ActivityIndicator size="large" color="#15803D" />
        <Text className="mt-3 text-sm text-gray-500">
          Chargement de vos favoris...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8F5] px-6">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
          <Heart size={36} color="#15803D" />
        </View>

        <Text className="mt-5 text-xl font-extrabold text-gray-900">
          Vos favoris vous attendent
        </Text>

        <Text className="mt-2 text-center leading-6 text-gray-500">
          Connectez-vous pour retrouver tous les produits que vous avez enregistrés.
        </Text>

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="mt-6 flex-row items-center rounded-xl bg-green-700 px-6 py-4"
        >
          <Text className="font-bold text-white">
            Se connecter
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F7F8F5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        {/* Header */}
        <View className="bg-[#14532D] px-5 pb-8 pt-16">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-extrabold text-white">
                Mes favoris
              </Text>

              <Text className="mt-2 text-sm text-green-100">
                Retrouvez vos produits préférés.
              </Text>
            </View>

            <Pressable
              onPress={loadFavorites}
              disabled={isLoading}
              className="h-11 w-11 items-center justify-center rounded-xl bg-green-800"
            >
              <RefreshCw size={19} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Counter */}
          <View className="mt-6 flex-row items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-4">
            <View>
              <Text className="text-xs font-medium text-green-100">
                Produits enregistrés
              </Text>

              <Text className="mt-1 text-3xl font-extrabold text-white">
                {products.length}
              </Text>
            </View>

            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Heart size={25} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>
        </View>

        <View className="px-5 pt-6">
          {error && (
            <View className="rounded-2xl bg-red-50 p-4">
              <Text className="font-medium text-red-700">{error}</Text>

              <Pressable onPress={loadFavorites} className="mt-3">
                <Text className="font-bold text-red-700">
                  Réessayer
                </Text>
              </Pressable>
            </View>
          )}

          {!error && products.length > 0 && (
            <>
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-extrabold text-gray-900">
                  Ma sélection
                </Text>

                <Text className="text-xs text-gray-500">
                  {products.length} produit(s)
                </Text>
              </View>

              {products.map((product) => (
                <View
                  key={product.id}
                  className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3"
                  style={{
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.04,
                    shadowRadius: 7,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  <View className="flex-row">
                    {product.images[0] ? (
                      <Image
                        source={{ uri: product.images[0] }}
                        className="h-32 w-32 rounded-xl bg-gray-100"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="h-32 w-32 items-center justify-center rounded-xl bg-gray-100">
                        <Package size={32} color="#9CA3AF" />
                        <Text className="mt-1 text-[10px] text-gray-400">
                          Sans image
                        </Text>
                      </View>
                    )}

                    <View className="ml-3 flex-1 justify-between py-1">
                      <View>
                        <Text
                          numberOfLines={2}
                          className="text-sm font-bold leading-5 text-gray-900"
                        >
                          {product.title}
                        </Text>

                        <Text className="mt-2 text-lg font-extrabold text-green-700">
                          {product.price.toLocaleString('fr-MA')} DH
                        </Text>

                        <View className="mt-2 flex-row items-center">
                          <MapPin size={12} color="#9CA3AF" />
                          <Text className="ml-1 text-xs text-gray-500">
                            {product.city}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center">
                        <Store size={12} color="#9CA3AF" />
                        <Text className="ml-1 text-[11px] text-gray-500">
                          {product.publicationType === 'SHOP'
                            ? 'Magasin'
                            : 'Particulier'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mt-3 flex-row items-center justify-between border-t border-gray-100 pt-3">
                    <View className="rounded-lg bg-green-50 px-3 py-2">
                      <Text className="text-[11px] font-semibold text-green-800">
                        {product.status === 'SOLD' ? 'Vendu' : 'Dans vos favoris'}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => handleRemoveFavorite(product)}
                      disabled={removingId === product.id}
                      className="flex-row items-center rounded-lg bg-red-50 px-3 py-2"
                    >
                      {removingId === product.id ? (
                        <ActivityIndicator size="small" color="#DC2626" />
                      ) : (
                        <Trash2 size={15} color="#DC2626" />
                      )}

                      <Text className="ml-2 text-xs font-bold text-red-600">
                        Retirer
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </>
          )}

          {!error && products.length === 0 && (
            <View className="mt-8 items-center rounded-3xl border border-gray-100 bg-white px-6 py-12">
              <View className="h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
                <Heart size={36} color="#15803D" />
              </View>

              <Text className="mt-5 text-lg font-extrabold text-gray-900">
                Votre sélection est vide
              </Text>

              <Text className="mt-2 text-center text-sm leading-6 text-gray-500">
                Explorez les annonces et ajoutez vos produits préférés ici.
              </Text>

              <Pressable
                onPress={() => router.push('/(tabs)')}
                className="mt-6 flex-row items-center rounded-xl bg-green-700 px-5 py-3"
              >
                <Text className="mr-2 text-sm font-bold text-white">
                  Explorer les produits
                </Text>
                <ArrowRight size={17} color="#FFFFFF" />
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
