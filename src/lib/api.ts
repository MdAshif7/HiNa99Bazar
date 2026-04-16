import { Product, OrderPayload, OrderResponse, TrackingStatus } from '@/types';
import { MOCK_PRODUCTS } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Catalog
export async function fetchCatalog(): Promise<Product[]> {
  if (!BASE_URL) return MOCK_PRODUCTS;
  return request<Product[]>('/api/catalog');
}

export async function fetchProduct(id: string): Promise<{ product: Product; related: Product[] }> {
  if (!BASE_URL) {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    const related = MOCK_PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== id
    ).slice(0, 4);
    return { product, related };
  }
  return request<{ product: Product; related: Product[] }>(`/api/catalog/${id}`);
}

// Orders
export async function placeOrder(payload: OrderPayload): Promise<OrderResponse> {
  if (!BASE_URL) {
    await new Promise((r) => setTimeout(r, 1200));
    return { order_ref: `HN${Date.now().toString().slice(-6)}`, message: 'OTP sent' };
  }
  return request<OrderResponse>('/api/order', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(order_ref: string, otp: string): Promise<{ success: boolean }> {
  if (!BASE_URL) {
    await new Promise((r) => setTimeout(r, 800));
    if (otp === '000000') throw new Error('Invalid OTP');
    return { success: true };
  }
  return request<{ success: boolean }>('/api/order/verify', {
    method: 'POST',
    body: JSON.stringify({ order_ref, otp }),
  });
}

export async function resendOtp(order_ref: string): Promise<{ success: boolean }> {
  if (!BASE_URL) {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true };
  }
  return request<{ success: boolean }>('/api/order/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ order_ref }),
  });
}

// Tracking
export async function trackOrder(order_ref: string): Promise<TrackingStatus> {
  if (!BASE_URL) {
    await new Promise((r) => setTimeout(r, 800));
    return {
      order_ref,
      status: 'accepted',
      customer: { name: 'Demo User', email: 'demo@email.com', phone: '9876543210' },
      items: [],
      total: 598,
      delivery: 'delivery',
      payment_link: 'https://razorpay.com/pay/demo',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
  }
  return request<TrackingStatus>(`/api/track/${order_ref}`);
}
