import React, { useState, useCallback } from 'react';
import { extractTextFromImage } from '../../services/ocrService';
import { extractTransactionsFromText, ExtractedTransaction } from '../../services/transactionExtractor';
import { useDialog } from '../../hooks/useDialog';
import { Button } from '../ui/Button';
import { PaperclipIcon, PlusCircle, XIcon } from '../Icons';
import { LoadingSpinner } from '../LoadingSpinner';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';

export const ReceiptScanner: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [ocrProgress, setOcrProgress] = useState({ status: '', progress: 0 });
    const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const { openDialog } = useDialog();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            reset();
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const reset = () => {
        setImageFile(null);
        setImageUrl(null);
        setOcrProgress({ status: '', progress: 0 });
        setExtractedTransactions([]);
        setIsProcessing(false);
    };

    const handleScan = useCallback(async () => {
        if (!imageFile) return;

        setIsProcessing(true);
        setExtractedTransactions([]);
        
        try {
            const text = await extractTextFromImage(imageFile, (log) => {
                setOcrProgress({ status: log.status, progress: log.progress });
            });
            
            const transactions = extractTransactionsFromText(text);
            setExtractedTransactions(transactions);
            if(transactions.length === 0) {
              setOcrProgress({ status: 'Nenhuma transação encontrada no texto.', progress: 1 });
            }

        } catch (error) {
            console.error("OCR Error:", error);
            setOcrProgress({ status: 'Erro ao processar a imagem.', progress: 1 });
        } finally {
            setIsProcessing(false);
        }

    }, [imageFile]);
    
    const handleAddTransaction = (tx: ExtractedTransaction) => {
        openDialog('add-transaction', { prefill: tx });
    };

    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white">Scanner de Comprovantes (OCR)</h3>
            <p className="text-sm text-gray-400 mt-2 mb-4">Envie a imagem de um comprovante ou extrato para extrair as transações automaticamente.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Lado Esquerdo: Upload e Preview */}
                <div className="space-y-4">
                    <div className="w-full h-48 bg-black/20 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center relative">
                        {imageUrl ? (
                            <>
                                <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded"/>
                                <button onClick={reset} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/80">
                                    <XIcon className="w-5 h-5"/>
                                </button>
                            </>
                        ) : (
                            <label htmlFor="receipt-upload" className="text-center text-gray-400 cursor-pointer p-4">
                                <PaperclipIcon className="w-8 h-8 mx-auto mb-2"/>
                                Clique para selecionar uma imagem
                            </label>
                        )}
                         <input id="receipt-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </div>
                     <Button onClick={handleScan} disabled={!imageFile || isProcessing} className="w-full">
                        {isProcessing ? <LoadingSpinner/> : null}
                        {isProcessing ? `Processando... (${(ocrProgress.progress * 100).toFixed(0)}%)` : 'Escanear Imagem'}
                    </Button>
                    {isProcessing && <p className="text-xs text-center text-gray-400">{ocrProgress.status}</p>}
                </div>

                {/* Lado Direito: Resultados */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-200">Transações Encontradas:</h4>
                    {extractedTransactions.length > 0 ? (
                        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                           {extractedTransactions.map((tx, index) => (
                               <li key={index} className="bg-black/20 p-3 rounded-lg flex justify-between items-center">
                                   <div>
                                       <p className="font-semibold text-white truncate">{tx.description}</p>
                                       <p className="text-sm text-gray-400">{formatDate(tx.date)}</p>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <span className="font-semibold text-red-400">{formatCurrencyBRL(tx.amount)}</span>
                                        <button onClick={() => handleAddTransaction(tx)} title="Adicionar Transação" className="p-1 text-gray-400 hover:text-green-400">
                                            <PlusCircle className="w-5 h-5"/>
                                        </button>
                                   </div>
                               </li>
                           ))}
                        </ul>
                    ) : (
                         <div className="text-center text-gray-500 py-8 border-2 border-dashed border-white/10 rounded-lg">
                             <p>Nenhuma transação extraída ainda.</p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};