import React, { useState } from 'react';
import { cn } from '@/utils/utils';
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface FileTreeProps {
  data: FileNode[];
  className?: string;
  onSelect?: (node: FileNode) => void;
}

const FileTreeNode: React.FC<{ node: FileNode; level: number; onSelect?: (node: FileNode) => void }> = ({ node, level, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    }
    onSelect?.(node);
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 hover:bg-accent/50 cursor-pointer rounded-sm text-sm select-none",
          level > 0 && "ml-4"
        )}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleToggle(e as any);
          }
        }}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <span className="mr-1 opacity-70">
          {node.type === 'folder' ? (
            isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
          ) : <div className="w-3" />}
        </span>
        <span className="mr-2 text-primary">
          {node.type === 'folder' ? (
            isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
          ) : <File className="h-4 w-4 text-muted-foreground" />}
        </span>
        <span>{node.name}</span>
      </div>
      {isOpen && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FileTreeNode key={child.id} node={child} level={level + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({ data, className, onSelect }) => {
  return (
    <div className={cn("border rounded-lg p-2 bg-card overflow-hidden", className)}>
      {data.map((node) => (
        <FileTreeNode key={node.id} node={node} level={0} onSelect={onSelect} />
      ))}
    </div>
  );
};
