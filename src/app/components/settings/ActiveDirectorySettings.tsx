import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  server: string;
  port: string;
  username: string;
}

export default function ActiveDirectorySettings() {
  const [domains, setDomains] = useState<Domain[]>([
    { id: '1', name: 'corp.local', server: 'dc01.corp.local', port: '389', username: 'admin@corp.local' }
  ]);

  const addDomain = () => {
    const newDomain: Domain = {
      id: Date.now().toString(),
      name: '',
      server: '',
      port: '389',
      username: ''
    };
    setDomains([...domains, newDomain]);
  };

  const removeDomain = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
  };

  const updateDomain = (id: string, field: keyof Domain, value: string) => {
    setDomains(domains.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Настройка Active Directory</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Добавьте домены Active Directory для интеграции с системой
        </p>
      </div>

      <div className="space-y-4">
        {domains.map((domain, index) => (
          <div key={domain.id} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Домен {index + 1}</h4>
              <button
                onClick={() => removeDomain(domain.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Название домена
                </label>
                <input
                  type="text"
                  value={domain.name}
                  onChange={(e) => updateDomain(domain.id, 'name', e.target.value)}
                  placeholder="corp.local"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Сервер
                </label>
                <input
                  type="text"
                  value={domain.server}
                  onChange={(e) => updateDomain(domain.id, 'server', e.target.value)}
                  placeholder="dc01.corp.local"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Порт
                </label>
                <input
                  type="text"
                  value={domain.port}
                  onChange={(e) => updateDomain(domain.id, 'port', e.target.value)}
                  placeholder="389"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Пользователь
                </label>
                <input
                  type="text"
                  value={domain.username}
                  onChange={(e) => updateDomain(domain.id, 'username', e.target.value)}
                  placeholder="admin@corp.local"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Пароль
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addDomain}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить домен
      </button>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
