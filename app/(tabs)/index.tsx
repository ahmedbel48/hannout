
import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';

import {
  Smartphone,
  Shirt,
  House,
  ShoppingBasket,
  Plus,
  Heart,
  Search,
  MapPin,
  Store,
  X,
} from 'lucide-react-native';

import { useAuth } from '@/contexts/auth-context';
import { getProducts } from '@/services/products/product-storage';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '@/services/favorites/favorite-storage';

import {
  getStorageItem,
  setStorageItem,
} from '@/services/storage/storage';

import { STORAGE_KEYS } from '@/services/storage/storage-keys';
import LocationPicker from '@/components/location/location-picker';

import { categories } from '@/data/categories';
import type { Product } from '@/types/product';

const categoryFilters = [
  { id: 'electronics', label: 'Électronique', Icon: Smartphone },
  { id: 'clothing', label: 'Vêtements', Icon: Shirt },
  { id: 'home', label: 'Maison', Icon: House },
  { id: 'food', label: 'Alimentation', Icon: ShoppingBasket },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingFavoriteId, setLoadingFavoriteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [country, setCountry] = useState('Morocco');
  const [city, setCity] = useState('Oujda');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const [
          storedProducts,
          storedCountry,
          storedCity,
          storedFavorites,
        ] = await Promise.all([
          getProducts(),
          getStorageItem<string>(STORAGE_KEYS.COUNTRY, 'Morocco'),
          getStorageItem<string>(STORAGE_KEYS.CITY, 'Oujda'),
          user
            ? getFavorites(user.id)
            : Promise.resolve<string[]>([]),
        ]);

        setProducts(storedProducts);
        setCountry(storedCountry);
        setCity(storedCity);
        setFavoriteIds(storedFavorites);
      } catch (err) {
        console.error('Home loading error:', err);
        setError('Impossible de charger les produits.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  function handleLocationChange(
    nextCountry: string,
    nextCity: string
  ) {
    setCountry(nextCountry);
    setCity(nextCity);

    Promise.all([
      setStorageItem(STORAGE_KEYS.COUNTRY, nextCountry),
      setStorageItem(STORAGE_KEYS.CITY, nextCity),
    ]).catch((err) => {
      console.error('Location storage error:', err);
      Alert.alert(
        'Erreur',
        'Impossible de sauvegarder votre localisation.'
      );
    });
  }

  const visibleProducts = products.filter((product) => {
    if (product.status === 'HIDDEN') return false;

    const productCountry = (product.country ?? 'Morocco')
      .trim()
      .toLowerCase();

    const selectedCountry = country.trim().toLowerCase();

    const matchesCountry = productCountry === selectedCountry;

    const matchesCity =
      !city ||
      product.city.trim().toLowerCase() === city.trim().toLowerCase();

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !normalizedQuery ||
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.city.toLowerCase().includes(normalizedQuery) ||
      (product.country ?? 'Morocco')
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesCategory =
      !selectedCategory || product.categoryId === selectedCategory;

    return (
      matchesCountry &&
      matchesCity &&
      matchesSearch &&
      matchesCategory
    );
  });

  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((category) => category.id === categoryId)?.name ??
      'Autres'
    );
  };

  const handlePublish = () => {
    router.push('/products/create');
  };

  const handleFavorite = async (productId: string) => {
    if (!user) {
      Alert.alert(
        'Connexion nécessaire',
        'Connectez-vous pour ajouter des produits à vos favoris.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Se connecter',
            onPress: () => router.push('/(auth)/login'),
          },
        ]
      );
      return;
    }

    if (loadingFavoriteId) return;

    try {
      setLoadingFavoriteId(productId);

      const alreadyFavorite = favoriteIds.includes(productId);

      if (alreadyFavorite) {
        await removeFavorite(user.id, productId);
        setFavoriteIds((previous) =>
          previous.filter((id) => id !== productId)
        );
      } else {
        await addFavorite(user.id, productId);
        setFavoriteIds((previous) => [...previous, productId]);
      }
    } catch (err) {
      console.error('Favorite update error:', err);
      Alert.alert(
        'Erreur',
        'Impossible de modifier vos favoris. Réessayez.'
      );
    } finally {
      setLoadingFavoriteId(null);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        className="flex-1 bg-[#F7F8F5]"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="bg-[#14532D] px-5 pb-8 pt-16">
          <View className="flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center">
                <Store size={23} color="#FFFFFF" strokeWidth={2.2} />
                <Text className="ml-2 text-2xl font-extrabold tracking-wide text-white">
                  Hannout
                </Text>
              </View>

              <View className="mt-3 flex-row items-center">
                <MapPin size={14} color="#BBF7D0" />
                <Text className="ml-1 text-sm font-medium text-green-100">
                  {city ? `${city}, ${country}` : country}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/(tabs)/profile')}
              className="h-11 w-11 items-center justify-center rounded-full border border-green-300/30 bg-green-800"
            >
              <Text className="text-lg font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'H'}
              </Text>
            </Pressable>
          </View>

          <View className="mt-7">
            <Text className="text-2xl font-bold leading-9 text-white">
              Trouvez ce qu'il vous faut.
            </Text>
            <Text className="mt-1 text-sm text-green-100">
              Achetez et vendez près de chez vous.
            </Text>
          </View>

          {/* Search */}
          <View className="mt-6 h-14 flex-row items-center rounded-2xl bg-white px-4">
            <Search size={21} color="#64748B" />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Que recherchez-vous ?"
              placeholderTextColor="#94A3B8"
              returnKeyType="search"
              className="ml-3 flex-1 text-sm text-gray-900"
            />

            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={19} color="#64748B" />
              </Pressable>
            )}
          </View>
        </View>

        <View className="px-5 pb-10">
          {/* Publish banner */}
          <Pressable
            onPress={handlePublish}
            className="mt-5 flex-row items-center justify-between rounded-2xl bg-white p-4"
            style={{
              elevation: 2,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <View className="flex-1 flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <Plus size={25} color="#15803D" strokeWidth={2.5} />
              </View>

              <View className="ml-3 flex-1">
                <Text className="font-bold text-gray-900">
                  Vous avez quelque chose à vendre ?
                </Text>
                <Text className="mt-1 text-xs text-gray-500">
                  Publiez votre annonce gratuitement.
                </Text>
              </View>
            </View>

            <View className="ml-2 rounded-xl bg-green-700 px-3 py-2">
              <Text className="text-xs font-bold text-white">
                Publier
              </Text>
            </View>
          </Pressable>

          {/* Location selection */}
          <View className="mt-6 rounded-2xl border border-gray-100 bg-white p-4">
            <Text className="text-base font-extrabold text-gray-900">
              Votre zone de recherche
            </Text>
            <Text className="mt-1 text-xs text-gray-500">
              Choisissez le pays et la ville des annonces à afficher.
            </Text>

            <View className="mt-4">
              <LocationPicker
                country={country}
                city={city}
                onChange={handleLocationChange}
              />
            </View>
          </View>

          {/* Categories */}
          <View className="mb-4 mt-8 flex-row items-center justify-between">
            <Text className="text-lg font-extrabold text-gray-900">
              Catégories
            </Text>

            <Pressable onPress={() => setSelectedCategory(null)}>
              <Text className="text-xs font-semibold text-green-700">
                Tout voir
              </Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {categoryFilters.map(({ id, label, Icon }) => {
              const isSelected = selectedCategory === id;

              return (
                <Pressable
                  key={id}
                  onPress={() =>
                    setSelectedCategory(isSelected ? null : id)
                  }
                  className={`mr-3 w-[105px] items-center rounded-2xl border p-3 ${
                    isSelected
                      ? 'border-green-700 bg-green-50'
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <View
                    className={`h-12 w-12 items-center justify-center rounded-xl ${
                      isSelected ? 'bg-green-100' : 'bg-gray-50'
                    }`}
                  >
                    <Icon
                      size={25}
                      color={isSelected ? '#15803D' : '#64748B'}
                      strokeWidth={1.8}
                    />
                  </View>

                  <Text
                    numberOfLines={1}
                    className={`mt-2 text-xs font-semibold ${
                      isSelected ? 'text-green-800' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Products title */}
          <View className="mb-4 mt-9 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-extrabold text-gray-900">
                {searchQuery || selectedCategory
                  ? 'Résultats'
                  : 'Produits récents'}
              </Text>
              <Text className="mt-1 text-xs text-gray-500">
                {city
                  ? `Annonces à ${city}, ${country}`
                  : `Annonces au ${country}`}
              </Text>
            </View>

            <View className="rounded-full bg-green-50 px-3 py-2">
              <Text className="text-xs font-bold text-green-800">
                {visibleProducts.length} annonces
              </Text>
            </View>
          </View>

          {/* Product list */}
          {isLoading ? (
            <View className="items-center py-12">
              <ActivityIndicator size="large" color="#15803D" />
              <Text className="mt-3 text-sm text-gray-500">
                Chargement des produits...
              </Text>
            </View>
          ) : error ? (
            <View className="rounded-2xl bg-red-50 p-5">
              <Text className="text-center text-sm font-medium text-red-600">
                {error}
              </Text>
            </View>
          ) : visibleProducts.length === 0 ? (
            <View className="items-center rounded-2xl border border-gray-100 bg-white px-5 py-10">
              <Search size={35} color="#9CA3AF" />
              <Text className="mt-3 text-base font-bold text-gray-800">
                Aucun produit trouvé
              </Text>
              <Text className="mt-2 text-center text-sm text-gray-500">
                Aucune annonce dans cette zone pour le moment. Essayez une autre ville ou un autre pays.
              </Text>

              <Pressable
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="mt-5 rounded-xl bg-green-700 px-5 py-3"
              >
                <Text className="text-sm font-bold text-white">
                  Réinitialiser la recherche
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {visibleProducts.map((product) => {
                const isFavorite = favoriteIds.includes(product.id);
                const isUpdating = loadingFavoriteId === product.id;

                return (
                  <View
                    key={product.id}
                    className="mb-4 w-[48.5%] overflow-hidden rounded-2xl border border-gray-100 bg-white"
                    style={{
                      elevation: 2,
                      shadowColor: '#000',
                      shadowOpacity: 0.04,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                    }}
                  >
                    <View className="relative">
                      {product.images.length > 0 ? (
                        <Image
                          source={{ uri: product.images[0] }}
                          className="h-36 w-full bg-gray-100"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="h-36 w-full items-center justify-center bg-gray-100">
                          <Store size={30} color="#9CA3AF" />
                          <Text className="mt-2 text-xs text-gray-400">
                            Aucune image
                          </Text>
                        </View>
                      )}

                      <Pressable
                        onPress={() => handleFavorite(product.id)}
                        disabled={isUpdating}
                        accessibilityLabel={
                          isFavorite
                            ? 'Retirer des favoris'
                            : 'Ajouter aux favoris'
                        }
                        className="absolute right-2 top-2 h-9 w-9 items-center justify-center rounded-full bg-white"
                        style={{ elevation: 2 }}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#15803D" />
                        ) : (
                          <Heart
                            size={19}
                            color={isFavorite ? '#15803D' : '#64748B'}
                            fill={isFavorite ? '#15803D' : 'transparent'}
                          />
                        )}
                      </Pressable>

                      {product.status === 'SOLD' && (
                        <View className="absolute bottom-2 left-2 rounded-md bg-red-600 px-2 py-1">
                          <Text className="text-[10px] font-bold text-white">
                            VENDU
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="p-3">
                      <Text
                        numberOfLines={1}
                        className="text-sm font-semibold text-gray-800"
                      >
                        {product.title}
                      </Text>

                      <Text className="mt-2 text-base font-extrabold text-green-700">
                        {product.price.toLocaleString('fr-FR')} DH
                      </Text>

                      <View className="mt-2 flex-row items-center">
                        <MapPin size={12} color="#9CA3AF" />
                        <Text
                          numberOfLines={1}
                          className="ml-1 flex-1 text-[11px] text-gray-500"
                        >
                          {product.city}
                        </Text>
                      </View>

                      <View className="mt-2 flex-row items-center justify-between border-t border-gray-100 pt-2">
                        <Text
                          numberOfLines={1}
                          className="flex-1 text-[10px] text-gray-400"
                        >
                          {getCategoryName(product.categoryId)}
                        </Text>

                        <Text className="ml-1 text-[10px] font-medium text-gray-500">
                          {product.publicationType === 'SHOP'
                            ? 'Magasin'
                            : 'Particulier'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
