import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IncidentTypeId } from '../types/incident.ts';

export interface IncidentTypeDefinition {
  id: IncidentTypeId | string;
  label: string;
  description: string;
  fieldIds: string[]; // IDs полей, относящихся к этому типу
}

export const DEFAULT_INCIDENT_TYPES: IncidentTypeDefinition[] = [
  {
    id: 'security',
    label: 'Безопасность',
    description: 'Инциденты безопасности и несанкционированного доступа',
    fieldIds: ['priority', 'detected_at', 'description', 'response_time', 'needs_escalation', 'affected_systems'],
  },
  {
    id: 'dlp',
    label: 'DLP',
    description: 'Инциденты утечки и нарушения работы с данными',
    fieldIds: ['priority', 'detected_at', 'description', 'response_time', 'needs_escalation', 'affected_systems'],
  },
  {
    id: 'network',
    label: 'Сеть',
    description: 'Сетевые аномалии и подозрительная активность',
    fieldIds: ['priority', 'detected_at', 'description', 'response_time', 'needs_escalation', 'affected_systems'],
  },
  {
    id: 'malware',
    label: 'Вредоносное ПО',
    description: 'Детекты вредоносного ПО и заражения',
    fieldIds: ['priority', 'detected_at', 'description', 'response_time', 'needs_escalation', 'affected_systems'],
  },
];

interface IncidentTypesState {
  types: IncidentTypeDefinition[];
  
  // Actions
  setTypes: (types: IncidentTypeDefinition[]) => void;
  addType: (type: IncidentTypeDefinition) => void;
  removeType: (typeId: string) => void;
  updateType: (typeId: string, updates: Partial<IncidentTypeDefinition>) => void;
  
  // Утилиты
  getTypeById: (typeId: string) => IncidentTypeDefinition | null;
  getTypes: () => IncidentTypeDefinition[];
  getTypeFieldIds: (typeId: string) => string[];
}

export const useIncidentTypesStore = create<IncidentTypesState>()(
  persist(
    (set, get) => ({
      types: DEFAULT_INCIDENT_TYPES,
      
      setTypes: (types) => set({ types }),
      
      addType: (type) =>
        set((state) => ({
          types: [...state.types, type],
        })),
      
      removeType: (typeId) =>
        set((state) => ({
          types: state.types.filter((t) => t.id !== typeId),
        })),
      
      updateType: (typeId, updates) =>
        set((state) => ({
          types: state.types.map((t) =>
            t.id === typeId ? { ...t, ...updates } : t
          ),
        })),
      
      getTypeById: (typeId) => {
        const { types } = get();
        return types.find((t) => t.id === typeId) ?? null;
      },
      
      getTypes: () => {
        const { types } = get();
        return types;
      },
      
      getTypeFieldIds: (typeId) => {
        const type = get().getTypeById(typeId);
        return type?.fieldIds ?? [];
      },
    }),
    {
      name: 'incident-types-settings',
    }
  )
);
