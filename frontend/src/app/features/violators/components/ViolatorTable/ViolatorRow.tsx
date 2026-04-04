import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, MoreVertical, Pencil } from 'lucide-react';
import { Violator, ViolatorDynamicColumnKey } from '../../../../types/violator.ts';
import { ViolatorColumnDefinition, getViolatorColumnValue } from '../../../../config/violator-config.tsx';

interface ViolatorRowProps {
  violator: Violator;
  columns: ViolatorColumnDefinition[];
}

export default function ViolatorRow({ violator, columns }: ViolatorRowProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = () => {
    navigate(`/violator/${violator.id}`);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleOpenInNewTab = () => {
    window.open(`/violator/${violator.id}`, '_blank');
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <>
      <div
        ref={rowRef}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        className={`flex items-center border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group ${
          isExpanded ? 'bg-blue-50/50 dark:bg-blue-900/5' : ''
        }`}
      >
        {/* Expand button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-10 h-10 shrink-0 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

        {/* Column values */}
        {columns.map((col) => (
          <div
            key={col.key}
            className="shrink-0 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 truncate"
            style={{ width: `${col.width}px` }}
          >
            {getViolatorColumnValue(violator, col.key)}
          </div>
        ))}

        {/* Context menu button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            setContextMenu({ x: rect.left, y: rect.bottom });
          }}
          className="w-10 h-10 shrink-0 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="flex items-center border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-10 shrink-0" />
          <div className="flex-1 px-4 py-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {columns.map((col) => (
                <div key={col.key} className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{col.label}</span>
                  <span className="text-gray-900 dark:text-gray-100">{getViolatorColumnValue(violator, col.key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeContextMenu} onMouseDown={closeContextMenu} />
          <div
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-48"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              onClick={() => {
                closeContextMenu();
                navigate(`/violator/${violator.id}`);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Pencil className="w-4 h-4" />
              Открыть нарушителя
            </button>
            <button
              onClick={() => {
                closeContextMenu();
                handleOpenInNewTab();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Открыть в новой вкладке
            </button>
            <button
              onClick={() => {
                closeContextMenu();
                setIsExpanded(!isExpanded);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isExpanded ? 'Свернуть' : 'Развернуть'}
            </button>
          </div>
        </>
      )}
    </>
  );
}
