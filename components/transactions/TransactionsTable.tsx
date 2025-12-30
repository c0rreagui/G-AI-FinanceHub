import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { motion, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { Transaction, TransactionType, TransactionStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PencilIcon, TrashIcon, LockClosed } from '../Icons';
import { MessageSquare, ArrowUpDown, MoreHorizontal, Star, Edit2, Copy, Trash2 } from 'lucide-react';
import { Flex, Box } from '../ui/AppLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { PrivacyMask } from "../ui/PrivacyMask";
import { Text } from '../ui/AppTypography';
import { Checkbox } from '../ui/Checkbox';
import { DataTable } from '../ui/DataTable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { GroupBy, TransactionGroup } from '../../utils/dateGrouping';

interface TransactionsTableProps {
  transactions: Transaction[];
  groupBy?: GroupBy;
  groupedData?: TransactionGroup[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (transaction: Transaction) => void;
  onDuplicate: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onComments: (transaction: Transaction) => void;
  isMutating: (id: string) => boolean;
  onToggleStar?: (id: string) => void;
}

import { useTransactionColumns } from '../../hooks/useTransactionColumns';

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  groupBy,
  groupedData,
  selectedIds,
  onSelect,
  onSelectAll,
  onEdit,
  onDuplicate,
  onDelete,
  onComments,
  isMutating,
  onToggleStar,
}) => {
  const allSelected = transactions.length > 0 && selectedIds.length === transactions.length;

  const columns = useTransactionColumns({
    transactions,
    selectedIds,
    onSelect,
    onSelectAll,
    onEdit,
    onComments,
    onDelete,
    isMutating
  });

  // Render grouped view if grouping is enabled (Item 118)
  if (groupBy && groupBy !== 'none' && groupedData && groupedData.length > 0) {
    return (
      <div className="w-full">
        {groupedData.map((group) => (
          <div key={group.dateKey} className="mb-4">
            {/* Group Header */}
            <div className="sticky top-0 z-10 bg-secondary/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-foreground">{group.dateLabel}</h3>
                <Badge variant="secondary" className="text-xs">
                  {group.transactions.length} {group.transactions.length === 1 ? 'transação' : 'transações'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {group.totalIncome > 0 && (
                  <span className="text-success font-mono">
                    <PrivacyMask>+{formatCurrency(group.totalIncome)}</PrivacyMask>
                  </span>
                )}
                {group.totalExpense > 0 && (
                  <span className="text-destructive font-mono">
                    <PrivacyMask>-{formatCurrency(group.totalExpense)}</PrivacyMask>
                  </span>
                )}
                <span className={`font-bold font-mono ${group.netTotal >= 0 ? 'text-success' : 'text-destructive'}`}>
                  <PrivacyMask>{group.netTotal >= 0 ? '+' : ''}{formatCurrency(group.netTotal)}</PrivacyMask>
                </span>
              </div>
            </div>

            {/* Render group's transactions */}
            <TransactionsTable
              transactions={group.transactions}
              groupBy="none"
              selectedIds={selectedIds}
              onSelect={onSelect}
              onSelectAll={onSelectAll}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onComments={onComments}
              isMutating={isMutating}
            />
          </div>
        ))}
      </div>
    );
  }

  // Mobile Card View with Swipe Actions
  const MobileCard = ({ tx }: { tx: Transaction }) => {
    const isSystem = !!tx.goal_contribution_id || !!tx.debt_payment_id;
    const isExpense = tx.type === TransactionType.DESPESA;
    const controls = useAnimation();
    const MotionDiv = motion.div as any;

    const [expanded, setExpanded] = useState(false);

    const handleDragEnd = async (event: any, info: PanInfo) => {
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      if (offset < -100 || velocity < -500) {
        // Swipe Left -> Delete
        if (!isSystem && !isMutating(tx.id)) {
          await controls.start({ x: -500, opacity: 0 });
          onDelete(tx.id);
        } else {
          controls.start({ x: 0 });
        }
      } else if (offset > 100 || velocity > 500) {
        // Swipe Right -> Edit
        if (!isSystem && !isMutating(tx.id)) {
          onEdit(tx);
          controls.start({ x: 0 }); // Reset after triggering edit
        } else {
          controls.start({ x: 0 });
        }
      } else {
        controls.start({ x: 0 });
      }
    };

    return (
      <div className="relative mb-3 overflow-hidden rounded-xl">
        {/* Background Actions */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <div className="flex items-center justify-start w-full h-full bg-blue-500/20 text-blue-500 rounded-xl">
            <PencilIcon className="w-6 h-6 ml-4" />
          </div>
          <div className="absolute inset-0 flex items-center justify-end w-full h-full bg-destructive/20 text-destructive rounded-xl">
            <TrashIcon className="w-6 h-6 mr-4" />
          </div>
        </div>

        {/* Foreground Card */}
        <MotionDiv
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={controls}
          className={`relative p-4 rounded-xl border border-border bg-card ${selectedIds.includes(tx.id) ? 'ring-1 ring-primary bg-primary/5' : ''}`}
          style={{ touchAction: 'pan-y' }} // Allow vertical scroll
          onClick={() => setExpanded(!expanded)}
        >
          <Flex justify="between" align="start" className="mb-3">
            <Flex align="center" gap="sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs border border-border bg-[var(--category-bg)]"
                ref={(el) => { if (el) el.style.setProperty('--category-bg', `${tx.category.color}20`); }}
              >
                <tx.category.icon
                  className="w-5 h-5 text-[var(--category-color)]"
                  ref={(el: HTMLElement) => { if (el) el.style.setProperty('--category-color', tx.category.color); }}
                />
              </div>
              <Box>
                <Flex gap="xs" align="center">
                  <Text weight="bold" className="truncate max-w-[150px] block">{tx.description}</Text>
                  {tx.starred && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                </Flex>
                <Text size="xs" variant="muted">{new Date(tx.date).toLocaleDateString('pt-BR')}</Text>
              </Box>
            </Flex>
            <Text weight="bold" size="lg" className={isExpense ? 'text-destructive' : 'text-success'}>
              <PrivacyMask>
                {isExpense ? '-' : '+'} {formatCurrency(Math.abs(tx.amount))}
              </PrivacyMask>
            </Text>
          </Flex>

          <Flex justify="between" align="center" className="pt-3 border-t border-white/5">
            <Badge variant="outline" className="font-normal text-xs">
              {tx.category.name}
            </Badge>

            <Flex gap="xs">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); if (onToggleStar) onToggleStar(tx.id); }}
                className={`h-8 w-8 ${tx.starred ? 'text-amber-500' : 'text-gray-400 hover:text-white'}`}
              >
                <Star className={`w-4 h-4 ${tx.starred ? 'fill-amber-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onComments(tx); }}
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </Flex>
          </Flex>

          {/* Expanded Details */}
          <AnimatePresence>
            {expanded && (
              <MotionDiv
                key="row-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-3 border-t border-white/5 space-y-2">
                  {tx.notes && (
                    <div className="flex gap-2">
                      <Text size="xs" variant="muted" className="w-16">Notas:</Text>
                      <Text size="xs" className="flex-1">{tx.notes}</Text>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Text size="xs" variant="muted" className="w-16">Status:</Text>
                    <Badge variant="secondary" className="text-xs h-5">
                      {tx.status === 'completed' ? 'Concluído' : tx.status === 'pending' ? 'Pendente' : 'Agendado'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Text size="xs" variant="muted" className="w-16">Conta:</Text>
                    <Text size="xs">{tx.account_id}</Text>
                  </div>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>

          {/* Swipe Hint - First time users */}
          <div className="text-center mt-2 text-xs text-muted-foreground/50 flex items-center justify-center gap-1">
            <span>↔</span>
            <span>Arraste para editar ou excluir</span>
          </div>
        </MotionDiv>
      </div>
    );
  };



  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <Flex justify="between" align="center" className="mb-4 px-3 py-2 bg-card/50 rounded-lg border border-border/50">
          <Flex align="center" gap="sm">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
            <Text size="sm" variant="muted">Selecionar todos</Text>
          </Flex>
        </Flex>
        {transactions.map(tx => (
          <MobileCard key={tx.id} tx={tx} />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={transactions}
          showFooter={true}
          enableZebraStriping={true}
          rowSelection={selectedIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})}
        />
      </div>
    </>
  );
};
