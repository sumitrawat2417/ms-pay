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

// Sync auth state with API client
import { setAuthUser } from '@ms-pay/api-client';

useAuthStore.subscribe((state) => {
  if (state.consumerId) {
    setAuthUser(state.consumerId);
  }
});

// Initialize on load
const initialState = useAuthStore.getState();
if (initialState.consumerId) {
  setAuthUser(initialState.consumerId);
}

