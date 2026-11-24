
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import {
  Package,
  RefreshCw,
  Trash2,
  MapPin,
  CheckCircle2,
  EyeOff,
  ShoppingBag,
  Plus,
} from 'lucide-react-native';

import { useAuth } from '@/contexts/auth-context';

import {
  getProducts,
  saveProducts,
} from '@/services/products/product-storage';

import { getStorageItem } from '@/services/storage/storage';
import { STORAGE_KEYS } from '@/services/storage/storage-keys';

import { sellers as initialSellers } from '@/data/sellers';

import type { Product, ProductStatus } from '@/types/product';
import type { Seller } from '@/types/seller';

type StatusFilter = 'ALL' | ProductStatus;

const filters: { label: string; value: StatusFilter }[] = [
  { label: 'Toutes', value: 'ALL' },
  { label: 'Disponibles', value: 'AVAILABLE' },
  { label: 'Vendues', value: 'SOLD' },
  { label: 'Masquées', value: 'HIDDEN' },
];

const statusLabels: Record<ProductStatus, string> = {
  AVAILABLE: 'Disponible',
  SOLD: 'Vendue',
  HIDDEN: 'Masquée',
};

const statusStyles: Record<ProductStatus, string> = {
  AVAILABLE: 'bg-green-50 text-green-700',
  SOLD: 'bg-blue-50 text-blue-700',
  HIDDEN: 'bg-gray-100 text-gray-600',
};

export default function MyProductsScreen() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const [allProducts, allSellers] = await Promise.all([
        getProducts(),
        getStorageItem<Seller[]>(
          STORAGE_KEYS.SELLERS,
          initialSellers
        ),
      ]);

      const currentSeller = allSellers.find(
        (seller) => seller.userId === user.id
      );

      if (!currentSeller) {
        setProducts([]);
        return;
      }

      const userProducts = allProducts.filter(
        (product) => product.sellerId === currentSeller.id
      );

      setProducts(userProducts);
    } catch (err) {
      console.error('Loading user products error:', err);
      setError('Impossible de charger vos produits.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading) {
      loadProducts();
    }
  }, [isAuthLoading, loadProducts]);

  const deleteProduct = async (productId: string) => {
    if (!user) return;

    try {
      setDeletingProductId(productId);

      const [allProducts, allSellers] = await Promise.all([
        getProducts(),
        getStorageItem<Seller[]>(
          STORAGE_KEYS.SELLERS,
          initialSellers
        ),
      ]);

      const currentSeller = allSellers.find(
        (seller) => seller.userId === user.id
      );

      if (!currentSeller) {
        throw new Error('Profil vendeur introuvable.');
      }

      const productToDelete = allProducts.find(
        (product) => product.id === productId
      );

      if (!productToDelete || productToDelete.sellerId !== currentSeller.id) {
        throw new Error('Vous ne pouvez pas supprimer ce produit.');
      }

      const updatedProducts = allProducts.filter(
        (product) => product.id !== productId
      );

      await saveProducts(updatedProducts);

      setProducts((previousProducts) =>
        previousProducts.filter((product) => product.id !== productId)
      );

      Alert.alert(
        'Annonce supprimée',
        'Votre annonce a été supprimée avec succès.'
      );
    } catch (err) {
      console.error('Delete product error:', err);

      Alert.alert(
        'Erreur',
        err instanceof Error
          ? err.message
          : 'Impossible de supprimer ce produit.'
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  const confirmDelete = (product: Product) => {
    Alert.alert(
      'Supprimer cette annonce ?',
      `Voulez-vous vraiment supprimer "${product.title}" ? Cette action est définitive.`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            void deleteProduct(product.id);
          },
        },
      ]
    );
  };

  const filteredProducts = useMemo(() => {
    if (filter === 'ALL') {
      return products;
    }

    return products.filter(
      (product) => product.status === filter
    );
  }, [products, filter]);

  const counts = useMemo(() => ({
    ALL: products.length,
    AVAILABLE: products.filter(
      (product) => product.status === 'AVAILABLE'
    ).length,
    SOLD: products.filter(
      (product) => product.status === 'SOLD'
    ).length,
    HIDDEN: products.filter(
      (product) => product.status === 'HIDDEN'
    ).length,
  }), [products]);

  if (isAuthLoading || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8F5]">
        <ActivityIndicator size="large" color="#15803D" />
        <Text className="mt-3 text-sm font-medium text-gray-500">
          Chargement de vos annonces...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8F5] px-7">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
          <Package size={36} color="#15803D" />
        </View>

        <Text className="mt-5 text-2xl font-bold text-gray-900">
          Vos annonces
        </Text>

        <Text className="mt-3 text-center text-sm leading-6 text-gray-500">
          Connectez-vous pour consulter et gérer les produits que vous avez publiés sur Hannout.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F7F8F5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* En-tête */}
        <View className="bg-[#14532D] px-5 pb-7 pt-16">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm font-medium text-green-200">
                ESPACE VENDEUR
              </Text>

              <Text className="mt-2 text-3xl font-bold text-white">
                Mes produits
              </Text>

              <Text className="mt-2 text-sm text-green-100">
                Gérez toutes vos annonces au même endroit.
              </Text>
            </View>

            <Pressable
              onPress={loadProducts}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Actualiser mes annonces"
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15"
            >
              <RefreshCw size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Résumé */}
          <View className="mt-6 flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-white p-4">
              <View className="flex-row items-center">
                <ShoppingBag size={17} color="#15803D" />
                <Text className="ml-2 text-xs font-medium text-gray-500">
                  Total annonces
                </Text>
              </View>

              <Text className="mt-3 text-3xl font-bold text-gray-900">
                {counts.ALL}
              </Text>

              <Text className="mt-1 text-xs text-gray-500">
                Toutes vos publications
              </Text>
            </View>

            <View className="flex-1 rounded-2xl bg-[#DCFCE7] p-4">
              <View className="flex-row items-center">
                <CheckCircle2 size={17} color="#15803D" />
                <Text className="ml-2 text-xs font-medium text-green-800">
                  Disponibles
                </Text>
              </View>

              <Text className="mt-3 text-3xl font-bold text-green-900">
                {counts.AVAILABLE}
              </Text>

              <Text className="mt-1 text-xs text-green-800">
                En vente actuellement
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-6">
          {/* Titre et bouton de publication */}
          <View className="mt-1 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">
                Vos annonces
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                Retrouvez et gérez vos publications.
              </Text>
            </View>

            <Pressable
              onPress={() => router.push('/products/create')}
              accessibilityRole="button"
              accessibilityLabel="Publier une annonce"
              className="ml-3 flex-row items-center rounded-xl bg-[#15803D] px-3 py-3"
            >
              <Plus size={17} color="#FFFFFF" />

              <Text className="ml-1 text-sm font-bold text-white">
                Publier
              </Text>
            </Pressable>
          </View>

          {/* Filtres */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-5"
            contentContainerStyle={{ gap: 9 }}
          >
            {filters.map((item) => {
              const isSelected = filter === item.value;

              return (
                <Pressable
                  key={item.value}
                  onPress={() => setFilter(item.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`flex-row items-center rounded-full px-4 py-3 ${
                    isSelected
                      ? 'bg-[#15803D]'
                      : 'border border-gray-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {item.label}
                  </Text>

                  <View
                    className={`ml-2 rounded-full px-2 py-0.5 ${
                      isSelected ? 'bg-white/20' : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {counts[item.value]}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Erreur */}
          {error && (
            <View className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
              <Text className="font-semibold text-red-700">
                Une erreur est survenue
              </Text>

              <Text className="mt-1 text-sm text-red-600">
                {error}
              </Text>

              <Pressable
                onPress={loadProducts}
                className="mt-3 self-start rounded-xl bg-red-100 px-4 py-2"
              >
                <Text className="text-sm font-bold text-red-700">
                  Réessayer
                </Text>
              </Pressable>
            </View>
          )}

          {/* Liste des produits */}
          {!error && filteredProducts.length > 0 && (
            <View className="mt-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={() => confirmDelete(product)}
                  isDeleting={deletingProductId === product.id}
                />
              ))}
            </View>
          )}

          {/* Liste vide */}
          {!error && filteredProducts.length === 0 && (
            <View className="mt-7 items-center rounded-3xl border border-gray-100 bg-white px-6 py-10">
              <View className="h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
                {filter === 'HIDDEN' ? (
                  <EyeOff size={34} color="#15803D" />
                ) : (
                  <Package size={34} color="#15803D" />
                )}
              </View>

              <Text className="mt-5 text-center text-lg font-bold text-gray-900">
                {products.length === 0
                  ? 'Aucune annonce pour le moment'
                  : 'Aucun résultat'}
              </Text>

              <Text className="mt-2 text-center text-sm leading-6 text-gray-500">
                {products.length === 0
                  ? 'Vos produits publiés apparaîtront ici.'
                  : 'Aucune annonce ne correspond à ce filtre.'}
              </Text>

              {products.length === 0 && (
                <Pressable
                  onPress={() => router.push('/products/create')}
                  className="mt-5 flex-row items-center rounded-xl bg-[#15803D] px-5 py-3"
                >
                  <Plus size={17} color="#FFFFFF" />

                  <Text className="ml-2 text-sm font-bold text-white">
                    Publier mon premier produit
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function ProductCard({
  product,
  onDelete,
  isDeleting,
}: {
  product: Product;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const imageUri = product.images[0];

  return (
    <View className="mb-4 overflow-hidden rounded-3xl border border-gray-100 bg-white p-3">
      <View className="flex-row">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="h-28 w-28 rounded-2xl bg-gray-100"
            resizeMode="cover"
          />
        ) : (
          <View className="h-28 w-28 items-center justify-center rounded-2xl bg-gray-100">
            <Package size={32} color="#9CA3AF" />
          </View>
        )}

        <View className="ml-3 flex-1 justify-center">
          <Text
            numberOfLines={2}
            className="text-base font-bold leading-5 text-gray-900"
          >
            {product.title}
          </Text>

          <Text className="mt-2 text-lg font-extrabold text-[#15803D]">
            {product.price.toLocaleString('fr-MA')} DH
          </Text>

          <View className="mt-2 flex-row items-center">
            <MapPin size={13} color="#9CA3AF" />
            <Text className="ml-1 text-xs text-gray-500">
              {product.city}
            </Text>
          </View>

          <View className="mt-2 self-start">
            <Text
              className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[product.status]}`}
            >
              {statusLabels[product.status]}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between border-t border-gray-100 pt-3">
        <Text className="text-xs font-medium text-gray-400">
          Gestion de l'annonce
        </Text>

        <Pressable
          onPress={onDelete}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel={`Supprimer ${product.title}`}
          className="flex-row items-center rounded-xl bg-red-50 px-3 py-2"
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <Trash2 size={15} color="#DC2626" />
          )}

          <Text className="ml-2 text-xs font-bold text-red-600">
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
