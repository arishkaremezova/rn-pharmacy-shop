import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { CartLine, Drug } from '../types/drug';

interface CartState {
  lines: Record<string, CartLine>;
  add: (drug: Drug) => void;
  remove: (drugId: string) => void;
  increment: (drugId: string) => void;
  decrement: (drugId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  lines: {},

  add: (drug) =>
    set((state) => {
      const quantity = (state.lines[drug.id]?.quantity ?? 0) + 1;
      if (quantity > drug.stock) return state;
      return { lines: { ...state.lines, [drug.id]: { drug, quantity } } };
    }),

  remove: (drugId) =>
    set((state) => {
      const lines = { ...state.lines };
      delete lines[drugId];
      return { lines };
    }),

  increment: (drugId) =>
    set((state) => {
      const line = state.lines[drugId];
      if (!line || line.quantity >= line.drug.stock) return state;
      return {
        lines: {
          ...state.lines,
          [drugId]: { ...line, quantity: line.quantity + 1 },
        },
      };
    }),

  decrement: (drugId) =>
    set((state) => {
      const line = state.lines[drugId];
      if (!line) return state;
      const lines = { ...state.lines };
      if (line.quantity === 1) {
        delete lines[drugId];
      } else {
        lines[drugId] = { ...line, quantity: line.quantity - 1 };
      }
      return { lines };
    }),

  clear: () => set({ lines: {} }),
}));

export const selectCartCount = (state: CartState): number =>
  Object.values(state.lines).reduce((sum, line) => sum + line.quantity, 0);

export const selectCartLines = (state: CartState): CartLine[] =>
  Object.values(state.lines);

export const useCartLines = () => useCartStore(useShallow(selectCartLines));
