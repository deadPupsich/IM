import { Plus, Trash2, Users as UsersIcon } from 'lucide-react';
import { useTeamsStore } from '../../../store/teamsStore.ts';
import { mockUsersDirectory } from '../../../data/mockData.ts';

export default function TeamsSettings() {
  const teams = useTeamsStore((state) => state.teams);
  const addTeam = useTeamsStore((state) => state.addTeam);
  const removeTeam = useTeamsStore((state) => state.removeTeam);
  const updateTeam = useTeamsStore((state) => state.updateTeam);
  const addMember = useTeamsStore((state) => state.addMember);
  const removeMember = useTeamsStore((state) => state.removeMember);
  const updatePermission = useTeamsStore((state) => state.updatePermission);

  const handleAddTeam = () => {
    addTeam({
      name: '',
      description: '',
      members: []
    });
  };

  const getUserById = (userId: string) => mockUsersDirectory.find(u => u.id === userId);

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
          <div key={team.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 mr-4">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                  placeholder="Название команды"
                  className="mb-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                />
                <input
                  type="text"
                  value={team.description}
                  onChange={(e) => updateTeam(team.id, { description: e.target.value })}
                  placeholder="Описание команды"
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <button
                onClick={() => removeTeam(team.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Пользователи</span>
              </div>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addMember(team.id, {
                      userId: e.target.value,
                      permissions: { canView: true, canEdit: false, canDelete: false, canAssign: false }
                    });
                    e.target.value = '';
                  }
                }}
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Добавить пользователя</option>
                {mockUsersDirectory
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
                  <div key={member.userId} className="bg-blue-100/50 dark:bg-blue-900/30 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                        <div className="text-xs text-blue-800 dark:text-blue-400">{user.email}</div>
                      </div>
                      <button
                        onClick={() => removeMember(team.id, member.userId)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
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
        onClick={handleAddTeam}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить команду
      </button>

      <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
