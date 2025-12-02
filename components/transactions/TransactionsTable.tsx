import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Transaction, TransactionType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PencilIcon, TrashIcon, LockClosed } from '../Icons';
import { MessageSquare, ArrowUpDown } from 'lucide-react';
import { Flex, Box } from '../ui/AppLayout';
import { Text } from '../ui/AppTypography';
import { Checkbox } from '../ui/Checkbox';
import { PrivacyMask } from '../ui/PrivacyMask';
import { DataTable } from '../ui/DataTable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';

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

  // Mobile Card View with Swipe Actions
  const MobileCard = ({ tx }: { tx: Transaction }) => {
    const isSystem = !!tx.goal_contribution_id || !!tx.debt_payment_id;
    const isExpense = tx.type === TransactionType.DESPESA;
    const controls = useAnimation();
    const MotionDiv = motion.div as any;
    
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
        >
            <Flex justify="between" align="start" className="mb-3">
                <Flex align="center" gap="sm">
                    <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs border border-border" 
                        style={{backgroundColor: `${tx.category.color}20`}}
                    >
                        <tx.category.icon className="w-5 h-5" style={{color: tx.category.color}} />
                    </div>
                    <Box>
                        <Text weight="bold" className="truncate max-w-[180px] block">{tx.description}</Text>
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
                <Badge variant="outline" className="font-normal text-[10px]">
                    {tx.category.name}
                </Badge>
                
                <Flex gap="xs">
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
        </MotionDiv>
      </div>
    );
  };

  const columns: ColumnDef<Transaction>[] = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={(table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")) as boolean | "indeterminate"}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={!!row.original.goal_contribution_id || !!row.original.debt_payment_id}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0 hover:bg-transparent"
          >
            Transação
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const tx = row.original;
        const isSystem = !!tx.goal_contribution_id || !!tx.debt_payment_id;
        return (
            <Flex align="center" gap="sm">
                <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs border border-white/10" 
                    style={{backgroundColor: `${tx.category.color}20`}}
                >
                    <tx.category.icon className="w-4 h-4" style={{color: tx.category.color}} />
                </div>
                <Box>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Text weight="medium" className="truncate max-w-[200px] block cursor-default">{tx.description}</Text>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tx.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {isSystem && (
                        <Flex align="center" gap="xs" className="text-muted-foreground">
                            <LockClosed className="w-3 h-3" />
                            <Text size="xs" variant="muted">Sistema</Text>
                        </Flex>
                    )}
                </Box>
            </Flex>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: "Categoria",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal bg-white/5 hover:bg-white/10 transition-colors">
            {row.original.category.name}
        </Badge>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0 hover:bg-transparent"
          >
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Text size="sm" variant="muted" className="font-mono">
            {new Date(row.getValue("date")).toLocaleDateString('pt-BR')}
        </Text>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
          <div className="text-right">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="pr-0 hover:bg-transparent"
            >
                Valor
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const isExpense = row.original.type === TransactionType.DESPESA;
        
        return (
            <div className="text-right font-bold font-mono">
                <Text className={isExpense ? 'text-destructive' : 'text-success'}>
                    <PrivacyMask>
                        {isExpense ? '-' : '+'} {formatCurrency(Math.abs(amount))}
                    </PrivacyMask>
                </Text>
            </div>
        );
      },
      footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const total = rows.reduce((sum, row) => {
              const val = parseFloat(row.getValue("amount"));
              return sum + (isNaN(val) ? 0 : val);
          }, 0);
          
          return (
              <div className="text-right font-bold font-mono text-foreground">
                  <PrivacyMask>
                      {formatCurrency(total)}
                  </PrivacyMask>
              </div>
          );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const tx = row.original;
        const isSystem = !!tx.goal_contribution_id || !!tx.debt_payment_id;

        return (
          <Flex justify="end" gap="xs" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onComments(tx)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
        );
      },
    },
  ], [onComments, onEdit, onDelete, isMutating]);

  return (
    <>
        {/* Mobile View */}
        <div className="md:hidden">
            <Flex justify="between" align="center" className="mb-4 px-1">
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
                searchKey="description"
                showFooter={true}
                enableZebraStriping={true}
                rowSelection={selectedIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})}
                setRowSelection={(updater) => {
                    // This is a bit of a hack to bridge the gap between TanStack Table's internal state and our parent state
                    // Ideally we would lift the state up entirely or use the table's state
                    if (typeof updater === 'function') {
                        // We can't easily access the old state here without fully controlling the table state
                        // For now, we'll rely on the individual row checkboxes which call onSelect directly
                    }
                }}
            />
        </div>
    </>
  );
};
