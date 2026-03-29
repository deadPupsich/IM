import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppSettings {
  theme: 'light' | 'dark';
  itemsPerPage: number;
  setTheme: (theme: 'light' | 'dark') => void;
  setItemsPerPage: (count: number) => void;
}

export const useAppSettings = create<AppSettings>()(
  persist(
    (set) => ({
      theme: 'light',
      itemsPerPage: 20,
      setTheme: (theme) => set({ theme }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
    }),
    {
      name: 'app-settings',
    }
  )
);
