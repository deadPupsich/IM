import { useState } from 'react';
import { Plus, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { CustomField } from '../../types/settings';

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

const colorOptions = [
  { name: 'Синий', value: 'blue', bg: 'bg-blue-100', text: 'text-blue-600' },
  { name: 'Зеленый', value: 'green', bg: 'bg-green-100', text: 'text-green-600' },
  { name: 'Красный', value: 'red', bg: 'bg-red-100', text: 'text-red-600' },
  { name: 'Желтый', value: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { name: 'Фиолетовый', value: 'purple', bg: 'bg-purple-100', text: 'text-purple-600' },
  { name: 'Розовый', value: 'pink', bg: 'bg-pink-100', text: 'text-pink-600' },
  { name: 'Индиго', value: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { name: 'Оранжевый', value: 'orange', bg: 'bg-orange-100', text: 'text-orange-600' },
  { name: 'Голубой', value: 'cyan', bg: 'bg-cyan-100', text: 'text-cyan-600' },
  { name: 'Серый', value: 'gray', bg: 'bg-gray-100', text: 'text-gray-600' }
];

const ITEMS_PER_PAGE = 10;
const SYSTEM_FIELD_SLUGS = new Set(['title', 'assignee', 'source', 'login', 'status']);

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-zа-я0-9_]/gi, '');
}

export default function FieldSettings() {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: '1',
      name: 'название',
      slug: 'title',
      type: 'string',
      icon: 'FileText',
      iconColor: 'blue',
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
      iconColor: 'green',
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
      iconColor: 'purple',
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
      iconColor: 'red',
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
      iconColor: 'indigo',
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
      iconColor: 'gray',
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

  const getColorClasses = (color: string) => {
    const colorOption = colorOptions.find(c => c.value === color);
    return colorOption || colorOptions[0];
  };

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
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <button
          onClick={addField}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить поле
        </button>
      </div>

      <div className="space-y-3">
        {paginatedFields.map((field) => {
          const IconComponent = getIconComponent(field.icon);
          const colorClasses = getColorClasses(field.iconColor);
          const isEditing = editingField === field.id;
          const isSystemField = SYSTEM_FIELD_SLUGS.has(field.slug);

          return (
            <div
              key={field.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Название поля
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        placeholder="название_поля"
                        disabled={isSystemField}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700"
                      />
                      {isSystemField && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Для системного поля название менять нельзя.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Slug в БД
                      </label>
                      <input
                        type="text"
                        value={field.slug}
                        onChange={(e) => updateField(field.id, { slug: e.target.value })}
                        placeholder="db_slug"
                        disabled={field.slugLocked}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {field.slugLocked
                          ? 'Slug уже зафиксирован и больше не редактируется.'
                          : 'Выбирается один раз при создании поля и потом не меняется.'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Тип поля
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Значения списка
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSelectOption[field.id] || ''}
                            onChange={(e) => setNewSelectOption((prev) => ({ ...prev, [field.id]: e.target.value }))}
                            placeholder="Новое значение"
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Иконка
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Поиск иконок..."
                          value={iconSearchTerm}
                          onChange={(e) => setIconSearchTerm(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Цвет иконки
                      </label>
                      <div className="grid grid-cols-10 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => updateField(field.id, { iconColor: color.value })}
                            className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center border-2 transition-all ${
                              field.iconColor === color.value
                                ? 'border-gray-900 scale-110'
                                : 'border-transparent hover:border-gray-300'
                            }`}
                            title={color.name}
                          >
                            <div className={`w-4 h-4 rounded-full ${color.bg.replace('100', '600')}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Описание
                      </label>
                      <input
                        type="text"
                        value={field.description || ''}
                        onChange={(e) => updateField(field.id, { description: e.target.value })}
                        placeholder="Описание поля"
                        disabled={isSystemField}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700"
                      />
                      {isSystemField && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Для системного поля описание менять нельзя.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        const nextSlug = field.slug.trim() || slugify(field.name) || `field_${field.id}`;
                        updateField(field.id, {
                          slug: nextSlug,
                          slugLocked: true,
                        });
                        setEditingField(null);
                        setIconSearchTerm('');
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Готово
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{field.name}</h4>
                        {field.required && (
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded">
                            Обязательное
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
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
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

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
