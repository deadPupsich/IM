import { useState, useCallback, useMemo } from 'react';
import { Incident, ColumnKey } from '../types/incident';
import ResizableDraggableColumnHeader from './ResizableDraggableColumnHeader';
import IncidentRow from './IncidentRow';
import ColumnFilter from './ColumnFilter';
import { useAppSettings } from '../store/settings';

interface IncidentTableProps {
  incidents: Incident[];
}

const defaultColumns: { key: ColumnKey; label: string; width: number }[] = [
  { key: 'название', label: 'Название', width: 250 },
  { key: 'ответственный', label: 'Ответственный', width: 180 },
  { key: 'источник', label: 'Источник', width: 150 },
  { key: 'списокФайлов', label: 'Список файлов', width: 150 },
  { key: 'нарушитель', label: 'Нарушитель', width: 180 },
  { key: 'статус', label: 'Статус', width: 120 },
  { key: 'дата', label: 'Дата', width: 150 }
];

const itemsPerPageOptions = [10, 20, 50, 100];

export default function IncidentTable({ incidents }: IncidentTableProps) {
  const [columns, setColumns] = useState(defaultColumns);
  const [filters, setFilters] = useState<Map<ColumnKey, Set<string>>>(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [customItemsPerPage, setCustomItemsPerPage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const { itemsPerPage, setItemsPerPage } = useAppSettings();

  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setColumns((prevColumns) => {
      if (dragIndex === hoverIndex) return prevColumns;
      const newColumns = [...prevColumns];
      const [removed] = newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, removed);
      return newColumns;
    });
  }, []);

  const handleResize = useCallback((columnKey: ColumnKey, width: number) => {
    setColumns((prevColumns) =>
        prevColumns.map((col) =>
            col.key === columnKey ? { ...col, width } : col
        )
    );
  }, []);

  const handleFilterChange = useCallback((columnKey: ColumnKey, selected: Set<string>) => {
    setFilters((prev) => {
      const newFilters = new Map(prev);
      if (selected.size === 0) {
        newFilters.delete(columnKey);
      } else {
        newFilters.set(columnKey, selected);
      }
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const getColumnValues = useCallback((columnKey: ColumnKey) => {
    return incidents.map((incident) => {
      const value = incident[columnKey];
      if (columnKey === 'списокФайлов' && Array.isArray(value)) {
        return value.length > 0 ? `${value.length} файл(ов)` : 'Нет файлов';
      }
      return value as string;
    });
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    if (filters.size === 0) return incidents;

    return incidents.filter((incident) => {
      return Array.from(filters.entries()).every(([key, selectedValues]) => {
        let value = incident[key];
        if (key === 'списокФайлов' && Array.isArray(value)) {
          value = value.length > 0 ? `${value.length} файл(ов)` : 'Нет файлов';
        }
        return selectedValues.has(value as string);
      });
    });
  }, [incidents, filters]);

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIncidents = filteredIncidents.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomInput(true);
    } else {
      setItemsPerPage(parseInt(value));
      setCurrentPage(1);
      setShowCustomInput(false);
    }
  };

  const handleCustomItemsPerPage = () => {
    const value = parseInt(customItemsPerPage);
    if (value > 0 && value <= 1000) {
      setItemsPerPage(value);
      setCurrentPage(1);
      setShowCustomInput(false);
      setCustomItemsPerPage('');
    }
  };

  return (
      <div className="space-y-4">
        {/* Items per page selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Показывать на странице:</span>
            <select
                value={itemsPerPageOptions.includes(itemsPerPage) ? itemsPerPage.toString() : 'custom'}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {itemsPerPageOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
              ))}
              <option value="custom">Своё количество</option>
            </select>

            {showCustomInput && (
                <div className="flex items-center gap-2">
                  <input
                      type="number"
                      value={customItemsPerPage}
                      onChange={(e) => setCustomItemsPerPage(e.target.value)}
                      placeholder="Введите число"
                      min="1"
                      max="1000"
                      className="w-32 px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                      onClick={handleCustomItemsPerPage}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    ОК
                  </button>
                </div>
            )}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Показано {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredIncidents.length)} из {filteredIncidents.length}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              {/* Header */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <div className="w-12 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0" />
                <div className="flex flex-1 min-w-0">
                  {columns.map((col, index) => (
                      <div
                          key={col.key}
                          className="relative flex-shrink-0"
                          style={{ width: `${col.width}px` }}
                      >
                        <ResizableDraggableColumnHeader
                            columnKey={col.key}
                            label={col.label}
                            index={index}
                            width={col.width}
                            moveColumn={moveColumn}
                            onResize={handleResize}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                          <ColumnFilter
                              values={getColumnValues(col.key)}
                              selectedValues={filters.get(col.key) || new Set()}
                              onFilterChange={(selected) => handleFilterChange(col.key, selected)}
                          />
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Rows */}
              {paginatedIncidents.length > 0 ? (
                  paginatedIncidents.map((incident) => (
                      <IncidentRow
                          key={incident.id}
                          incident={incident}
                          columns={columns}
                      />
                  ))
              ) : (
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                    Нет инцидентов, соответствующих фильтрам
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Назад
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                      <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg transition-colors ${
                              currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                      >
                        {pageNum}
                      </button>
                  );
                })}
              </div>

              <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Вперёд
              </button>
            </div>
        )}
      </div>
  );
}