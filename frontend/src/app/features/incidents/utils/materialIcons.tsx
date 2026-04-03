import React from 'react';

interface MaterialIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({ name, size = 16, className = '' }) => {
  return (
    <span
      className={`material-icons ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
    >
      {name}
    </span>
  );
};

// Маппинг расширений файлов на Material Icons
const fileIconMap: Record<string, string> = {
  // Документы
  'pdf': 'picture_as_pdf',
  'doc': 'description',
  'docx': 'description',
  'txt': 'text_snippet',
  'rtf': 'text_snippet',
  'odt': 'description',
  
  // Изображения
  'png': 'image',
  'jpg': 'image',
  'jpeg': 'image',
  'gif': 'gif',
  'svg': 'image',
  'webp': 'image',
  'bmp': 'image',
  'ico': 'image',
  
  // Видео
  'mp4': 'videocam',
  'avi': 'movie',
  'mov': 'movie',
  'mkv': 'movie',
  'webm': 'movie',
  'flv': 'movie',
  
  // Аудио
  'mp3': 'audio_file',
  'wav': 'audio_file',
  'ogg': 'audio_file',
  'flac': 'audio_file',
  'aac': 'audio_file',
  
  // Архивы
  'zip': 'folder_zip',
  'rar': 'folder_zip',
  '7z': 'folder_zip',
  'tar': 'folder_zip',
  'gz': 'folder_zip',
  
  // Код
  'js': 'code',
  'ts': 'code',
  'jsx': 'code',
  'tsx': 'code',
  'py': 'code',
  'json': 'data_object',
  'xml': 'code',
  'html': 'code',
  'css': 'code',
  'java': 'code',
  'cpp': 'code',
  'c': 'code',
  'go': 'code',
  'rs': 'code',
  
  // Таблицы
  'xlsx': 'table_chart',
  'xls': 'table_chart',
  'csv': 'table_chart',
  'ods': 'table_chart',
};

export function getFileIconName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return fileIconMap[ext] || 'insert_drive_file';
}
