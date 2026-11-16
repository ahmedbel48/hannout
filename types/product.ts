export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  city: string;
  sellerId: string;
  sellerType: "shop" | "individual";
  createdAt: string;
};