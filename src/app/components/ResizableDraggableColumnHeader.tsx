import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'lucide-react';
import { ColumnKey } from '../types/incident';

interface ResizableDraggableColumnHeaderProps {
  columnKey: ColumnKey;
  label: string;
  index: number;
  width: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onResize: (columnKey: ColumnKey, width: number) => void;
}

const COLUMN_TYPE = 'COLUMN';

export default function ResizableDraggableColumnHeader({
  columnKey,
  label,
  index,
  width,
  moveColumn,
  onResize
}: ResizableDraggableColumnHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
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

  preview(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-700 dark:text-gray-300 ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ width: `${width}px` }}
    >
      <div ref={drag} className="cursor-move">
        <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>
      <span className="truncate">{label}</span>
      
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
        style={{ background: isResizing ? '#3b82f6' : 'transparent' }}
      />
    </div>
  );
}
