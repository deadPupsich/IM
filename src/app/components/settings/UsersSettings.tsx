import { useState } from 'react';
import { Trash2, Users as UsersIcon, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  groups: string[];
}

export default function UsersSettings() {
  const [selectedADGroup, setSelectedADGroup] = useState('');
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Иван Петров', email: 'ivan@company.com', groups: ['Domain Users', 'SOC Team'] },
    { id: '2', name: 'Алексей Смирнов', email: 'alexey@company.com', groups: ['Domain Users'] },
    { id: '3', name: 'Мария Иванова', email: 'maria@company.com', groups: ['Domain Users', 'DLP Team'] },
  ]);

  const [adGroups] = useState([
    'Domain Users',
    'SOC Team',
    'DLP Team',
    'Administrators',
    'Security Team'
  ]);

  const handleSyncUsers = () => {
    if (!selectedADGroup) {
      alert('Выберите группу AD');
      return;
    }
    console.log('Синхронизация пользователей из группы:', selectedADGroup);
    alert(`Синхронизация пользователей из группы "${selectedADGroup}"`);
  };

  const removeUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
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
              Выберите группу AD для импорта пользователей
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedADGroup}
            onChange={(e) => setSelectedADGroup(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите группу AD</option>
            {adGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          
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
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Список пользователей ({users.length})
          </h4>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Имя
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Группы AD
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.groups.map((group) => (
                        <span
                          key={group}
                          className="inline-flex px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeUser(user.id)}
                      className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
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

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
