import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AnimatedCurrency } from '../ui/AnimatedCurrency';
import { PrivacyMask } from '../ui/PrivacyMask';
import { Heading, Text } from '../ui/typography';
import { cn } from '../../utils/utils';
import { formatCurrencyBRL } from '../../utils/formatters';

interface BalanceCardProps {
  balance: number;
  className?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, className }) => {
  return (
    <Card className={cn("bg-gradient-to-br from-cyan-900/40 to-blue-900/20 !border-cyan-500/30 relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-cyan-200 uppercase tracking-wider">Saldo Total</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl md:text-4xl font-bold text-white tracking-tight tabular-nums truncate" title={formatCurrencyBRL(balance)}>
          <PrivacyMask>
            <AnimatedCurrency value={balance} />
          </PrivacyMask>
        </div>
      </CardContent>
    </Card>
  );
};
