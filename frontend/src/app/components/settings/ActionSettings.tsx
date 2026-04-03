import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useIncidentActionsStore } from '../../store/incidentActionsStore.ts';
import { useIncidentFieldsStore } from '../../store/incidentFieldsStore.ts';
import { useIncidentTypesStore } from '../../store/incidentTypesStore.ts';

const ITEMS_PER_PAGE = 10;

const iconsList = [
  'UserPlus', 'UserCheck', 'Mail', 'MessageSquare', 'Send', 'CheckCircle',
  'XCircle', 'AlertCircle', 'Edit', 'Trash2', 'Archive', 'Flag', 'Users',
  'Database', 'FileStack', 'AlertTriangle', 'Calendar', 'Shield', 'Activity',
  'Clock', 'Phone', 'MapPin', 'Building', 'Briefcase', 'Tag', 'Hash',
  'Link', 'Image', 'File', 'Folder', 'Archive', 'Paperclip', 'BookOpen',
  'Bookmark', 'Flag', 'Star', 'Heart', 'Globe', 'Wifi', 'Lock', 'Unlock',
  'Key', 'Eye', 'EyeOff', 'Settings', 'Tool', 'Wrench', 'Package', 'Box',
  'Layers', 'Grid', 'List', 'CheckSquare', 'Square', 'Circle', 'Triangle'
];

const activityTypes = [
  { type: 'email', label: 'Отправить письмо' },
  { type: 'email_with_attachments', label: 'Отправить письмо с вложениями' },
  { type: 'telegram', label: 'Отправить в Telegram' },
  { type: 'webhook', label: 'Вызвать webhook' }
];

export default function ActionSettings() {
  const {
    actions,
    addAction,
    removeAction,
    updateAction,
  } = useIncidentActionsStore();

  const { getTypes } = useIncidentTypesStore();
  const baseFields = useIncidentFieldsStore((state) => state.baseFields);
  const extraFields = useIncidentFieldsStore((state) => state.extraFields);
  const availableFields = [...baseFields, ...extraFields];

  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [targetConfig, setTargetConfig] = useState<{ [key: string]: any }>({});
  const [iconSearch, setIconSearch] = useState<{ [key: string]: string }>({});
  const [colorPickerOpen, setColorPickerOpen] = useState<{ [key: string]: boolean }>({});
  const [colorPickerPosition, setColorPickerPosition] = useState<{ top: number; left: number } | null>(null);
  const colorPickerRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const colorButtonRef = useRef<HTMLButtonElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypeForFieldSearch, setSelectedTypeForFieldSearch] = useState<string>('security');

  const filteredActions = actions;
  const totalPages = Math.ceil(filteredActions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedActions = filteredActions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.UserPlus;
  };

  const toggleColorPicker = (actionId: string) => {
    if (colorPickerOpen[actionId]) {
      setColorPickerOpen(prev => ({ ...prev, [actionId]: false }));
      setColorPickerPosition(null);
      return;
    }

    if (colorButtonRef.current) {
      const rect = colorButtonRef.current.getBoundingClientRect();
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

      setColorPickerPosition({ top, left });
    }

    setColorPickerOpen(prev => ({ ...prev, [actionId]: true }));
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
        setColorPickerPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [colorPickerOpen]);

  const handleAddAction = () => {
    const newAction = {
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: 'UserPlus',
      iconColor: '#3b82f6',
      targetType: 'user' as const,
      activities: [],
    };
    addAction(newAction);
    setExpandedAction(newAction.id);
  };

  const handleRemoveAction = (id: string) => {
    const action = actions.find(a => a.id === id);
    if (!confirm(`Удалить действие "${action?.name || id}"? Это действие нельзя отменить.`)) {
      return;
    }
    removeAction(id);
  };

  const handleUpdateAction = (id: string, updates: Partial<typeof actions[0]>) => {
    // Валидация названия
    if (updates.name !== undefined) {
      if (!updates.name.trim()) {
        return; // Нельзя установить пустое название
      }
    }
    updateAction(id, updates);
  };

  const updateTargetConfig = (actionId: string, config: any) => {
    setTargetConfig({ ...targetConfig, [actionId]: config });
  };

  const addActivity = (actionId: string, activityType: string) => {
    const activity = activityTypes.find(a => a.type === activityType);
    if (!activity) return;

    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    const newActivities = [...action.activities, { type: activity.type as any, label: activity.label }];
    updateAction(actionId, { activities: newActivities });
  };

  const removeActivity = (actionId: string, activityIndex: number) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    const newActivities = action.activities.filter((_, i) => i !== activityIndex);
    updateAction(actionId, { activities: newActivities });
  };

  const activeTypes = getTypes();

  const renderTargetSelector = (action: typeof actions[0]) => {
    const config = targetConfig[action.id] || {};

    switch (action.targetType) {
      case 'user':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Выбор пользователя
            </label>
            <select
              value={config.userId || ''}
              onChange={(e) => updateTargetConfig(action.id, { userId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">Выберите пользователя</option>
              <option value="u1">Иван Петров (ivan@company.com)</option>
              <option value="u2">Алексей Смирнов (alexey@company.com)</option>
            </select>
          </div>
        );

      case 'team':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Выбор команды
            </label>
            <select
              value={config.teamId || ''}
              onChange={(e) => updateTargetConfig(action.id, { teamId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">Выберите команду</option>
              {activeTypes.map(team => (
                <option key={team.id} value={team.id}>{team.label}</option>
              ))}
            </select>
          </div>
        );

      case 'custom':
        const selectedField = availableFields.find(f => f.id === config.fieldId);
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Тип инцидента для полей
              </label>
              <select
                value={selectedTypeForFieldSearch}
                onChange={(e) => {
                  setSelectedTypeForFieldSearch(e.target.value);
                  updateTargetConfig(action.id, { fieldSlug: '', value: '' });
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              >
                {activeTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Изменяемое поле
              </label>
              <select
                value={config.fieldId || ''}
                onChange={(e) => updateTargetConfig(action.id, { fieldId: e.target.value, value: '' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Выберите поле</option>
                {availableFields.map(field => (
                  <option key={field.id} value={field.id}>{field.name} ({field.type})</option>
                ))}
              </select>
            </div>

            {selectedField && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Значение поля
                </label>
                {selectedField.type === 'select' && (
                  <select
                    value={config.value || ''}
                    onChange={(e) => updateTargetConfig(action.id, { ...config, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="">Выберите значение</option>
                    {selectedField.selectOptions?.map((opt, idx) => (
                      <option key={idx} value={opt.label}>{opt.label}</option>
                    ))}
                  </select>
                )}
                {selectedField.type === 'boolean' && (
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`bool-${action.id}`}
                        checked={config.value === 'true'}
                        onChange={() => updateTargetConfig(action.id, { ...config, value: 'true' })}
                        className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-100">Да</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`bool-${action.id}`}
                        checked={config.value === 'false'}
                        onChange={() => updateTargetConfig(action.id, { ...config, value: 'false' })}
                        className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-100">Нет</span>
                    </label>
                  </div>
                )}
                {(selectedField.type === 'string' || selectedField.type === 'number') && (
                  <input
                    type={selectedField.type === 'number' ? 'number' : 'text'}
                    value={config.value || ''}
                    onChange={(e) => updateTargetConfig(action.id, { ...config, value: e.target.value })}
                    placeholder="Введите значение"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  />
                )}
                {selectedField.type === 'multiline' && (
                  <textarea
                    value={config.value || ''}
                    onChange={(e) => updateTargetConfig(action.id, { ...config, value: e.target.value })}
                    placeholder="Введите значение"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  />
                )}
              </div>
            )}
          </div>
        );

      case 'status':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Новый статус
            </label>
            <select
              value={config.status || ''}
              onChange={(e) => updateTargetConfig(action.id, { status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">Выберите статус</option>
              <option value="Открыт">Открыт</option>
              <option value="В работе">В работе</option>
              <option value="Расследование">Расследование</option>
              <option value="Закрыт">Закрыт</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Настройка действий</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Создайте автоматизированные действия для работы с инцидентами
        </p>
      </div>

      <div className="space-y-3">
        {paginatedActions.map((action) => {
          const IconComponent = getIconComponent(action.icon);
          const isExpanded = expandedAction === action.id;

          return (
            <div key={action.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    <ChevronDown className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                  </button>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${action.iconColor || '#3b82f6'}20` }}
                    >
                      <IconComponent
                        className="w-5 h-5"
                        style={{ color: action.iconColor || '#3b82f6' }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                        {action.name || 'Новое действие'}
                      </h4>
                      <p className="text-xs text-blue-800 dark:text-blue-400">{action.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isExpanded && (
                    <button
                      onClick={() => setExpandedAction(null)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Готово
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveAction(action.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Название действия
                      </label>
                      <input
                        type="text"
                        value={action.name}
                        onChange={(e) => handleUpdateAction(action.id, { name: e.target.value })}
                        placeholder="Назначить на"
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Тип цели
                      </label>
                      <select
                        value={action.targetType}
                        onChange={(e) => {
                          handleUpdateAction(action.id, { targetType: e.target.value as any });
                          updateTargetConfig(action.id, {});
                        }}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="user">Пользователь</option>
                        <option value="team">Команда</option>
                        <option value="status">Статус</option>
                        <option value="custom">Произвольное</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Описание
                      </label>
                      <textarea
                        value={action.description}
                        onChange={(e) => handleUpdateAction(action.id, { description: e.target.value })}
                        placeholder="Описание действия"
                        rows={2}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Иконка
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Поиск иконок..."
                          value={iconSearch[action.id] || ''}
                          onChange={(e) => setIconSearch({ ...iconSearch, [action.id]: e.target.value })}
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-100/50 dark:bg-blue-900/30">
                          {iconsList
                            .filter(icon => icon.toLowerCase().includes((iconSearch[action.id] || '').toLowerCase()))
                            .map((iconName) => {
                              const Icon = getIconComponent(iconName);
                              return (
                                <button
                                  key={iconName}
                                  type="button"
                                  onClick={() => handleUpdateAction(action.id, { icon: iconName })}
                                  className={`p-2 rounded-lg border-2 transition-all hover:bg-white flex flex-col items-center gap-1 ${
                                    action.icon === iconName
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
                            ref={(el) => { colorButtonRef.current = el; }}
                            onClick={() => toggleColorPicker(action.id)}
                            className="w-12 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors shadow-sm"
                            style={{ backgroundColor: action.iconColor || '#3b82f6' }}
                          />
                          {colorPickerOpen[action.id] && colorPickerPosition && (
                            <div
                              ref={(el) => { colorPickerRef.current[action.id] = el; }}
                              className="fixed p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[100] w-[260px] overflow-visible"
                              style={{
                                top: `${colorPickerPosition.top + 8}px`,
                                left: `${colorPickerPosition.left - 130}px`,
                              }}
                              data-color-picker
                            >
                              <HexColorPicker
                                color={action.iconColor || '#3b82f6'}
                                onChange={(color) => handleUpdateAction(action.id, { iconColor: color })}
                              />
                              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  HEX цвет
                                </label>
                                <div className="flex items-center gap-2 mb-3">
                                  <div
                                    className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                    style={{ backgroundColor: action.iconColor || '#3b82f6' }}
                                  />
                                  <input
                                    type="text"
                                    value={action.iconColor || '#3b82f6'}
                                    onChange={(e) => handleUpdateAction(action.id, { iconColor: e.target.value })}
                                    className="flex-1 px-3 py-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#000000"
                                  />
                                </div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  RGB значения
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                  {(['r', 'g', 'b'] as const).map((channel) => {
                                    const rgb = hexToRgb(action.iconColor || '#3b82f6');
                                    const channelMap = { r: 'R', g: 'G', b: 'B' };
                                    const valueMap = { r: rgb.r, g: rgb.g, b: rgb.b };
                                    return (
                                      <div key={channel}>
                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                          {channelMap[channel]}
                                        </label>
                                        <input
                                          type="number"
                                          value={valueMap[channel]}
                                          onChange={(e) => {
                                            const newRgb = { ...rgb, [channel]: parseInt(e.target.value) || 0 };
                                            const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
                                            handleUpdateAction(action.id, { iconColor: newHex });
                                          }}
                                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          min="0"
                                          max="255"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={action.iconColor || '#3b82f6'}
                          onChange={(e) => handleUpdateAction(action.id, { iconColor: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm font-mono border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                        Активности
                      </label>
                      <div className="space-y-2">
                        {action.activities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-blue-100/50 dark:bg-blue-900/30 p-3 rounded-lg"
                          >
                            <span className="text-sm text-gray-900 dark:text-gray-100">{activity.label}</span>
                            <button
                              onClick={() => removeActivity(action.id, index)}
                              className="ml-auto p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addActivity(action.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          value=""
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                        >
                          <option value="">Добавить активность...</option>
                          {activityTypes.map(type => (
                            <option key={type.type} value={type.type}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-span-2 pt-4 border-t border-blue-200 dark:border-blue-800">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                        Конфигурация цели
                      </label>
                      {renderTargetSelector(action)}
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
            Показано {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredActions.length)} из {filteredActions.length}
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

      <button
        onClick={handleAddAction}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить действие
      </button>
    </div>
  );
}
