
export type Seller = {
  id: string;
  userId: string;
  name: string;
  description: string;
  phone: string;
  country?: string;
  city: string;
  image: string | null;
  createdAt: string;
};
