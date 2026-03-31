import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import * as Icons from 'lucide-react';
import { CustomAction, ActionActivity } from '../../types/settings';
import { CustomField } from '../../types/settings';
import { SYSTEM_INCIDENT_ACTIONS } from '../../config/incident-actions';

const iconsList = [
  'UserPlus', 'UserCheck', 'Mail', 'MessageSquare', 'Send', 'CheckCircle',
  'XCircle', 'AlertCircle', 'Edit', 'Trash2', 'Archive', 'Flag'
];

const colorOptions = [
  { name: 'Синий', value: 'blue', bg: 'bg-blue-100', text: 'text-blue-600' },
  { name: 'Зеленый', value: 'green', bg: 'bg-green-100', text: 'text-green-600' },
  { name: 'Красный', value: 'red', bg: 'bg-red-100', text: 'text-red-600' },
  { name: 'Желтый', value: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { name: 'Фиолетовый', value: 'purple', bg: 'bg-purple-100', text: 'text-purple-600' },
  { name: 'Оранжевый', value: 'orange', bg: 'bg-orange-100', text: 'text-orange-600' }
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
  { id: 'f1', name: 'статус', slug: 'status', type: 'select', icon: 'Activity', iconColor: 'blue', required: true, selectOptions: ['Открыт', 'Закрыт', 'Расследование', 'Ложный'] },
  { id: 'f2', name: 'приоритет', slug: 'priority', type: 'select', icon: 'Flag', iconColor: 'orange', required: false, selectOptions: ['Низкий', 'Средний', 'Высокий'] },
  { id: 'f3', name: 'ответственный', slug: 'assignee', type: 'string', icon: 'User', iconColor: 'green', required: true },
  { id: 'f4', name: 'описание', slug: 'description', type: 'multiline', icon: 'FileText', iconColor: 'gray', required: false },
  { id: 'f5', name: 'закрыт', slug: 'closed', type: 'boolean', icon: 'CheckCircle', iconColor: 'green', required: false },
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

  const addAction = () => {
    const newAction: CustomAction = {
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: 'UserPlus',
      iconColor: 'blue',
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

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.UserPlus;
  };

  const getColorClasses = (color: string) => {
    const colorOption = colorOptions.find(c => c.value === color);
    return colorOption || colorOptions[0];
  };

  const renderTargetSelector = (action: CustomAction) => {
    const config = targetConfig[action.id] || {};

    switch (action.targetType) {
      case 'user':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Выбор пользователя
            </label>
            <select
              value={config.userId || ''}
              onChange={(e) => updateTargetConfig(action.id, { userId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Выбор команды
            </label>
            <select
              value={config.teamId || ''}
              onChange={(e) => updateTargetConfig(action.id, { teamId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Изменяемое поле
              </label>
              <select
                value={config.fieldId || ''}
                onChange={(e) => updateTargetConfig(action.id, { fieldId: e.target.value, value: '' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите поле</option>
                {mockFields.map(field => (
                  <option key={field.id} value={field.id}>{field.name} ({field.type})</option>
                ))}
              </select>
            </div>

            {selectedField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Значение поля
                </label>
                {selectedField.type === 'select' && (
                  <select
                    value={config.value || ''}
                    onChange={(e) => updateTargetConfig(action.id, { ...config, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <span className="text-sm">Да</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`bool-${action.id}`}
                        checked={config.value === 'false'}
                        onChange={() => updateTargetConfig(action.id, { ...config, value: 'false' })}
                        className="text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                      />
                      <span className="text-sm">Нет</span>
                    </label>
                  </div>
                )}
                {(selectedField.type === 'string' || selectedField.type === 'number') && (
                  <input
                    type={selectedField.type === 'number' ? 'number' : 'text'}
                    value={config.value || ''}
                    onChange={(e) => updateTargetConfig(action.id, { ...config, value: e.target.value })}
                    placeholder="Введите значение"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {selectedField.type === 'multiline' && (
                  <textarea
                    value={config.value || ''}
                    onChange={(e) => updateTargetConfig(action.id, { ...config, value: e.target.value })}
                    placeholder="Введите значение"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <button
        onClick={addAction}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить действие
      </button>

      <div className="space-y-3">
        {actions.map((action) => {
          const IconComponent = getIconComponent(action.icon);
          const colorClasses = getColorClasses(action.iconColor);
          const isExpanded = expandedAction === action.id;

          return (
            <div key={action.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {action.name || 'Новое действие'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Название действия
                        </label>
                        <input
                          type="text"
                          value={action.name}
                          onChange={(e) => updateAction(action.id, { name: e.target.value })}
                          placeholder="Назначить на"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Тип цели
                        </label>
                        <select
                          value={action.targetType}
                          onChange={(e) => {
                            updateAction(action.id, { targetType: e.target.value as any });
                            updateTargetConfig(action.id, {});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="user">Пользователь</option>
                          <option value="team">Команда</option>
                          <option value="custom">Произвольное</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Описание
                        </label>
                        <textarea
                          value={action.description}
                          onChange={(e) => updateAction(action.id, { description: e.target.value })}
                          placeholder="Описание действия"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Иконка
                        </label>
                        <select
                          value={action.icon}
                          onChange={(e) => updateAction(action.id, { icon: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {iconsList.map((icon) => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Цвет иконки
                        </label>
                        <div className="flex gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => updateAction(action.id, { iconColor: color.value })}
                              className={`w-8 h-8 rounded-lg ${color.bg} border-2 transition-all ${
                                action.iconColor === color.value
                                  ? 'border-gray-900 scale-110'
                                  : 'border-transparent hover:border-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Target Selector */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      {renderTargetSelector(action)}
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Автоматические активности</h5>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addActivity(action.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-lg"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{activity.label}</span>
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
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
