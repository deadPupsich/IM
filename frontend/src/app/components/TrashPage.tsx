import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import IncidentTable from './IncidentTable.tsx';
import { useIncidentsStore } from '../store/incidents.ts';

export default function TrashPage() {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearFilters, setClearFilters] = useState({
    all: false,
    команда: '',
    ответственный: '',
    источник: ''
  });
  const incidents = useIncidentsStore((state) => state.incidents);

  const deletedIncidents = incidents.slice(0, 2);

  const handleClearTrash = () => {
    console.log('Clearing trash with filters:', clearFilters);
    alert('Корзина очищена!');
    setShowClearDialog(false);
  };

  const teams = Array.from(new Set(incidents.map(i => i.команда)));
  const responsibles = Array.from(new Set(incidents.map(i => i.ответственный)));
  const sources = Array.from(new Set(incidents.map(i => i.источник)));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Корзина</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Удалённые инциденты • Всего: {deletedIncidents.length}
          </p>
        </div>

        <button
          onClick={() => setShowClearDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Очистить корзину
        </button>
      </div>

      <IncidentTable incidents={deletedIncidents} />

      {/* Clear Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Очистить корзину</h3>
              <button
                onClick={() => setShowClearDialog(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Выберите параметры очистки корзины:
              </p>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={clearFilters.all}
                  onChange={(e) => setClearFilters({ ...clearFilters, all: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Очистить все инциденты</span>
              </label>

              {!clearFilters.all && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Команда
                    </label>
                    <select
                      value={clearFilters.команда}
                      onChange={(e) => setClearFilters({ ...clearFilters, команда: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Все команды</option>
                      {teams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Ответственный
                    </label>
                    <select
                      value={clearFilters.ответственный}
                      onChange={(e) => setClearFilters({ ...clearFilters, ответственный: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Все ответственные</option>
                      {responsibles.map(resp => (
                        <option key={resp} value={resp}>{resp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Источник
                    </label>
                    <select
                      value={clearFilters.источник}
                      onChange={(e) => setClearFilters({ ...clearFilters, источник: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Все источники</option>
                      {sources.map(src => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-blue-200 dark:border-blue-800">
              <button
                onClick={() => setShowClearDialog(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleClearTrash}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
