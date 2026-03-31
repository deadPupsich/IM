import { useState } from 'react';
import { Plus, Trash2, Users as UsersIcon } from 'lucide-react';

interface TeamMember {
  userId: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAssign: boolean;
  };
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

const mockUsers = [
  { id: 'u1', name: 'Иван Петров', email: 'ivan@company.com' },
  { id: 'u2', name: 'Алексей Смирнов', email: 'alexey@company.com' },
  { id: 'u3', name: 'Мария Иванова', email: 'maria@company.com' },
  { id: 'u4', name: 'Дмитрий Козлов', email: 'dmitry@company.com' },
];

export default function TeamsSettings() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'SOC L1',
      description: 'Команда первой линии безопасности',
      members: [
        { 
          userId: 'u1', 
          permissions: { canView: true, canEdit: true, canDelete: false, canAssign: true }
        }
      ]
    }
  ]);

  const addTeam = () => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name: '',
      description: '',
      members: []
    };
    setTeams([...teams, newTeam]);
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams(teams.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addMember = (teamId: string, userId: string) => {
    setTeams(teams.map(t => {
      if (t.id !== teamId) return t;
      if (t.members.some(m => m.userId === userId)) return t;
      
      return {
        ...t,
        members: [
          ...t.members,
          {
            userId,
            permissions: { canView: true, canEdit: false, canDelete: false, canAssign: false }
          }
        ]
      };
    }));
  };

  const removeMember = (teamId: string, userId: string) => {
    setTeams(teams.map(t => 
      t.id === teamId 
        ? { ...t, members: t.members.filter(m => m.userId !== userId) }
        : t
    ));
  };

  const updatePermission = (teamId: string, userId: string, permission: string, value: boolean) => {
    setTeams(teams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        members: t.members.map(m =>
          m.userId === userId
            ? { ...m, permissions: { ...m.permissions, [permission]: value } }
            : m
        )
      };
    }));
  };

  const getUserById = (userId: string) => mockUsers.find(u => u.id === userId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Управление командами</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Создайте команды и настройте права доступа для пользователей
        </p>
      </div>

      <div className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 mr-4">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                  placeholder="Название команды"
                  className="mb-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
                <input
                  type="text"
                  value={team.description}
                  onChange={(e) => updateTeam(team.id, { description: e.target.value })}
                  placeholder="Описание команды"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <button
                onClick={() => removeTeam(team.id)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Пользователи</span>
              </div>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addMember(team.id, e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Добавить пользователя</option>
                {mockUsers
                  .filter(u => !team.members.some(m => m.userId === u.id))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>

              {team.members.map((member) => {
                const user = getUserById(member.userId);
                if (!user) return null;

                return (
                  <div key={member.userId} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                      <button
                        onClick={() => removeMember(team.id, member.userId)}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={member.permissions.canView}
                          onChange={(e) => updatePermission(team.id, member.userId, 'canView', e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Просмотр</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={member.permissions.canEdit}
                          onChange={(e) => updatePermission(team.id, member.userId, 'canEdit', e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Редактирование</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={member.permissions.canDelete}
                          onChange={(e) => updatePermission(team.id, member.userId, 'canDelete', e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Удаление</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={member.permissions.canAssign}
                          onChange={(e) => updatePermission(team.id, member.userId, 'canAssign', e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Назначение</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addTeam}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить команду
      </button>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
