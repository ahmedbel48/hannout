
import type { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'product-1',
    title: 'iPhone 13',
    description: 'Smartphone Apple en très bon état',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
    ],
    categoryId: 'electronics',
    city: 'Oujda',
    sellerId: 'seller-1',
    publicationType: 'SHOP',
    status: 'AVAILABLE',
    createdAt: '2026-11-15T10:00:00.000Z',
    updatedAt: '2026-11-15T10:00:00.000Z',
  },
  {
    id: 'product-2',
    title: 'Chaussures Nike',
    description: 'Chaussures de sport confortables',
    price: 350,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    ],
    categoryId: 'clothing',
    city: 'Oujda',
    sellerId: 'seller-2',
    publicationType: 'INDIVIDUAL',
    status: 'AVAILABLE',
    createdAt: '2026-11-14T10:00:00.000Z',
    updatedAt: '2026-11-14T10:00:00.000Z',
  },
  {
    id: 'product-3',
    title: 'Canapé moderne',
    description: 'Canapé confortable pour salon',
    price: 2800,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    ],
    categoryId: 'home',
    city: 'Oujda',
    sellerId: 'seller-1',
    publicationType: 'SHOP',
    status: 'AVAILABLE',
    createdAt: '2026-11-13T10:00:00.000Z',
    updatedAt: '2026-11-13T10:00:00.000Z',
  },
  {
    id: 'product-4',
    title: 'Sac à dos',
    description: 'Sac pratique pour les déplacements',
    price: 180,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    ],
    categoryId: 'accessories',
    city: 'Oujda',
    sellerId: 'seller-2',
    publicationType: 'INDIVIDUAL',
    status: 'AVAILABLE',
    createdAt: '2026-11-12T10:00:00.000Z',
    updatedAt: '2026-11-12T10:00:00.000Z',
  },
];
