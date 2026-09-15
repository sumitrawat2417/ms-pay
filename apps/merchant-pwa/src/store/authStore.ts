import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  merchantId: string | null;
  ownerName: string | null;
  storeName: string | null;
  storeQrToken: string | null;
  login: (merchantId: string, ownerName: string, storeName: string, storeQrToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      merchantId: null,
      ownerName: null,
      storeName: null,
      storeQrToken: null,
      login: (merchantId, ownerName, storeName, storeQrToken) => set({ 
        merchantId, 
        ownerName, 
        storeName, 
        storeQrToken, 
        isAuthenticated: true 
      }),
      logout: () => set({ 
        isAuthenticated: false, 
        merchantId: null, 
        ownerName: null, 
        storeName: null, 
        storeQrToken: null 
      }),
    }),
    { name: 'ms-merchant-auth' }
  )
);
