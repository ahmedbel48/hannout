
import { Stack } from 'expo-router';
import { View, Text, TextInput, ScrollView, Image } from 'react-native';
import {
  Smartphone,
  Shirt,
  House,
  ShoppingBasket,
} from 'lucide-react-native';

import { products } from '@/data/products';

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Hannout',
          headerShown: false,
        }}
      />

      <ScrollView className="flex-1 bg-white">
        <View className="px-5 pt-16">

          {/* Header */}
          <Text className="text-3xl font-bold text-green-700">
            Hannout
          </Text>

          <Text className="mt-2 text-base text-gray-500">
            Tout ce que vous cherchez, près de chez vous.
          </Text>

          {/* Search */}
          <TextInput
            placeholder="Rechercher un produit..."
            placeholderTextColor="#9CA3AF"
            className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4"
          />

          {/* Categories */}
          <Text className="mt-8 text-xl font-bold text-gray-900">
            Catégories
          </Text>

          <View className="mt-5 flex-row flex-wrap justify-between">

            <View className="mb-3 w-[48%] rounded-2xl border border-gray-100 bg-green-50 p-5">
              <View className="h-14 w-14 items-center justify-center rounded-xl bg-white">
                <Smartphone size={28} color="#15803d" strokeWidth={1.8} />
              </View>
              <Text className="mt-3 font-bold text-gray-800">
                Électronique
              </Text>
            </View>

            <View className="mb-3 w-[48%] rounded-2xl border border-gray-100 bg-green-50 p-5">
              <View className="h-14 w-14 items-center justify-center rounded-xl bg-white">
                <Shirt size={28} color="#15803d" strokeWidth={1.8} />
              </View>
              <Text className="mt-3 font-bold text-gray-800">
                Vêtements
              </Text>
            </View>

            <View className="mb-3 w-[48%] rounded-2xl border border-gray-100 bg-green-50 p-5">
              <View className="h-14 w-14 items-center justify-center rounded-xl bg-white">
                <House size={28} color="#15803d" strokeWidth={1.8} />
              </View>
              <Text className="mt-3 font-bold text-gray-800">
                Maison
              </Text>
            </View>

            <View className="mb-3 w-[48%] rounded-2xl border border-gray-100 bg-green-50 p-5">
              <View className="h-14 w-14 items-center justify-center rounded-xl bg-white">
                <ShoppingBasket size={28} color="#15803d" strokeWidth={1.8} />
              </View>
              <Text className="mt-3 font-bold text-gray-800">
                Alimentation
              </Text>
            </View>

          </View>

          {/* Recent products */}
          <View className="mb-4 mt-8 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              Produits récents
            </Text>
            <Text className="text-sm font-semibold text-green-700">
              {products.length} produits
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => (
              <View
                key={product.id}
                className="mb-4 w-[48%] overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <Image
                  source={{ uri: product.image }}
                  className="h-36 w-full bg-gray-100"
                  resizeMode="cover"
                />

                <View className="p-3">
                  <Text
                    numberOfLines={1}
                    className="font-bold text-gray-900"
                  >
                    {product.title}
                  </Text>

                  <Text className="mt-2 text-lg font-bold text-green-700">
                    {product.price.toLocaleString('fr-FR')} DH
                  </Text>

                  <Text className="mt-1 text-xs text-gray-500">
                    {product.city}
                  </Text>

                  <Text className="mt-1 text-xs text-gray-400">
                    {product.sellerType === 'shop'
                      ? 'Magasin'
                      : 'Particulier'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </>
  );
}
