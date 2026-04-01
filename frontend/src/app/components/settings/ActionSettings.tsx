import { useState, useRef } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import * as Icons from 'lucide-react';
import { CustomAction } from '../../types/settings.ts';
import { CustomField } from '../../types/settings.ts';
import { SYSTEM_INCIDENT_ACTIONS } from '../../config/incident-actions.ts';

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

// Mock data
const mockUsers = [
  { id: 'u1', name: 'Иван Петров', email: 'ivan@company.com' },
  { id: 'u2', name: 'Алексей Смирнов', email: 'alexey@company.com' },
  { id: 'u3', name: 'Мария Иванова', email: 'maria@company.com' },
  { id: 'u4', name: 'Дмитрий Козлов', email: 'dmitry@company.com' },
];

const mockTeams = [
  { id: 't1', name: 'SOC L1' },
  { id: 't2', name: 'SOC L2' },
  { id: 't3', name: 'DLP' },
];

const mockFields: CustomField[] = [
  { id: 'f1', name: 'Статус', slug: 'status', type: 'select', icon: 'Activity', iconColor: 'blue', required: true, selectOptions: [{ label: 'Открыт', borderColor: '#3b82f6', textColor: '#1d4ed8', bgColor: '#dbeafe' }, { label: 'Закрыт', borderColor: '#6b7280', textColor: '#374151', bgColor: '#f3f4f6' }, { label: 'Расследование', borderColor: '#8b5cf6', textColor: '#6d28d9', bgColor: '#ede9fe' }, { label: 'Ложный', borderColor: '#ef4444', textColor: '#b91c1c', bgColor: '#fee2e2' }] },
  { id: 'f2', name: 'Приоритет', slug: 'priority', type: 'select', icon: 'Flag', iconColor: 'orange', required: false, selectOptions: [{ label: 'Низкий', borderColor: '#22c55e', textColor: '#15803d', bgColor: '#dcfce7' }, { label: 'Средний', borderColor: '#f59e0b', textColor: '#b45309', bgColor: '#fef3c7' }, { label: 'Высокий', borderColor: '#ef4444', textColor: '#b91c1c', bgColor: '#fee2e2' }] },
  { id: 'f3', name: 'Ответственный', slug: 'assignee', type: 'string', icon: 'User', iconColor: 'green', required: true },
  { id: 'f7', name: 'Описание', slug: 'description', type: 'multiline', icon: 'FileText', iconColor: 'gray', required: false },
  { id: 'f11', name: 'Требуется эскалация', slug: 'needs_escalation', type: 'boolean', icon: 'AlertCircle', iconColor: 'red', required: false },
];

export default function ActionSettings() {
  const [actions, setActions] = useState<CustomAction[]>([
    ...SYSTEM_INCIDENT_ACTIONS.slice(0, 2).map((action, index) => ({
      id: String(index + 1),
      name: action.name,
      description: action.description,
      icon: action.icon,
      iconColor: action.iconColor,
      targetType: action.targetType,
      activities: [
        { type: 'email', label: 'Отправить письмо' }
      ]
    }))
  ]);

  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [targetConfig, setTargetConfig] = useState<{ [key: string]: any }>({});
  const [iconSearch, setIconSearch] = useState<{ [key: string]: string }>({});
  const [colorPickerOpen, setColorPickerOpen] = useState<{ [key: string]: boolean }>({});
  const colorPickerRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.UserPlus;
  };

  const toggleColorPicker = (actionId: string) => {
    setColorPickerOpen(prev => ({ ...prev, [actionId]: !prev[actionId] }));
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

  const addAction = () => {
    const newAction: CustomAction = {
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: 'UserPlus',
      iconColor: '#3b82f6',
      targetType: 'user',
      activities: []
    };
    setActions([...actions, newAction]);
    setExpandedAction(newAction.id);
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
    const newConfig = { ...targetConfig };
    delete newConfig[id];
    setTargetConfig(newConfig);
  };

  const updateAction = (id: string, updates: Partial<CustomAction>) => {
    setActions(actions.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const updateTargetConfig = (actionId: string, config: any) => {
    setTargetConfig({ ...targetConfig, [actionId]: config });
  };

  const addActivity = (actionId: string, activityType: string) => {
    const activity = activityTypes.find(a => a.type === activityType);
    if (!activity) return;

    setActions(actions.map(a =>
      a.id === actionId
        ? { ...a, activities: [...a.activities, { type: activity.type as any, label: activity.label }] }
        : a
    ));
  };

  const removeActivity = (actionId: string, activityIndex: number) => {
    setActions(actions.map(a =>
      a.id === actionId
        ? { ...a, activities: a.activities.filter((_, i) => i !== activityIndex) }
        : a
    ));
  };

  const renderTargetSelector = (action: CustomAction) => {
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
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
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
              {mockTeams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        );

      case 'custom':
        const selectedField = mockFields.find(f => f.id === config.fieldId);
        return (
          <div className="space-y-3">
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
                {mockFields.map(field => (
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
                    {selectedField.id === 'f1' && (
                      <>
                        <option value="Открыт">Открыт</option>
                        <option value="В работе">В работе</option>
                        <option value="Закрыт">Закрыт</option>
                        <option value="Расследование">Расследование</option>
                      </>
                    )}
                    {selectedField.id === 'f2' && (
                      <>
                        <option value="Низкий">Низкий</option>
                        <option value="Средний">Средний</option>
                        <option value="Высокий">Высокий</option>
                        <option value="Критический">Критический</option>
                      </>
                    )}
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
        {actions.map((action) => {
          const IconComponent = getIconComponent(action.icon);
          const isExpanded = expandedAction === action.id;

          return (
            <div key={action.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                  <button
                    onClick={() => removeAction(action.id)}
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
                        onChange={(e) => updateAction(action.id, { name: e.target.value })}
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
                          updateAction(action.id, { targetType: e.target.value as any });
                          updateTargetConfig(action.id, {});
                        }}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="user">Пользователь</option>
                        <option value="team">Команда</option>
                        <option value="custom">Произвольное</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Описание
                      </label>
                      <textarea
                        value={action.description}
                        onChange={(e) => updateAction(action.id, { description: e.target.value })}
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
                                  onClick={() => updateAction(action.id, { icon: iconName })}
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
                            onClick={() => toggleColorPicker(action.id)}
                            className="w-12 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors shadow-sm"
                            style={{ backgroundColor: action.iconColor || '#3b82f6' }}
                          />
                          {colorPickerOpen[action.id] && (
                            <div 
                              ref={(el) => { colorPickerRef.current[action.id] = el; }}
                              className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[100] w-[260px] overflow-visible" 
                              data-color-picker
                            >
                              <HexColorPicker
                                color={action.iconColor || '#3b82f6'}
                                onChange={(color) => updateAction(action.id, { iconColor: color })}
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
                                    onChange={(e) => updateAction(action.id, { iconColor: e.target.value })}
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
                                            updateAction(action.id, { iconColor: newHex });
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
                          {action.iconColor || '#3b82f6'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Target Selector */}
                  <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                    {renderTargetSelector(action)}
                  </div>

                  <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Автоматические активности</h5>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addActivity(action.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="text-sm px-3 py-1.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="">Добавить активность</option>
                        {activityTypes.map((activity) => (
                          <option key={activity.type} value={activity.type}>
                            {activity.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      {action.activities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-blue-100/50 dark:bg-blue-900/30 p-3 rounded-lg"
                        >
                          <span className="text-sm text-gray-900 dark:text-gray-100">{activity.label}</span>
                          <button
                            onClick={() => removeActivity(action.id, index)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {action.activities.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Нет активностей. Добавьте автоматическую активность.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={addAction}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить действие
      </button>

      <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
