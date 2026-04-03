import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Filter, Check } from 'lucide-react';

interface ColumnFilterProps {
  values: string[];
  selectedValues: Set<string>;
  onFilterChange: (selected: Set<string>) => void;
}

export default function ColumnFilter({ values, selectedValues, onFilterChange }: ColumnFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const uniqueValues = Array.from(new Set(values)).sort();
  const filteredValues = uniqueValues.filter(val =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasActiveFilters = selectedValues.size > 0 && selectedValues.size < uniqueValues.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX - 120
        });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const toggleValue = (value: string) => {
    const newSelected = new Set(selectedValues);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    onFilterChange(newSelected);
  };

  const selectAll = () => {
    onFilterChange(new Set());
  };

  const clearAll = () => {
    onFilterChange(new Set(uniqueValues));
  };

  return (
      <>
        <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                hasActiveFilters ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
            }`}
        >
          <Filter className="w-3.5 h-3.5" />
        </button>

        {isOpen && createPortal(
            <div
                ref={menuRef}
                className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-1000"
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                  minWidth: '256px'
                }}
            >
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                />
              </div>

              <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                <button
                    onClick={selectAll}
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                >
                  Выбрать все
                </button>
                <button
                    onClick={clearAll}
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                >
                  Очистить
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto p-2">
                {filteredValues.map((value) => {
                  const isSelected = selectedValues.size === 0 || selectedValues.has(value);
                  return (
                      <button
                          key={value}
                          onClick={() => toggleValue(value)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 truncate">{value}</span>
                      </button>
                  );
                })}
              </div>
            </div>,
            document.body
        )}
      </>
  );
}