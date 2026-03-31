import { useState } from 'react';
import { ChevronDown, LogOut, Sun, Moon } from 'lucide-react';
import { User } from '../types/incident';
import { useAppSettings } from '../store/settings';

interface TopBarProps {
  user: User;
  activeTeam: string;
  onTeamChange: (team: string) => void;
  onLogout: () => void;
}

export default function TopBar({ user, activeTeam, onTeamChange, onLogout }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, setTheme } = useAppSettings();

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