import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  consumerName: string | null;
  merchantName: string | null;
  idQrToken: string | null;
  setConsumerName: (name: string) => void;
  setMerchantName: (name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      consumerName: null,
      merchantName: null,
      idQrToken: 'token_f3x9_demo', // mock token for now
      setConsumerName: (name) => set({ consumerName: name, isAuthenticated: true }),
      setMerchantName: (name) => set({ merchantName: name, isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false, consumerName: null, merchantName: null, idQrToken: null }),
    }),
    { name: 'ms-pay-auth' }
  )
);
