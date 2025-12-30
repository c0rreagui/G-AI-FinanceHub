import React from 'react';
import { ChevronRight, MoreHorizontal, Home } from 'lucide-react';
import { cn } from '@/utils/utils';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, maxItems = 3, className }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const renderItems = () => {
    if (items.length <= maxItems || isExpanded) {
      return items;
    }

    const start = items.slice(0, 1);
    const end = items.slice(-2);
    return [...start, { label: '...', href: undefined }, ...end];
  };

  const displayItems = renderItems();

  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <Link to="/" className="hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.label === '...';

        return (
          <React.Fragment key={item.label}>
            <ChevronRight className="h-4 w-4 mx-2 opacity-50" />
            {isEllipsis ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                aria-label="Show more items"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            ) : item.href && !isLast ? (
              <Link to={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={cn("font-medium text-foreground", isLast && "truncate")}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
