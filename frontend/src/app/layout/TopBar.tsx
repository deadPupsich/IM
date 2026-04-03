import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, LogOut, Sun, Moon, Bell, AtSign } from 'lucide-react';
import { User } from '../types/incident.ts';
import { useAppSettings } from '../store/settings.ts';
import { useIncidentCollaboration } from '../store/incidentCollaboration.ts';

interface TopBarProps {
  user: User;
  activeTeam: string;
  onTeamChange: (team: string) => void;
  onLogout: () => void;
}

export default function TopBar({ user, activeTeam, onTeamChange, onLogout }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const theme = useAppSettings((state) => state.theme);
  const setTheme = useAppSettings((state) => state.setTheme);
  const navigate = useNavigate();
  const allNotifications = useIncidentCollaboration((state) => state.notifications);
  const notifications = allNotifications.filter((notification) => notification.userId === user.id);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const markNotificationRead = useIncidentCollaboration((state) => state.markNotificationRead);
  const markAllNotificationsRead = useIncidentCollaboration((state) => state.markAllNotificationsRead);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">IM</h1>
        
        <div className="flex gap-2">
          {user.teams.map((team) => (
            <button
              key={team}
              onClick={() => onTeamChange(team)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTeam === team
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Уведомления"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-semibold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Уведомления</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Упоминания и события расследования</div>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead(user.id)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Прочитать все
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications
                      .slice()
                      .reverse()
                      .map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => {
                            markNotificationRead(notification.id);
                            setShowNotifications(false);
                            navigate(`/incident/${notification.incidentId}`);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            !notification.read ? 'bg-blue-50/80 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                              <AtSign className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</div>
                                {!notification.read && <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                              </div>
                              <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">{notification.description}</div>
                              <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{notification.createdAt}</div>
                            </div>
                          </div>
                        </button>
                      ))
                  ) : (
                    <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                      Пока нет уведомлений.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="w-5 h-5 text-gray-400" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из учетки
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
