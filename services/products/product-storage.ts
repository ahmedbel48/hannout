
import type { Product } from '@/types/product';

import { products as initialProducts } from '@/data/products';

import {
  getStorageItem,
  setStorageItem,
} from '@/services/storage/storage';

import { STORAGE_KEYS } from '@/services/storage/storage-keys';

/**
 * Récupérer les produits depuis AsyncStorage.
 */
export async function getProducts(): Promise<Product[]> {
  return getStorageItem<Product[]>(
    STORAGE_KEYS.PRODUCTS,
    initialProducts
  );
}

/**
 * Sauvegarder les produits dans AsyncStorage.
 */
export async function saveProducts(
  products: Product[]
): Promise<void> {
  await setStorageItem(STORAGE_KEYS.PRODUCTS, products);
}

/**
 * Tester la sauvegarde et la lecture des produits.
 * Les données originales sont restaurées à la fin.
 */
export async function testProductsPersistence(): Promise<boolean> {
  const originalProducts = await getProducts();

  if (originalProducts.length === 0) {
    return false;
  }

  const testTitle = `${originalProducts[0].title} - TEST`;

  const testProducts = originalProducts.map((product, index) =>
    index === 0
      ? { ...product, title: testTitle }
      : product
  );

  try {
    await saveProducts(testProducts);

    const savedProducts = await getProducts();

    return savedProducts[0]?.title === testTitle;
  } finally {
    await saveProducts(originalProducts);
  }
}
