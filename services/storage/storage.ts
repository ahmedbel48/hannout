
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Récupérer une donnée sauvegardée.
 * Retourne la valeur par défaut si aucune donnée n'existe.
 */
export async function getStorageItem<T>(
  key: string,
  defaultValue: T
): Promise<T> {
  const storedValue = await AsyncStorage.getItem(key);

  if (storedValue === null) {
    return defaultValue;
  }

  return JSON.parse(storedValue) as T;
}

/**
 * Sauvegarder une donnée au format JSON.
 */
export async function setStorageItem<T>(
  key: string,
  value: T
): Promise<void> {
  const jsonValue = JSON.stringify(value);

  await AsyncStorage.setItem(key, jsonValue);
}

/**
 * Supprimer une donnée sauvegardée.
 */
export async function removeStorageItem(
  key: string
): Promise<void> {
  await AsyncStorage.removeItem(key);
}
