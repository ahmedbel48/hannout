
import {
  getStorageItem,
  setStorageItem,
} from '@/services/storage/storage';

import { STORAGE_KEYS } from '@/services/storage/storage-keys';

/**
 * Structure des favoris :
 * Chaque utilisateur possède sa propre liste de produits.
 */
type FavoritesByUser = Record<string, string[]>;

/**
 * Récupérer les favoris de tous les utilisateurs.
 */
async function getAllFavorites(): Promise<FavoritesByUser> {
  return getStorageItem<FavoritesByUser>(
    STORAGE_KEYS.FAVORITES,
    {}
  );
}

/**
 * Récupérer les favoris d'un utilisateur.
 */
export async function getFavorites(
  userId: string
): Promise<string[]> {
  const favorites = await getAllFavorites();

  return favorites[userId] ?? [];
}

/**
 * Ajouter un produit aux favoris.
 */
export async function addFavorite(
  userId: string,
  productId: string
): Promise<void> {
  const favorites = await getAllFavorites();

  const userFavorites = favorites[userId] ?? [];

  if (userFavorites.includes(productId)) {
    return;
  }

  favorites[userId] = [...userFavorites, productId];

  await setStorageItem(STORAGE_KEYS.FAVORITES, favorites);
}

/**
 * Retirer un produit des favoris.
 */
export async function removeFavorite(
  userId: string,
  productId: string
): Promise<void> {
  const favorites = await getAllFavorites();

  const userFavorites = favorites[userId] ?? [];

  favorites[userId] = userFavorites.filter(
    (id) => id !== productId
  );

  await setStorageItem(STORAGE_KEYS.FAVORITES, favorites);
}

/**
 * Vérifier si un produit est dans les favoris.
 */
export async function isFavorite(
  userId: string,
  productId: string
): Promise<boolean> {
  const favorites = await getFavorites(userId);

  return favorites.includes(productId);
}
