
import type { User } from '@/types/user';
import type { Seller } from '@/types/seller';

import { users as initialUsers } from '@/data/users';
import { sellers as initialSellers } from '@/data/sellers';

import {
  getStorageItem,
  setStorageItem,
} from '@/services/storage/storage';

import { STORAGE_KEYS } from '@/services/storage/storage-keys';

import {
  getSession,
  setSession,
  clearSession,
} from '@/services/auth/session-storage';

export type AuthenticatedUser = Omit<User, 'password'>;

function toAuthenticatedUser(user: User): AuthenticatedUser {
  const { password, ...authenticatedUser } = user;
  return authenticatedUser;
}

export async function login(
  email: string,
  password: string
): Promise<AuthenticatedUser> {
  const storedUsers = await getStorageItem<User[]>(
    STORAGE_KEYS.USERS,
    initialUsers
  );

  const user = storedUsers.find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password
  );

  if (!user) {
    throw new Error('Email ou mot de passe incorrect.');
  }

  await setSession(user.id);

  return toAuthenticatedUser(user);
}

export async function register(
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<AuthenticatedUser> {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();

  if (!normalizedName || !normalizedEmail || !normalizedPhone || !password) {
    throw new Error('Veuillez remplir tous les champs.');
  }

  const storedUsers = await getStorageItem<User[]>(
    STORAGE_KEYS.USERS,
    initialUsers
  );

  const emailAlreadyExists = storedUsers.some(
    (user) => user.email.toLowerCase() === normalizedEmail
  );

  if (emailAlreadyExists) {
    throw new Error('Cette adresse e-mail est déjà utilisée.');
  }

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    password,
    createdAt: new Date().toISOString(),
  };

  // Récupérer les vendeurs et la ville actuelle.
  const [storedSellers, currentCity] = await Promise.all([
    getStorageItem<Seller[]>(
      STORAGE_KEYS.SELLERS,
      initialSellers
    ),
    getStorageItem<string>(
      STORAGE_KEYS.CITY,
      'Oujda'
    ),
  ]);

  // Créer automatiquement le profil vendeur.
  const newSeller: Seller = {
    id: `seller-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: newUser.id,
    name: normalizedName,
    description: '',
    phone: normalizedPhone,
    city: currentCity,
    image: null,
    createdAt: new Date().toISOString(),
  };

  // Enregistrer le compte et son profil vendeur.
  await setStorageItem(
    STORAGE_KEYS.USERS,
    [...storedUsers, newUser]
  );

  await setStorageItem(
    STORAGE_KEYS.SELLERS,
    [...storedSellers, newSeller]
  );

  // Connecter automatiquement le nouvel utilisateur.
  await setSession(newUser.id);

  return toAuthenticatedUser(newUser);
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const storedUsers = await getStorageItem<User[]>(
    STORAGE_KEYS.USERS,
    initialUsers
  );

  const user = storedUsers.find(
    (item) => item.id === session.userId
  );

  if (!user) {
    await clearSession();
    return null;
  }

  return toAuthenticatedUser(user);
}

export async function logout(): Promise<void> {
  await clearSession();
}
