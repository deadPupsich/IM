import { BaseColumnKey, DynamicColumnKey, Incident, IncidentTypeId } from '../types/incident.ts';
import { useIncidentFieldsStore } from '../store/incidentFieldsStore.ts';
import { useIncidentTypesStore } from '../store/incidentTypesStore.ts';
import { getFileIcon } from '../features/incidents/utils/fileIcons.tsx';
import React from 'react';

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
  const extraFields = fieldsStore.getExtraFieldsByIds(type.fieldIds);
  const mappedExtraFields = extraFields
    .map((field) => ({
      id: field.id,
      label: field.name,
      width: 150,
    }));

  return {
    id: type.id,
    label: type.label,
    description: type.description,
    extraFields: mappedExtraFields,
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

  const extraFields = fieldsStore.getExtraFieldsByIds(type.fieldIds);
  return extraFields.map((field) => ({
    key: `custom:${field.id}` as DynamicColumnKey,
    label: field.name,
    width: 150,
    isDefault: false,
  }));
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
 * Получает значение колонки для инцидента как React элемент (для рендеринга в таблице)
 */
export function getIncidentColumnValueReact(incident: Incident, columnKey: DynamicColumnKey): React.ReactNode {
  if (columnKey.startsWith('custom:')) {
    const fieldId = columnKey.replace('custom:', '');
    const value = incident.дополнительныеПоля?.[fieldId];
    if (!value) return '—';
    
    // Проверяем, является ли поле типом file
    const fieldsStore = useIncidentFieldsStore.getState();
    const field = fieldsStore.getExtraFieldById(fieldId);
    
    if (field?.type === 'file') {
      const files = value.split(',').map(s => s.trim()).filter(s => s);
      if (files.length === 0) return '—';
      return (
        <div className="flex flex-wrap gap-1">
          {files.map((file, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {getFileIcon(file)}
              {file}
            </span>
          ))}
        </div>
      );
    }
    
    return value;
  }

  const value = incident[columnKey as BaseColumnKey];
  if (columnKey === 'списокФайлов' && Array.isArray(value)) {
    if (value.length === 0) return 'Нет файлов';
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((file, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {getFileIcon(file)}
            {file}
          </span>
        ))}
      </div>
    );
  }

  return String(value ?? '—');
}

/**
 * Хук для получения всех полей для типа инцидента
 * Используется в React компонентах
 */
export function useIncidentType(typeId: IncidentTypeId | string) {
  return useIncidentTypesStore((state) => state.getTypeById(typeId));
}
