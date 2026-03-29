import { useMemo } from 'react';
import { mockIncidents, mockUser } from '../data/mockData';
import CollapsibleIncidentTable from './CollapsibleIncidentTable';

export default function MyIncidentsPage() {
  const assignedToMe = useMemo(() => {
    return mockIncidents.filter((incident) => 
      incident.ответственный === mockUser.name && incident.статус !== 'Закрыт'
    );
  }, []);

  const closedByMe = useMemo(() => {
    return mockIncidents.filter((incident) => 
      incident.ответственный === mockUser.name && incident.статус === 'Закрыт'
    );
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Мои инциденты</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Всего: {assignedToMe.length + closedByMe.length} инцидентов
        </p>
      </div>

      <CollapsibleIncidentTable
        title="Назначенные на меня"
        incidents={assignedToMe}
        defaultExpanded={true}
      />

      <CollapsibleIncidentTable
        title="Закрытые мной"
        incidents={closedByMe}
        defaultExpanded={false}
      />
    </div>
  );
}
