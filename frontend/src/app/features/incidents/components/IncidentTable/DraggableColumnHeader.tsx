import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'lucide-react';
import { ColumnKey } from '../../../../types/incident.ts';

interface DraggableColumnHeaderProps {
  columnKey: ColumnKey;
  label: string;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
}

const COLUMN_TYPE = 'COLUMN';

export default function DraggableColumnHeader({
  columnKey,
  label,
  index,
  moveColumn
}: DraggableColumnHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: COLUMN_TYPE,
    item: { index, columnKey },
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

  return (
    <div
      ref={(node) => {
        ref.current = node;
        if (node) {
          drop(node);
          preview(node);
        }
      }}
      className={`flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div ref={(node) => { if (node) drag(node); }} className="cursor-move">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <span>{label}</span>
    </div>
  );
}
