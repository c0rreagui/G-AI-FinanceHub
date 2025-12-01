import React from 'react';
import { cn } from '@/utils/utils';
import { ClipboardButton } from './ClipboardButton';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'json', className }) => {
  return (
    <div className={cn("relative rounded-lg border bg-muted font-mono text-sm", className)}>
      <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
        <span className="text-xs text-muted-foreground uppercase">{language}</span>
        <ClipboardButton value={code} variant="ghost" size="icon" className="h-6 w-6" />
      </div>
      <div className="overflow-x-auto p-4 custom-scrollbar">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
