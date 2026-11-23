
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  Package,
  Plus,
  RefreshCw,
} from 'lucide-react-native';

import { useAuth } from '@/contexts/auth-context';
import { getProducts } from '@/services/products/product-storage';
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

  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [isLoading, setIsLoading] = useState(true);
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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#15803d" />
        <Text className="mt-3 text-gray-500">
          Chargement de vos produits...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Package size={45} color="#9CA3AF" />

        <Text className="mt-4 text-xl font-bold text-gray-900">
          Connectez-vous
        </Text>

        <Text className="mt-2 text-center text-gray-500">
          Vous devez être connecté pour consulter vos annonces.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        <View className="px-5 pb-5 pt-16">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-gray-900">
                Mes produits
              </Text>

              <Text className="mt-2 text-gray-500">
                Gérez vos annonces sur Hannout.
              </Text>
            </View>

            <Pressable
              onPress={loadProducts}
              className="h-11 w-11 items-center justify-center rounded-xl bg-white"
            >
              <RefreshCw size={20} color="#15803d" />
            </Pressable>
          </View>

          {/* Résumé */}
          <View className="mt-6 rounded-2xl bg-green-700 p-5">
            <Text className="text-sm font-medium text-green-100">
              Total de mes annonces
            </Text>

            <Text className="mt-2 text-4xl font-bold text-white">
              {products.length}
            </Text>

            <Text className="mt-1 text-sm text-green-100">
              {counts.AVAILABLE} disponible(s)
            </Text>
          </View>

          {/* Filtres */}
          <Text className="mb-3 mt-7 text-lg font-bold text-gray-900">
            Mes annonces
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-1"
          >
            {filters.map((item) => {
              const isSelected = filter === item.value;

              return (
                <Pressable
                  key={item.value}
                  onPress={() => setFilter(item.value)}
                  className={`mr-2 rounded-full px-4 py-2.5 ${
                    isSelected ? 'bg-green-700' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {item.label} ({counts[item.value]})
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Erreur */}
          {error && (
            <View className="mt-5 rounded-xl bg-red-50 p-4">
              <Text className="text-red-700">{error}</Text>

              <Pressable onPress={loadProducts} className="mt-2">
                <Text className="font-bold text-red-700">
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
                />
              ))}
            </View>
          )}

          {/* Liste vide */}
          {!error && filteredProducts.length === 0 && (
            <View className="mt-8 items-center rounded-2xl bg-white px-6 py-10">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Package size={30} color="#9CA3AF" />
              </View>

              <Text className="mt-4 text-lg font-bold text-gray-900">
                {products.length === 0
                  ? 'Aucune annonce pour le moment'
                  : 'Aucun résultat'}
              </Text>

              <Text className="mt-2 text-center leading-6 text-gray-500">
                {products.length === 0
                  ? 'Vos produits publiés apparaîtront ici.'
                  : 'Aucune annonce ne correspond à ce filtre.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imageUri = product.images[0];

  return (
    <View className="mb-4 flex-row overflow-hidden rounded-2xl bg-white p-3">
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className="h-28 w-28 rounded-xl bg-gray-100"
          resizeMode="cover"
        />
      ) : (
        <View className="h-28 w-28 items-center justify-center rounded-xl bg-gray-100">
          <Package size={30} color="#9CA3AF" />
        </View>
      )}

      <View className="ml-3 flex-1 justify-center">
        <Text
          numberOfLines={2}
          className="font-bold text-gray-900"
        >
          {product.title}
        </Text>

        <Text className="mt-2 text-lg font-bold text-green-700">
          {product.price.toLocaleString('fr-MA')} DH
        </Text>

        <Text className="mt-1 text-xs text-gray-500">
          {product.city}
        </Text>

        <View className="mt-2 self-start">
          <Text
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[product.status]}`}
          >
            {statusLabels[product.status]}
          </Text>
        </View>
      </View>
    </View>
  );
}
