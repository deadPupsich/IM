import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronDown, ChevronUp, FileText, User, Users, Database, AlertTriangle, Monitor, Activity, Calendar, Workflow, Pencil } from 'lucide-react';
import { DynamicColumnKey, Incident } from '../types/incident';
import ExportButtons from './ExportButtons';
import { getIncidentColumnValue, getIncidentTypeDefinition } from '../config/incident-config';
import { useIncidentCollaboration } from '../store/incidentCollaboration';
import DraggableIncidentAction from './DraggableIncidentAction';
import IncidentFieldEditDialog from './IncidentFieldEditDialog';
import { useIncidentsStore } from '../store/incidents';

const incidentStatusOptions = ['Открыт', 'В работе', 'Расследование', 'Закрыт', 'Ложный'];

interface IncidentRowProps {
  incident: Incident;
  columns: { key: DynamicColumnKey; label: string; width: number }[];
}

export default function IncidentRow({ incident, columns }: IncidentRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionsCollapsed, setActionsCollapsed] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: string;
    label: string;
    inputType: 'text' | 'select';
    value: string;
    options?: string[];
    isAdditional?: boolean;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; incidentId: string } | null>(null);
  const navigate = useNavigate();
  const incidentType = getIncidentTypeDefinition(incident.типИнцидента);
  const actionsByIncident = useIncidentCollaboration((state) => state.actionsByIncident);
  const initializeIncidentActions = useIncidentCollaboration((state) => state.initializeIncidentActions);
  const updateIncident = useIncidentsStore((state) => state.updateIncident);

  useEffect(() => {
    initializeIncidentActions(incident.id, incident.типИнцидента);
  }, [incident.id, incident.типИнцидента, initializeIncidentActions]);

  const actions = actionsByIncident[incident.id] ?? [];

  const requiredDetails = useMemo(() => ([
    {
      key: 'название',
      label: 'Название',
      value: incident.название,
      icon: <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      iconBg: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      key: 'ответственный',
      label: 'Ответственный',
      value: incident.ответственный,
      icon: <User className="w-5 h-5 text-green-600 dark:text-green-400" />,
      iconBg: 'bg-green-100 dark:bg-green-900',
    },
    {
      key: 'источник',
      label: 'Источник',
      value: incident.источник,
      icon: <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      iconBg: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      key: 'login',
      label: 'Нарушитель',
      value: incident.login,
      icon: <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />,
      iconBg: 'bg-red-100 dark:bg-red-900',
    },
    {
      key: 'хост',
      label: 'Хост',
      value: incident.хост,
      icon: <Monitor className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
      iconBg: 'bg-slate-100 dark:bg-slate-900',
    },
    {
      key: 'статус',
      label: 'Статус',
      value: incident.статус,
      icon: <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900',
    },
    {
      key: 'команда',
      label: 'Команда',
      value: incident.команда,
      icon: <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      iconBg: 'bg-cyan-100 dark:bg-cyan-900',
    },
    {
      key: 'дата',
      label: 'Дата создания',
      value: incident.дата,
      icon: <Calendar className="w-5 h-5 text-pink-600 dark:text-pink-400" />,
      iconBg: 'bg-pink-100 dark:bg-pink-900',
    },
  ]), [incident]);

  const handleRowDoubleClick = () => {
    navigate(`/incident/${incident.id}`);
  };

  const handleRowAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      window.open(`/incident/${incident.id}`, '_blank');
    }
  };

  const handleRowContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, incidentId: incident.id });
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const openFieldEditor = (fieldKey: string, label: string, value: string, inputType: 'text' | 'select' = 'text', options?: string[], isAdditional = false) => {
    setEditingField({ key: fieldKey, label, value, inputType, options, isAdditional });
  };

  const handleSaveField = (value: string) => {
    if (!editingField) return;

    if (editingField.isAdditional) {
      updateIncident(incident.id, {
        дополнительныеПоля: {
          ...(incident.дополнительныеПоля ?? {}),
          [editingField.key]: value.trim(),
        },
      });
      return;
    }

    updateIncident(incident.id, {
      [editingField.key]: value.trim(),
    } as Partial<Incident>);
  };

  return (
      <>
        <div className="flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div
              className="w-10 h-10 flex items-center justify-center border-r border-gray-200 dark:border-gray-700 flex-shrink-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none"
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
              onDoubleClick={handleRowDoubleClick}
              onAuxClick={handleRowAuxClick}
              onContextMenu={handleRowContextMenu}
              style={{ userSelect: 'text' }}
          >
            {columns.map((col, index) => (
                <div
                    key={col.key}
                    className={`px-3 h-10 flex items-center text-sm text-gray-900 dark:text-gray-100 border-r border-gray-150 dark:border-gray-700 truncate flex-shrink-0`}
                    style={{ width: `${col.width}px`, userSelect: 'text' }}
                >
                  {getIncidentColumnValue(incident, col.key)}
                </div>
            ))}
          </div>
        </div>

        {contextMenu && contextMenu.incidentId === incident.id && (
          <div 
            className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 py-1 min-w-[200px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              onClick={() => {
                navigate(`/incident/${incident.id}`);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Открыть инцидент
            </button>
            <button
              onClick={() => {
                window.open(`/incident/${incident.id}`, '_blank');
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Workflow className="w-4 h-4" />
              Открыть в новой вкладке
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Свернуть
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  Развернуть
                </>
              )}
            </button>
          </div>
        )}

        {isExpanded && (
            <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="max-w-6xl space-y-4">
                
                {/* Actions Section */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      <Workflow className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Действия
                    </div>
                    {actions.length > 3 && (
                      <button
                        onClick={() => setActionsCollapsed(!actionsCollapsed)}
                        className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      >
                        {actionsCollapsed ? (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            Показать все ({actions.length})
                          </>
                        ) : (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            Свернуть
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {(actionsCollapsed ? actions.slice(0, 3) : actions).map((action, index) => (
                      <DraggableIncidentAction
                        key={action.id}
                        action={action}
                        index={index}
                        moveAction={() => {}}
                        onRemove={() => {}}
                        readonly
                      />
                    ))}
                    <ExportButtons incident={incident} />
                  </div>
                  {actionsCollapsed && actions.length > 3 && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Показано 3 из {actions.length} действий
                    </div>
                  )}
                </div>

                {/* Fields Section */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {requiredDetails.map((detail) => (
                      <div key={detail.key} className="flex items-start gap-3 min-w-0">
                        <div className={`w-10 h-10 ${detail.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {detail.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400 w-28 flex-shrink-0">{detail.label}</div>
                            <button
                              onClick={() => openFieldEditor(detail.key, detail.label, String(detail.value), detail.key === 'статус' ? 'select' : detail.key === 'команда' ? 'select' : 'text', detail.key === 'статус' ? incidentStatusOptions : detail.key === 'команда' ? ['SOC L1', 'SOC L2', 'DLP'] : undefined)}
                              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 flex-shrink-0"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{detail.value}</div>
                          {detail.key === 'название' && (
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Тип: {incidentType?.label ?? incident.типИнцидента}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Fields Section */}
                {incidentType?.extraFields.length ? (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Дополнительные поля</div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {incidentType.extraFields.map((field) => (
                        <div key={field.id} className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <div className="text-xs text-gray-500 dark:text-gray-400 w-28 flex-shrink-0">{field.label}</div>
                              <button
                                onClick={() => openFieldEditor(field.id, field.label, incident.дополнительныеПоля?.[field.id] ?? '', 'text', undefined, true)}
                                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 flex-shrink-0"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                              {incident.дополнительныеПоля?.[field.id] ?? '—'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
        )}

        {editingField && (
          <IncidentFieldEditDialog
            open={Boolean(editingField)}
            onOpenChange={(open) => {
              if (!open) setEditingField(null);
            }}
            label={editingField.label}
            value={editingField.value}
            inputType={editingField.inputType}
            options={editingField.options}
            onSave={handleSaveField}
          />
        )}
      </>
  );
}
