
import { users } from '@/data/users';
import { sellers } from '@/data/sellers';
import { products } from '@/data/products';
import { categories } from '@/data/categories';

import {
  getStorageItem,
  setStorageItem,
} from '@/services/storage/storage';

import { STORAGE_KEYS } from '@/services/storage/storage-keys';

/**
 * Initialise une donnée uniquement si elle n'existe pas encore.
 */
async function initializeIfMissing<T>(
  key: string,
  initialValue: T
): Promise<void> {
  const existingValue = await getStorageItem<T | null>(key, null);

  if (existingValue === null) {
    await setStorageItem(key, initialValue);
  }
}

/**
 * Initialise les données locales de Hannout.
 */
export async function initializeStorage(): Promise<void> {
  await Promise.all([
    initializeIfMissing(STORAGE_KEYS.USERS, users),
    initializeIfMissing(STORAGE_KEYS.SELLERS, sellers),
    initializeIfMissing(STORAGE_KEYS.PRODUCTS, products),
    initializeIfMissing(STORAGE_KEYS.CATEGORIES, categories),
    initializeIfMissing(STORAGE_KEYS.CITY, 'Oujda'),
  ]);
}
