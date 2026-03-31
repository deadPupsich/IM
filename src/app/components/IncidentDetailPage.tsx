import { useState, useCallback, useMemo, useEffect, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  FileText,
  User,
  Database,
  FileStack,
  AlertTriangle,
  Calendar,
  Shield,
  Activity,
  History,
  Plus,
  Send,
  Mail,
  MessageSquare,
  AtSign,
  Workflow,
  Paperclip,
  X,
} from 'lucide-react';
import { mockIncidents, mockUser, mockUsersDirectory } from '../data/mockData';
import DraggableField from './DraggableField';
import ExportButtons from './ExportButtons';
import DraggableIncidentAction from './DraggableIncidentAction';
import { InvestigationAttachment, useIncidentCollaboration } from '../store/incidentCollaboration';
import { getIncidentTypeDefinition } from '../config/incident-config';
import { SYSTEM_INCIDENT_ACTIONS } from '../config/incident-actions';

interface Field {
  id: string;
  label: string;
  getValue: (incident: (typeof mockIncidents)[number]) => React.ReactNode;
  icon: React.ReactNode;
}

const defaultFields: Field[] = [
  {
    id: 'название',
    label: 'Название',
    getValue: (incident) => incident.название,
    icon: <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
  },
  {
    id: 'ответственный',
    label: 'Ответственный',
    getValue: (incident) => incident.ответственный,
    icon: <User className="w-5 h-5 text-green-600 dark:text-green-400" />
  },
  {
    id: 'источник',
    label: 'Источник',
    getValue: (incident) => incident.источник,
    icon: <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
  },
  {
    id: 'login',
    label: 'Login',
    getValue: (incident) => incident.login,
    icon: <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
  },
  {
    id: 'хост',
    label: 'Хост',
    getValue: (incident) => incident.хост,
    icon: <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
  },
  {
    id: 'статус',
    label: 'Статус',
    getValue: (incident) => (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
        incident.статус === 'Закрыт' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
        incident.статус === 'Открыт' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
        incident.статус === 'В работе' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
        'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
      }`}>
        {incident.статус}
      </span>
    ),
    icon: <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
  },
  {
    id: 'команда',
    label: 'Команда',
    getValue: (incident) => incident.команда,
    icon: <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
  },
  {
    id: 'дата',
    label: 'Дата создания',
    getValue: (incident) => incident.дата,
    icon: <Calendar className="w-5 h-5 text-pink-600 dark:text-pink-400" />
  },
  {
    id: 'файлы',
    label: 'Список файлов',
    getValue: (incident) => (
      <div className="space-y-2">
        {incident.списокФайлов.length > 0 ? (
          incident.списокФайлов.map((file: string, idx: number) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs mr-2 mb-2"
            >
              <FileText className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{file}</span>
            </div>
          ))
        ) : (
          <span className="text-gray-500 dark:text-gray-400 text-sm">Нет прикрепленных файлов</span>
        )}
      </div>
    ),
    icon: <FileStack className="w-5 h-5 text-orange-600 dark:text-orange-400" />
  }
];

const emailTemplates = [
  {
    id: 'clarification',
    label: 'Запросить пояснение',
    subject: 'Запрос пояснения по инциденту',
    body: 'Добрый день. В рамках расследования инцидента просим вас предоставить пояснение по описанному событию и подтвердить, выполнялись ли указанные действия.',
  },
  {
    id: 'preservation',
    label: 'Попросить сохранить артефакты',
    subject: 'Сохранение артефактов по инциденту',
    body: 'Просим не удалять связанные файлы и письма до завершения расследования, а также подтвердить, что данные сохранены.',
  },
  {
    id: 'meeting',
    label: 'Приглашение на разбор',
    subject: 'Приглашение на разбор инцидента',
    body: 'Назначен дополнительный разбор инцидента. Просим подготовить описание действий и быть на связи для уточняющих вопросов.',
  },
];

function resolveViolatorEmail(violator: string, incidentId: string) {
  if (violator.includes('@')) {
    return violator;
  }
  return `incident-${incidentId}@company.com`;
}

function highlightMentions(content: string) {
  const parts = content.split(/(@[А-Яа-яA-Za-zЁё][^@\n]*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return (
        <span
          key={`${part}-${index}`}
          className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        >
          {part}
        </span>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState(defaultFields);
  const [commentText, setCommentText] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(emailTemplates[0].id);
  const [emailSubject, setEmailSubject] = useState(emailTemplates[0].subject);
  const [emailBody, setEmailBody] = useState(emailTemplates[0].body);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [showActionPicker, setShowActionPicker] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState<InvestigationAttachment[]>([]);

  const incident = useMemo(() => {
    return mockIncidents.find((inc) => inc.id === id);
  }, [id]);

  const actionsByIncident = useIncidentCollaboration((state) => state.actionsByIncident);
  const investigationByIncident = useIncidentCollaboration((state) => state.investigationByIncident);
  const initializeIncidentActions = useIncidentCollaboration((state) => state.initializeIncidentActions);
  const moveAction = useIncidentCollaboration((state) => state.moveAction);
  const addAction = useIncidentCollaboration((state) => state.addAction);
  const removeAction = useIncidentCollaboration((state) => state.removeAction);
  const addComment = useIncidentCollaboration((state) => state.addComment);
  const sendSystemEmail = useIncidentCollaboration((state) => state.sendSystemEmail);

  const moveField = useCallback((dragIndex: number, hoverIndex: number) => {
    setFields((prevFields) => {
      if (dragIndex === hoverIndex) return prevFields;
      const newFields = [...prevFields];
      const temp = newFields[dragIndex];
      newFields[dragIndex] = newFields[hoverIndex];
      newFields[hoverIndex] = temp;
      return newFields;
    });
  }, []);

  const handleAddMention = (userName: string) => {
    setCommentText((prev) => `${prev}${prev.trim().length > 0 ? ' ' : ''}@${userName} `);
  };

  const handleAddAction = (actionName: string) => {
    if (!incident) return;
    addAction(incident.id, actionName);
    setShowActionPicker(false);
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const nextAttachments = files.map((file, index) => ({
      id: `local-${file.name}-${index}-${Date.now()}`,
      name: file.name,
      sizeLabel: file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`,
    }));
    setCommentAttachments((prev) => [...prev, ...nextAttachments]);
    event.target.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    setCommentAttachments((prev) => prev.filter((attachment) => attachment.id !== attachmentId));
  };

  const handleSendComment = () => {
    const value = commentText.trim();
    if (!incident || (!value && commentAttachments.length === 0)) return;
    addComment(incident.id, value || 'Добавлены вложения к расследованию.', commentAttachments);
    setCommentText('');
    setCommentAttachments([]);
  };

  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find((item) => item.id === templateId);
    if (!template) return;
    setSelectedTemplateId(templateId);
    setEmailSubject(template.subject);
    setEmailBody(template.body);
  };

  const handleSendEmail = () => {
    if (!incident) return;
    const recipient = emailRecipient.trim() || resolveViolatorEmail(incident.login, incident.id);
    if (!emailSubject.trim() || !emailBody.trim()) return;

    const selectedTemplate = emailTemplates.find((template) => template.id === selectedTemplateId);
    sendSystemEmail(
      incident.id,
      recipient,
      emailSubject.trim(),
      emailBody.trim(),
      selectedTemplate?.label ?? 'Письмо'
    );
    setEmailRecipient(recipient);
  };

  useEffect(() => {
    if (!incident) return;
    initializeIncidentActions(incident.id, incident.типИнцидента);
  }, [incident, initializeIncidentActions]);

  if (!incident) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          Инцидент не найден
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
        >
          Назад
        </button>
      </div>
    );
  }

  const actions = actionsByIncident[incident.id] ?? [];
  const investigationEntries = investigationByIncident[incident.id] ?? [];
  const availableActions = SYSTEM_INCIDENT_ACTIONS.filter((systemAction) => !actions.some((action) => action.label === systemAction.name));
  const incidentType = getIncidentTypeDefinition(incident.типИнцидента);
  const suggestedRecipient = emailRecipient || resolveViolatorEmail(incident.login, incident.id);
  const requiredFieldIds = new Set(['название', 'ответственный', 'источник', 'login', 'хост', 'статус', 'команда', 'дата']);
  const requiredFields = fields.filter((field) => requiredFieldIds.has(field.id));
  const optionalFields = fields.filter((field) => !requiredFieldIds.has(field.id));

  return (
    <div className="p-6 space-y-8">
      <div className="relative">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <div className="pr-40">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Карточка инцидента</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            ID: {incident.id} • Тип: <span className="font-medium">{incidentType?.label ?? incident.типИнцидента}</span>
          </p>
        </div>

        <button className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <History className="w-4 h-4" />
          История изменений
        </button>
      </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          <Workflow className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Действия
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {actions.map((action, index) => (
            <DraggableIncidentAction
              key={action.id}
              action={action}
              index={index}
              moveAction={(dragIndex, hoverIndex) => moveAction(incident.id, dragIndex, hoverIndex)}
              onRemove={(actionId) => removeAction(incident.id, actionId)}
            />
          ))}
          <ExportButtons incident={incident} />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Редактировать
          </button>
          <div className="relative">
            <button
              onClick={() => setShowActionPicker((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>

            {showActionPicker && (
              <div className="absolute left-0 top-full z-20 mt-2 w-80 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-xl">
                {availableActions.length > 0 ? (
                  availableActions.map((systemAction) => (
                    <button
                      key={systemAction.id}
                      onClick={() => handleAddAction(systemAction.name)}
                      className="w-full rounded-xl px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{systemAction.name}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{systemAction.description}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    Все системные действия уже добавлены.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Поля инцидента</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredFields.map((field, index) => (
            <DraggableField
              key={field.id}
              id={field.id}
              label={field.label}
              value={field.getValue(incident)}
              icon={field.icon}
              index={index}
              moveField={moveField}
            />
          ))}
        </div>

        {optionalFields.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Дополнительные поля</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optionalFields.map((field, index) => (
                <DraggableField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  value={field.getValue(incident)}
                  icon={field.icon}
                  index={requiredFields.length + index}
                  moveField={moveField}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Расследование</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Здесь отображаются комментарии аналитиков, письма системе и ответы нарушителя в единой ленте.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="border-r-0 xl:border-r border-gray-200 dark:border-gray-800">
            <div className="max-h-[760px] overflow-y-auto px-6 py-5 space-y-4 bg-gray-50/70 dark:bg-gray-950/40">
              {investigationEntries.length > 0 ? (
                investigationEntries.map((entry) => {
                  const isOutgoing = entry.type === 'email_out';
                  const isIncomingMail = entry.type === 'email_in';
                  const accentClass = isOutgoing
                    ? 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30'
                    : isIncomingMail
                      ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900';

                  return (
                    <div key={entry.id} className={`rounded-2xl border p-4 ${accentClass}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{entry.authorName}</span>
                            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                              {entry.authorRole}
                            </span>
                            {entry.type !== 'comment' && (
                              <span className="rounded-full bg-white/80 dark:bg-black/20 px-2 py-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                                {entry.type === 'email_out' ? 'Исходящее письмо' : 'Входящий ответ'}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{entry.createdAt}</div>
                        </div>
                      </div>

                      {(entry.subject || entry.recipient) && (
                        <div className="mt-3 rounded-xl bg-white/70 dark:bg-black/10 p-3 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                          {entry.subject && <div><span className="font-medium">Тема:</span> {entry.subject}</div>}
                          {entry.recipient && <div><span className="font-medium">Адресат:</span> {entry.recipient}</div>}
                          {entry.templateName && <div><span className="font-medium">Шаблон:</span> {entry.templateName}</div>}
                        </div>
                      )}

                      <div className="mt-3 text-sm leading-6 text-gray-800 dark:text-gray-200">
                        {highlightMentions(entry.content)}
                      </div>

                      {entry.attachments && entry.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>{attachment.name}</span>
                              <span className="text-gray-400 dark:text-gray-500">{attachment.sizeLabel}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-500 dark:text-gray-400">
                  Лента расследования пока пуста.
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-5 space-y-6 bg-white dark:bg-gray-900">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <AtSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Комментарий в расследование
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Используйте `@Имя Фамилия`, чтобы отметить коллегу. Упоминание попадёт в уведомления сверху.
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {mockUsersDirectory
                  .filter((user) => user.id !== mockUser.id)
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleAddMention(user.name)}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <AtSign className="w-3 h-3" />
                      {user.name}
                    </button>
                  ))}
              </div>

              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Оставьте комментарий по расследованию, отметьте коллег через @..."
                rows={6}
                className="mt-3 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Paperclip className="w-4 h-4" />
                  Прикрепить файлы
                  <input
                    type="file"
                    multiple
                    onChange={handleAttachmentChange}
                    className="hidden"
                  />
                </label>
                {commentAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{attachment.name}</span>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSendComment}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Отправить комментарий
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Письмо нарушителю от имени системы
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Выберите шаблон, при необходимости скорректируйте текст и отправьте. Ответ появится в ленте расследования.
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Шаблон письма</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {emailTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Кому</label>
                  <input
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder={suggestedRecipient}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Тема письма</label>
                  <input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Содержание</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={8}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSendEmail}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Отправить письмо
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
