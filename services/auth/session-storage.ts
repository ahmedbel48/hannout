
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from '@/services/storage/storage';

import { STORAGE_KEYS } from '@/services/storage/storage-keys';

export type Session = {
  userId: string;
};

/**
 * Récupérer la session actuelle.
 * Retourne null si aucun utilisateur n'est connecté.
 */
export async function getSession(): Promise<Session | null> {
  return getStorageItem<Session | null>(
    STORAGE_KEYS.SESSION,
    null
  );
}

/**
 * Enregistrer la session d'un utilisateur.
 */
export async function setSession(userId: string): Promise<void> {
  const session: Session = { userId };

  await setStorageItem(STORAGE_KEYS.SESSION, session);
}

/**
 * Déconnecter l'utilisateur.
 */
export async function clearSession(): Promise<void> {
  await removeStorageItem(STORAGE_KEYS.SESSION);
}
