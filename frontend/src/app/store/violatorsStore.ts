import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Violator } from '../types/violator.ts';

// Начальные данные — примеры нарушителей
const INITIAL_VIOLATORS: Violator[] = [
  {
    id: 'v1',
    name: 'Иванов Иван Иванович',
    email: 'ivanov@corp.local',
    samAccountName: 'ivanov',
    domain: 'corp.local',
    дополнительныеПоля: {},
  },
  {
    id: 'v2',
    name: 'Петров Пётр Петрович',
    email: 'petrov@corp.local',
    samAccountName: 'petrov',
    domain: 'corp.local',
    дополнительныеПоля: {},
  },
];

interface ViolatorsState {
  violators: Violator[];
  addViolator: (violator: Violator) => void;
  updateViolator: (id: string, updates: Partial<Violator>) => void;
  removeViolator: (id: string) => void;
  getViolatorById: (id: string) => Violator | undefined;
}

export const useViolatorsStore = create<ViolatorsState>()(
  persist(
    (set, get) => ({
      violators: INITIAL_VIOLATORS,

      addViolator: (violator) =>
        set((state) => ({
          violators: [...state.violators, violator],
        })),

      updateViolator: (id, updates) =>
        set((state) => ({
          violators: state.violators.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        })),

      removeViolator: (id) =>
        set((state) => ({
          violators: state.violators.filter((v) => v.id !== id),
        })),

      getViolatorById: (id) => {
        return get().violators.find((v) => v.id === id);
      },
    }),
    {
      name: 'violators-settings',
    }
  )
);
