import { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import IncidentTable from './IncidentTable';
import { Incident } from '../types/incident';
import { useDrag, useDrop } from 'react-dnd';

interface CollapsibleIncidentTableProps {
  title: string;
  incidents: Incident[];
  defaultExpanded?: boolean;
  id: string;
}

const TABLE_TYPE = 'TABLE';

export default function CollapsibleIncidentTable({ 
  title, 
  incidents, 
  defaultExpanded = true,
  id
}: CollapsibleIncidentTableProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const [{ isDragging }, drag, preview] = useDrag({
    type: TABLE_TYPE,
    item: { id, title },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: TABLE_TYPE,
    hover: () => {
      // Здесь можно реализовать перемещение таблиц
    }
  });

  preview(drop(drag(null)));

  return (
    <div 
      ref={isDragging ? undefined : undefined}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-move" />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 -mx-2 px-2 py-1 rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
            {incidents.length}
          </span>
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <IncidentTable incidents={incidents} />
        </div>
      )}
    </div>
  );
}
