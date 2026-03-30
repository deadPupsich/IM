import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ColumnKey } from '../types/incident';

interface ResizableDraggableColumnHeaderProps {
  columnKey: ColumnKey;
  label: string;
  index: number;
  width: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onResize: (columnKey: ColumnKey, width: number) => void;
  onSort: (columnKey: ColumnKey, direction: 'asc' | 'desc' | null) => void;
  sortDirection: 'asc' | 'desc' | null;
}

const COLUMN_TYPE = 'COLUMN';

export default function ResizableDraggableColumnHeader({
                                                         columnKey,
                                                         label,
                                                         index,
                                                         width,
                                                         moveColumn,
                                                         onResize,
                                                         onSort,
                                                         sortDirection
                                                       }: ResizableDraggableColumnHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: COLUMN_TYPE,
    item: { index, columnKey },
    canDrag: !isResizing,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: COLUMN_TYPE,
    hover: (item: { index: number; columnKey: ColumnKey }) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(100, startWidth + delta);
      onResize(columnKey, newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSortClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let newDirection: 'asc' | 'desc' | null = null;
    if (sortDirection === null) {
      newDirection = 'asc';
    } else if (sortDirection === 'asc') {
      newDirection = 'desc';
    } else {
      newDirection = null;
    }
    
    onSort(columnKey, newDirection);
  };

  // Применяем drop к основному элементу
  drop(ref);
  // Применяем drag к ручке
  drag(dragHandleRef);

  return (
      <div
          ref={ref}
          className={`relative flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-700 dark:text-gray-300 ${
              isDragging ? 'opacity-50' : ''
          }`}
          style={{ width: `${width}px` }}
      >
        <div ref={dragHandleRef} className="cursor-move flex-shrink-0">
          <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <span 
          onClick={handleSortClick}
          className="truncate flex-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          {label}
          {sortDirection !== null && (
            sortDirection === 'asc' ? 
              <ArrowUp className="w-3 h-3 flex-shrink-0" /> : 
              <ArrowDown className="w-3 h-3 flex-shrink-0" />
          )}
        </span>

        <div
            onMouseDown={handleMouseDown}
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors z-20"
            style={{ background: isResizing ? '#3b82f6' : 'transparent' }}
        />
      </div>
  );
}