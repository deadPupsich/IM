import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { CustomField } from '../../types/settings';
import { HexColorPicker } from 'react-colorful';

const iconsList = [
  'FileText', 'User', 'Users', 'Database', 'FileStack', 'AlertTriangle', 
  'Calendar', 'Shield', 'Activity', 'Clock', 'Mail', 'Phone', 'MapPin',
  'Building', 'Briefcase', 'Tag', 'Hash', 'Link', 'Image', 'File',
  'Folder', 'Archive', 'Paperclip', 'BookOpen', 'Bookmark', 'Flag',
  'Star', 'Heart', 'MessageSquare', 'Send', 'Globe', 'Wifi',
  'Lock', 'Unlock', 'Key', 'Eye', 'EyeOff', 'Search',
  'Settings', 'Tool', 'Wrench', 'Package', 'Box', 'Layers',
  'Grid', 'List', 'CheckSquare', 'Square', 'Circle', 'Triangle'
];

const ITEMS_PER_PAGE = 10;
const SYSTEM_FIELD_SLUGS = new Set(['title', 'assignee', 'source', 'login', 'status', 'host']);

const slugify = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

const capitalizeFirst = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function FieldSettings() {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: '1',
      name: 'название',
      slug: 'title',
      type: 'string',
      icon: 'FileText',
      iconColor: '#3b82f6',
      required: true,
      description: 'Название инцидента',
      slugLocked: true,
    },
    {
      id: '2',
      name: 'ответственный',
      slug: 'assignee',
      type: 'string',
      icon: 'User',
      iconColor: '#22c55e',
      required: true,
      description: 'Ответственный за инцидент',
      slugLocked: true,
    },
    {
      id: '3',
      name: 'источник',
      slug: 'source',
      type: 'string',
      icon: 'Database',
      iconColor: '#a855f7',
      required: true,
      description: 'Источник инцидента',
      slugLocked: true,
    },
    {
      id: '4',
      name: 'нарушитель',
      slug: 'login',
      type: 'string',
      icon: 'AlertTriangle',
      iconColor: '#ef4444',
      required: true,
      description: 'Это должен быть логин пользователя из AD',
      slugLocked: true,
    },
    {
      id: '5',
      name: 'статус',
      slug: 'status',
      type: 'select',
      icon: 'Activity',
      iconColor: '#6366f1',
      required: true,
      description: 'Статус инцидента',
      selectOptions: ['Открыт', 'Закрыт', 'Расследование', 'Ложный'],
      slugLocked: true,
    },
    {
      id: '6',
      name: 'хост',
      slug: 'host',
      type: 'string',
      icon: 'Monitor',
      iconColor: '#6b7280',
      required: true,
      description: 'Хост, на котором зафиксирован инцидент',
      slugLocked: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const [newSelectOption, setNewSelectOption] = useState<Record<string, string>>({});

  const addField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      name: '',
      slug: '',
      type: 'string',
      icon: 'FileText',
      iconColor: 'blue',
      required: false,
      selectOptions: [],
      slugLocked: false,
    };
    setFields([...fields, newField]);
    setEditingField(newField.id);
    setCurrentPage(Math.ceil((fields.length + 1) / ITEMS_PER_PAGE));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<CustomField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addSelectOption = (fieldId: string) => {
    const value = (newSelectOption[fieldId] || '').trim();
    if (!value) return;

    setFields(fields.map(field =>
      field.id === fieldId
        ? {
            ...field,
            selectOptions: [...(field.selectOptions || []), value]
          }
        : field
    ));
    setNewSelectOption((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const removeSelectOption = (fieldId: string, option: string) => {
    setFields(fields.map(field =>
      field.id === fieldId
        ? {
            ...field,
            selectOptions: (field.selectOptions || []).filter((value) => value !== option)
          }
        : field
    ));
  };

  const filteredFields = fields.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFields.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFields = filteredFields.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.FileText;
  };

  const [colorPickerOpen, setColorPickerOpen] = useState<{ [key: string]: boolean }>({});
  const colorPickerRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleColorPicker = (fieldId: string) => {
    setColorPickerOpen(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, x)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const openPickerId = Object.keys(colorPickerOpen).find(key => colorPickerOpen[key]);
      if (openPickerId && colorPickerRef.current[openPickerId] && !colorPickerRef.current[openPickerId]?.contains(target)) {
        setColorPickerOpen({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [colorPickerOpen]);

  const filteredIcons = iconsList.filter(icon =>
    icon.toLowerCase().includes(iconSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Настройка полей</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Создайте и настройте поля для использования в инцидентах
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск полей..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-blue-200 bg-white py-2 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <button
          onClick={addField}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить поле
        </button>
      </div>

      <div className="space-y-3">
        {paginatedFields.map((field) => {
          const IconComponent = getIconComponent(field.icon);
          const isEditing = editingField === field.id;
          const isSystemField = SYSTEM_FIELD_SLUGS.has(field.slug);

          return (
            <div
              key={field.id}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                        {capitalizeFirst(field.name) || 'Новое поле'}
                      </h4>
                      {isSystemField && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                          Системное
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Название поля
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        placeholder="Название_поля"
                        disabled={isSystemField}
                        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700"
                      />
                      {isSystemField && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Для системного поля название менять нельзя.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Slug в БД
                      </label>
                      <input
                        type="text"
                        value={field.slug}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                          updateField(field.id, { slug: value });
                        }}
                        placeholder="field_slug"
                        disabled={field.slugLocked}
                        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700 font-mono"
                      />
                      <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                        {field.slugLocked
                          ? 'Slug уже зафиксирован и больше не редактируется.'
                          : 'Только латинские буквы, цифры и подчёркивание. Пример: field_name'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Тип поля
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="string">Строка</option>
                        <option value="multiline">Многострочное</option>
                        <option value="datetime">Дата-время</option>
                        <option value="file">Файл</option>
                        <option value="select">Список</option>
                        <option value="number">Число</option>
                        <option value="boolean">Да/Нет</option>
                      </select>
                    </div>

                    {field.type === 'select' && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                          Значения списка
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSelectOption[field.id] || ''}
                            onChange={(e) => setNewSelectOption((prev) => ({ ...prev, [field.id]: e.target.value }))}
                            placeholder="Новое значение"
                            className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => addSelectOption(field.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Добавить
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {(field.selectOptions || []).map((option) => (
                            <div
                              key={option}
                              className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200"
                            >
                              <span>{option}</span>
                              <button
                                type="button"
                                onClick={() => removeSelectOption(field.id, option)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Иконка
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Поиск иконок..."
                          value={iconSearchTerm}
                          onChange={(e) => setIconSearchTerm(e.target.value)}
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-100/50 dark:bg-blue-900/30">
                          {filteredIcons.map((iconName) => {
                            const Icon = getIconComponent(iconName);
                            return (
                              <button
                                key={iconName}
                                type="button"
                                onClick={() => updateField(field.id, { icon: iconName })}
                                className={`p-2 rounded-lg border-2 transition-all hover:bg-white flex flex-col items-center gap-1 ${
                                  field.icon === iconName
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-transparent hover:border-gray-300'
                                }`}
                                title={iconName}
                              >
                                <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span className="text-[10px] text-gray-600 dark:text-gray-400 truncate w-full text-center">{iconName}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Цвет иконки
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() => toggleColorPicker(field.id)}
                            className="w-12 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors shadow-sm"
                            style={{ backgroundColor: field.iconColor || '#3b82f6' }}
                          />
                          {colorPickerOpen[field.id] && (
                            <div 
                              ref={(el) => { colorPickerRef.current[field.id] = el; }}
                              className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[100] w-[260px] overflow-visible" 
                              data-color-picker
                            >
                              <HexColorPicker
                                color={field.iconColor || '#3b82f6'}
                                onChange={(color) => updateField(field.id, { iconColor: color })}
                              />
                              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  HEX цвет
                                </label>
                                <div className="flex items-center gap-2 mb-3">
                                  <div 
                                    className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                    style={{ backgroundColor: field.iconColor || '#3b82f6' }}
                                  />
                                  <input
                                    type="text"
                                    value={field.iconColor || '#3b82f6'}
                                    onChange={(e) => updateField(field.id, { iconColor: e.target.value })}
                                    className="flex-1 px-3 py-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#000000"
                                  />
                                </div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  RGB значения
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                  {(['r', 'g', 'b'] as const).map((channel) => {
                                    const rgb = hexToRgb(field.iconColor || '#3b82f6');
                                    return (
                                      <div key={channel}>
                                        <label className="block text-xs text-gray-500 dark:text-gray-500 mb-1 uppercase">
                                          {channel === 'r' ? 'Red' : channel === 'g' ? 'Green' : 'Blue'}
                                        </label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="255"
                                          value={rgb[channel]}
                                          onChange={(e) => {
                                            const value = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                                            const newHex = rgbToHex(
                                              channel === 'r' ? value : rgb.r,
                                              channel === 'g' ? value : rgb.g,
                                              channel === 'b' ? value : rgb.b
                                            );
                                            updateField(field.id, { iconColor: newHex });
                                          }}
                                          className="w-full px-2 py-1.5 text-sm text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                          {field.iconColor || '#3b82f6'}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Описание
                      </label>
                      <input
                        type="text"
                        value={field.description || ''}
                        onChange={(e) => updateField(field.id, { description: e.target.value })}
                        placeholder="Описание поля"
                        disabled={isSystemField}
                        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700"
                      />
                      {isSystemField && (
                        <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                          Для системного поля описание менять нельзя.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setEditingField(null);
                        setIconSearchTerm('');
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={() => {
                        const nextSlug = field.slug.trim() || slugify(field.name) || `field_${field.id}`;
                        updateField(field.id, {
                          slug: nextSlug.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                          slugLocked: true,
                        });
                        setEditingField(null);
                        setIconSearchTerm('');
                      }}
                      disabled={!field.slug.trim() && !field.name.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Готово
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${field.iconColor || '#3b82f6'}20` }}
                    >
                      <IconComponent 
                        className="w-6 h-6" 
                        style={{ color: field.iconColor || '#3b82f6' }}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{capitalizeFirst(field.name)}</h4>
                        {isSystemField && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                            Системное
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {field.description || `Тип: ${field.type}`}
                      </p>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Slug: {field.slug}
                        {field.type === 'select' && field.selectOptions && field.selectOptions.length > 0 && (
                          <span> • Значений: {field.selectOptions.length}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingField(field.id)}
                      className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-blue-200 dark:border-blue-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Показано {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredFields.length)} из {filteredFields.length}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
