import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomField } from '../types/settings.ts';

// Базовые (системные) поля нарушителя
export const DEFAULT_VIOLATOR_BASE_FIELDS: CustomField[] = [
  {
    id: 'name',
    name: 'ФИО',
    type: 'string',
    icon: 'User',
    iconColor: '#3b82f6',
    required: true,
    description: 'Полное имя нарушителя',
  },
  {
    id: 'email',
    name: 'Email',
    type: 'string',
    icon: 'Mail',
    iconColor: '#22c55e',
    required: true,
    description: 'Электронная почта',
  },
  {
    id: 'samAccountName',
    name: 'SAM Account Name',
    type: 'string',
    icon: 'Key',
    iconColor: '#f59e0b',
    required: true,
    description: 'Имя учётной записи в AD',
  },
  {
    id: 'domain',
    name: 'Домен',
    type: 'string',
    icon: 'Server',
    iconColor: '#6366f1',
    required: true,
    description: 'Домен Active Directory',
  },
];

interface ViolatorFieldsState {
  baseFields: CustomField[];
  extraFields: CustomField[];

  setBaseFields: (fields: CustomField[]) => void;
  addExtraField: (field: CustomField) => void;
  removeExtraField: (fieldId: string) => void;
  updateExtraField: (fieldId: string, updates: Partial<CustomField>) => void;

  getExtraFieldById: (id: string) => CustomField | null;
  getExtraFieldsByIds: (ids: string[]) => CustomField[];
}

export const useViolatorFieldsStore = create<ViolatorFieldsState>()(
  persist(
    (set, get) => ({
      baseFields: DEFAULT_VIOLATOR_BASE_FIELDS,
      extraFields: [],

      setBaseFields: (fields) => set({ baseFields: fields }),

      addExtraField: (field) =>
        set((state) => ({
          extraFields: [...state.extraFields, field],
        })),

      removeExtraField: (fieldId) =>
        set((state) => ({
          extraFields: state.extraFields.filter((f) => f.id !== fieldId),
        })),

      updateExtraField: (fieldId, updates) =>
        set((state) => ({
          extraFields: state.extraFields.map((f) =>
            f.id === fieldId ? { ...f, ...updates } : f
          ),
        })),

      getExtraFieldById: (id) => {
        const { extraFields } = get();
        return extraFields.find((f) => f.id === id) ?? null;
      },

      getExtraFieldsByIds: (ids) => {
        const { extraFields } = get();
        return extraFields.filter((f) => ids.includes(f.id));
      },
    }),
    {
      name: 'violator-fields-settings',
    }
  )
);
