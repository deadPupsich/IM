import { useState } from 'react';
import { Trash2, Users as UsersIcon, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  groups: string[];
}

type DirectoryConnectionType = 'LDAP' | 'LDAPS' | 'GlobalLDAP' | 'GlobalLDAPS';

const directoryConnectionOptions = [
  { value: 'LDAP', label: 'LDAP (389)' },
  { value: 'LDAPS', label: 'LDAPS (636)' },
  { value: 'GlobalLDAP', label: 'GlobalLDAP (3268)' },
  { value: 'GlobalLDAPS', label: 'GlobalLDAPS (3269)' },
] as const;

interface UserSyncConfig {
  domainName: string;
  controllerIp: string;
  username: string;
  password: string;
  connectionType: DirectoryConnectionType;
  distinguishedName: string;
}

export default function UsersSettings() {
  const [syncConfig, setSyncConfig] = useState<UserSyncConfig>({
    domainName: 'corp.local',
    controllerIp: '10.10.10.10',
    username: 'svc_im_sync@corp.local',
    password: '',
    connectionType: 'LDAPS',
    distinguishedName: 'CN=SOC Team,OU=Groups,DC=corp,DC=local',
  });
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Иван Петров', email: 'ivan@company.com', groups: ['Domain Users', 'SOC Team'] },
    { id: '2', name: 'Алексей Смирнов', email: 'alexey@company.com', groups: ['Domain Users'] },
    { id: '3', name: 'Мария Иванова', email: 'maria@company.com', groups: ['Domain Users', 'DLP Team'] },
  ]);

  const handleSyncUsers = () => {
    if (!syncConfig.domainName || !syncConfig.controllerIp || !syncConfig.username || !syncConfig.distinguishedName) {
      alert('Заполните параметры подключения к AD и Distinguished Name группы');
      return;
    }
    console.log('Синхронизация пользователей из AD:', syncConfig);
    alert(`Синхронизация пользователей из ${syncConfig.domainName} по группе ${syncConfig.distinguishedName}`);
  };

  const removeUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const updateSyncConfig = (field: keyof UserSyncConfig, value: string) => {
    setSyncConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Управление пользователями</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Добавьте пользователей из Active Directory и управляйте ими
        </p>
      </div>

      {/* AD Sync Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3 mb-4">
          <UsersIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
              Синхронизация с Active Directory
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-400">
              Укажите параметры подключения и Distinguished Name группы, из которой нужно забирать пользователей
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Имя домена
            </label>
            <input
              type="text"
              value={syncConfig.domainName}
              onChange={(e) => updateSyncConfig('domainName', e.target.value)}
              placeholder="corp.local"
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              IP контроллера
            </label>
            <input
              type="text"
              value={syncConfig.controllerIp}
              onChange={(e) => updateSyncConfig('controllerIp', e.target.value)}
              placeholder="10.10.10.10"
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Пользователь
            </label>
            <input
              type="text"
              value={syncConfig.username}
              onChange={(e) => updateSyncConfig('username', e.target.value)}
              placeholder="svc_im_sync@corp.local"
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={syncConfig.password}
              onChange={(e) => updateSyncConfig('password', e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Тип подключения
            </label>
            <select
              value={syncConfig.connectionType}
              onChange={(e) => updateSyncConfig('connectionType', e.target.value)}
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
            >
              {directoryConnectionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Distinguished Name группы
            </label>
            <input
              type="text"
              value={syncConfig.distinguishedName}
              onChange={(e) => updateSyncConfig('distinguishedName', e.target.value)}
              placeholder="CN=SOC Team,OU=Groups,DC=corp,DC=local"
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSyncUsers}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Синхронизировать
          </button>
        </div>
      </div>

      {/* Users List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
            Список пользователей ({users.length})
          </h4>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-100/50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-300 uppercase">
                  Имя
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-300 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-300 uppercase">
                  Группы AD
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-blue-900 dark:text-blue-300 uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-200 dark:divide-blue-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-100/30 dark:hover:bg-blue-900/40">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.groups.map((group) => (
                        <span
                          key={group}
                          className="inline-flex px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 text-xs rounded"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeUser(user.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                      title="Удалить пользователя"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
