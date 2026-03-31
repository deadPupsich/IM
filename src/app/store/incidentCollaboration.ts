import { create } from 'zustand';
import { mockUser, mockUsersDirectory } from '../data/mockData';
import { getDefaultActionsForIncidentType, SYSTEM_INCIDENT_ACTIONS } from '../config/incident-actions';
import { IncidentTypeId } from '../types/incident';

export interface IncidentAction {
  id: string;
  label: string;
  tone: 'blue' | 'green' | 'amber' | 'red' | 'slate';
}

export interface InvestigationEntry {
  id: string;
  incidentId: string;
  type: 'comment' | 'email_out' | 'email_in';
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  mentions?: string[];
  recipient?: string;
  subject?: string;
  templateName?: string;
  attachments?: InvestigationAttachment[];
}

export interface InvestigationAttachment {
  id: string;
  name: string;
  sizeLabel: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  incidentId: string;
  createdAt: string;
  title: string;
  description: string;
  read: boolean;
}

interface IncidentCollaborationState {
  actionsByIncident: Record<string, IncidentAction[]>;
  investigationByIncident: Record<string, InvestigationEntry[]>;
  notifications: UserNotification[];
  initializeIncidentActions: (incidentId: string, incidentType: IncidentTypeId) => void;
  moveAction: (incidentId: string, dragIndex: number, hoverIndex: number) => void;
  addAction: (incidentId: string, actionName: string) => void;
  removeAction: (incidentId: string, actionId: string) => void;
  addComment: (incidentId: string, content: string, attachments?: InvestigationAttachment[]) => void;
  sendSystemEmail: (incidentId: string, recipient: string, subject: string, content: string, templateName: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
}

const initialActions: Record<string, IncidentAction[]> = {
  '1': [
    { id: 'a-1', label: 'Назначить на аналитика', tone: 'blue' },
    { id: 'a-2', label: 'Запросить артефакты', tone: 'amber' },
    { id: 'a-3', label: 'Эскалировать в SOC L2', tone: 'green' },
  ],
  '2': [
    { id: 'a-4', label: 'Сменить статус', tone: 'blue' },
    { id: 'a-5', label: 'Уведомить владельца системы', tone: 'green' },
  ],
};

const initialInvestigation: Record<string, InvestigationEntry[]> = {
  '1': [
    {
      id: 'm-1',
      incidentId: '1',
      type: 'comment',
      authorId: 'u2',
      authorName: 'Алексей Смирнов',
      authorRole: 'Аналитик SOC',
      content: 'Проверил сетевой всплеск. Нужна дополнительная выгрузка с пограничного узла. @Иван Петров, подключись к разбору.',
      createdAt: '2026-03-31 09:20',
      mentions: ['u1'],
      attachments: [
        { id: 'att-1', name: 'edge-traffic.csv', sizeLabel: '420 KB' },
      ],
    },
    {
      id: 'm-2',
      incidentId: '1',
      type: 'email_in',
      authorId: 'violator',
      authorName: 'Подозреваемый пользователь',
      authorRole: 'Внешний ответ',
      content: 'Я не инициировал это соединение. Прошу уточнить временной интервал и узел.',
      createdAt: '2026-03-31 09:42',
      recipient: 'abuse@company.com',
      subject: 'Re: Уточнение по сетевой активности',
      templateName: 'Ответ нарушителя',
    },
  ],
};

function getNowString() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function extractMentionedUserIds(content: string) {
  return mockUsersDirectory
    .filter((user) => user.id !== mockUser.id)
    .filter((user) => content.includes(`@${user.name}`))
    .map((user) => user.id);
}

function makeActionTone(index: number): IncidentAction['tone'] {
  return (['blue', 'green', 'amber', 'red', 'slate'] as IncidentAction['tone'][])[index % 5];
}

function resolveActionTone(actionName: string, fallbackIndex: number): IncidentAction['tone'] {
  const sourceAction = SYSTEM_INCIDENT_ACTIONS.find((action) => action.name === actionName);
  return sourceAction?.iconColor === 'green'
    ? 'green'
    : sourceAction?.iconColor === 'orange'
      ? 'amber'
      : sourceAction?.iconColor === 'red'
        ? 'red'
        : sourceAction?.iconColor === 'blue'
          ? 'blue'
          : makeActionTone(fallbackIndex);
}

export const useIncidentCollaboration = create<IncidentCollaborationState>()((set) => ({
  actionsByIncident: initialActions,
  investigationByIncident: initialInvestigation,
  notifications: [
    {
      id: 'n-1',
      userId: mockUser.id,
      incidentId: '1',
      createdAt: '2026-03-31 09:20',
      title: 'Вас упомянули в расследовании',
      description: 'Алексей Смирнов отметил вас в комментарии по инциденту #1.',
      read: false,
    },
  ],
  initializeIncidentActions: (incidentId, incidentType) =>
    set((state) => {
      if (state.actionsByIncident[incidentId]) {
        return state;
      }

      const defaultActions = getDefaultActionsForIncidentType(incidentType).map((actionName, index) => ({
        id: `default-${incidentId}-${index}`,
        label: actionName,
        tone: resolveActionTone(actionName, index),
      }));

      return {
        actionsByIncident: {
          ...state.actionsByIncident,
          [incidentId]: defaultActions,
        },
      };
    }),
  moveAction: (incidentId, dragIndex, hoverIndex) =>
    set((state) => {
      const actions = state.actionsByIncident[incidentId] ?? [];
      if (dragIndex === hoverIndex || !actions[dragIndex] || !actions[hoverIndex]) {
        return state;
      }
      const nextActions = [...actions];
      const temp = nextActions[dragIndex];
      nextActions[dragIndex] = nextActions[hoverIndex];
      nextActions[hoverIndex] = temp;
      return {
        actionsByIncident: {
          ...state.actionsByIncident,
          [incidentId]: nextActions,
        },
      };
    }),
  addAction: (incidentId, actionName) =>
    set((state) => {
      const actions = state.actionsByIncident[incidentId] ?? [];
      if (actions.some((action) => action.label === actionName)) {
        return state;
      }
      const nextAction: IncidentAction = {
        id: `action-${Date.now()}`,
        label: actionName,
        tone: resolveActionTone(actionName, actions.length),
      };
      return {
        actionsByIncident: {
          ...state.actionsByIncident,
          [incidentId]: [...actions, nextAction],
        },
      };
    }),
  removeAction: (incidentId, actionId) =>
    set((state) => ({
      actionsByIncident: {
        ...state.actionsByIncident,
        [incidentId]: (state.actionsByIncident[incidentId] ?? []).filter((action) => action.id !== actionId),
      },
    })),
  addComment: (incidentId, content, attachments = []) =>
    set((state) => {
      const entries = state.investigationByIncident[incidentId] ?? [];
      const mentionedUserIds = extractMentionedUserIds(content);
      const nextEntry: InvestigationEntry = {
        id: `comment-${Date.now()}`,
        incidentId,
        type: 'comment',
        authorId: mockUser.id,
        authorName: mockUser.name,
        authorRole: 'Текущий пользователь',
        content,
        createdAt: getNowString(),
        mentions: mentionedUserIds,
        attachments,
      };

      const mentionNotifications: UserNotification[] = mentionedUserIds.map((userId) => {
        const mentionedUser = mockUsersDirectory.find((user) => user.id === userId);
        return {
          id: `notification-${Date.now()}-${userId}`,
          userId,
          incidentId,
          createdAt: getNowString(),
          title: 'Новое упоминание',
          description: `${mockUser.name} отметил${userId === 'u3' ? 'а' : ''} вас в расследовании инцидента #${incidentId}.`,
          read: false,
        };
      });

      return {
        investigationByIncident: {
          ...state.investigationByIncident,
          [incidentId]: [...entries, nextEntry],
        },
        notifications: [...state.notifications, ...mentionNotifications],
      };
    }),
  sendSystemEmail: (incidentId, recipient, subject, content, templateName) => {
    const outEntry: InvestigationEntry = {
      id: `email-out-${Date.now()}`,
      incidentId,
      type: 'email_out',
      authorId: 'system',
      authorName: 'Система IM',
      authorRole: 'Системное письмо',
      content,
      createdAt: getNowString(),
      recipient,
      subject,
      templateName,
    };

    set((state) => {
      const entries = state.investigationByIncident[incidentId] ?? [];
      return {
        investigationByIncident: {
          ...state.investigationByIncident,
          [incidentId]: [...entries, outEntry],
        },
      };
    });

    setTimeout(() => {
      set((state) => {
        const entries = state.investigationByIncident[incidentId] ?? [];
        const replyEntry: InvestigationEntry = {
          id: `email-in-${Date.now()}`,
          incidentId,
          type: 'email_in',
          authorId: 'violator',
          authorName: 'Нарушитель',
          authorRole: 'Ответ на письмо',
          content: 'Получил письмо. Подтверждаю получение и подготовлю пояснение по ситуации.',
          createdAt: getNowString(),
          recipient,
          subject: `Re: ${subject}`,
          templateName: 'Ответ нарушителя',
        };
        return {
          investigationByIncident: {
            ...state.investigationByIncident,
            [incidentId]: [...entries, replyEntry],
          },
        };
      });
    }, 1500);
  },
  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ),
    })),
  markAllNotificationsRead: (userId) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.userId === userId
          ? { ...notification, read: true }
          : notification
      ),
    })),
}));
