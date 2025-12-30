import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LockClosed } from '../components/Icons';
import { MessageSquare, ArrowUpDown, MoreHorizontal, Star, Edit2, Copy, Trash2 } from 'lucide-react';
import { Flex, Box } from '../components/ui/AppLayout';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import { PrivacyMask } from "../components/ui/PrivacyMask";
import { Text } from '../components/ui/AppTypography';
import { Checkbox } from '../components/ui/Checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/Tooltip';

interface UseTransactionColumnsProps {
    transactions: Transaction[];
    selectedIds: string[];
    onSelect: (id: string) => void;
    onSelectAll: () => void;
    onEdit: (transaction: Transaction) => void;
    onComments: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
    isMutating: (id: string) => boolean;
}

export function useTransactionColumns({
    transactions,
    selectedIds,
    onSelect,
    onSelectAll,
    onEdit,
    onComments,
    onDelete,
    isMutating
}: UseTransactionColumnsProps) {
    return useMemo<ColumnDef<Transaction>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={transactions.length > 0 && selectedIds.length === transactions.length}
                    onCheckedChange={onSelectAll}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={() => onSelect(row.original.id)}
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
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs border border-white/10 bg-[var(--category-bg)]"
                            ref={(el) => { if (el) el.style.setProperty('--category-bg', `${tx.category.color}20`); }}
                        >
                            <tx.category.icon
                                className="w-4 h-4 text-[var(--category-color)]"
                                ref={(el: HTMLElement | null) => { if (el) el.style.setProperty('--category-color', tx.category.color); }}
                            />
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
                            {tx.starred && (
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            )}
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
                    return sum + (Number.isNaN(val) ? 0 : val);
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(tx)} disabled={isSystem}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onComments(tx)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Comentários
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit({ ...tx, id: 'duplicate' } as any)} disabled={isSystem}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(tx.id)}
                                disabled={isSystem || isMutating(tx.id)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [onComments, onEdit, onDelete, isMutating, selectedIds, transactions, onSelectAll, onSelect]);
}
