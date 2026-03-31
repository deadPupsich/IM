import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface FieldMapping {
  id: string;
  externalField: string;
  internalField: string;
  fieldType: 'string' | 'multiline' | 'datetime' | 'file';
}

interface Integration {
  id: string;
  name: string;
  incidentType: string;
  endpoint: string;
  fields: FieldMapping[];
  isExpanded: boolean;
}

const incidentTypes = ['Безопасность', 'DLP', 'Сеть', 'Вредоносное ПО', 'Другое'];
const internalFields = ['название', 'ответственный', 'источник', 'хост', 'login', 'статус', 'дата', 'описание'];

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'SIEM Integration',
      incidentType: 'Безопасность',
      endpoint: '/api/incidents/siem',
      fields: [
        { id: 'f1', externalField: 'alert_title', internalField: 'название', fieldType: 'string' },
        { id: 'f2', externalField: 'timestamp', internalField: 'дата', fieldType: 'datetime' }
      ],
      isExpanded: false
    }
  ]);

  const addIntegration = () => {
    const newIntegration: Integration = {
      id: Date.now().toString(),
      name: '',
      incidentType: incidentTypes[0],
      endpoint: '',
      fields: [],
      isExpanded: true
    };
    setIntegrations([...integrations, newIntegration]);
  };

  const removeIntegration = (id: string) => {
    setIntegrations(integrations.filter(i => i.id !== id));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(i => 
      i.id === id ? { ...i, isExpanded: !i.isExpanded } : i
    ));
  };

  const updateIntegration = (id: string, field: keyof Integration, value: any) => {
    setIntegrations(integrations.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const addField = (integrationId: string) => {
    const newField: FieldMapping = {
      id: Date.now().toString(),
      externalField: '',
      internalField: internalFields[0],
      fieldType: 'string'
    };
    
    setIntegrations(integrations.map(i => 
      i.id === integrationId ? { ...i, fields: [...i.fields, newField] } : i
    ));
  };

  const removeField = (integrationId: string, fieldId: string) => {
    setIntegrations(integrations.map(i => 
      i.id === integrationId ? { ...i, fields: i.fields.filter(f => f.id !== fieldId) } : i
    ));
  };

  const updateField = (integrationId: string, fieldId: string, field: keyof FieldMapping, value: any) => {
    setIntegrations(integrations.map(i => 
      i.id === integrationId 
        ? { ...i, fields: i.fields.map(f => f.id === fieldId ? { ...f, [field]: value } : f) }
        : i
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Настройка интеграций</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Настройте API endpoints для приема инцидентов из внешних систем
        </p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleIntegration(integration.id)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                {integration.isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {integration.name || 'Новая интеграция'}
                </h4>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                  {integration.incidentType}
                </span>
              </button>
              <button
                onClick={() => removeIntegration(integration.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {integration.isExpanded && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Название интеграции
                    </label>
                    <input
                      type="text"
                      value={integration.name}
                      onChange={(e) => updateIntegration(integration.id, 'name', e.target.value)}
                      placeholder="SIEM Integration"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Тип инцидента
                    </label>
                    <select
                      value={integration.incidentType}
                      onChange={(e) => updateIntegration(integration.id, 'incidentType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {incidentTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      API Endpoint
                    </label>
                    <input
                      type="text"
                      value={integration.endpoint}
                      onChange={(e) => updateIntegration(integration.id, 'endpoint', e.target.value)}
                      placeholder="/api/incidents/siem"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Маппинг полей</h5>
                    <button
                      onClick={() => addField(integration.id)}
                      className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить поле
                    </button>
                  </div>

                  <div className="space-y-2">
                    {integration.fields.map((field) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={field.externalField}
                          onChange={(e) => updateField(integration.id, field.id, 'externalField', e.target.value)}
                          placeholder="Внешнее поле"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-400">→</span>
                        <select
                          value={field.internalField}
                          onChange={(e) => updateField(integration.id, field.id, 'internalField', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {internalFields.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                        <select
                          value={field.fieldType}
                          onChange={(e) => updateField(integration.id, field.id, 'fieldType', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="string">Строка</option>
                          <option value="multiline">Многострочное</option>
                          <option value="datetime">Дата-время</option>
                          <option value="file">Файл</option>
                        </select>
                        <button
                          onClick={() => removeField(integration.id, field.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addIntegration}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить интеграцию
      </button>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
