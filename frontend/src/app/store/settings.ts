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
    (set, get) => ({
      theme: 'light',
      itemsPerPage: 20,
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
    }),
    {
      name: 'app-settings',
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
