import { useState } from 'react';
import { useAppSettings } from '../../store/settings';

type ViewMode = 'compact' | 'full';

export default function ViewSettings() {
  const [selectedMode, setSelectedMode] = useState<ViewMode>('full');

  return (
      <div className="space-y-8">
        {/* View Mode Selection */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Формат отображения</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Выберите предпочтительный формат отображения карточек инцидентов
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Mode */}
            <button
                onClick={() => setSelectedMode('full')}
                className={`relative border-2 rounded-lg p-6 transition-all ${
                    selectedMode === 'full'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Полный режим</h4>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Название</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Подозрительная активность</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                Все поля с иконками и визуальными элементами
              </p>
            </button>

            {/* Compact Mode */}
            <button
                onClick={() => setSelectedMode('compact')}
                className={`relative border-2 rounded-lg p-6 transition-all ${
                    selectedMode === 'compact'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Компактный режим</h4>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Название:</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Подозрительная активность</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                Компактное представление без иконок для экономии места
              </p>
            </button>
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