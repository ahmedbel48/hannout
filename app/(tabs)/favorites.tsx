
import { View, Text } from 'react-native';

export default function FavoritesScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-900">
        Mes favoris
      </Text>

      <Text className="mt-3 text-center text-gray-500">
        Retrouvez ici les produits que vous avez enregistrés.
      </Text>
    </View>
  );
}
