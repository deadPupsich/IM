import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomField } from '../types/settings.ts';

// Дефолтные базовые поля
export const DEFAULT_BASE_FIELDS: CustomField[] = [
  {
    id: 'title',
    name: 'Название',
    slug: 'title',
    type: 'string',
    icon: 'FileText',
    iconColor: '#3b82f6',
    required: true,
    description: 'Название инцидента',
  },
  {
    id: 'assignee',
    name: 'Ответственный',
    slug: 'assignee',
    type: 'string',
    icon: 'User',
    iconColor: '#22c55e',
    required: true,
    description: 'Ответственный аналитик',
  },
  {
    id: 'source',
    name: 'Источник',
    slug: 'source',
    type: 'select',
    icon: 'Database',
    iconColor: '#f97316',
    required: true,
    description: 'Источник обнаружения инцидента',
    selectOptions: [
      { label: 'SIEM', borderColor: '#3b82f6', textColor: '#3b82f6', bgColor: '#dbeafe' },
      { label: 'Firewall', borderColor: '#ef4444', textColor: '#ef4444', bgColor: '#fee2e2' },
      { label: 'DLP System', borderColor: '#a855f7', textColor: '#a855f7', bgColor: '#f3e8ff' },
      { label: 'Antivirus', borderColor: '#22c55e', textColor: '#22c55e', bgColor: '#dcfce7' },
      { label: 'Network Monitor', borderColor: '#06b6d4', textColor: '#06b6d4', bgColor: '#cffafe' },
      { label: 'Email Gateway', borderColor: '#f59e0b', textColor: '#f59e0b', bgColor: '#fef3c7' },
      { label: 'UEBA', borderColor: '#8b5cf6', textColor: '#8b5cf6', bgColor: '#ede9fe' },
      { label: 'EDR', borderColor: '#ec4899', textColor: '#ec4899', bgColor: '#fce7f3' },
      { label: 'WAF', borderColor: '#14b8a6', textColor: '#14b8a6', bgColor: '#ccfbf1' },
      { label: 'Resource Monitor', borderColor: '#6366f1', textColor: '#6366f1', bgColor: '#e0e7ff' },
      { label: 'Device Control', borderColor: '#84cc16', textColor: '#84cc16', bgColor: '#ecfccb' },
      { label: 'Email Security', borderColor: '#0ea5e9', textColor: '#0ea5e9', bgColor: '#e0f2fe' },
    ],
  },
  {
    id: 'host',
    name: 'Хост',
    slug: 'host',
    type: 'string',
    icon: 'Server',
    iconColor: '#6366f1',
    required: true,
    description: 'Хост или устройство',
  },
  {
    id: 'login',
    name: 'Login',
    slug: 'login',
    type: 'string',
    icon: 'Key',
    iconColor: '#f59e0b',
    required: true,
    description: 'Учетная запись пользователя',
  },
  {
    id: 'status',
    name: 'Статус',
    slug: 'status',
    type: 'select',
    icon: 'CircleCheck',
    iconColor: '#22c55e',
    required: true,
    description: 'Статус инцидента',
    selectOptions: [
      { label: 'Открыт', borderColor: '#3b82f6', textColor: '#3b82f6', bgColor: '#dbeafe' },
      { label: 'В работе', borderColor: '#f59e0b', textColor: '#f59e0b', bgColor: '#fef3c7' },
      { label: 'Расследование', borderColor: '#a855f7', textColor: '#a855f7', bgColor: '#f3e8ff' },
      { label: 'Закрыт', borderColor: '#22c55e', textColor: '#22c55e', bgColor: '#dcfce7' },
    ],
  },
  {
    id: 'date',
    name: 'Дата',
    slug: 'date',
    type: 'datetime',
    icon: 'Calendar',
    iconColor: '#06b6d4',
    required: true,
    description: 'Дата и время инцидента',
  },
];

// Дефолтные дополнительные поля для типов инцидентов
export const DEFAULT_EXTRA_FIELDS: Record<string, CustomField[]> = {
  security: [
    {
      id: 'priority',
      name: 'Приоритет',
      slug: 'priority',
      type: 'select',
      icon: 'Flag',
      iconColor: '#ef4444',
      required: true,
      description: 'Приоритет инцидента',
      selectOptions: [
        { label: 'Критический', borderColor: '#ef4444', textColor: '#ef4444', bgColor: '#fee2e2' },
        { label: 'Высокий', borderColor: '#f97316', textColor: '#f97316', bgColor: '#ffedd5' },
        { label: 'Средний', borderColor: '#f59e0b', textColor: '#f59e0b', bgColor: '#fef3c7' },
        { label: 'Низкий', borderColor: '#22c55e', textColor: '#22c55e', bgColor: '#dcfce7' },
      ],
    },
    {
      id: 'detected_at',
      name: 'Дата обнаружения',
      slug: 'detected_at',
      type: 'datetime',
      icon: 'Clock',
      iconColor: '#06b6d4',
      required: true,
      description: 'Дата и время обнаружения',
    },
    {
      id: 'description',
      name: 'Описание',
      slug: 'description',
      type: 'multiline',
      icon: 'FileText',
      iconColor: '#3b82f6',
      required: true,
      description: 'Подробное описание инцидента',
    },
    {
      id: 'response_time',
      name: 'Время реакции (мин)',
      slug: 'response_time',
      type: 'number',
      icon: 'Timer',
      iconColor: '#f59e0b',
      required: false,
      description: 'Время реакции в минутах',
      prefix: 'мин',
    },
    {
      id: 'needs_escalation',
      name: 'Требуется эскалация',
      slug: 'needs_escalation',
      type: 'boolean',
      icon: 'ArrowUpRight',
      iconColor: '#a855f7',
      required: false,
      description: 'Требуется ли эскалация',
    },
    {
      id: 'affected_systems',
      name: 'Затронутые системы',
      slug: 'affected_systems',
      type: 'string',
      icon: 'Network',
      iconColor: '#6366f1',
      required: false,
      description: 'Список затронутых систем',
    },
  ],
  dlp: [
    {
      id: 'priority',
      name: 'Приоритет',
      slug: 'priority',
      type: 'select',
      icon: 'Flag',
      iconColor: '#ef4444',
      required: true,
      description: 'Приоритет инцидента',
      selectOptions: [
        { label: 'Критический', borderColor: '#ef4444', textColor: '#ef4444', bgColor: '#fee2e2' },
        { label: 'Высокий', borderColor: '#f97316', textColor: '#f97316', bgColor: '#ffedd5' },
        { label: 'Средний', borderColor: '#f59e0b', textColor: '#f59e0b', bgColor: '#fef3c7' },
        { label: 'Низкий', borderColor: '#22c55e', textColor: '#22c55e', bgColor: '#dcfce7' },
      ],
    },
    {
      id: 'detected_at',
      name: 'Дата обнаружения',
      slug: 'detected_at',
      type: 'datetime',
      icon: 'Clock',
      iconColor: '#06b6d4',
      required: true,
      description: 'Дата и время обнаружения',
    },
    {
      id: 'description',
      name: 'Описание',
      slug: 'description',
      type: 'multiline',
      icon: 'FileText',
      iconColor: '#3b82f6',
      required: true,
      description: 'Подробное описание инцидента',
    },
    {
      id: 'response_time',
      name: 'Время реакции (мин)',
      slug: 'response_time',
      type: 'number',
      icon: 'Timer',
      iconColor: '#f59e0b',
      required: false,
      description: 'Время реакции в минутах',
      prefix: 'мин',
    },
    {
      id: 'needs_escalation',
      name: 'Требуется эскалация',
      slug: 'needs_escalation',
      type: 'boolean',
      icon: 'ArrowUpRight',
      iconColor: '#a855f7',
      required: false,
      description: 'Требуется ли эскалация',
    },
    {
      id: 'affected_systems',
      name: 'Затронутые системы',
      slug: 'affected_systems',
      type: 'string',
      icon: 'Network',
      iconColor: '#6366f1',
      required: false,
      description: 'Список затронутых систем',
    },
  ],
  network: [
    {
      id: 'priority',
      name: 'Приоритет',
      slug: 'priority',
      type: 'select',
      icon: 'Flag',
      iconColor: '#ef4444',
      required: true,
      description: 'Приоритет инцидента',
      selectOptions: [
        { label: 'Критический', borderColor: '#ef4444', textColor: '#ef4444', bgColor: '#fee2e2' },
        { label: 'Высокий', borderColor: '#f97316', textColor: '#f97316', bgColor: '#ffedd5' },
        { label: 'Средний', borderColor: '#f59e0b', textColor: '#f59e0b', bgColor: '#fef3c7' },
        { label: 'Низкий', borderColor: '#22c55e', textColor: '#22c55e', bgColor: '#dcfce7' },
      ],
    },
    {
      id: 'detected_at',
      name: 'Дата обнаружения',
      slug: 'detected_at',
      type: 'datetime',
      icon: 'Clock',
      iconColor: '#06b6d4',
      required: true,
      description: 'Дата и время обнаружения',
    },
    {
      id: 'description',
      name: 'Описание',
      slug: 'description',
      type: 'multiline',
      icon: 'FileText',
      iconColor: '#3b82f6',
      required: true,
      description: 'Подробное описание инцидента',
    },
    {
      id: 'response_time',
      name: 'Время реакции (мин)',
      slug: 'response_time',
      type: 'number',
      icon: 'Timer',
      iconColor: '#f59e0b',
      required: false,
      description: 'Время реакции в минутах',
      prefix: 'мин',
    },
    {
      id: 'needs_escalation',
      name: 'Требуется эскалация',
      slug: 'needs_escalation',
      type: 'boolean',
      icon: 'ArrowUpRight',
      iconColor: '#a855f7',
      required: false,
      description: 'Требуется ли эскалация',
    },
    {
      id: 'affected_systems',
      name: 'Затронутые системы',
      slug: 'affected_systems',
      type: 'string',
      icon: 'Network',
      iconColor: '#6366f1',
      required: false,
      description: 'Список затронутых систем',
    },
  ],
  malware: [
    {
      id: 'priority',
      name: 'Приоритет',
      slug: 'priority',
      type: 'select',
      icon: 'Flag',
      iconColor: '#ef4444',
      required: true,
      description: 'Приоритет инцидента',
      selectOptions: [
        { label: 'Критический', borderColor: '#ef4444', textColor: '#ef4444', bgColor: '#fee2e2' },
        { label: 'Высокий', borderColor: '#f97316', textColor: '#f97316', bgColor: '#ffedd5' },
        { label: 'Средний', borderColor: '#f59e0b', textColor: '#f59e0b', bgColor: '#fef3c7' },
        { label: 'Низкий', borderColor: '#22c55e', textColor: '#22c55e', bgColor: '#dcfce7' },
      ],
    },
    {
      id: 'detected_at',
      name: 'Дата обнаружения',
      slug: 'detected_at',
      type: 'datetime',
      icon: 'Clock',
      iconColor: '#06b6d4',
      required: true,
      description: 'Дата и время обнаружения',
    },
    {
      id: 'description',
      name: 'Описание',
      slug: 'description',
      type: 'multiline',
      icon: 'FileText',
      iconColor: '#3b82f6',
      required: true,
      description: 'Подробное описание инцидента',
    },
    {
      id: 'response_time',
      name: 'Время реакции (мин)',
      slug: 'response_time',
      type: 'number',
      icon: 'Timer',
      iconColor: '#f59e0b',
      required: false,
      description: 'Время реакции в минутах',
      prefix: 'мин',
    },
    {
      id: 'needs_escalation',
      name: 'Требуется эскалация',
      slug: 'needs_escalation',
      type: 'boolean',
      icon: 'ArrowUpRight',
      iconColor: '#a855f7',
      required: false,
      description: 'Требуется ли эскалация',
    },
    {
      id: 'affected_systems',
      name: 'Затронутые системы',
      slug: 'affected_systems',
      type: 'string',
      icon: 'Network',
      iconColor: '#6366f1',
      required: false,
      description: 'Список затронутых систем',
    },
  ],
};

interface IncidentFieldsState {
  // Базовые поля (общие для всех типов)
  baseFields: CustomField[];
  // Дополнительные поля по типам инцидентов
  extraFields: Record<string, CustomField[]>;
  // Пользовательские поля (добавленные администратором)
  customFields: CustomField[];
  
  // Actions для базовых полей
  setBaseFields: (fields: CustomField[]) => void;
  
  // Actions для дополнительных полей по типам
  setExtraFields: (typeId: string, fields: CustomField[]) => void;
  addExtraField: (typeId: string, field: CustomField) => void;
  removeExtraField: (typeId: string, fieldId: string) => void;
  updateExtraField: (typeId: string, fieldId: string, updates: Partial<CustomField>) => void;
  
  // Actions для пользовательских полей
  addCustomField: (field: CustomField) => void;
  removeCustomField: (fieldId: string) => void;
  updateCustomField: (fieldId: string, updates: Partial<CustomField>) => void;
  
  // Утилиты
  getAllFieldsForType: (typeId: string) => CustomField[];
  getFieldBySlug: (slug: string, typeId?: string) => CustomField | null;
}

export const useIncidentFieldsStore = create<IncidentFieldsState>()(
  persist(
    (set, get) => ({
      baseFields: DEFAULT_BASE_FIELDS,
      extraFields: DEFAULT_EXTRA_FIELDS,
      customFields: [],
      
      setBaseFields: (fields) => set({ baseFields: fields }),
      
      setExtraFields: (typeId, fields) =>
        set((state) => ({
          extraFields: {
            ...state.extraFields,
            [typeId]: fields,
          },
        })),
      
      addExtraField: (typeId, field) =>
        set((state) => ({
          extraFields: {
            ...state.extraFields,
            [typeId]: [...(state.extraFields[typeId] ?? []), field],
          },
        })),
      
      removeExtraField: (typeId, fieldId) =>
        set((state) => ({
          extraFields: {
            ...state.extraFields,
            [typeId]: (state.extraFields[typeId] ?? []).filter((f) => f.id !== fieldId),
          },
        })),
      
      updateExtraField: (typeId, fieldId, updates) =>
        set((state) => ({
          extraFields: {
            ...state.extraFields,
            [typeId]: (state.extraFields[typeId] ?? []).map((f) =>
              f.id === fieldId ? { ...f, ...updates } : f
            ),
          },
        })),
      
      addCustomField: (field) =>
        set((state) => ({
          customFields: [...state.customFields, field],
        })),
      
      removeCustomField: (fieldId) =>
        set((state) => ({
          customFields: state.customFields.filter((f) => f.id !== fieldId),
        })),
      
      updateCustomField: (fieldId, updates) =>
        set((state) => ({
          customFields: state.customFields.map((f) =>
            f.id === fieldId ? { ...f, ...updates } : f
          ),
        })),
      
      getAllFieldsForType: (typeId) => {
        const { baseFields, extraFields, customFields } = get();
        const typeExtraFields = extraFields[typeId] ?? [];
        return [...baseFields, ...typeExtraFields, ...customFields];
      },
      
      getFieldBySlug: (slug, typeId) => {
        const { baseFields, extraFields, customFields } = get();
        const typeExtraFields = typeId ? (extraFields[typeId] ?? []) : [];
        const allFields = [...baseFields, ...typeExtraFields, ...customFields];
        return allFields.find((f) => f.slug === slug) ?? null;
      },
    }),
    {
      name: 'incident-fields-settings',
    }
  )
);
