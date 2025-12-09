import React, { useState, useEffect } from 'react';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType, ScheduledTransactionFrequency, TransactionStatus } from '../../types';
import { Input } from '../ui/Input';
import { SmartInput } from '../ui/SmartInput';
import { SmartDatePicker } from '../ui/SmartDatePicker';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';
import { LoadingSpinner } from '../LoadingSpinner';
import { DragDropUpload } from '../ui/DragDropUpload';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Mic, Repeat, CalendarClock } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { useToast } from '../../hooks/useToast';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: Partial<Transaction>;
  transactionToEdit?: Transaction;
  isInvestmentMode?: boolean;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose, prefill, transactionToEdit, isInvestmentMode }) => {
  const { addTransaction, updateTransaction, addScheduledTransaction, categories, accounts, checkForDuplicates, addTransfer } = useDashboardData();
  const { showToast } = useToast();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.DESPESA);
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.COMPLETED);
  const [excludeFromReports, setExcludeFromReports] = useState(false);
  const [reconciled, setReconciled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isTransferMode, setIsTransferMode] = useState(false);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  // Recurrence State
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<ScheduledTransactionFrequency>(ScheduledTransactionFrequency.MENSAL);

  // Attachments State
  const [files, setFiles] = useState<File[]>([]);

  const isEditing = !!transactionToEdit;

  useEffect(() => {
    if (isOpen) {
        if (transactionToEdit) {
            setDescription(transactionToEdit.description);
            setAmount(Math.abs(transactionToEdit.amount).toString());
            setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
            setType(transactionToEdit.type);
            setCategoryId(transactionToEdit.category_id);
            setNotes(transactionToEdit.notes || '');
            setIsRecurring(false); // Editing regular transaction
        } else if (isInvestmentMode) {
            setType(TransactionType.DESPESA);
            const investCat = categories.find(c => c.name.toLowerCase().includes('investimento'));
            if (investCat) setCategoryId(investCat.id);
            resetForm(false);
        } else if (prefill) {
            if (prefill.type) setType(prefill.type);
            if (prefill.date) setDate(new Date(prefill.date).toISOString().split('T')[0]);
            if (prefill.category_id) setCategoryId(prefill.category_id);
            if (prefill.description) setDescription(prefill.description);
            if (prefill.amount) setAmount(Math.abs(prefill.amount).toString());
            if (prefill.notes) setNotes(prefill.notes);
        } else {
            resetForm();
        }
    }
  }, [isOpen, transactionToEdit, prefill, isInvestmentMode, categories]);

  // Predictive Categorization
  useEffect(() => {
      if (!description || isEditing || categoryId) return;

      const lowerDesc = description.toLowerCase();
      
      // 1. Exact match with category name
      const exactMatch = categories.find(c => lowerDesc.includes(c.name.toLowerCase()));
      if (exactMatch) {
          setCategoryId(exactMatch.id);
          return;
      }

      // 2. Keyword mapping (Simple heuristic)
      const keywords: Record<string, string[]> = {
          'alimentação': ['ifood', 'restaurante', 'mercado', 'burger', 'pizza', 'lanche', 'café'],
          'transporte': ['uber', '99', 'taxi', 'ônibus', 'metro', 'combustível', 'posto'],
          'lazer': ['cinema', 'netflix', 'spotify', 'jogo', 'steam'],
          'saúde': ['farmácia', 'médico', 'hospital', 'exame'],
          'casa': ['aluguel', 'condomínio', 'luz', 'água', 'internet'],
          'salário': ['pagamento', 'remuneração', 'freela'],
      };

      for (const catName in keywords) {
          if (keywords[catName].some(k => lowerDesc.includes(k))) {
              const cat = categories.find(c => c.name.toLowerCase() === catName);
              if (cat) {
                  setCategoryId(cat.id);
                  return;
              }
          }
      }

  }, [description, categories, isEditing, categoryId]);

  const resetForm = (full = true) => {
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setFiles([]);
      if (full) {
          setType(TransactionType.DESPESA);
          setCategoryId('');
          setAccountId('');
          setStatus(TransactionStatus.COMPLETED);
          setExcludeFromReports(false);
          setReconciled(false);
          setIsRecurring(false);
          setFrequency(ScheduledTransactionFrequency.MENSAL);
      }
      setIsListening(false);
  };

  const startListening = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = 'pt-BR';
          recognition.continuous = false;
          recognition.interimResults = false;

          recognition.onstart = () => setIsListening(true);
          recognition.onend = () => setIsListening(false);
          recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              setDescription(transcript);
          };
          recognition.start();
      } else {
          showToast("Seu navegador não suporta reconhecimento de voz.", { type: "error" });
      }
  };

  const handleSubmit = async (e?: React.FormEvent, shouldClose: boolean = true) => {
      if (e) e.preventDefault();
      
      if (!description || !amount || !date) {
        showToast("Preencha todos os campos obrigatórios.", { type: "error" });
        return;
      }

      const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));

      // Item 143: Transfer validation
      if (isTransferMode) {
        if (!fromAccountId || !toAccountId) {
          showToast("Selecione as contas de origem e destino.", { type: "error" });
          return;
        }
        if (fromAccountId === toAccountId) {
          showToast("As contas de origem e destino devem ser diferentes.", { type: "error" });
          return;
        }
        
        setIsSubmitting(true);
        try {
          const success = await addTransfer(fromAccountId, toAccountId, numericAmount, description, date, notes);
          if (success) {
            resetForm();
            if (shouldClose) onClose();
          }
        } catch (error) {
          console.error("Error adding transfer", error);
          showToast("Ocorreu um erro ao adicionar a transferência.", { type: "error" });
        } finally {
          setIsSubmitting(false);
        }
        return;
      }

      setIsSubmitting(true);
      try {
          // TODO: Implement attachment upload logic when backend supports it
          if (files.length > 0) {
              console.log("Attachments to upload:", files);
          }

          if (isRecurring) {
              // Add Scheduled Transaction
              await addScheduledTransaction({
                  description,
                  amount: numericAmount,
                  type,
                  categoryId,
                  startDate: new Date(date).toISOString(),
                  frequency
              });
          } else {
              // Add Regular Transaction
              const txData = {
                  description,
                  amount: numericAmount,
                  date: new Date(date).toISOString(),
                  type,
                  categoryId,
                  notes,
                  account_id: accountId,
                  status,
                  exclude_from_reports: excludeFromReports,
                  reconciled,
              };

              if (!isEditing) {
                  const duplicates = checkForDuplicates(txData);
                  if (duplicates.length > 0) {
                      const confirmed = window.confirm(
                          `Atenção! Encontramos ${duplicates.length} transação(ões) similar(es) nesta data. Deseja adicionar mesmo assim?`
                      );
                      if (!confirmed) {
                          setIsSubmitting(false);
                          return;
                      }
                  }
              }

              if (isEditing && transactionToEdit) {
                  await updateTransaction({ ...txData, id: transactionToEdit.id });
              } else {
                  await addTransaction(txData);
              }
          }
          
          if (shouldClose) {
            onClose();
          }
          resetForm();
      } catch (error) {
          console.error("Error saving transaction", error);
      } finally {
          setIsSubmitting(false);
      }
  };

    const MotionDiv = motion.div as any;

    return (
    <Sheet 
        isOpen={isOpen} 
        onClose={onClose} 
        title={isEditing ? "Editar Transação" : (isInvestmentMode ? "Novo Investimento" : (isRecurring ? "Agendar Transação" : "Nova Transação"))}
        footer={
            <div className="flex justify-end gap-2 w-full">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                    Cancelar
                </Button>
                {!isEditing && (
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => handleSubmit(undefined, false)} 
                        disabled={isSubmitting || !categoryId || !amount || !description || !accountId}
                    >
                        Salvar e Novo
                    </Button>
                )}
                <Button type="submit" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting || !categoryId || !amount || !description || !accountId}>
                    {isSubmitting ? <><LoadingSpinner /> Salvando...</> : 'Salvar'}
                </Button>
            </div>
        }
    >
        <MotionDiv className="space-y-6" initial="visible" animate="visible" variants={{ visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
            {/* Type Toggle */}
            <motion.div variants={itemVariants}>
                <TypeToggle selectedType={type} onTypeChange={setType} />
            </motion.div>

            {/* Transfer Mode Toggle - Item 143 */}
            {/* @ts-ignore */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 p-4 bg-secondary/20 rounded-xl border border-border">
                <input
                    type="checkbox"
                    id="transfer-mode"
                    checked={isTransferMode}
                    onChange={(e) => setIsTransferMode(e.target.checked)}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                />
                <label htmlFor="transfer-mode" className="text-sm cursor-pointer">
                    Transferência entre contas
                </label>
            </motion.div>

            {/* Transfer Account Selectors - Item 143 */}
            {isTransferMode && (
                <>
                {/* @ts-ignore */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="from-account" className="text-sm font-medium">Conta Origem *</label>
                        <Select value={fromAccountId} onValueChange={setFromAccountId}>
                            <SelectTrigger id="from-account">
                                <SelectValue placeholder="De..." />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.map(acc => (
                                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="to-account" className="text-sm font-medium">Conta Destino *</label>
                        <Select value={toAccountId} onValueChange={setToAccountId}>
                            <SelectTrigger id="to-account">
                                <SelectValue placeholder="Para..." />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.filter(a => a.id !== fromAccountId).map(acc => (
                                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>
                </>
            )}

            {/* Amount */}
            <motion.div variants={itemVariants}>
                <SmartInput
                    value={amount}
                    onChange={setAmount}
                    label="Valor *"
                    placeholder="0,00"
                    autoFocus={!isEditing}
                />
            </motion.div>

            {/* Description & Voice */}
            <motion.div variants={itemVariants}>
                <div className="flex gap-2 items-end">
                    <div className="flex-grow">
                        <Input
                            label="Descrição *"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Supermercado, Salário..."
                        />
                    </div>
                    <Button 
                        type="button" 
                        variant={isListening ? "destructive" : "secondary"} 
                        className="mb-[2px] h-[42px] w-[42px] p-0 flex items-center justify-center flex-shrink-0"
                        onClick={startListening}
                        title="Falar descrição"
                    >
                        <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                    </Button>
                </div>
            </motion.div>

            {/* Date & Category */}
            {/* @ts-ignore */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SmartDatePicker
                    label={isRecurring ? "Data de Início *" : "Data *"}
                    value={date}
                    onChange={setDate}
                />
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Categoria *</label>
                    <CategoryPicker 
                        categories={categories}
                        selectedCategoryId={categoryId}
                        onSelectCategory={setCategoryId}
                    />
                </div>
            </motion.div>

            {/* Account & Status */}
            {/* @ts-ignore */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Conta *</label>
                    <Select value={accountId} onValueChange={setAccountId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a conta" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-3 h-3 rounded-full bg-[var(--account-color)]" 
                                            ref={(el) => { if (el) el.style.setProperty('--account-color', account.color); }}
                                        ></div>
                                        {account.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                    <Select value={status} onValueChange={(v) => setStatus(v as TransactionStatus)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TransactionStatus.COMPLETED}>Concluído</SelectItem>
                            <SelectItem value={TransactionStatus.PENDING}>Pendente</SelectItem>
                            <SelectItem value={TransactionStatus.SCHEDULED}>Agendado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            {/* Recurrence Toggle */}
            {!isEditing && !isInvestmentMode && (
                <>
                {/* @ts-ignore */}
                <motion.div variants={itemVariants} className="bg-secondary/20 p-4 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${isRecurring ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                {isRecurring ? <CalendarClock className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="font-medium text-sm">Repetir Transação</h4>
                                <p className="text-xs text-muted-foreground">Criar uma recorrência automática</p>
                            </div>
                        </div>
                        <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
                    </div>

                    {isRecurring && (
                        <div className="animate-fade-in">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Frequência</label>
                            <Select value={frequency} onValueChange={(v) => setFrequency(v as ScheduledTransactionFrequency)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a frequência" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(ScheduledTransactionFrequency).map((freq) => (
                                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </motion.div>
                </>
            )}

            {/* Attachments */}
            {/* @ts-ignore */}
            <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Anexos</label>
                <DragDropUpload 
                    onUpload={setFiles}
                    maxFiles={3}
                    accept="image/*,.pdf"
                />
            </motion.div>

            {/* Notes */}
            <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Observações</label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Detalhes adicionais..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </motion.div>

        </MotionDiv>
    </Sheet>
  );
};