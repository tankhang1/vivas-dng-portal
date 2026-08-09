import React, { useRef, useState } from 'react';
import { cn } from './ui';
import { ImagePlus, X, UploadCloud } from 'lucide-react';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
}

interface MediaUploadProps {
  value: MediaFile[];
  onChange: (files: MediaFile[]) => void;
  accept?: string;
  multiple?: boolean;
  hint?: string;
}

export function MediaUpload({ value, onChange, accept = 'image/*,video/*', multiple = true, hint }: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newFiles: MediaFile[] = Array.from(fileList).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    onChange(multiple ? [...value, ...newFiles] : newFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(f => f.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-input bg-slate-50 hover:bg-slate-100'
        )}
      >
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', isDragging ? 'bg-primary/10 text-primary' : 'bg-white text-muted-foreground')}>
          {isDragging ? <UploadCloud className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
        </div>
        <p className="text-sm font-medium">
          Kéo thả tệp vào đây, hoặc <span className="text-primary underline">chọn tệp</span>
        </p>
        <p className="text-xs text-muted-foreground">{hint || 'Hỗ trợ ảnh và video, có thể chọn nhiều tệp.'}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map(file => {
            const isVideo = /\.(mp4|mov|webm|avi)$/i.test(file.name);
            return (
              <div key={file.id} className="group relative aspect-square overflow-hidden rounded-md border border-border bg-slate-100">
                {isVideo ? (
                  <video src={file.url} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(file.id); }}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <p className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{file.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
