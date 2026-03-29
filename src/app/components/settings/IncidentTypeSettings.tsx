import { useState, useRef } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Search, GripVertical } from 'lucide-react';
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
  { id: 'f1', name: 'название', type: 'string', icon: 'FileText', iconColor: 'blue', required: true },
  { id: 'f2', name: 'ответственный', type: 'string', icon: 'User', iconColor: 'green', required: true },
  { id: 'f3', name: 'источник', type: 'string', icon: 'Database', iconColor: 'purple', required: true },
  { id: 'f4', name: 'нарушитель', type: 'string', icon: 'AlertTriangle', iconColor: 'red', required: true },
  { id: 'f5', name: 'статус', type: 'select', icon: 'Activity', iconColor: 'indigo', required: true },
  { id: 'f6', name: 'дата', type: 'datetime', icon: 'Calendar', iconColor: 'pink', required: true },
  { id: 'f7', name: 'описание', type: 'multiline', icon: 'FileText', iconColor: 'gray', required: false },
  { id: 'f8', name: 'приоритет', type: 'select', icon: 'Flag', iconColor: 'orange', required: false },
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
  const [draggedActionIndex, setDraggedActionIndex] = useState<number | null>(null);
  const dragOverIndexRef = useRef<number | null>(null);

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

  const handleActionDragStart = (e: React.DragEvent, index: number) => {
    setDraggedActionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleActionDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIndexRef.current = index;
  };

  const handleActionDrop = (e: React.DragEvent, typeId: string) => {
    e.preventDefault();
    
    if (draggedActionIndex === null || dragOverIndexRef.current === null) return;
    if (draggedActionIndex === dragOverIndexRef.current) return;

    setIncidentTypes(incidentTypes.map(t => {
      if (t.id !== typeId) return t;
      
      const newActions = [...t.actions];
      const [draggedAction] = newActions.splice(draggedActionIndex, 1);
      newActions.splice(dragOverIndexRef.current!, 0, draggedAction);
      
      return { ...t, actions: newActions };
    }));

    setDraggedActionIndex(null);
    dragOverIndexRef.current = null;
  };

  const getFieldById = (fieldId: string) => availableFields.find(f => f.id === fieldId);
  const getActionById = (actionId: string) => availableActions.find(a => a.id === actionId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Настройка типов инцидентов</h3>
        <p className="text-sm text-gray-600 mb-6">
          Создайте типы инцидентов и настройте необходимые поля и действия для каждого типа
        </p>
      </div>

      <div className="space-y-4">
        {incidentTypes.map((type) => (
          <div key={type.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <button
                onClick={() => toggleIncidentType(type.id)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                {type.isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {type.name || 'Новый тип инцидента'}
                  </h4>
                  {type.description && (
                    <p className="text-xs text-gray-600 mt-0.5">{type.description}</p>
                  )}
                </div>
              </button>
              <button
                onClick={() => removeIncidentType(type.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {type.isExpanded && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название типа
                    </label>
                    <input
                      type="text"
                      value={type.name}
                      onChange={(e) => updateIncidentType(type.id, 'name', e.target.value)}
                      placeholder="Безопасность"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Описание
                    </label>
                    <textarea
                      value={type.description}
                      onChange={(e) => updateIncidentType(type.id, 'description', e.target.value)}
                      placeholder="Описание типа инцидента"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Fields Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Поля инцидента</h5>
                  
                  <div className="mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Поиск полей..."
                        value={fieldSearch[type.id] || ''}
                        onChange={(e) => setFieldSearch({ ...fieldSearch, [type.id]: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="mt-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200">
                      {availableFields
                        .filter(f => 
                          f.name.toLowerCase().includes((fieldSearch[type.id] || '').toLowerCase()) &&
                          !type.fields.some(tf => tf.fieldId === f.id)
                        )
                        .map(field => (
                          <button
                            key={field.id}
                            onClick={() => addFieldToType(type.id, field.id)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between"
                          >
                            <span>{field.name}</span>
                            <Plus className="w-4 h-4 text-gray-400" />
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {type.fields.map((field, index) => {
                      const fieldData = getFieldById(field.fieldId);
                      if (!fieldData) return null;

                      return (
                        <div
                          key={field.id}
                          className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
                        >
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          
                          <span className="flex-1 text-sm text-gray-700">{fieldData.name}</span>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{fieldData.type}</span>
                          
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateFieldInType(type.id, field.id, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-700">Обязательное</span>
                          </label>
                          
                          <button
                            onClick={() => removeFieldFromType(type.id, field.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Доступные действия</h5>
                  
                  <div className="mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Поиск действий..."
                        value={actionSearch[type.id] || ''}
                        onChange={(e) => setActionSearch({ ...actionSearch, [type.id]: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {availableActions
                      .filter(a => 
                        a.name.toLowerCase().includes((actionSearch[type.id] || '').toLowerCase())
                      )
                      .map(action => (
                        <button
                          key={action.id}
                          onClick={() => toggleAction(type.id, action.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                            type.actions.includes(action.id)
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span>{action.name}</span>
                        </button>
                      ))}
                  </div>

                  {type.actions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Порядок отображения (перетащите для изменения):</p>
                      <div className="space-y-1">
                        {type.actions.map((actionId, index) => {
                          const action = getActionById(actionId);
                          if (!action) return null;

                          return (
                            <div
                              key={actionId}
                              draggable
                              onDragStart={(e) => handleActionDragStart(e, index)}
                              onDragOver={(e) => handleActionDragOver(e, index)}
                              onDrop={(e) => handleActionDrop(e, type.id)}
                              className={`flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg cursor-move hover:bg-blue-100 transition-colors ${
                                draggedActionIndex === index ? 'opacity-50' : ''
                              }`}
                            >
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{action.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addIncidentType}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить тип инцидента
      </button>

      <div className="pt-6 border-t border-gray-200">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
