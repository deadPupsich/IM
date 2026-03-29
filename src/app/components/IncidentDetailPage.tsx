import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, FileText, User, Database, FileStack, AlertTriangle, Calendar, Shield, Activity } from 'lucide-react';
import { mockIncidents } from '../data/mockData';
import DraggableField from './DraggableField';
import ExportButtons from './ExportButtons';

interface Field {
  id: string;
  label: string;
  getValue: (incident: any) => React.ReactNode;
  icon: React.ReactNode;
}

const defaultFields: Field[] = [
  {
    id: 'название',
    label: 'Название',
    getValue: (incident) => incident.название,
    icon: <FileText className="w-5 h-5 text-blue-600" />
  },
  {
    id: 'ответственный',
    label: 'Ответственный',
    getValue: (incident) => incident.ответственный,
    icon: <User className="w-5 h-5 text-green-600" />
  },
  {
    id: 'источник',
    label: 'Источник',
    getValue: (incident) => incident.источник,
    icon: <Database className="w-5 h-5 text-purple-600" />
  },
  {
    id: 'нарушитель',
    label: 'Нарушитель',
    getValue: (incident) => incident.нарушитель,
    icon: <AlertTriangle className="w-5 h-5 text-red-600" />
  },
  {
    id: 'статус',
    label: 'Статус',
    getValue: (incident) => (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
        incident.статус === 'Закрыт' ? 'bg-gray-100 text-gray-700' :
        incident.статус === 'Открыт' ? 'bg-blue-100 text-blue-700' :
        incident.статус === 'В работе' ? 'bg-yellow-100 text-yellow-700' :
        'bg-orange-100 text-orange-700'
      }`}>
        {incident.статус}
      </span>
    ),
    icon: <Activity className="w-5 h-5 text-indigo-600" />
  },
  {
    id: 'команда',
    label: 'Команда',
    getValue: (incident) => incident.команда,
    icon: <Shield className="w-5 h-5 text-cyan-600" />
  },
  {
    id: 'дата',
    label: 'Дата создания',
    getValue: (incident) => incident.дата,
    icon: <Calendar className="w-5 h-5 text-pink-600" />
  },
  {
    id: 'файлы',
    label: 'Список файлов',
    getValue: (incident) => (
      <div className="space-y-2">
        {incident.списокФайлов.length > 0 ? (
          incident.списокФайлов.map((file: string, idx: number) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs mr-2 mb-2"
            >
              <FileText className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-gray-700">{file}</span>
            </div>
          ))
        ) : (
          <span className="text-gray-500 text-sm">Нет прикрепленных файлов</span>
        )}
      </div>
    ),
    icon: <FileStack className="w-5 h-5 text-orange-600" />
  }
];

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState(defaultFields);

  const incident = useMemo(() => {
    return mockIncidents.find((inc) => inc.id === id);
  }, [id]);

  const moveField = useCallback((dragIndex: number, hoverIndex: number) => {
    setFields((prevFields) => {
      const newFields = [...prevFields];
      const [removed] = newFields.splice(dragIndex, 1);
      newFields.splice(hoverIndex, 0, removed);
      return newFields;
    });
  }, []);

  if (!incident) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          Инцидент не найден
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Карточка инцидента</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">ID: {incident.id}</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 Вы можете перетаскивать поля для изменения их порядка
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <DraggableField
            key={field.id}
            id={field.id}
            label={field.label}
            value={field.getValue(incident)}
            icon={field.icon}
            index={index}
            moveField={moveField}
          />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Действия</h3>
        <div className="mb-4">
          <ExportButtons incident={incident} />
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Редактировать
          </button>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            История изменений
          </button>
        </div>
      </div>
    </div>
  );
}