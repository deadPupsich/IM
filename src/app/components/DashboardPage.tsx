import { useMemo, useState, useRef } from 'react';
import { mockIncidents } from '../data/mockData';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
  const [dateFilter, setDateFilter] = useState('all');
  const dashboardRef = useRef<HTMLDivElement>(null);

  const filteredIncidents = useMemo(() => {
    const now = new Date();
    if (dateFilter === 'today') {
      return mockIncidents.filter(inc => {
        const incDate = new Date(inc.дата);
        return incDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return mockIncidents.filter(inc => new Date(inc.дата) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return mockIncidents.filter(inc => new Date(inc.дата) >= monthAgo);
    }
    return mockIncidents;
  }, [dateFilter]);

  const stats = useMemo(() => {
    const total = filteredIncidents.length;
    const closed = filteredIncidents.filter(inc => inc.статус === 'Закрыт').length;
    const open = filteredIncidents.filter(inc => inc.статус === 'Открыт').length;
    const inProgress = filteredIncidents.filter(inc => inc.статус === 'В работе').length;
    
    return { total, closed, open, inProgress };
  }, [filteredIncidents]);

  const statusData = useMemo(() => {
    const statusCount = new Map<string, number>();
    filteredIncidents.forEach(inc => {
      statusCount.set(inc.статус, (statusCount.get(inc.статус) || 0) + 1);
    });
    return Array.from(statusCount.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredIncidents]);

  const teamData = useMemo(() => {
    const teamCount = new Map<string, number>();
    filteredIncidents.forEach(inc => {
      teamCount.set(inc.команда, (teamCount.get(inc.команда) || 0) + 1);
    });
    return Array.from(teamCount.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredIncidents]);

  const sourceData = useMemo(() => {
    const sourceCount = new Map<string, number>();
    filteredIncidents.forEach(inc => {
      sourceCount.set(inc.источник, (sourceCount.get(inc.источник) || 0) + 1);
    });
    return Array.from(sourceCount.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredIncidents]);

  const exportChart = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element);
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportFullDashboard = async () => {
    if (!dashboardRef.current) return;

    const canvas = await html2canvas(dashboardRef.current, {
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });
    
    const link = document.createElement('a');
    link.download = `dashboard-${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="p-6 space-y-6" ref={dashboardRef}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Дашборд</h2>
          <p className="text-sm text-gray-600 mt-1">Статистика и аналитика инцидентов</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="all">Все время</option>
              <option value="today">Сегодня</option>
              <option value="week">Последняя неделя</option>
              <option value="month">Последний месяц</option>
            </select>
          </div>
          
          <button
            onClick={exportFullDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Экспорт дашборда
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Всего инцидентов</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Открыто</p>
              <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">В работе</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Закрыто</p>
              <p className="text-3xl font-bold text-green-600">{stats.closed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6" id="status-chart">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Статусы инцидентов</h3>
            <button
              onClick={() => exportChart('status-chart', 'status-chart')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Team Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6" id="team-chart">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Инциденты по командам</h3>
            <button
              onClick={() => exportChart('team-chart', 'team-chart')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Количество" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2" id="source-chart">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Источники инцидентов</h3>
            <button
              onClick={() => exportChart('source-chart', 'source-chart')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Количество" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
