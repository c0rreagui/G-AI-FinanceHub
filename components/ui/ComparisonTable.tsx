import React from 'react';
import { cn } from '@/utils/utils';
import { Check, X, Minus } from 'lucide-react';

interface ComparisonFeature {
  name: string;
  values: (boolean | string | null)[];
}

interface ComparisonTableProps {
  headers: string[];
  features: ComparisonFeature[];
  className?: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ headers, features, className }) => {
  return (
    <div className={cn("w-full overflow-auto rounded-xl border", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-1/3">Recurso</th>
            {headers.map((h, i) => (
              <th key={i} className="h-12 px-4 text-center align-middle font-medium text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {features.map((feature, i) => (
            <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle font-medium">{feature.name}</td>
              {feature.values.map((val, j) => (
                <td key={j} className="p-4 align-middle text-center">
                  {val === true && <Check className="mx-auto h-4 w-4 text-green-500" />}
                  {val === false && <X className="mx-auto h-4 w-4 text-red-500" />}
                  {val === null && <Minus className="mx-auto h-4 w-4 text-muted-foreground" />}
                  {typeof val === 'string' && <span className="text-muted-foreground">{val}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
