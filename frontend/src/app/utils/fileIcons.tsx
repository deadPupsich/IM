import React from 'react';
import { MaterialIcon, getFileIconName } from './materialIcons.tsx';

export function getFileIcon(fileName: string): React.ReactNode {
  return <MaterialIcon name={getFileIconName(fileName)} size={16} />;
}

export function getFileIconLarge(fileName: string): React.ReactNode {
  return <MaterialIcon name={getFileIconName(fileName)} size={20} />;
}
