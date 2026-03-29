import { useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { mockIncidents } from '../data/mockData';
import IncidentTable from './IncidentTable';

interface OutletContext {
  activeTeam: string;
}

export default function IncidentsPage() {
  const { activeTeam } = useOutletContext<OutletContext>();

  const filteredIncidents = useMemo(() => {
    return mockIncidents.filter((incident) => incident.команда === activeTeam);
  }, [activeTeam]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Инциденты</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Команда: <span className="font-medium">{activeTeam}</span> • Всего инцидентов: {filteredIncidents.length}
        </p>
      </div>

      <IncidentTable incidents={filteredIncidents} />
    </div>
  );
}