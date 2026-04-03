import { useState } from 'react';
import { Trash2, Users as UsersIcon, RefreshCw, Plus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  samAccountName: string;
  position: string;
  groups: string[];
}

type DirectoryConnectionType = 'LDAP' | 'LDAPS' | 'GlobalLDAP' | 'GlobalLDAPS';

const directoryConnectionOptions = [
  { value: 'LDAP', label: 'LDAP (389)' },
  { value: 'LDAPS', label: 'LDAPS (636)' },
  { value: 'GlobalLDAP', label: 'GlobalLDAP (3268)' },
  { value: 'GlobalLDAPS', label: 'GlobalLDAPS (3269)' },
] as const;

interface DomainConfig {
  id: string;
  domainName: string;
  controllerIp: string;
  username: string;
  password: string;
  connectionType: DirectoryConnectionType;
  groups: string[];
}

export default function UsersSettings() {
  const [domains, setDomains] = useState<DomainConfig[]>([
    {
      id: '1',
      domainName: 'corp.local',
      controllerIp: '10.10.10.10',
      username: 'svc_im_sync@corp.local',
      password: '',
      connectionType: 'LDAPS',
      groups: ['CN=SOC Team,OU=Groups,DC=corp,DC=local'],
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Иван Петров', email: 'ivan@company.com', samAccountName: 'i.petrov', position: 'Аналитик SOC', groups: ['Domain Users', 'SOC Team'] },
    { id: '2', name: 'Алексей Смирнов', email: 'alexey@company.com', samAccountName: 'a.smirnov', position: 'Старший аналитик', groups: ['Domain Users', 'SOC L2'] },
    { id: '3', name: 'Мария Иванова', email: 'maria@company.com', samAccountName: 'm.ivanova', position: 'DLP Аналитик', groups: ['Domain Users', 'DLP Team'] },
  ]);

  const handleSyncUsers = () => {
    const validDomains = domains.filter(d => d.domainName && d.controllerIp && d.username && d.groups.length > 0);
    if (validDomains.length === 0) {
      alert('Заполните параметры подключения к AD и добавьте хотя бы одну группу для синхронизации');
      return;
    }
    console.log('Синхронизация пользователей из AD:', validDomains);
    alert(`Синхронизация пользователей из ${validDomains.length} домена(ов)`);
  };

  const removeUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const addDomain = () => {
    const newDomain: DomainConfig = {
      id: Date.now().toString(),
      domainName: '',
      controllerIp: '',
      username: '',
      password: '',
      connectionType: 'LDAPS',
      groups: [],
    };
    setDomains([...domains, newDomain]);
  };

  const removeDomain = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
  };

  const updateDomain = (id: string, field: keyof DomainConfig, value: any) => {
    setDomains(domains.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const addGroup = (domainId: string) => {
    setDomains(domains.map(d => 
      d.id === domainId 
        ? { ...d, groups: [...d.groups, ''] }
        : d
    ));
  };

  const removeGroup = (domainId: string, groupIndex: number) => {
    setDomains(domains.map(d => 
      d.id === domainId 
        ? { ...d, groups: d.groups.filter((_, i) => i !== groupIndex) }
        : d
    ));
  };

  const updateGroup = (domainId: string, groupIndex: number, value: string) => {
    setDomains(domains.map(d => 
      d.id === domainId 
        ? { ...d, groups: d.groups.map((g, i) => i === groupIndex ? value : g) }
        : d
    ));
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
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <UsersIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
              Синхронизация с Active Directory
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-400">
              Настройте подключение к доменам и укажите группы для синхронизации пользователей
            </p>
          </div>
        </div>

        {domains.map((domain) => (
          <div key={domain.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                Домен: {domain.domainName || 'Новый домен'}
              </h5>
              {domains.length > 1 && (
                <button
                  onClick={() => removeDomain(domain.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Имя домена
                </label>
                <input
                  type="text"
                  value={domain.domainName}
                  onChange={(e) => updateDomain(domain.id, 'domainName', e.target.value)}
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
                  value={domain.controllerIp}
                  onChange={(e) => updateDomain(domain.id, 'controllerIp', e.target.value)}
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
                  value={domain.username}
                  onChange={(e) => updateDomain(domain.id, 'username', e.target.value)}
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
                  value={domain.password}
                  onChange={(e) => updateDomain(domain.id, 'password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Тип подключения
                </label>
                <select
                  value={domain.connectionType}
                  onChange={(e) => updateDomain(domain.id, 'connectionType', e.target.value)}
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  {directoryConnectionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-300">
                  Группы для синхронизации
                </label>
                <button
                  onClick={() => addGroup(domain.id)}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  <Plus className="w-3 h-3" />
                  Добавить группу
                </button>
              </div>

              {domain.groups.map((group, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={group}
                    onChange={(e) => updateGroup(domain.id, index, e.target.value)}
                    placeholder="CN=Group Name,OU=Groups,DC=corp,DC=local"
                    className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                  {domain.groups.length > 1 && (
                    <button
                      onClick={() => removeGroup(domain.id, index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            onClick={addDomain}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить домен
          </button>
        </div>

        <div className="flex justify-end">
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

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-x-auto">
          <table className="w-full min-w-200">
            <thead className="bg-blue-100/50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-300 uppercase">
                  Имя
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-300 uppercase">
                  SamAccountName
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-300 uppercase">
                  Должность
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
                    {user.samAccountName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {user.position}
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
