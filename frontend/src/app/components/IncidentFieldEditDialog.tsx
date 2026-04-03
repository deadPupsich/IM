import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { Upload, X, ChevronDown, Check, Trash2 } from 'lucide-react';
import { getFileIconLarge } from '../utils/fileIcons.tsx';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog.tsx';

interface IncidentFieldEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  value: string;
  inputType?: 'text' | 'textarea' | 'select' | 'boolean' | 'datetime' | 'file' | 'number' | 'multiselect';
  options?: { label: string; value: string }[];
  onSave: (value: string) => void;
  prefix?: string;
  postfix?: string;
}

export default function IncidentFieldEditDialog({
  open,
  onOpenChange,
  label,
  value,
  inputType = 'text',
  options = [],
  onSave,
  prefix,
  postfix,
}: IncidentFieldEditDialogProps) {
  const [draft, setDraft] = useState(value);
  const [datetime, setDatetime] = useState({ date: '', time: '' });
  const [booleanValue, setBooleanValue] = useState(value === 'true');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFileNames, setExistingFileNames] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [multiselectOpen, setMultiselectOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(value);

      // Parse datetime value
      if (inputType === 'datetime' && value) {
        const parts = value.split(' ');
        setDatetime({
          date: parts[0] || '',
          time: parts[1] || ''
        });
      }

      // Parse boolean value
      if (inputType === 'boolean') {
        setBooleanValue(value === 'true');
      }

      // Parse existing file names for file type
      if (inputType === 'file' && value && value !== '—') {
        setExistingFileNames(value.split(',').map(s => s.trim()).filter(s => s));
      } else {
        setExistingFileNames([]);
      }
    }
  }, [open, value, inputType]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (multiselectOpen && !target.closest('[data-multiselect]')) {
        setMultiselectOpen(false);
      }
    };

    if (multiselectOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [multiselectOpen]);

  const handleSave = () => {
    if (inputType === 'datetime') {
      const datetimeValue = datetime.time ? `${datetime.date} ${datetime.time}` : datetime.date;
      onSave(datetimeValue);
    } else if (inputType === 'boolean') {
      onSave(booleanValue ? 'true' : 'false');
    } else if (inputType === 'file') {
      // Combine existing file names with new file names
      const allFiles = [...existingFileNames, ...selectedFiles.map(f => f.name)];
      onSave(allFiles.join(', '));
    } else if (inputType === 'multiselect') {
      // For multiselect, value is already comma-separated
      onSave(draft);
    } else {
      onSave(draft.trim());
    }
    onOpenChange(false);
  };

  const removeExistingFile = (fileName: string) => {
    setExistingFileNames(prev => prev.filter(f => f !== fileName));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSelectedFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const toggleOption = (optionValue: string) => {
    if (inputType !== 'multiselect') return;
    
    const currentValues = draft.split(',').map(v => v.trim()).filter(v => v);
    const index = currentValues.indexOf(optionValue.trim());
    
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(optionValue.trim());
    }
    
    setDraft(currentValues.join(', '));
  };

  const isSelected = (optionValue: string) => {
    if (inputType !== 'multiselect') return false;
    return draft.split(',').map(v => v.trim()).includes(optionValue.trim());
  };

  const removeTag = (tagValue: string) => {
    toggleOption(tagValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Редактировать поле</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">{label}</label>
          
          {inputType === 'textarea' ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите текст (Shift+Enter для новой строки)"
            />
          ) : inputType === 'select' ? (
            <select
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options.map((option) => (
                <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>
                  {typeof option === 'string' ? option : option.label}
                </option>
              ))}
            </select>
          ) : inputType === 'multiselect' ? (
            <div className="relative" data-multiselect>
              <button
                type="button"
                onClick={() => setMultiselectOpen(!multiselectOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="truncate">
                  {draft ? draft.split(',').filter(v => v.trim()).length + ' выбрано' : 'Выберите значения'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${multiselectOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {multiselectOpen && (
                <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                  {options.map((option) => (
                    <button
                      key={typeof option === 'string' ? option : option.value}
                      type="button"
                      onClick={() => toggleOption(typeof option === 'string' ? option : option.value)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected(typeof option === 'string' ? option : option.value)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected(typeof option === 'string' ? option : option.value) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {typeof option === 'string' ? option : option.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              
              {draft && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {draft.split(',').map((v, i) => {
                    const trimmed = v.trim();
                    if (!trimmed) return null;
                    return (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                        {trimmed}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTag(trimmed);
                          }}
                          className="hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ) : inputType === 'boolean' ? (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setBooleanValue(true)}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  booleanValue
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Да
              </button>
              <button
                type="button"
                onClick={() => setBooleanValue(false)}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  !booleanValue
                    ? 'bg-gray-100 dark:bg-gray-700 border-gray-500 text-gray-700 dark:text-gray-300'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Нет
              </button>
            </div>
          ) : inputType === 'datetime' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Дата</label>
                <input
                  type="date"
                  value={datetime.date}
                  onChange={(e) => setDatetime(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Время (опционально)</label>
                <input
                  type="time"
                  value={datetime.time}
                  onChange={(e) => setDatetime(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Если время не указано, будет отображаться только дата
              </p>
            </div>
          ) : inputType === 'file' ? (
            <div className="space-y-3">
              <label
                className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40'
                    : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Нажмите для загрузки или перетащите файлы
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Поддерживается любой тип файлов
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              
              {/* Existing files */}
              {existingFileNames.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Загруженные файлы:</p>
                  {existingFileNames.map((fileName, index) => (
                    <div key={`existing-${index}`} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIconLarge(fileName)}
                        <span className="text-sm text-gray-700 dark:text-gray-300">{fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingFile(fileName)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* New files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Новые файлы:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={`new-${index}`} className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIconLarge(file.name)}
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : inputType === 'number' ? (
            <div className="relative">
              {prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  {prefix}
                </span>
              )}
              <input
                type="number"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  prefix ? 'pl-8' : ''
                } ${postfix ? 'pr-12' : ''}`}
                placeholder="0"
              />
              {postfix && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                  {postfix}
                </span>
              )}
            </div>
          ) : (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Сохранить
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
