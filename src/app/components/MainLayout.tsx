import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { mockUser } from '../data/mockData';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { useAppSettings } from '../store/settings';

export default function MainLayout() {
  const [activeTeam, setActiveTeam] = useState(mockUser.teams[0]);
  const { theme } = useAppSettings();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = () => {
    console.log('Выход из системы');
    // Здесь будет логика выхода из системы
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-950">
      <TopBar
        user={mockUser}
        activeTeam={activeTeam}
        onTeamChange={setActiveTeam}
        onLogout={handleLogout}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950">
          <Outlet context={{ activeTeam }} />
        </main>
      </div>
    </div>
  );
}