import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  consumerId: string | null;
  consumerName: string | null;
  idQrToken: string | null;
  login: (id: string, name: string, qrToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      consumerId: null,
      consumerName: null,
      idQrToken: null,
      login: (id, name, qrToken) =>
        set({ isAuthenticated: true, consumerId: id, consumerName: name, idQrToken: qrToken }),
      logout: () =>
        set({ isAuthenticated: false, consumerId: null, consumerName: null, idQrToken: null }),
    }),
    { name: 'ms-pay-auth' }
  )
);
