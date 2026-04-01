export type IncidentTeam = 'SOC L1' | 'SOC L2' | 'DLP';

export type IncidentTypeId = 'security' | 'dlp' | 'network' | 'malware';

export type BaseColumnKey =
  | 'название'
  | 'ответственный'
  | 'источник'
  | 'хост'
  | 'списокФайлов'
  | 'login'
  | 'статус'
  | 'дата';

export type DynamicColumnKey = BaseColumnKey | `custom:${string}`;

export interface Incident {
  id: string;
  название: string;
  ответственный: string;
  источник: string;
  хост: string;
  списокФайлов: string[];
  login: string;
  команда: IncidentTeam;
  статус: string;
  дата: string;
  типИнцидента: IncidentTypeId;
  дополнительныеПоля?: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  teams: string[];
}

export type ColumnKey = DynamicColumnKey;
