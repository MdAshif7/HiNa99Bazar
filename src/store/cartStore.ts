import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, Language } from '@/types';

interface CartState {
  items: CartItem[];
  language: Language;
  isCartOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleLanguage: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      language: 'en',
      isCartOpen: false,

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      setCartOpen: (open) => set({ isCartOpen: open }),

      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),

      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),

      getTotal: () => get().getSubtotal(),

      getItemCount: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    {
      name: 'hina99-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, language: state.language }),
    }
  )
);
