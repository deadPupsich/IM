import { useState } from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';

interface TelegramBot {
  id: string;
  botToken: string;
  botName: string;
  chatId: string;
  enabled: boolean;
}

export default function TelegramSettings() {
  const [bots, setBots] = useState<TelegramBot[]>([
    {
      id: '1',
      botToken: '',
      botName: '',
      chatId: '',
      enabled: true
    }
  ]);

  const addBot = () => {
    const newBot: TelegramBot = {
      id: Date.now().toString(),
      botToken: '',
      botName: '',
      chatId: '',
      enabled: true
    };
    setBots([...bots, newBot]);
  };

  const removeBot = (id: string) => {
    setBots(bots.filter(b => b.id !== id));
  };

  const updateBot = (id: string, field: keyof TelegramBot, value: any) => {
    setBots(bots.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const testBot = (botToken: string) => {
    console.log('Testing bot:', botToken);
    alert('Отправлено тестовое сообщение в Telegram');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Настройка Telegram</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Добавьте Telegram ботов для отправки уведомлений и управления инцидентами
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Как создать бота?</h4>
            <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>Откройте Telegram и найдите @BotFather</li>
              <li>Отправьте команду /newbot и следуйте инструкциям</li>
              <li>Скопируйте токен бота и вставьте его ниже</li>
              <li>Добавьте бота в группу или чат и скопируйте Chat ID</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {bots.map((bot, index) => (
          <div key={bot.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300">Бот {index + 1}</h4>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bot.enabled}
                    onChange={(e) => updateBot(bot.id, 'enabled', e.target.checked)}
                    className="rounded border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-900 dark:text-blue-300">Активен</span>
                </label>
                {bots.length > 1 && (
                  <button
                    onClick={() => removeBot(bot.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Bot Token
                </label>
                <input
                  type="text"
                  value={bot.botToken}
                  onChange={(e) => updateBot(bot.id, 'botToken', e.target.value)}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Имя бота
                </label>
                <input
                  type="text"
                  value={bot.botName}
                  onChange={(e) => updateBot(bot.id, 'botName', e.target.value)}
                  placeholder="MyIncidentBot"
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Chat ID
                </label>
                <input
                  type="text"
                  value={bot.chatId}
                  onChange={(e) => updateBot(bot.id, 'chatId', e.target.value)}
                  placeholder="-1001234567890"
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <button
                onClick={() => testBot(bot.botToken)}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors text-sm"
                disabled={!bot.botToken || !bot.chatId}
              >
                Отправить тестовое сообщение
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addBot}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить бота
      </button>

      <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
