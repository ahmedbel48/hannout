
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
  Store,
  User,
  X,
  Tag,
} from 'lucide-react-native';

import { useAuth } from '@/contexts/auth-context';

import LocationPicker from '@/components/location/location-picker';

import { categories as initialCategories } from '@/data/categories';
import { sellers as initialSellers } from '@/data/sellers';

import type { Category } from '@/types/category';
import type { Seller } from '@/types/seller';
import type {
  Product,
  PublicationType,
} from '@/types/product';

import {
  getProducts,
  saveProducts,
} from '@/services/products/product-storage';

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

  const [country, setCountry] = useState('Morocco');
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
        const storedCategories = await getStorageItem<Category[]>(
          STORAGE_KEYS.CATEGORIES,
          initialCategories
        );

        const storedCity = await getStorageItem<string>(
          STORAGE_KEYS.CITY,
          'Oujda'
        );

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

    try {
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

        setImages((currentImages) => {
          const uniqueImages = selectedImages.filter(
            (uri) => !currentImages.includes(uri)
          );

          return [...currentImages, ...uniqueImages].slice(
            0,
            MAX_IMAGES
          );
        });
      }
    } catch (error) {
      console.error('Image selection error:', error);

      Alert.alert(
        'Erreur',
        'Impossible d’ouvrir votre galerie. Veuillez réessayer.'
      );
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

    if (!country || !city) {
      Alert.alert(
        'Localisation obligatoire',
        'Veuillez sélectionner un pays et une ville.'
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
        country,
        city,
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
      <View className="flex-1 items-center justify-center bg-[#F7F8F5]">
        <ActivityIndicator size="large" color="#15803D" />
        <Text className="mt-3 text-sm font-medium text-gray-500">
          Préparation du formulaire...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F8F5]">
        <ActivityIndicator size="large" color="#15803D" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F7F8F5]">
      {/* En-tête */}
      <View className="flex-row items-center bg-[#14532D] px-5 pb-5 pt-14">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-white/15"
        >
          <ArrowLeft size={21} color="#FFFFFF" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-xl font-bold text-white">
            Nouvelle annonce
          </Text>

          <Text className="mt-1 text-xs text-green-100">
            Présentez votre produit aux acheteurs.
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingTop: 20,
            paddingBottom: 45,
          }}
        >
          {/* Introduction */}
          <View className="mb-5">
            <Text className="text-2xl font-bold text-gray-900">
              Créez votre annonce
            </Text>

            <Text className="mt-2 text-sm leading-6 text-gray-500">
              Remplissez les informations ci-dessous pour présenter
              votre produit sur Hannout.
            </Text>
          </View>

          {/* Photos */}
          <View className="rounded-3xl border border-gray-100 bg-white p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <Camera size={20} color="#15803D" />
                </View>

                <View className="ml-3">
                  <Text className="font-bold text-gray-900">
                    Photos du produit *
                  </Text>

                  <Text className="mt-1 text-xs text-gray-500">
                    Montrez votre produit
                  </Text>
                </View>
              </View>

              <Text className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                {images.length}/{MAX_IMAGES}
              </Text>
            </View>

            <Text className="mb-4 mt-4 text-sm leading-5 text-gray-500">
              Ajoutez au moins une photo. Des images claires
              permettent aux acheteurs de mieux voir votre produit.
            </Text>

            <View className="flex-row flex-wrap">
              {images.map((uri, index) => (
                <View
                  key={uri}
                  className="relative mb-3 mr-3"
                >
                  <Image
                    source={{ uri }}
                    className="h-24 w-24 rounded-2xl bg-gray-100"
                    resizeMode="cover"
                  />

                  {index === 0 && (
                    <View className="absolute bottom-1 left-1 rounded-md bg-black/60 px-2 py-1">
                      <Text className="text-[9px] font-bold text-white">
                        PRINCIPALE
                      </Text>
                    </View>
                  )}

                  <Pressable
                    onPress={() => removeImage(uri)}
                    accessibilityRole="button"
                    accessibilityLabel={`Supprimer la photo ${index + 1}`}
                    className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-600"
                  >
                    <X size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}

              {images.length < MAX_IMAGES && (
                <Pressable
                  onPress={selectImages}
                  accessibilityRole="button"
                  accessibilityLabel="Ajouter des photos"
                  className="mb-3 h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50"
                >
                  <ImagePlus size={27} color="#15803D" />

                  <Text className="mt-2 text-xs font-bold text-green-700">
                    Ajouter
                  </Text>
                </Pressable>
              )}
            </View>

            {images.length === 0 && (
              <Text className="mt-1 text-xs text-orange-600">
                Une photo est obligatoire pour publier.
              </Text>
            )}
          </View>

          {/* Informations générales */}
          <View className="mt-5 rounded-3xl border border-gray-100 bg-white p-5">
            <View className="mb-5 flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <Tag size={20} color="#15803D" />
              </View>

              <View className="ml-3">
                <Text className="font-bold text-gray-900">
                  Informations du produit
                </Text>

                <Text className="mt-1 text-xs text-gray-500">
                  Décrivez ce que vous vendez.
                </Text>
              </View>
            </View>

            {/* Titre */}
            <View>
              <View className="mb-2 flex-row justify-between">
                <Text className="text-sm font-bold text-gray-800">
                  Nom du produit *
                </Text>

                <Text className="text-xs text-gray-400">
                  {title.length}/80
                </Text>
              </View>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex : iPhone 13, canapé moderne..."
                placeholderTextColor="#9CA3AF"
                maxLength={80}
                returnKeyType="next"
                className="rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-4 text-gray-900"
              />

              <Text className="mt-2 text-xs text-gray-400">
                Choisissez un titre court et précis.
              </Text>
            </View>

            {/* Description */}
            <View className="mt-5">
              <View className="mb-2 flex-row justify-between">
                <Text className="text-sm font-bold text-gray-800">
                  Description *
                </Text>

                <Text className="text-xs text-gray-400">
                  {description.length}/1000
                </Text>
              </View>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Décrivez l'état, les caractéristiques et les détails de votre produit..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={1000}
                className="min-h-32 rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-4 text-gray-900"
              />

              <Text className="mt-2 text-xs text-gray-400">
                Une bonne description aide les acheteurs à prendre leur décision.
              </Text>
            </View>

            {/* Prix */}
            <View className="mt-5">
              <Text className="mb-2 text-sm font-bold text-gray-800">
                Prix de vente *
              </Text>

              <View className="flex-row items-center rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4">
                <TextInput
                  value={price}
                  onChangeText={(value) =>
                    setPrice(value.replace(/[^0-9.,]/g, ''))
                  }
                  placeholder="Ex : 450"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  className="flex-1 py-4 text-lg font-bold text-gray-900"
                />

                <View className="rounded-xl bg-green-50 px-3 py-2">
                  <Text className="font-bold text-green-700">
                    DH
                  </Text>
                </View>
              </View>

              <Text className="mt-2 text-xs text-gray-400">
                Le prix est actuellement exprimé en dirhams marocains.
              </Text>
            </View>
          </View>

          {/* Catégorie */}
          <View className="mt-5 rounded-3xl border border-gray-100 bg-white p-5">
            <Text className="text-base font-bold text-gray-900">
              Catégorie *
            </Text>

            <Text className="mb-4 mt-1 text-sm text-gray-500">
              Choisissez la catégorie qui correspond à votre produit.
            </Text>

            <View className="flex-row flex-wrap">
              {categories.map((category) => {
                const selected = categoryId === category.id;

                return (
                  <Pressable
                    key={category.id}
                    onPress={() => setCategoryId(category.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    className={`mb-2 mr-2 flex-row items-center rounded-xl border px-3 py-3 ${
                      selected
                        ? 'border-green-700 bg-green-50'
                        : 'border-gray-200 bg-[#FAFAFA]'
                    }`}
                  >
                    {selected && (
                      <Check size={15} color="#15803D" />
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
          </View>

          {/* Type de publication */}
          <View className="mt-5 rounded-3xl border border-gray-100 bg-white p-5">
            <Text className="text-base font-bold text-gray-900">
              Type de publication *
            </Text>

            <Text className="mb-4 mt-1 text-sm text-gray-500">
              Précisez la nature de votre vente.
            </Text>

            <View className="flex-row">
              <Pressable
                onPress={() => setPublicationType('INDIVIDUAL')}
                accessibilityRole="button"
                accessibilityState={{
                  selected: publicationType === 'INDIVIDUAL',
                }}
                className={`mr-2 flex-1 rounded-2xl border p-4 ${
                  publicationType === 'INDIVIDUAL'
                    ? 'border-green-700 bg-green-50'
                    : 'border-gray-200 bg-[#FAFAFA]'
                }`}
              >
                <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-white">
                  <User
                    size={19}
                    color={
                      publicationType === 'INDIVIDUAL'
                        ? '#15803D'
                        : '#6B7280'
                    }
                  />
                </View>

                <Text className="font-bold text-gray-900">
                  Particulier
                </Text>

                <Text className="mt-1 text-xs leading-5 text-gray-500">
                  Vente personnelle
                </Text>

                {publicationType === 'INDIVIDUAL' && (
                  <View className="absolute right-3 top-3">
                    <Check size={17} color="#15803D" />
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => setPublicationType('SHOP')}
                accessibilityRole="button"
                accessibilityState={{
                  selected: publicationType === 'SHOP',
                }}
                className={`flex-1 rounded-2xl border p-4 ${
                  publicationType === 'SHOP'
                    ? 'border-green-700 bg-green-50'
                    : 'border-gray-200 bg-[#FAFAFA]'
                }`}
              >
                <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-white">
                  <Store
                    size={19}
                    color={
                      publicationType === 'SHOP'
                        ? '#15803D'
                        : '#6B7280'
                    }
                  />
                </View>

                <Text className="font-bold text-gray-900">
                  Boutique
                </Text>

                <Text className="mt-1 text-xs leading-5 text-gray-500">
                  Vente professionnelle
                </Text>

                {publicationType === 'SHOP' && (
                  <View className="absolute right-3 top-3">
                    <Check size={17} color="#15803D" />
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Localisation */}
          <View className="mt-5 rounded-3xl border border-gray-100 bg-white p-5">
            <Text className="mb-2 text-base font-bold text-gray-900">
              Localisation de l'annonce
            </Text>

            <Text className="mb-4 text-sm text-gray-500">
              Choisissez le pays et la ville où votre produit est disponible.
            </Text>

            <LocationPicker
              country={country}
              city={city}
              onChange={(selectedCountry, selectedCity) => {
                setCountry(selectedCountry);
                setCity(selectedCity);
              }}
            />
          </View>

          {/* Publication */}
          <View className="mt-6">
            <Pressable
              onPress={handlePublish}
              disabled={isPublishing}
              accessibilityRole="button"
              accessibilityLabel="Publier mon produit"
              className={`flex-row items-center justify-center rounded-2xl py-4 ${
                isPublishing ? 'bg-green-800' : 'bg-[#15803D]'
              }`}
            >
              {isPublishing ? (
                <>
                  <ActivityIndicator color="#FFFFFF" />

                  <Text className="ml-3 font-bold text-white">
                    Publication en cours...
                  </Text>
                </>
              ) : (
                <>
                  <Camera size={19} color="#FFFFFF" />

                  <Text className="ml-2 font-bold text-white">
                    Publier mon produit
                  </Text>
                </>
              )}
            </Pressable>

            <Text className="mt-4 text-center text-xs leading-5 text-gray-400">
              Les champs marqués d'un * sont obligatoires.
              {'\n'}
              Vérifiez vos informations avant de publier.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
