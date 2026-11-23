
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import {
  ArrowLeft,
  Camera,
  Check,
  ImagePlus,
  X,
} from 'lucide-react-native';

import { useAuth } from '@/contexts/auth-context';

import { categories as initialCategories } from '@/data/categories';
import { sellers as initialSellers } from '@/data/sellers';

import type { Category } from '@/types/category';
import type { Seller } from '@/types/seller';
import type {
  Product,
  PublicationType,
} from '@/types/product';

import { getProducts, saveProducts } from '@/services/products/product-storage';

import { getStorageItem } from '@/services/storage/storage';
import { STORAGE_KEYS } from '@/services/storage/storage-keys';

const MAX_IMAGES = 5;

export default function CreateProductScreen() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [publicationType, setPublicationType] =
    useState<PublicationType>('INDIVIDUAL');

  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [city, setCity] = useState('Oujda');

  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user, isAuthLoading]);

  useEffect(() => {
    async function loadFormData() {
      try {
        const [storedCategories, storedCity] = await Promise.all([
          getStorageItem<Category[]>(
            STORAGE_KEYS.CATEGORIES,
            initialCategories
          ),
          getStorageItem<string>(
            STORAGE_KEYS.CITY,
            'Oujda'
          ),
        ]);

        setCategories(storedCategories);
        setCity(storedCity);

        if (storedCategories.length > 0) {
          setCategoryId(storedCategories[0].id);
        }
      } catch (error) {
        console.error('Form data loading error:', error);
        Alert.alert(
          'Erreur',
          'Impossible de charger les données du formulaire.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadFormData();
  }, []);

  async function selectImages() {
    if (images.length >= MAX_IMAGES) {
      Alert.alert(
        'Limite atteinte',
        `Vous pouvez ajouter au maximum ${MAX_IMAGES} photos.`
      );
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission nécessaire',
        'Autorisez Hannout à accéder à votre galerie pour sélectionner des photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map(
        (asset) => asset.uri
      );

      setImages((currentImages) => [
        ...currentImages,
        ...selectedImages,
      ].slice(0, MAX_IMAGES));
    }
  }

  function removeImage(uri: string) {
    setImages((currentImages) =>
      currentImages.filter((image) => image !== uri)
    );
  }

  async function handlePublish() {
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const numericPrice = Number(price.replace(',', '.'));

    if (!normalizedTitle || !normalizedDescription || !price.trim()) {
      Alert.alert(
        'Champs obligatoires',
        'Veuillez remplir le titre, la description et le prix.'
      );
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      Alert.alert(
        'Prix invalide',
        'Veuillez saisir un prix supérieur à zéro.'
      );
      return;
    }

    if (!categoryId) {
      Alert.alert(
        'Catégorie obligatoire',
        'Veuillez sélectionner une catégorie.'
      );
      return;
    }

    if (images.length === 0) {
      Alert.alert(
        'Photo obligatoire',
        'Ajoutez au moins une photo de votre produit.'
      );
      return;
    }

    try {
      setIsPublishing(true);

      const storedSellers = await getStorageItem<Seller[]>(
        STORAGE_KEYS.SELLERS,
        initialSellers
      );

      const currentSeller = storedSellers.find(
        (seller) => seller.userId === user.id
      );

      if (!currentSeller) {
        Alert.alert(
          'Profil vendeur introuvable',
          'Votre profil vendeur doit être créé avant de publier.'
        );
        return;
      }

      const currentProducts = await getProducts();

      const now = new Date().toISOString();

      const newProduct: Product = {
        id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: normalizedTitle,
        description: normalizedDescription,
        price: numericPrice,
        images,
        categoryId,
        city: currentSeller.city || city,
        sellerId: currentSeller.id,
        publicationType,
        status: 'AVAILABLE',
        createdAt: now,
        updatedAt: now,
      };

      await saveProducts([
        newProduct,
        ...currentProducts,
      ]);

      Alert.alert(
        'Publication réussie',
        'Votre produit a été ajouté avec succès.',
        [
          {
            text: 'Voir mes produits',
            onPress: () => router.replace('/(tabs)/my-products'),
          },
        ]
      );
    } catch (error) {
      console.error('Product publication error:', error);

      Alert.alert(
        'Erreur',
        'Une erreur est survenue pendant la publication.'
      );
    } finally {
      setIsPublishing(false);
    }
  }

  if (isAuthLoading || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#15803d" />
        <Text className="mt-3 text-gray-500">
          Préparation du formulaire...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#15803d" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center border-b border-gray-100 bg-white px-5 pb-4 pt-14">
        <Pressable
          onPress={() => router.back()}
          className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
        >
          <ArrowLeft size={21} color="#111827" />
        </Pressable>

        <View>
          <Text className="text-xl font-bold text-gray-900">
            Publier un produit
          </Text>

          <Text className="mt-1 text-xs text-gray-500">
            Présentez votre produit aux acheteurs.
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingBottom: 45 }}
      >
        {/* Photos */}
        <Text className="mb-3 text-base font-bold text-gray-900">
          Photos du produit
        </Text>

        <Text className="mb-4 text-sm text-gray-500">
          Ajoutez jusqu'à 5 photos. Une bonne présentation attire les acheteurs.
        </Text>

        <View className="flex-row flex-wrap">
          {images.map((uri) => (
            <View
              key={uri}
              className="relative mb-3 mr-3"
            >
              <Image
                source={{ uri }}
                className="h-24 w-24 rounded-xl bg-gray-200"
              />

              <Pressable
                onPress={() => removeImage(uri)}
                className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full bg-red-600"
              >
                <X size={15} color="#FFFFFF" />
              </Pressable>
            </View>
          ))}

          {images.length < MAX_IMAGES && (
            <Pressable
              onPress={selectImages}
              className="mb-3 h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed border-green-300 bg-green-50"
            >
              <ImagePlus size={27} color="#15803d" />

              <Text className="mt-2 text-xs font-semibold text-green-700">
                Ajouter
              </Text>
            </Pressable>
          )}
        </View>

        {/* Informations */}
        <View className="mt-6">
          <Text className="mb-2 font-bold text-gray-900">
            Titre du produit *
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex : iPhone 13, canapé moderne..."
            maxLength={80}
            className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-900"
          />

          <Text className="mb-2 mt-5 font-bold text-gray-900">
            Description *
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre produit, son état et ses caractéristiques..."
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={1000}
            className="min-h-32 rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-900"
          />

          <Text className="mb-2 mt-5 font-bold text-gray-900">
            Prix en DH *
          </Text>

          <TextInput
            value={price}
            onChangeText={(value) =>
              setPrice(value.replace(/[^0-9.,]/g, ''))
            }
            placeholder="Ex : 450"
            keyboardType="decimal-pad"
            className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-900"
          />

          {/* Catégorie */}
          <Text className="mb-3 mt-6 font-bold text-gray-900">
            Catégorie *
          </Text>

          <View className="flex-row flex-wrap">
            {categories.map((category) => {
              const selected = categoryId === category.id;

              return (
                <Pressable
                  key={category.id}
                  onPress={() => setCategoryId(category.id)}
                  className={`mb-2 mr-2 flex-row items-center rounded-full border px-4 py-3 ${
                    selected
                      ? 'border-green-700 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {selected && (
                    <Check size={15} color="#15803d" />
                  )}

                  <Text
                    className={`ml-1 text-sm font-semibold ${
                      selected ? 'text-green-700' : 'text-gray-600'
                    }`}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Type de publication */}
          <Text className="mb-3 mt-6 font-bold text-gray-900">
            Type de publication *
          </Text>

          <View className="flex-row">
            <Pressable
              onPress={() => setPublicationType('INDIVIDUAL')}
              className={`mr-2 flex-1 rounded-xl border p-4 ${
                publicationType === 'INDIVIDUAL'
                  ? 'border-green-700 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text className="font-bold text-gray-900">
                Particulier
              </Text>

              <Text className="mt-1 text-xs text-gray-500">
                Vente personnelle
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setPublicationType('SHOP')}
              className={`flex-1 rounded-xl border p-4 ${
                publicationType === 'SHOP'
                  ? 'border-green-700 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text className="font-bold text-gray-900">
                Boutique
              </Text>

              <Text className="mt-1 text-xs text-gray-500">
                Vente professionnelle
              </Text>
            </Pressable>
          </View>

          {/* Ville */}
          <Text className="mb-2 mt-6 font-bold text-gray-900">
            Ville
          </Text>

          <View className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-4">
            <Text className="font-medium text-gray-700">
              {city}
            </Text>
          </View>

          {/* Bouton publication */}
          <Pressable
            onPress={handlePublish}
            disabled={isPublishing}
            className="mt-8 flex-row items-center justify-center rounded-xl bg-green-700 py-4"
          >
            {isPublishing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Camera size={19} color="#FFFFFF" />

                <Text className="ml-2 font-bold text-white">
                  Publier mon produit
                </Text>
              </>
            )}
          </Pressable>

          <Text className="mt-3 text-center text-xs text-gray-400">
            Les champs marqués d'un * sont obligatoires.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
