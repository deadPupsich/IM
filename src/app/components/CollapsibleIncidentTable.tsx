import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import IncidentTable from './IncidentTable';
import { Incident } from '../types/incident';

interface CollapsibleIncidentTableProps {
  title: string;
  incidents: Incident[];
  defaultExpanded?: boolean;
}

export default function CollapsibleIncidentTable({ 
  title, 
  incidents, 
  defaultExpanded = true 
}: CollapsibleIncidentTableProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
            {incidents.length}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <IncidentTable incidents={incidents} />
        </div>
      )}
    </div>
  );
}
