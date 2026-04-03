import { useMemo, useState, useCallback } from 'react';
import { mockUser } from '../../../data/mockData.ts';
import CollapsibleIncidentTable from './IncidentTable/CollapsibleIncidentTable.tsx';
import { useIncidentsStore } from '../../../store/incidents.ts';

export default function MyIncidentsPage() {
  const [tables, setTables] = useState([
    { id: 'assigned-to-me', title: 'Назначенные на меня' },
    { id: 'assigned-by-me', title: 'Назначенные мной' },
    { id: 'closed-by-me', title: 'Закрытые мной' }
  ]);
  const incidents = useIncidentsStore((state) => state.incidents);

  const assignedToMe = useMemo(() => {
    return incidents.filter((incident) => 
      incident.ответственный === mockUser.name && incident.статус !== 'Закрыт'
    );
  }, [incidents]);
  
  const closedByMe = useMemo(() => {
    return incidents.filter((incident) => 
      incident.ответственный === mockUser.name && incident.статус === 'Закрыт'
    );
  }, [incidents]);

  const assignedByMe = useMemo(() => {
    return incidents.filter((incident) => 
      incident.статус !== 'Закрыт' && incident.команда === 'SOC L1'
    );
  }, [incidents]);

  const moveTable = useCallback((dragIndex: number, hoverIndex: number) => {
    setTables((prevTables) => {
      if (dragIndex === hoverIndex) return prevTables;
      const newTables = [...prevTables];
      // Обмен местами вместо перемещения
      const temp = newTables[dragIndex];
      newTables[dragIndex] = newTables[hoverIndex];
      newTables[hoverIndex] = temp;
      return newTables;
    });
  }, []);

  const getIncidentsForTable = (tableId: string) => {
    switch (tableId) {
      case 'assigned-to-me':
        return assignedToMe;
      case 'assigned-by-me':
        return assignedByMe;
      case 'closed-by-me':
        return closedByMe;
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Мои инциденты</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Всего: {assignedToMe.length + closedByMe.length + assignedByMe.length} инцидентов
        </p>
      </div>

      {tables.map((table, index) => (
        <CollapsibleIncidentTable
          key={table.id}
          title={table.title}
          incidents={getIncidentsForTable(table.id)}
          defaultExpanded={table.id === 'assigned-to-me'}
          id={table.id}
          index={index}
          moveTable={moveTable}
        />
      ))}
    </div>
  );
}
