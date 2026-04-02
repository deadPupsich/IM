import { IncidentTypeId } from '../types/incident.ts';
import { useIncidentActionsStore } from '../store/incidentActionsStore.ts';

export interface SystemIncidentAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  targetType: 'user' | 'team' | 'status' | 'custom';
}

/**
 * Получает все действия из store
 */
export function getIncidentActions(): SystemIncidentAction[] {
  const store = useIncidentActionsStore.getState();
  return store.getActions().map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    icon: a.icon,
    iconColor: a.iconColor,
    targetType: a.targetType,
  }));
}

/**
 * Получает действия для типа инцидента из store
 */
export function getDefaultActionsForIncidentType(typeId: IncidentTypeId): string[] {
  const store = useIncidentActionsStore.getState();
  return store.typeActions[typeId] ?? [];
}

/**
 * Получает полные объекты действий для типа инцидента
 */
export function getActionsForIncidentType(typeId: IncidentTypeId) {
  const store = useIncidentActionsStore.getState();
  return store.getActionsForType(typeId);
}

/**
 * Хук для получения действий для типа инцидента в React компонентах
 */
export function useActionsForIncidentType(typeId: IncidentTypeId) {
  return useIncidentActionsStore((state) => state.getActionsForType(typeId));
}

/**
 * Хук для получения всех действий в React компонентах
 */
export function useAllIncidentActions() {
  return useIncidentActionsStore((state) => state.getActions());
}

// Экспортируем константы для обратной совместимости
export const SYSTEM_INCIDENT_ACTIONS = getIncidentActions();
export const INCIDENT_TYPE_ACTIONS: Record<IncidentTypeId, string[]> = {
  security: getDefaultActionsForIncidentType('security'),
  dlp: getDefaultActionsForIncidentType('dlp'),
  network: getDefaultActionsForIncidentType('network'),
  malware: getDefaultActionsForIncidentType('malware'),
};
