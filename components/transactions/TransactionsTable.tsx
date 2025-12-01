import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';
import { Transaction, TransactionType } from '../../types';
import { formatCurrencyBRL } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PencilIcon, TrashIcon, LockClosed, LinkIcon } from '../Icons';
import { MessageSquare } from 'lucide-react';
import { Flex, Box } from '../ui/layout';
import { Text } from '../ui/typography';
import { Checkbox } from '../ui/Checkbox';
import { PrivacyMask } from '../ui/PrivacyMask';

interface TransactionsTableProps {
  transactions: Transaction[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onComments: (transaction: Transaction) => void;
  isMutating: (id: string) => boolean;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  selectedIds,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onComments,
  isMutating,
}) => {
  const allSelected = transactions.length > 0 && selectedIds.length === transactions.length;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Transação</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-[120px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const isSystem = !!tx.goal_contribution_id || !!tx.debt_payment_id;
            const isExpense = tx.type === TransactionType.DESPESA;
            
            return (
              <TableRow key={tx.id} data-state={selectedIds.includes(tx.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox 
                    checked={selectedIds.includes(tx.id)}
                    onCheckedChange={() => !isSystem && onSelect(tx.id)}
                    disabled={isSystem}
                    aria-label={`Select transaction ${tx.description}`}
                  />
                </TableCell>
                <TableCell>
                  <Flex align="center" gap="sm">
                    <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs border border-white/10" 
                        style={{backgroundColor: `${tx.category.color}20`}}
                    >
                        <tx.category.icon className="w-4 h-4" style={{color: tx.category.color}} />
                    </div>
                    <Box>
                        <Text weight="medium" className="truncate max-w-[200px] block">{tx.description}</Text>
                        {isSystem && (
                            <Flex align="center" gap="xs" className="text-muted-foreground">
                                <LockClosed className="w-3 h-3" />
                                <Text size="xs" variant="muted">Sistema</Text>
                            </Flex>
                        )}
                    </Box>
                  </Flex>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="font-normal">
                        {tx.category.name}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Text size="sm" variant="muted">
                        {new Date(tx.date).toLocaleDateString('pt-BR')}
                    </Text>
                </TableCell>
                <TableCell className="text-right">

                    <Text weight="bold" className={isExpense ? 'text-destructive' : 'text-success'}>
                        <PrivacyMask>
                            {isExpense ? '-' : '+'} {formatCurrencyBRL(Math.abs(tx.amount))}
                        </PrivacyMask>
                    </Text>
                </TableCell>
                <TableCell>
                    <Flex justify="end" gap="xs">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onComments(tx)}
                            className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                            <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onEdit(tx)}
                            disabled={isSystem || isMutating(tx.id)}
                            className="h-8 w-8"
                        >
                            <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onDelete(tx.id)}
                            disabled={isSystem || isMutating(tx.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </Button>
                    </Flex>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
