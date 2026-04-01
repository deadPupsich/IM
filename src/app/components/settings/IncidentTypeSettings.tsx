import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { CustomField } from '../../types/settings';

interface IncidentField {
  id: string;
  fieldId: string;
  required: boolean;
}

interface IncidentType {
  id: string;
  name: string;
  description: string;
  fields: IncidentField[];
  actions: string[];
  isExpanded: boolean;
}

// Mock data for fields (в реальности будет из FieldSettings)
const availableFields: CustomField[] = [
  { id: 'f1', name: 'Название', slug: 'title', type: 'string', icon: 'FileText', iconColor: 'blue', required: true, slugLocked: true },
  { id: 'f2', name: 'Ответственный', slug: 'assignee', type: 'string', icon: 'User', iconColor: 'green', required: true, slugLocked: true },
  { id: 'f3', name: 'Источник', slug: 'source', type: 'string', icon: 'Database', iconColor: 'purple', required: true, slugLocked: true },
  { id: 'f4', name: 'Нарушитель', slug: 'login', type: 'string', icon: 'AlertTriangle', iconColor: 'red', required: true, description: 'Это должен быть логин пользователя из AD', slugLocked: true },
  { id: 'f9', name: 'Хост', slug: 'host', type: 'string', icon: 'Monitor', iconColor: 'gray', required: true, slugLocked: true },
  { id: 'f5', name: 'Статус', slug: 'status', type: 'select', icon: 'Activity', iconColor: 'indigo', required: true, selectOptions: [{ label: 'Открыт', borderColor: '#3b82f6', textColor: '#1d4ed8', bgColor: '#dbeafe' }, { label: 'Закрыт', borderColor: '#6b7280', textColor: '#374151', bgColor: '#f3f4f6' }, { label: 'Расследование', borderColor: '#8b5cf6', textColor: '#6d28d9', bgColor: '#ede9fe' }, { label: 'Ложный', borderColor: '#ef4444', textColor: '#b91c1c', bgColor: '#fee2e2' }], slugLocked: true },
  { id: 'f6', name: 'Дата обнаружения', slug: 'detected_at', type: 'datetime', icon: 'Calendar', iconColor: 'pink', required: true, slugLocked: true },
  { id: 'f7', name: 'Описание', slug: 'description', type: 'multiline', icon: 'FileText', iconColor: 'gray', required: false, slugLocked: true },
  { id: 'f8', name: 'Приоритет', slug: 'priority', type: 'select', icon: 'Flag', iconColor: 'orange', required: false, selectOptions: [{ label: 'Низкий', borderColor: '#22c55e', textColor: '#15803d', bgColor: '#dcfce7' }, { label: 'Средний', borderColor: '#f59e0b', textColor: '#b45309', bgColor: '#fef3c7' }, { label: 'Высокий', borderColor: '#ef4444', textColor: '#b91c1c', bgColor: '#fee2e2' }], slugLocked: true },
  { id: 'f10', name: 'Время реакции (мин)', slug: 'response_time', type: 'number', icon: 'Clock', iconColor: 'cyan', required: false },
  { id: 'f11', name: 'Требуется эскалация', slug: 'needs_escalation', type: 'boolean', icon: 'AlertCircle', iconColor: 'red', required: false },
  { id: 'f12', name: 'Файлы доказательств', slug: 'evidence_files', type: 'file', icon: 'Paperclip', iconColor: 'slate', required: false },
  { id: 'f14', name: 'Затронутые системы', slug: 'affected_systems', type: 'select', icon: 'Server', iconColor: 'blue', required: false, selectOptions: [{ label: 'Active Directory', borderColor: '#2563eb', textColor: '#1e40af', bgColor: '#dbeafe' }, { label: 'Exchange', borderColor: '#059669', textColor: '#065f46', bgColor: '#d1fae5' }, { label: 'File Server', borderColor: '#d97706', textColor: '#92400e', bgColor: '#fef3c7' }], allowMultiple: true },
];

const availableActions = [
  { id: 'a1', name: 'Назначить на', icon: 'UserPlus', color: 'blue' },
  { id: 'a2', name: 'Изменить статус', icon: 'CheckCircle', color: 'green' },
  { id: 'a3', name: 'Добавить комментарий', icon: 'MessageSquare', color: 'purple' },
  { id: 'a4', name: 'Закрыть инцидент', icon: 'XCircle', color: 'red' },
];

export default function IncidentTypeSettings() {
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([
    {
      id: '1',
      name: 'Безопасность',
      description: 'Инциденты безопасности и несанкционированного доступа',
      fields: [
        { id: 'if1', fieldId: 'f1', required: true },
        { id: 'if2', fieldId: 'f2', required: true },
      ],
      actions: ['a1', 'a2'],
      isExpanded: false
    }
  ]);

  const [fieldSearch, setFieldSearch] = useState<{ [key: string]: string }>({});
  const [actionSearch, setActionSearch] = useState<{ [key: string]: string }>({});

  const addIncidentType = () => {
    const newType: IncidentType = {
      id: Date.now().toString(),
      name: '',
      description: '',
      fields: [],
      actions: [],
      isExpanded: true
    };
    setIncidentTypes([...incidentTypes, newType]);
  };

  const removeIncidentType = (id: string) => {
    setIncidentTypes(incidentTypes.filter(t => t.id !== id));
  };

  const toggleIncidentType = (id: string) => {
    setIncidentTypes(incidentTypes.map(t => 
      t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
    ));
  };

  const updateIncidentType = (id: string, field: keyof IncidentType, value: any) => {
    setIncidentTypes(incidentTypes.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const addFieldToType = (typeId: string, fieldId: string) => {
    const newField: IncidentField = {
      id: Date.now().toString(),
      fieldId,
      required: false
    };
    
    setIncidentTypes(incidentTypes.map(t => 
      t.id === typeId ? { ...t, fields: [...t.fields, newField] } : t
    ));
  };

  const removeFieldFromType = (typeId: string, fieldId: string) => {
    setIncidentTypes(incidentTypes.map(t => 
      t.id === typeId ? { ...t, fields: t.fields.filter(f => f.id !== fieldId) } : t
    ));
  };

  const updateFieldInType = (typeId: string, fieldId: string, required: boolean) => {
    setIncidentTypes(incidentTypes.map(t => 
      t.id === typeId 
        ? { ...t, fields: t.fields.map(f => f.id === fieldId ? { ...f, required } : f) }
        : t
    ));
  };

  const toggleAction = (typeId: string, actionId: string) => {
    setIncidentTypes(incidentTypes.map(t => {
      if (t.id !== typeId) return t;
      const hasAction = t.actions.includes(actionId);
      return {
        ...t,
        actions: hasAction 
          ? t.actions.filter(a => a !== actionId)
          : [...t.actions, actionId]
      };
    }));
  };

  const getFieldById = (fieldId: string) => availableFields.find(f => f.id === fieldId);
  const getActionById = (actionId: string) => availableActions.find(a => a.id === actionId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Настройка типов инцидентов</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Создайте типы инцидентов и настройте необходимые поля и действия для каждого типа
        </p>
      </div>

      <div className="space-y-4">
        {incidentTypes.map((type) => (
          <div key={type.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleIncidentType(type.id)}
                  className="flex-shrink-0 mt-0.5"
                >
                  <ChevronDown className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform ${type.isExpanded ? '' : '-rotate-90'}`} />
                </button>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    {type.name || 'Новый тип инцидента'}
                  </h4>
                  {type.description && (
                    <p className="text-xs text-blue-800 dark:text-blue-400 mt-0.5">{type.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeIncidentType(type.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {type.isExpanded && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                      Название типа
                    </label>
                    <input
                      type="text"
                      value={type.name}
                      onChange={(e) => updateIncidentType(type.id, 'name', e.target.value)}
                      placeholder="Безопасность"
                      className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                      Описание
                    </label>
                    <textarea
                      value={type.description}
                      onChange={(e) => updateIncidentType(type.id, 'description', e.target.value)}
                      placeholder="Описание типа инцидента"
                      rows={2}
                      className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Fields Section */}
                <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                  <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">Поля инцидента</h5>

                  <div className="mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Поиск полей..."
                        value={fieldSearch[type.id] || ''}
                        onChange={(e) => setFieldSearch({ ...fieldSearch, [type.id]: e.target.value })}
                        className="w-full rounded-lg border border-blue-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>

                    <div className="mt-2 max-h-40 overflow-y-auto bg-blue-100/50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      {availableFields
                        .filter(f =>
                          f.name.toLowerCase().includes((fieldSearch[type.id] || '').toLowerCase()) &&
                          !type.fields.some(tf => tf.fieldId === f.id)
                        )
                        .map(field => (
                          <button
                            key={field.id}
                            onClick={() => addFieldToType(type.id, field.id)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-between"
                          >
                            <span className="text-gray-900 dark:text-gray-100">{field.name}</span>
                            <Plus className="w-4 h-4 text-gray-400" />
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {type.fields.map((field) => {
                      const fieldData = getFieldById(field.fieldId);
                      if (!fieldData) return null;

                      return (
                        <div
                          key={field.id}
                          className="flex items-center gap-2 bg-blue-100/50 dark:bg-blue-900/30 p-3 rounded-lg"
                        >
                          <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">{fieldData.name}</span>
                          <span className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded">{fieldData.type}</span>

                          <button
                            onClick={() => removeFieldFromType(type.id, field.id)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                  <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">Доступные действия</h5>

                  <div className="mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Поиск действий..."
                        value={actionSearch[type.id] || ''}
                        onChange={(e) => setActionSearch({ ...actionSearch, [type.id]: e.target.value })}
                        className="w-full rounded-lg border border-blue-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>

                    <div className="mt-2 max-h-40 overflow-y-auto bg-blue-100/50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      {availableActions
                        .filter(a =>
                          a.name.toLowerCase().includes((actionSearch[type.id] || '').toLowerCase()) &&
                          !type.actions.includes(a.id)
                        )
                        .map(action => (
                          <button
                            key={action.id}
                            onClick={() => toggleAction(type.id, action.id)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-between"
                          >
                            <span className="text-gray-900 dark:text-gray-100">{action.name}</span>
                            <Plus className="w-4 h-4 text-gray-400" />
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {type.actions.map((actionId) => {
                      const actionData = getActionById(actionId);
                      if (!actionData) return null;

                      return (
                        <div
                          key={actionId}
                          className="flex items-center gap-2 bg-blue-100/50 dark:bg-blue-900/30 p-3 rounded-lg"
                        >
                          <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">{actionData.name}</span>

                          <button
                            onClick={() => toggleAction(type.id, actionId)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addIncidentType}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить тип инцидента
      </button>

      <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
