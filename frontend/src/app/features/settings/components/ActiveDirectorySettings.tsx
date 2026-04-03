import { useState } from 'react';
import { Plus, Trash2, Shield } from 'lucide-react';

type DirectoryConnectionType = 'LDAP' | 'LDAPS' | 'GlobalLDAP' | 'GlobalLDAPS';

const directoryConnectionOptions = [
  { value: 'LDAP', label: 'LDAP (389)' },
  { value: 'LDAPS', label: 'LDAPS (636)' },
  { value: 'GlobalLDAP', label: 'GlobalLDAP (3268)' },
  { value: 'GlobalLDAPS', label: 'GlobalLDAPS (3269)' },
] as const;

interface Domain {
  id: string;
  domainName: string;
  controllerIp: string;
  username: string;
  password: string;
  connectionType: DirectoryConnectionType;
}

export default function ActiveDirectorySettings() {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      domainName: 'corp.local',
      controllerIp: '10.10.10.10',
      username: 'svc_im_sync@corp.local',
      password: '',
      connectionType: 'LDAPS',
    }
  ]);

  const addDomain = () => {
    const newDomain: Domain = {
      id: Date.now().toString(),
      domainName: '',
      controllerIp: '',
      username: '',
      password: '',
      connectionType: 'LDAP'
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
          Добавьте подключения к Active Directory для интеграции с системой
        </p>
      </div>

      <div className="space-y-4">
        {domains.map((domain, index) => (
          <div key={domain.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Подключение AD {index + 1}</h4>
                  <p className="text-xs text-blue-800 dark:text-blue-400">
                    Укажите параметры подключения к контроллеру домена
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeDomain(domain.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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

              <div className="md:col-span-2">
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
          </div>
        ))}
      </div>

      <button
        onClick={addDomain}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
