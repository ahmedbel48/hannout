
export type PublicationType = 'SHOP' | 'INDIVIDUAL';

export type ProductStatus = 'AVAILABLE' | 'SOLD' | 'HIDDEN';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  city: string;
  sellerId: string;
  publicationType: PublicationType;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};
