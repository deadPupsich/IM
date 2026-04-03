import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import { CustomField, SelectOptionValue } from '../../types/settings.ts';
import { HexColorPicker } from 'react-colorful';
import { useIncidentFieldsStore } from '../../store/incidentFieldsStore.ts';

const iconsList = [
  'FileText', 'User', 'Users', 'Database', 'FileStack', 'AlertTriangle', 'AlertCircle',
  'Calendar', 'Shield', 'Activity', 'Clock', 'Mail', 'Phone', 'MapPin',
  'Building', 'Briefcase', 'Tag', 'Hash', 'Link', 'Image', 'File',
  'Folder', 'Archive', 'Paperclip', 'BookOpen', 'Bookmark', 'Flag',
  'Star', 'Heart', 'MessageSquare', 'Send', 'Globe', 'Wifi',
  'Lock', 'Unlock', 'Key', 'Eye', 'EyeOff', 'Search',
  'Settings', 'Tool', 'Wrench', 'Package', 'Box', 'Layers',
  'Grid', 'List', 'CheckSquare', 'Square', 'Circle', 'Triangle',
  'Server', 'Monitor', 'TriangleAlert'
];

const ITEMS_PER_PAGE = 10;

export default function FieldSettings() {
  const { 
    baseFields, 
    extraFields,
    setBaseFields,
    addExtraField,
    removeExtraField,
    updateExtraField,
  } = useIncidentFieldsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const [newSelectOption, setNewSelectOption] = useState<Record<string, string>>({});
  const [iconColorPickerOpen, setIconColorPickerOpen] = useState<{ [key: string]: boolean }>({});
  const [optionColorPicker, setOptionColorPicker] = useState<{ fieldId: string; optionIndex: number; pickerType: 'border' | 'text' | 'bg' } | null>(null);
  const [iconColorPickerPosition, setIconColorPickerPosition] = useState<{ top: number; left: number } | null>(null);
  const [optionColorPickerPosition, setOptionColorPickerPosition] = useState<{ top: number; left: number } | null>(null);
  const iconColorButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const optionColorButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Собираем все поля: базовые + дополнительные
  const allFields: CustomField[] = [...baseFields, ...extraFields];

  // Определяем тип поля для UI
  const getFieldCategory = (fieldId: string) => {
    if (baseFields.some(f => f.id === fieldId)) return 'base';
    return 'extra';
  };

  const addField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      icon: 'FileText',
      iconColor: '#3b82f6',
      required: false,
      selectOptions: [],
    };
    addExtraField(newField);
    setEditingField(newField.id);
    setCurrentPage(Math.ceil((extraFields.length + 1) / ITEMS_PER_PAGE));
  };

  const removeField = (id: string) => {
    const category = getFieldCategory(id);
    const field = allFields.find(f => f.id === id);

    if (!confirm(`Удалить поле "${field?.name || id}"? Это действие нельзя отменить.`)) {
      return;
    }

    if (category === 'base') {
      // Базовые поля нельзя удалить
      return;
    }

    // Удаляем дополнительное поле
    removeExtraField(id);
  };

  const updateField = (id: string, updates: Partial<CustomField>) => {
    // Валидация названия
    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        return; // Нельзя установить пустое название
      }
    }

    const category = getFieldCategory(id);

    if (category === 'base') {
      setBaseFields(baseFields.map(f => f.id === id ? { ...f, ...updates } : f));
      return;
    }

    // Обновляем дополнительное поле
    updateExtraField(id, updates);
  };

  const addSelectOption = (fieldId: string) => {
    const value = (newSelectOption[fieldId] || '').trim();
    if (!value) return;

    const field = allFields.find(f => f.id === fieldId);
    if (!field) return;

    const updatedOptions: SelectOptionValue[] = [
      ...(field.selectOptions || []), 
      { label: value, borderColor: '#3b82f6', textColor: '#1d4ed8', bgColor: '#dbeafe' }
    ];

    updateField(fieldId, { selectOptions: updatedOptions });
    setNewSelectOption((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const removeSelectOption = (fieldId: string, optionIndex: number) => {
    const field = allFields.find(f => f.id === fieldId);
    if (!field) return;

    const updatedOptions = (field.selectOptions || []).filter((_, i) => i !== optionIndex);
    updateField(fieldId, { selectOptions: updatedOptions });
  };

  const updateSelectOption = (fieldId: string, optionIndex: number, updates: Partial<SelectOptionValue>) => {
    const field = allFields.find(f => f.id === fieldId);
    if (!field) return;

    const updatedOptions = (field.selectOptions || []).map((opt, i) =>
      i === optionIndex ? { ...opt, ...updates } : opt
    );
    updateField(fieldId, { selectOptions: updatedOptions });
  };

  const filteredFields = allFields.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFields.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFields = filteredFields.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.FileText;
  };

  const colorPickerRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleIconColorPicker = (fieldId: string, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (iconColorPickerOpen[fieldId]) {
      setIconColorPickerOpen(prev => ({ ...prev, [fieldId]: false }));
      setIconColorPickerPosition(null);
      return;
    }

    const button = iconColorButtonRefs.current[fieldId];
    if (button) {
      const rect = button.getBoundingClientRect();
      const pickerHeight = 360;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Определяем позицию: снизу или сверху
      const top = spaceBelow < pickerHeight && spaceAbove > spaceBelow
        ? rect.top - pickerHeight
        : rect.bottom;

      // Центрируем по горизонтали относительно кнопки
      let left = rect.left + rect.width / 2;

      // Защита от выхода за края экрана (ширина пикера ~260px + padding)
      const pickerWidth = 300;
      if (left - pickerWidth / 2 < 0) {
        left = pickerWidth / 2;
      } else if (left + pickerWidth / 2 > window.innerWidth) {
        left = window.innerWidth - pickerWidth / 2;
      }

      setIconColorPickerPosition({ top, left });
    }

    setIconColorPickerOpen(prev => ({ ...prev, [fieldId]: true }));
  };

  const toggleOptionColorPicker = (fieldId: string, optionIndex: number, pickerType: 'border' | 'text' | 'bg', event?: React.MouseEvent<HTMLButtonElement>) => {
    const pickerKey = `${fieldId}-${optionIndex}-${pickerType}`;
    
    if (optionColorPicker?.fieldId === fieldId && optionColorPicker?.optionIndex === optionIndex && optionColorPicker?.pickerType === pickerType) {
      setOptionColorPicker(null);
      setOptionColorPickerPosition(null);
      return;
    }

    const button = optionColorButtonRefs.current[pickerKey];
    if (button) {
      const rect = button.getBoundingClientRect();
      const pickerHeight = 360;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Определяем позицию: снизу или сверху
      const top = spaceBelow < pickerHeight && spaceAbove > spaceBelow
        ? rect.top - pickerHeight
        : rect.bottom;

      // Центрируем по горизонтали относительно кнопки
      let left = rect.left + rect.width / 2;

      // Защита от выхода за края экрана (ширина пикера ~260px + padding)
      const pickerWidth = 300;
      if (left - pickerWidth / 2 < 0) {
        left = pickerWidth / 2;
      } else if (left + pickerWidth / 2 > window.innerWidth) {
        left = window.innerWidth - pickerWidth / 2;
      }

      setOptionColorPickerPosition({ top, left });
    }

    setOptionColorPicker({ fieldId, optionIndex, pickerType });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const openPickerId = Object.keys(iconColorPickerOpen).find(key => iconColorPickerOpen[key]);
      if (openPickerId && colorPickerRef.current[openPickerId] && !colorPickerRef.current[openPickerId]?.contains(target)) {
        setIconColorPickerOpen({});
        setIconColorPickerPosition(null);
      }
      if (optionColorPicker && !target.closest('[data-option-color-picker]')) {
        setOptionColorPicker(null);
        setOptionColorPickerPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [iconColorPickerOpen, optionColorPicker]);

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
          const fieldCategory = getFieldCategory(field.id);
          const isBaseField = fieldCategory === 'base';

          return (
            <div
              key={field.id}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setEditingField(isEditing ? null : field.id)}
                    className="shrink-0 mt-0.5"
                  >
                    <ChevronDown className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform ${isEditing ? '' : '-rotate-90'}`} />
                  </button>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${field.iconColor}20` }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: field.iconColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                          {field.name}
                        </h4>
                        {isBaseField && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                            Системное
                          </span>
                        )}
                        {!isBaseField && (
                          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded">
                            Доп. поле
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-400">
                        {field.type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing && (
                    <button
                      onClick={() => setEditingField(null)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Готово
                    </button>
                  )}
                  {!isBaseField && (
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="space-y-4 pt-4 border-t border-blue-200 dark:border-blue-800">
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
                        disabled={isBaseField}
                        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700"
                      />
                      {isBaseField && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Для системного поля название менять нельзя.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Тип поля
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                        disabled={isBaseField}
                        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100 disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-700"
                      >
                        <option value="string">Строка</option>
                        <option value="multiline">Многострочное</option>
                        <option value="datetime">Дата-время</option>
                        <option value="file">Файл</option>
                        <option value="select">Список</option>
                        <option value="number">Число</option>
                        <option value="boolean">Да/Нет</option>
                      </select>
                      {isBaseField && (
                        <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                          Для системного поля тип менять нельзя.
                        </p>
                      )}
                    </div>

                    {field.type === 'number' && (
                      <div className="col-span-2 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                              Префикс
                            </label>
                            <input
                              type="text"
                              value={field.prefix || ''}
                              onChange={(e) => updateField(field.id, { prefix: e.target.value })}
                              placeholder="Например: ₽"
                              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                            />
                            <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                              Отображается перед числом
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                              Постфикс
                            </label>
                            <input
                              type="text"
                              value={field.postfix || ''}
                              onChange={(e) => updateField(field.id, { postfix: e.target.value })}
                              placeholder="Например: мин, кг, шт"
                              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                            />
                            <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                              Отображается после числа
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {field.type === 'select' && (
                      <div className="col-span-2 space-y-4">
                        <div>
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
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
                            <input
                              type="checkbox"
                              checked={field.allowMultiple || false}
                              onChange={(e) => updateField(field.id, { allowMultiple: e.target.checked })}
                              className="rounded border-blue-200 dark:border-blue-700 text-blue-600 focus:ring-blue-500"
                            />
                            Разрешить несколько значений
                          </label>
                        </div>

                        <div className="space-y-2">
                          {(field.selectOptions || []).map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 bg-blue-100/50 dark:bg-blue-900/30 p-3 rounded-lg"
                            >
                              <div
                                className="px-3 py-1.5 text-sm rounded-full border-2 font-medium"
                                style={{
                                  borderColor: option.borderColor,
                                  color: option.textColor,
                                  backgroundColor: option.bgColor,
                                }}
                              >
                                {option.label}
                              </div>
                              <div className="flex items-center gap-1 ml-auto">
                                <div className="relative">
                                  <button
                                    type="button"
                                    ref={(el) => { optionColorButtonRefs.current[`${field.id}-${index}-border`] = el; }}
                                    onClick={(e) => toggleOptionColorPicker(field.id, index, 'border', e)}
                                    className="w-6 h-6 rounded border-2 flex items-center justify-center hover:scale-110 transition-transform"
                                    style={{ backgroundColor: option.borderColor, borderColor: option.borderColor }}
                                    title="Цвет обводки"
                                  >
                                    {optionColorPicker?.fieldId === field.id && optionColorPicker?.optionIndex === index && optionColorPicker?.pickerType === 'border' && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                      </div>
                                    )}
                                  </button>
                                  {optionColorPicker?.fieldId === field.id && optionColorPicker?.optionIndex === index && optionColorPicker?.pickerType === 'border' && optionColorPickerPosition && (
                                    <div
                                      className="fixed p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                                      data-option-color-picker
                                      style={{
                                        top: `${optionColorPickerPosition.top + 8}px`,
                                        left: `${optionColorPickerPosition.left - 120}px`,
                                      }}
                                    >
                                      <HexColorPicker
                                        color={option.borderColor}
                                        onChange={(color) => updateSelectOption(field.id, index, { borderColor: color })}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="relative">
                                  <button
                                    type="button"
                                    ref={(el) => { optionColorButtonRefs.current[`${field.id}-${index}-text`] = el; }}
                                    onClick={(e) => toggleOptionColorPicker(field.id, index, 'text', e)}
                                    className="w-6 h-6 rounded border-2 flex items-center justify-center hover:scale-110 transition-transform"
                                    style={{ backgroundColor: option.textColor, borderColor: option.textColor }}
                                    title="Цвет текста"
                                  >
                                    {optionColorPicker?.fieldId === field.id && optionColorPicker?.optionIndex === index && optionColorPicker?.pickerType === 'text' && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                      </div>
                                    )}
                                  </button>
                                  {optionColorPicker?.fieldId === field.id && optionColorPicker?.optionIndex === index && optionColorPicker?.pickerType === 'text' && optionColorPickerPosition && (
                                    <div
                                      className="fixed p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                                      data-option-color-picker
                                      style={{
                                        top: `${optionColorPickerPosition.top + 8}px`,
                                        left: `${optionColorPickerPosition.left - 120}px`,
                                      }}
                                    >
                                      <HexColorPicker
                                        color={option.textColor}
                                        onChange={(color) => updateSelectOption(field.id, index, { textColor: color })}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="relative">
                                  <button
                                    type="button"
                                    ref={(el) => { optionColorButtonRefs.current[`${field.id}-${index}-bg`] = el; }}
                                    onClick={(e) => toggleOptionColorPicker(field.id, index, 'bg', e)}
                                    className="w-6 h-6 rounded border-2 flex items-center justify-center hover:scale-110 transition-transform"
                                    style={{ backgroundColor: option.bgColor, borderColor: option.bgColor }}
                                    title="Цвет фона"
                                  >
                                    {optionColorPicker?.fieldId === field.id && optionColorPicker?.optionIndex === index && optionColorPicker?.pickerType === 'bg' && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                      </div>
                                    )}
                                  </button>
                                  {optionColorPicker?.fieldId === field.id && optionColorPicker?.optionIndex === index && optionColorPicker?.pickerType === 'bg' && optionColorPickerPosition && (
                                    <div
                                      className="fixed p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                                      data-option-color-picker
                                      style={{
                                        top: `${optionColorPickerPosition.top + 8}px`,
                                        left: `${optionColorPickerPosition.left - 120}px`,
                                      }}
                                    >
                                      <HexColorPicker
                                        color={option.bgColor}
                                        onChange={(color) => updateSelectOption(field.id, index, { bgColor: color })}
                                      />
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeSelectOption(field.id, index)}
                                  className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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
                        <div className="relative">
                          <button
                            type="button"
                            ref={(el) => { iconColorButtonRefs.current[field.id] = el; }}
                            onClick={(e) => toggleIconColorPicker(field.id, e)}
                            className="w-12 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors shadow-sm"
                            style={{ backgroundColor: field.iconColor }}
                          />
                          {iconColorPickerOpen[field.id] && iconColorPickerPosition && (
                            <div
                              ref={(el) => { colorPickerRef.current[field.id] = el; }}
                              className="fixed p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-100 w-65"
                              style={{
                                top: `${iconColorPickerPosition.top + 8}px`,
                                left: `${iconColorPickerPosition.left - 130}px`,
                              }}
                            >
                              <HexColorPicker
                                color={field.iconColor}
                                onChange={(color) => updateField(field.id, { iconColor: color })}
                              />
                              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  HEX цвет
                                </label>
                                <div className="flex items-center gap-2 mb-3">
                                  <div
                                    className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 shrink-0"
                                    style={{ backgroundColor: field.iconColor }}
                                  />
                                  <input
                                    type="text"
                                    value={field.iconColor}
                                    onChange={(e) => updateField(field.id, { iconColor: e.target.value })}
                                    className="flex-1 px-3 py-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#000000"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={field.iconColor}
                          onChange={(e) => updateField(field.id, { iconColor: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm font-mono border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Описание
                      </label>
                      <textarea
                        value={field.description || ''}
                        onChange={(e) => updateField(field.id, { description: e.target.value })}
                        placeholder="Описание поля"
                        rows={2}
                        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
                      : 'hover:bg-gray-100 text-gray-700 dark:text-gray-300'
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
    </div>
  );
}
