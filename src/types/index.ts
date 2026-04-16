export interface Product {
  id: string;
  name: string;
  nameHi: string;
  price: number;
  originalPrice?: number;
  description: string;
  descriptionHi: string;
  category: Category;
  emoji: string;
  image?: string;
  inStock: boolean;
  badge?: string;
}

export type Category =
  | 'all'
  | 'fashion'
  | 'footwear'
  | 'bags'
  | 'home'
  | 'kitchen'
  | 'plastic';

export interface CategoryMeta {
  id: Category;
  label: string;
  labelHi: string;
  emoji: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderPayload {
  items: { productId: string; quantity: number; price: number }[];
  delivery: 'delivery' | 'pickup';
  customer: CustomerInfo;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  address?: string;
}

export interface OrderResponse {
  order_ref: string;
  message: string;
}

export interface TrackingStatus {
  order_ref: string;
  status: OrderStatus;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  delivery: 'delivery' | 'pickup';
  payment_link?: string;
  tracking_info?: {
    carrier?: string;
    tracking_number?: string;
    estimated_delivery?: string;
  };
  updated_at: string;
  created_at: string;
}

export type OrderStatus =
  | 'verified'
  | 'accepted'
  | 'paid'
  | 'shipped'
  | 'delivered';

export type Language = 'en' | 'hi';
