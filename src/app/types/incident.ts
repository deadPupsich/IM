export interface Incident {
  id: string;
  название: string;
  ответственный: string;
  источник: string;
  списокФайлов: string[];
  нарушитель: string;
  команда: 'SOC L1' | 'SOC L2' | 'DLP';
  статус: string;
  дата: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  teams: string[];
}

export type ColumnKey = keyof Omit<Incident, 'id' | 'команда'>;
