export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
  discount: number;
}
