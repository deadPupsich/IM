import { BaseColumnKey, DynamicColumnKey, Incident, IncidentTypeId } from '../types/incident';

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
      { id: 'severity', label: 'Критичность', width: 140 },
      { id: 'attackVector', label: 'Вектор атаки', width: 170 },
    ],
  },
  {
    id: 'dlp',
    label: 'DLP',
    description: 'Инциденты утечки и нарушения работы с данными',
    extraFields: [
      { id: 'dataCategory', label: 'Категория данных', width: 180 },
      { id: 'channel', label: 'Канал утечки', width: 160 },
    ],
  },
  {
    id: 'network',
    label: 'Сеть',
    description: 'Сетевые аномалии и подозрительная активность',
    extraFields: [
      { id: 'targetHost', label: 'Целевой узел', width: 170 },
      { id: 'trafficProfile', label: 'Профиль трафика', width: 170 },
    ],
  },
  {
    id: 'malware',
    label: 'Вредоносное ПО',
    description: 'Детекты вредоносного ПО и заражения',
    extraFields: [
      { id: 'malwareFamily', label: 'Семейство', width: 170 },
      { id: 'quarantineStatus', label: 'Карантин', width: 140 },
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
