import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronDown, FileText, User, Database, FileStack, AlertTriangle } from 'lucide-react';
import { DynamicColumnKey, Incident } from '../types/incident';
import ExportButtons from './ExportButtons';
import { getIncidentColumnValue, getIncidentTypeDefinition } from '../config/incident-config';

interface IncidentRowProps {
  incident: Incident;
  columns: { key: DynamicColumnKey; label: string; width: number }[];
}

export default function IncidentRow({ incident, columns }: IncidentRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const incidentType = getIncidentTypeDefinition(incident.типИнцидента);

  const handleRowClick = () => {
    navigate(`/incident/${incident.id}`);
  };

  return (
      <>
        <div className="flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div
              className="w-12 flex items-center justify-center border-r border-gray-200 dark:border-gray-700 flex-shrink-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
          >
            {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </div>

          <div
              className="flex flex-1 min-w-0 cursor-pointer"
              onClick={handleRowClick}
          >
            {columns.map((col, index) => (
                <div
                    key={col.key}
                    className={`px-4 py-3 text-sm text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 ${
                        index === columns.length - 1 ? 'border-r-0' : ''
                    } truncate flex-shrink-0`}
                    style={{ width: `${col.width}px` }}
                >
                  {getIncidentColumnValue(incident, col.key)}
                </div>
            ))}
          </div>
        </div>

        {isExpanded && (
            <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="max-w-4xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Детали инцидента</h3>

                <div className="mb-4">
                  <ExportButtons incident={incident} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Название</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{incident.название}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Тип: {incidentType?.label ?? incident.типИнцидента}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ответственный</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{incident.ответственный}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Источник</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{incident.источник}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Нарушитель</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{incident.нарушитель}</div>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileStack className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Список файлов</div>
                      {incident.списокФайлов.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {incident.списокФайлов.map((file, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300"
                                >
                          <FileText className="w-3 h-3" />
                                  {file}
                        </span>
                            ))}
                          </div>
                      ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">Нет прикрепленных файлов</div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Статус</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{incident.статус}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Команда</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{incident.команда}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Дата создания</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{incident.дата}</div>
                    </div>
                  </div>

                  {incidentType && incidentType.extraFields.length > 0 && (
                    <div className="col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Поля типа инцидента</div>
                      <div className="grid grid-cols-2 gap-4">
                        {incidentType.extraFields.map((field) => (
                          <div key={field.id}>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{field.label}</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {incident.дополнительныеПоля?.[field.id] ?? '—'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </>
  );
}
