import { BaseColumnKey, DynamicColumnKey, Incident, IncidentTypeId } from '../types/incident.ts';

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
  id: IncidentTypeId;
  label: string;
  description: string;
  extraFields: IncidentTypeFieldDefinition[];
}

export const DEFAULT_INCIDENT_COLUMNS: IncidentColumnDefinition[] = [
  { key: 'название', label: 'Название', width: 250, isDefault: true },
  { key: 'ответственный', label: 'Ответственный', width: 180, isDefault: true },
  { key: 'источник', label: 'Источник', width: 150, isDefault: true },
  { key: 'хост', label: 'Хост', width: 160, isDefault: true },
  { key: 'login', label: 'Login', width: 180, isDefault: true },
  { key: 'статус', label: 'Статус', width: 120, isDefault: true },
  { key: 'дата', label: 'Дата', width: 150, isDefault: true },
];

export const INCIDENT_TYPE_DEFINITIONS: IncidentTypeDefinition[] = [
  {
    id: 'security',
    label: 'Безопасность',
    description: 'Инциденты безопасности и несанкционированного доступа',
    extraFields: [
      { id: 'priority', label: 'Приоритет', width: 120 },
      { id: 'detected_at', label: 'Дата обнаружения', width: 160 },
      { id: 'description', label: 'Описание', width: 250 },
      { id: 'response_time', label: 'Время реакции (мин)', width: 140 },
      { id: 'needs_escalation', label: 'Требуется эскалация', width: 140 },
      { id: 'affected_systems', label: 'Затронутые системы', width: 200 },
    ],
  },
  {
    id: 'dlp',
    label: 'DLP',
    description: 'Инциденты утечки и нарушения работы с данными',
    extraFields: [
      { id: 'priority', label: 'Приоритет', width: 120 },
      { id: 'detected_at', label: 'Дата обнаружения', width: 160 },
      { id: 'description', label: 'Описание', width: 250 },
      { id: 'response_time', label: 'Время реакции (мин)', width: 140 },
      { id: 'needs_escalation', label: 'Требуется эскалация', width: 140 },
      { id: 'affected_systems', label: 'Затронутые системы', width: 200 },
    ],
  },
  {
    id: 'network',
    label: 'Сеть',
    description: 'Сетевые аномалии и подозрительная активность',
    extraFields: [
      { id: 'priority', label: 'Приоритет', width: 120 },
      { id: 'detected_at', label: 'Дата обнаружения', width: 160 },
      { id: 'description', label: 'Описание', width: 250 },
      { id: 'response_time', label: 'Время реакции (мин)', width: 140 },
      { id: 'needs_escalation', label: 'Требуется эскалация', width: 140 },
      { id: 'affected_systems', label: 'Затронутые системы', width: 200 },
    ],
  },
  {
    id: 'malware',
    label: 'Вредоносное ПО',
    description: 'Детекты вредоносного ПО и заражения',
    extraFields: [
      { id: 'priority', label: 'Приоритет', width: 120 },
      { id: 'detected_at', label: 'Дата обнаружения', width: 160 },
      { id: 'description', label: 'Описание', width: 250 },
      { id: 'response_time', label: 'Время реакции (мин)', width: 140 },
      { id: 'needs_escalation', label: 'Требуется эскалация', width: 140 },
      { id: 'affected_systems', label: 'Затронутые системы', width: 200 },
    ],
  },
];

export function getIncidentTypeDefinition(typeId: IncidentTypeId) {
  return INCIDENT_TYPE_DEFINITIONS.find((type) => type.id === typeId) ?? null;
}

export function getExtraColumnDefinitions(typeId: IncidentTypeId): IncidentColumnDefinition[] {
  const type = getIncidentTypeDefinition(typeId);
  if (!type) {
    return [];
  }

  return type.extraFields.map((field) => ({
    key: `custom:${field.id}` as DynamicColumnKey,
    label: field.label,
    width: field.width,
    isDefault: false,
  }));
}

export function getColumnDefinition(columnKey: DynamicColumnKey, incidentTypeId?: IncidentTypeId | null) {
  const defaultColumn = DEFAULT_INCIDENT_COLUMNS.find((column) => column.key === columnKey);
  if (defaultColumn) {
    return defaultColumn;
  }

  if (!incidentTypeId) {
    return null;
  }

  return getExtraColumnDefinitions(incidentTypeId).find((column) => column.key === columnKey) ?? null;
}

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
