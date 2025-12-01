import React, { useState, useRef } from 'react';
import { cn } from '@/utils/utils';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from './Button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string) => {
    document.execCommand(command, false, '');
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-card", className)}>
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        <Button variant="ghost" size="icon" onClick={() => execCommand('bold')} className="h-8 w-8">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => execCommand('italic')} className="h-8 w-8">
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="icon" onClick={() => execCommand('insertUnorderedList')} className="h-8 w-8">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => execCommand('insertOrderedList')} className="h-8 w-8">
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[100px] outline-none prose prose-invert max-w-none text-sm"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};
