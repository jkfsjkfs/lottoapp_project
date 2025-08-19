import { create } from 'zustand';
import { setItem, getItem, removeItem } from '../services/storage/localStorage';
import { apiPost } from '../api/client';

function getToday() {
  return new Date().toISOString().split('T')[0]; // "2025-08-18"
}

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  init: async () => {
    const saved = await getItem('auth_user');
    const lastLoginDate = await getItem('last_login_date');

    if (saved && lastLoginDate) {
      if (lastLoginDate !== getToday()) {
        // 👇 si ya es otro día → logout
        await removeItem('auth_user');
        await removeItem('last_login_date');
        set({ user: null, loading: false });
        return;
      }
      set({ user: saved, loading: false });
    } else {
      set({ loading: false });
    }
  },

  login: async (login, password) => {
    const profile = await apiPost('/auth/login', { login, password });
    set({ user: profile });
    await setItem('auth_user', profile);
    await setItem('last_login_date', getToday()); // 👈 guardamos solo la fecha
    return profile;
  },

  logout: async () => {
    set({ user: null });
    await removeItem('auth_user');
    await removeItem('last_login_date');
  },
}));
