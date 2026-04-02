import { BaseColumnKey, DynamicColumnKey, Incident, IncidentTypeId } from '../types/incident.ts';
import { useIncidentFieldsStore } from '../store/incidentFieldsStore.ts';
import { useIncidentTypesStore } from '../store/incidentTypesStore.ts';

export interface IncidentColumnDefinition {
  key: DynamicColumnKey;
  label: string;
  width: number;
  isDefault: boolean;
}

export interface IncidentTypeFieldDefinition {
  id: string;
  label: string;
  width: number;
}

export interface IncidentTypeDefinition {
  id: IncidentTypeId | string;
  label: string;
  description: string;
  extraFields: IncidentTypeFieldDefinition[];
}

// Дефолтные колонки (для обратной совместимости)
export const DEFAULT_INCIDENT_COLUMNS: IncidentColumnDefinition[] = [
  { key: 'название', label: 'Название', width: 250, isDefault: true },
  { key: 'ответственный', label: 'Ответственный', width: 180, isDefault: true },
  { key: 'источник', label: 'Источник', width: 150, isDefault: true },
  { key: 'хост', label: 'Хост', width: 160, isDefault: true },
  { key: 'login', label: 'Login', width: 180, isDefault: true },
  { key: 'статус', label: 'Статус', width: 120, isDefault: true },
  { key: 'дата', label: 'Дата', width: 150, isDefault: true },
];

/**
 * Получает определение типа инцидента из store
 */
export function getIncidentTypeDefinition(typeId: IncidentTypeId | string): IncidentTypeDefinition | null {
  const type = useIncidentTypesStore.getState().getTypeById(typeId);
  if (!type) return null;

  const fieldsStore = useIncidentFieldsStore.getState();
  const extraFields = type.fieldIds
    .map((fieldId) => {
      const field = fieldsStore.getFieldBySlug(fieldId, typeId as string);
      if (!field) return null;
      return {
        id: field.slug,
        label: field.name,
        width: 150, // Дефолтная ширина, можно хранить в поле
      };
    })
    .filter((f): f is IncidentTypeFieldDefinition => f !== null);

  return {
    id: type.id,
    label: type.label,
    description: type.description,
    extraFields,
  };
}

/**
 * Получает дополнительные колонки для типа инцидента из store
 */
export function getExtraColumnDefinitions(typeId: IncidentTypeId | string): IncidentColumnDefinition[] {
  const fieldsStore = useIncidentFieldsStore.getState();
  const type = useIncidentTypesStore.getState().getTypeById(typeId);
  
  if (!type) {
    return [];
  }

  return type.fieldIds
    .map((fieldId) => {
      const field = fieldsStore.getFieldBySlug(fieldId, typeId as string);
      if (!field) return null;
      return {
        key: `custom:${field.slug}` as DynamicColumnKey,
        label: field.name,
        width: 150,
        isDefault: false,
      };
    })
    .filter((col): col is IncidentColumnDefinition => col !== null);
}

/**
 * Получает определение колонки по ключу
 */
export function getColumnDefinition(
  columnKey: DynamicColumnKey,
  incidentTypeId?: IncidentTypeId | null
): IncidentColumnDefinition | null {
  const defaultColumn = DEFAULT_INCIDENT_COLUMNS.find((column) => column.key === columnKey);
  if (defaultColumn) {
    return defaultColumn;
  }

  if (!incidentTypeId) {
    return null;
  }

  return getExtraColumnDefinitions(incidentTypeId).find((column) => column.key === columnKey) ?? null;
}

/**
 * Получает значение колонки для инцидента
 */
export function getIncidentColumnValue(incident: Incident, columnKey: DynamicColumnKey): string {
  if (columnKey.startsWith('custom:')) {
    const fieldId = columnKey.replace('custom:', '');
    return incident.дополнительныеПоля?.[fieldId] ?? '—';
  }

  const value = incident[columnKey as BaseColumnKey];
  if (columnKey === 'списокФайлов' && Array.isArray(value)) {
    return value.length > 0 ? `${value.length} файл(ов)` : 'Нет файлов';
  }

  return String(value ?? '—');
}

/**
 * Хук для получения всех полей для типа инцидента
 * Используется в React компонентах
 */
export function useFieldsForIncidentType(typeId: IncidentTypeId | string) {
  return useIncidentFieldsStore((state) => state.getAllFieldsForType(typeId as string));
}

/**
 * Хук для получения типа инцидента
 */
export function useIncidentType(typeId: IncidentTypeId | string) {
  return useIncidentTypesStore((state) => state.getTypeById(typeId));
}
