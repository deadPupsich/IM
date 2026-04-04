import { Violator, ViolatorDynamicColumnKey } from '../types/violator.ts';
import { useViolatorFieldsStore } from '../store/violatorFieldsStore.ts';
import * as Icons from 'lucide-react';
import React from 'react';

export interface ViolatorColumnDefinition {
  key: ViolatorDynamicColumnKey;
  label: string;
  width: number;
  isDefault?: boolean;
}

export const DEFAULT_VIOLATOR_COLUMNS: ViolatorColumnDefinition[] = [
  { key: 'name', label: 'ФИО', width: 220, isDefault: true },
  { key: 'email', label: 'Email', width: 200, isDefault: true },
  { key: 'samAccountName', label: 'SAM Account Name', width: 180, isDefault: true },
  { key: 'domain', label: 'Домен', width: 150, isDefault: true },
];

export function getExtraColumnDefinitions(): ViolatorColumnDefinition[] {
  const extraFields = useViolatorFieldsStore.getState().extraFields;
  return extraFields.map((field) => ({
    key: `custom:${field.id}`,
    label: field.name,
    width: 180,
  }));
}

export function getViolatorColumnValue(
  violator: Violator,
  columnKey: ViolatorDynamicColumnKey
): string {
  if (columnKey.startsWith('custom:')) {
    const fieldId = columnKey.replace('custom:', '');
    return violator.дополнительныеПоля?.[fieldId] || '—';
  }

  switch (columnKey) {
    case 'name':
      return violator.name || '—';
    case 'email':
      return violator.email || '—';
    case 'samAccountName':
      return violator.samAccountName || '—';
    case 'domain':
      return violator.domain || '—';
    default:
      return '—';
  }
}

export function getViolatorColumnValueReact(
  violator: Violator,
  columnKey: ViolatorDynamicColumnKey
): React.ReactNode {
  return getViolatorColumnValue(violator, columnKey);
}

export function getIconComponent(iconName: string): React.ComponentType<{ className?: string; style?: React.CSSProperties }> {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.User;
}
