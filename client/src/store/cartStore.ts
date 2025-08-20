import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: { id: string; name: string; price: number; description: string }, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getGST: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        
        return {
          items: [...state.items, {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            description: product.description
          }]
        };
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),
      
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter(item => item.id !== productId)
          };
        }
        
        return {
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        };
      }),
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getGST: () => {
        return get().getSubtotal() * 0.1;
      },
      
      getTotal: () => {
        return get().getSubtotal() + get().getGST();
      },
    }),
    {
      name: 'nk2it-cart',
    }
  )
);
