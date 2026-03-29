import { useState } from 'react';
import { Settings, Eye, Server, Link2, FileType, Hash, MessageSquare, Zap, Users, UserCog } from 'lucide-react';
import ViewSettings from './settings/ViewSettings';
import ActiveDirectorySettings from './settings/ActiveDirectorySettings';
import IntegrationSettings from './settings/IntegrationSettings';
import IncidentTypeSettings from './settings/IncidentTypeSettings';
import FieldSettings from './settings/FieldSettings';
import TelegramSettings from './settings/TelegramSettings';
import ActionSettings from './settings/ActionSettings';
import TeamsSettings from './settings/TeamsSettings';
import UsersSettings from './settings/UsersSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('view');

  const tabs = [
    { id: 'view', label: 'Настройка представления', icon: Eye },
    { id: 'fields', label: 'Поля', icon: Hash },
    { id: 'incident-types', label: 'Настройка инцидентов', icon: FileType },
    { id: 'actions', label: 'Действия', icon: Zap },
    { id: 'teams', label: 'Команды', icon: Users },
    { id: 'users', label: 'Пользователи', icon: UserCog },
    { id: 'ad', label: 'Active Directory', icon: Server },
    { id: 'integrations', label: 'Интеграции', icon: Link2 },
    { id: 'telegram', label: 'Telegram', icon: MessageSquare },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Настройки</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Управление параметрами системы</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'view' && <ViewSettings />}
          {activeTab === 'fields' && <FieldSettings />}
          {activeTab === 'incident-types' && <IncidentTypeSettings />}
          {activeTab === 'actions' && <ActionSettings />}
          {activeTab === 'teams' && <TeamsSettings />}
          {activeTab === 'users' && <UsersSettings />}
          {activeTab === 'ad' && <ActiveDirectorySettings />}
          {activeTab === 'integrations' && <IntegrationSettings />}
          {activeTab === 'telegram' && <TelegramSettings />}
        </div>
      </div>
    </div>
  );
}