import React, { useState, useRef } from 'react';
import { cn } from '@/utils/utils';
import { CloudUpload, File, X } from 'lucide-react';
import { Button } from './Button';

interface DragDropUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  className?: string;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({ 
  onUpload, 
  accept, 
  maxFiles = 1, 
  className 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border border-border/50 bg-secondary/5 rounded-xl p-8 text-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:bg-secondary/10 hover:border-primary/30",
          isDragging ? "border-primary bg-primary/10 ring-2 ring-primary/20" : "",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          title="Upload de arquivos"
          aria-label="Upload de arquivos"
          multiple={maxFiles > 1}
          accept={accept}
          onChange={(e) => {
            if (e.target.files) handleFiles(Array.from(e.target.files));
          }}
          disabled={files.length >= maxFiles}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-primary/10 ring-1 ring-primary/20 transition-transform group-hover:scale-110">
            <CloudUpload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">
                Clique para enviar ou arraste
            </div>
            <div className="text-xs text-muted-foreground mt-1">
                Suporta: {accept || 'Todos os arquivos'} (Max: {maxFiles})
            </div>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-card border rounded-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <File className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[200px]" title={file.name}>{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(i)}>
                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
