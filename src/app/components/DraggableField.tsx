import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'lucide-react';

interface DraggableFieldProps {
  id: string;
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  index: number;
  moveField: (dragIndex: number, hoverIndex: number) => void;
}

const FIELD_TYPE = 'FIELD';

export default function DraggableField({
  id,
  label,
  value,
  icon,
  index,
  moveField
}: DraggableFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: FIELD_TYPE,
    item: { index, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: FIELD_TYPE,
    hover: (item: { index: number; id: string }) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-200 rounded-lg p-4 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div ref={drag} className="cursor-move pt-1">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-1">{label}</div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}
