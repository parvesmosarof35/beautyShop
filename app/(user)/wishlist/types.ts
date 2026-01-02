export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size?: string;
  color?: string;
}

export interface WishlistState {
  items: WishlistItem[];
}
