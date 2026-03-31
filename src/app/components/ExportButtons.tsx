import { Download, FileArchive } from 'lucide-react';
import { Incident } from '../types/incident';

interface ExportButtonsProps {
  incident: Incident;
}

export default function ExportButtons({ incident }: ExportButtonsProps) {
  const handleExportFiles = () => {
    console.log('Выгрузка файлов для инцидента:', incident.id);
    alert(`Выгружаются файлы инцидента: ${incident.название}`);
    // Здесь будет логика выгрузки файлов
  };

  const handleExportFilesAndCard = () => {
    console.log('Выгрузка файлов и карточки для инцидента:', incident.id);
    alert(`Выгружаются файлы и карточка инцидента: ${incident.название}`);
    // Здесь будет логика выгрузки файлов и карточки
  };

  const handleExportByViolator = () => {
    console.log('Выгрузка всех инцидентов по login:', incident.login);
    alert(`Выгружаются все инциденты по login: ${incident.login}`);
    // Здесь будет логика выгрузки всех инцидентов по login
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleExportFiles}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        Выгрузить файлы
      </button>
      <button
        onClick={handleExportFilesAndCard}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
      >
        <FileArchive className="w-4 h-4" />
        Файлы + карточка
      </button>
      <button
        onClick={handleExportByViolator}
        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
      >
        <FileArchive className="w-4 h-4" />
        Все по login
      </button>
    </div>
  );
}
