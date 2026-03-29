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

export default function FieldSettings() {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: '1',
      name: 'название',
      type: 'string',
      icon: 'FileText',
      iconColor: 'blue',
      required: true,
      description: 'Название инцидента'
    },
    {
      id: '2',
      name: 'ответственный',
      type: 'string',
      icon: 'User',
      iconColor: 'green',
      required: true,
      description: 'Ответственный за инцидент'
    },
    {
      id: '3',
      name: 'источник',
      type: 'string',
      icon: 'Database',
      iconColor: 'purple',
      required: true,
      description: 'Источник инцидента'
    },
    {
      id: '4',
      name: 'нарушитель',
      type: 'string',
      icon: 'AlertTriangle',
      iconColor: 'red',
      required: true,
      description: 'Нарушитель'
    },
    {
      id: '5',
      name: 'статус',
      type: 'select',
      icon: 'Activity',
      iconColor: 'indigo',
      required: true,
      description: 'Статус инцидента'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [iconSearchTerm, setIconSearchTerm] = useState('');

  const addField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      icon: 'FileText',
      iconColor: 'blue',
      required: false
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Настройка полей</h3>
        <p className="text-sm text-gray-600 mb-6">
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          return (
            <div
              key={field.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Название поля
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        placeholder="название_поля"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Тип поля
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Иконка
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Поиск иконок..."
                          value={iconSearchTerm}
                          onChange={(e) => setIconSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                          {filteredIcons.map((iconName) => {
                            const Icon = getIconComponent(iconName);
                            return (
                              <button
                                key={iconName}
                                type="button"
                                onClick={() => updateField(field.id, { icon: iconName })}
                                className={`p-2 rounded-lg border-2 transition-all hover:bg-white ${
                                  field.icon === iconName
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-transparent hover:border-gray-300'
                                }`}
                                title={iconName}
                              >
                                <Icon className="w-5 h-5 text-gray-700" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Описание
                      </label>
                      <input
                        type="text"
                        value={field.description || ''}
                        onChange={(e) => updateField(field.id, { description: e.target.value })}
                        placeholder="Описание поля"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Обязательное поле</span>
                    </label>

                    <button
                      onClick={() => {
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
                        <h4 className="font-semibold text-gray-900">{field.name}</h4>
                        {field.required && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            Обязательное
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {field.description || `Тип: ${field.type}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingField(field.id)}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Показано {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredFields.length)} из {filteredFields.length}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-gray-200">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
