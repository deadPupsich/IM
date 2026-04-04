import { useMemo } from 'react';
import ViolatorTable from './ViolatorTable/ViolatorTable.tsx';
import { useViolatorsStore } from '../../../store/violatorsStore.ts';

export default function ViolatorsPage() {
  const violators = useViolatorsStore((state) => state.violators);

  const activeViolators = useMemo(() => {
    return violators;
  }, [violators]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Нарушители</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Всего нарушителей: {activeViolators.length}
        </p>
      </div>

      <ViolatorTable violators={activeViolators} />
    </div>
  );
}
