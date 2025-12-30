import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from './Table';
import { Button } from './Button';
import { Input } from './Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import { Flex } from './AppLayout';
import { DataTableViewOptions } from './DataTableViewOptions';
import { LayoutList, Maximize2, Minimize2, SearchX } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  onRowClick?: (row: TData) => void;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  maxHeight?: string;
  showFooter?: boolean;
  enableZebraStriping?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onRowClick,
  rowSelection = {},
  setRowSelection,
  maxHeight = "600px",
  showFooter = false,
  enableZebraStriping = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-4">
        {searchKey && (
          <Input
            placeholder="Filtrar..."
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-background/50"
          />
        )}
        <div className={`flex items-center gap-2 ${!searchKey ? 'ml-auto' : ''}`}>
           <Button
              variant="outline"
              size="sm"
              onClick={() => setDensity(density === 'normal' ? 'compact' : 'normal')}
              className="hidden h-8 lg:flex"
              title={density === 'normal' ? "Modo Compacto" : "Modo Confortável"}
           >
              {density === 'normal' ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
              {density === 'normal' ? 'Compacto' : 'Confortável'}
           </Button>
           <DataTableViewOptions table={table} />
        </div>
      </div>
      
      <div 
        className="rounded-md border border-border overflow-auto relative max-h-[var(--max-h)]"
        ref={(el) => { if (el) el.style.setProperty('--max-h', typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight); }}
      >
        <Table>
          <TableHeader className="bg-card sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={`h-10 ${density === 'compact' ? 'py-1' : 'py-3'}`}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                           )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={`group border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${onRowClick ? 'cursor-pointer' : ''} ${enableZebraStriping ? 'even:bg-muted/30' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={`${density === 'compact' ? 'py-1' : 'py-3'}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <EmptyState 
                    title="Nenhum resultado encontrado"
                    description="Tente ajustar os filtros ou sua busca."
                    icon={SearchX}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {showFooter && (
             <TableFooter className="bg-muted/50 sticky bottom-0 z-10 font-medium">
               {table.getFooterGroups().map((footerGroup) => (
                 <TableRow key={footerGroup.id}>
                   {footerGroup.headers.map((header) => (
                     <TableCell key={header.id} className="p-2">
                       {header.isPlaceholder
                         ? null
                         : flexRender(
                             header.column.columnDef.footer,
                             header.getContext()
                           )}
                     </TableCell>
                   ))}
                 </TableRow>
               ))}
             </TableFooter>
          )}
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-muted-foreground">Linhas por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Primeira página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Próxima página</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Última página</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
