import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DragDropUpload } from '../ui/DragDropUpload';
import { useDashboardData } from '../../hooks/useDashboardData';
import { TransactionType } from '../../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Checkbox } from '../ui/Checkbox';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../LoadingSpinner';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface ImportTransactionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedTransaction {
  id: string; // Temporary ID
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  selected: boolean;
  isDuplicate?: boolean;
  duplicateInitialID?: string;
  categoryId?: string;
}

export const ImportTransactionsDialog: React.FC<ImportTransactionsDialogProps> = ({ isOpen, onClose }) => {
  const { addTransaction, categories, transactions: existingTransactions } = useDashboardData();
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    
    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      
      // Basic CSV Parsing (Assuming Date, Description, Amount)
      // This is a simplified parser. In a real app, we'd need column mapping.
      const transactions: ParsedTransaction[] = rows
        .slice(1) // Skip header
        .filter(row => row.length >= 3 && row[0] && row[1] && row[2])
        .map((row, index) => {
            const amount = Number.parseFloat(row[2]);
            const date = new Date(row[0]).toISOString();
            const description = row[1].replace(/"/g, '');
            const type = amount < 0 ? TransactionType.DESPESA : TransactionType.RECEITA;
            const absAmount = Math.abs(amount);

            // Duplicate Check
            const isDuplicate = existingTransactions.some(ex => {
                const exDate = new Date(ex.date).toISOString().split('T')[0];
                const newDate = date.split('T')[0];
                return exDate === newDate && 
                       Math.abs(ex.amount) === absAmount &&
                       ex.description.toLowerCase() === description.toLowerCase();
            });

            // Auto-Categorization
            let categoryId = undefined;
            const match = existingTransactions.find(ex => ex.description.toLowerCase().includes(description.toLowerCase()));
            if (match) {
                categoryId = match.category_id;
            }

            return {
                id: `import-${index}`,
                date,
                description,
                amount: absAmount,
                type,
                selected: !isDuplicate, // Default unselected if duplicate
                isDuplicate,
                categoryId
            };
        });

      if (transactions.length === 0) {
          setError("Nenhuma transação válida encontrada. Verifique o formato do CSV (Data, Descrição, Valor).");
          return;
      }

      setParsedTransactions(transactions);
      setStep('preview');
      setError(null);
    } catch (err) {
      setError("Erro ao ler o arquivo. Certifique-se que é um CSV válido.");
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    const selected = parsedTransactions.filter(t => t.selected);
    
    // Default category (Outros)
    const defaultCategory = categories.find(c => c.name === 'Outros') || categories[0];

    try {
        for (const tx of selected) {
            await addTransaction({
                description: tx.description,
                amount: tx.amount,
                date: tx.date,
                type: tx.type,
                categoryId: tx.categoryId || defaultCategory.id,
                account_id: 'acc_1',
                status: 'completed' as any,
                created_at: new Date().toISOString(),
                goal_contribution_id: null,
                debt_payment_id: null,
                investment_id: null
            });
        }
        onClose();
        setStep('upload');
        setParsedTransactions([]);
    } catch (err) {
        setError("Erro ao importar transações.");
    } finally {
        setIsImporting(false);
    }
  };

  const toggleSelectAll = () => {
      const allSelected = parsedTransactions.every(t => t.selected);
      setParsedTransactions(parsedTransactions.map(t => ({ ...t, selected: !allSelected })));
  };

  const toggleSelect = (id: string) => {
      setParsedTransactions(parsedTransactions.map(t => 
          t.id === id ? { ...t, selected: !t.selected } : t
      ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Importar Transações">
      <div className="space-y-6">
        {step === 'upload' ? (
            <div className="space-y-4">
                <DragDropUpload 
                    onUpload={handleFileUpload}
                    maxFiles={1}
                    accept=".csv,.txt"
                />
                <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md">
                    <p className="font-medium mb-2">Formato esperado (CSV):</p>
                    <code className="block bg-black/20 p-2 rounded">Data, Descrição, Valor<br/>2023-10-01, Supermercado, -150.00</code>
                </div>
                {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium">Pré-visualização ({parsedTransactions.filter(t => t.selected).length} selecionadas)</h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep('upload')}>Voltar</Button>
                </div>
                
                <div className="max-h-[400px] overflow-auto border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox 
                                        checked={parsedTransactions.every(t => t.selected)}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {parsedTransactions.map(tx => (
                                <TableRow key={tx.id} className={tx.isDuplicate ? 'bg-yellow-500/10 hover:bg-yellow-500/20' : ''}>
                                    <TableCell>
                                        <Checkbox 
                                            checked={tx.selected}
                                            onCheckedChange={() => toggleSelect(tx.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(tx.date).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {tx.description}
                                            {tx.isDuplicate && (
                                                <div title="Possível duplicata encontrada" className="text-yellow-600 dark:text-yellow-500">
                                                    <AlertTriangle className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs bg-muted px-2 py-1 rounded">
                                            {tx.categoryId 
                                                ? categories.find(c => c.id === tx.categoryId)?.name || 'Outros'
                                                : 'Outros (Padrão)'}
                                        </span>
                                    </TableCell>
                                    <TableCell className={`text-right ${tx.type === TransactionType.DESPESA ? 'text-destructive' : 'text-success'}`}>
                                        {formatCurrency(tx.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleImport} disabled={isImporting || parsedTransactions.filter(t => t.selected).length === 0}>
                        {isImporting ? <><LoadingSpinner /> Importando...</> : 'Importar Selecionadas'}
                    </Button>
                </div>
            </div>
        )}
      </div>
    </Modal>
  );
};
