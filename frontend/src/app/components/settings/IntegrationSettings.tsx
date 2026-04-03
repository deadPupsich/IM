import { useState } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

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
      fields: [],
      isExpanded: true
    };
    setIntegrations([...integrations, newIntegration]);
  };

  const removeIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!confirm(`Удалить интеграцию "${integration?.name || id}"? Это действие нельзя отменить.`)) {
      return;
    }
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
    if (!confirm('Удалить это поле маппинга?')) {
      return;
    }
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
          Настройте интеграции для приема инцидентов из внешних систем
        </p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleIntegration(integration.id)}
                  className="shrink-0 mt-0.5"
                >
                  <ChevronDown className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform ${integration.isExpanded ? '' : '-rotate-90'}`} />
                </button>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    {integration.name || 'Новая интеграция'}
                  </h4>
                  <p className="text-xs text-blue-800 dark:text-blue-400 mt-0.5">
                    Укажите параметры интеграции
                  </p>
                </div>
              </div>
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
                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                      Название интеграции
                    </label>
                    <input
                      type="text"
                      value={integration.name}
                      onChange={(e) => updateIntegration(integration.id, 'name', e.target.value)}
                      placeholder="SIEM Integration"
                      className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                      Тип инцидента
                    </label>
                    <select
                      value={integration.incidentType}
                      onChange={(e) => updateIntegration(integration.id, 'incidentType', e.target.value)}
                      className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                      {incidentTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Маппинг полей</h5>
                    <button
                      onClick={() => addField(integration.id)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
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
                          className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <span className="text-gray-400">→</span>
                        <select
                          value={field.internalField}
                          onChange={(e) => updateField(integration.id, field.id, 'internalField', e.target.value)}
                          className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                        >
                          {internalFields.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                        <select
                          value={field.fieldType}
                          onChange={(e) => updateField(integration.id, field.id, 'fieldType', e.target.value)}
                          className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
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
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить интеграцию
      </button>

      <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
