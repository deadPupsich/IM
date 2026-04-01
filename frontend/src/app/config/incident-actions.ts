import { IncidentTypeId } from '../types/incident.ts';

export interface SystemIncidentAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  targetType: 'user' | 'team' | 'status' | 'custom';
}

export const SYSTEM_INCIDENT_ACTIONS: SystemIncidentAction[] = [
  {
    id: 'assign-analyst',
    name: 'Назначить на аналитика',
    description: 'Назначить инцидент на ответственного аналитика',
    icon: 'UserPlus',
    iconColor: '#3b82f6',
    targetType: 'user',
  },
  {
    id: 'request-artifacts',
    name: 'Запросить артефакты',
    description: 'Собрать недостающие материалы расследования',
    icon: 'Archive',
    iconColor: '#f97316',
    targetType: 'custom',
  },
  {
    id: 'escalate-l2',
    name: 'Эскалировать в SOC L2',
    description: 'Передать инцидент на следующую линию',
    icon: 'ShieldAlert',
    iconColor: '#22c55e',
    targetType: 'team',
  },
  {
    id: 'notify-owner',
    name: 'Уведомить владельца системы',
    description: 'Отправить уведомление владельцу затронутой системы',
    icon: 'Mail',
    iconColor: '#a855f7',
    targetType: 'user',
  },
  {
    id: 'change-status',
    name: 'Сменить статус',
    description: 'Перевести инцидент в другой статус',
    icon: 'CheckCircle',
    iconColor: '#3b82f6',
    targetType: 'status',
  },
  {
    id: 'contact-violator',
    name: 'Связаться с нарушителем',
    description: 'Отправить системное письмо подозреваемому пользователю',
    icon: 'Send',
    iconColor: '#ef4444',
    targetType: 'custom',
  },
];

export const INCIDENT_TYPE_ACTIONS: Record<IncidentTypeId, string[]> = {
  security: ['Назначить на аналитика', 'Сменить статус', 'Связаться с нарушителем'],
  dlp: ['Назначить на аналитика', 'Запросить артефакты', 'Связаться с нарушителем'],
  network: ['Назначить на аналитика', 'Эскалировать в SOC L2', 'Запросить артефакты'],
  malware: ['Назначить на аналитика', 'Сменить статус', 'Уведомить владельца системы'],
};

export function getDefaultActionsForIncidentType(typeId: IncidentTypeId) {
  return INCIDENT_TYPE_ACTIONS[typeId] ?? [];
}
