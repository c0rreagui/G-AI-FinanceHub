import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Tool, PaperclipIcon } from '../Icons';
import { Button } from '../ui/Button';
import { extractTextFromImage } from '../../services/ocrService';
import { LoadingSpinner } from '../LoadingSpinner';
import { extractTransactionsFromText, ExtractedTransaction } from '../../services/transactionExtractor';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';

const OCRTool: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [ocrResult, setOcrResult] = useState<string | null>(null);
    const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
    const { addTransaction } = useDashboardData();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setOcrResult(null);
            setExtractedTransactions([]);
            setError(null);
            setProgress(0);
            setImportSuccessMessage(null);
        }
    };

    const handleExtractText = async () => {
        if (!selectedFile) return;
        setIsProcessing(true);
        setOcrResult(null);
        setExtractedTransactions([]);
        setError(null);
        setImportSuccessMessage(null);
        try {
            const result = await extractTextFromImage(selectedFile, (log) => {
                if (log.status === 'recognizing text') {
                    setProgress(Math.round(log.progress * 100));
                }
            });
            setOcrResult(result);
            const data = extractTransactionsFromText(result);
            setExtractedTransactions(data);
        } catch (err) {
            setError('Falha ao extrair texto da imagem.');
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleImportTransactions = async () => {
        if (extractedTransactions.length === 0) return;
        setIsImporting(true);
        setError(null);
        try {
            const importPromises = extractedTransactions.map(tx => 
                addTransaction({
                    ...tx,
                    category_id: 'cat12' // Categoria "Outros" como padrão
                })
            );
            await Promise.all(importPromises);
            setImportSuccessMessage(`${extractedTransactions.length} transações importadas com sucesso!`);
            setExtractedTransactions([]);
            setSelectedFile(null);
            setOcrResult(null);
        } catch (err) {
            setError('Ocorreu um erro ao importar as transações.');
            console.error(err);
        } finally {
            setIsImporting(false);
        }
    }

    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-lg font-semibold text-white">Scanner de Extratos e Comprovantes (OCR)</h3>
            <p className="text-sm text-gray-400 mt-2 mb-4">
                Envie a imagem de um extrato para extrair as transações e importá-las com um clique.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <label htmlFor="ocr-file-upload" className="w-full sm:w-auto cursor-pointer bg-gray-700 text-gray-200 hover:bg-gray-600 px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2">
                    <PaperclipIcon className="w-5 h-5" />
                    <span>{selectedFile ? 'Trocar Imagem' : 'Selecionar Imagem'}</span>
                </label>
                <input id="ocr-file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                <span className="text-sm text-gray-300 truncate flex-grow">{selectedFile?.name ?? 'Nenhuma imagem selecionada.'}</span>
                <Button onClick={handleExtractText} disabled={!selectedFile || isProcessing} className="w-full sm:w-auto">
                    {isProcessing ? 'Processando...' : 'Extrair Transações'}
                </Button>
            </div>
            
            {isProcessing && (
                <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2">{progress > 0 ? `Reconhecendo texto... ${progress}%` : 'Inicializando...'}</p>
                </div>
            )}

            {error && <p className="mt-4 text-red-400">{error}</p>}
            {importSuccessMessage && <p className="mt-4 text-green-400">{importSuccessMessage}</p>}
            
            {extractedTransactions.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-white mb-2">Transações Encontradas:</h4>
                    <div className="bg-black/20 p-4 rounded-md max-h-60 overflow-y-auto">
                        <ul className="divide-y divide-white/10">
                            {extractedTransactions.map((tx, index) => (
                                <li key={index} className="py-2 flex justify-between items-center text-sm">
                                    <div>
                                        <p className="text-white">{tx.description}</p>
                                        <p className="text-gray-400">{formatDate(tx.date, 'short')}</p>
                                    </div>
                                    <p className="font-semibold text-red-400">{formatCurrencyBRL(tx.amount)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button onClick={handleImportTransactions} disabled={isImporting}>
                            {isImporting ? <><LoadingSpinner/> Importando...</> : `Importar ${extractedTransactions.length} Transações`}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};


export const ToolsView: React.FC = () => {
    return (
        <>
            <PageHeader
                icon={Tool}
                title="Ferramentas"
                breadcrumbs={['FinanceHub', 'Ferramentas']}
            />
            <div className="mt-6 flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <OCRTool />
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white">Calculadora de Juros Compostos</h3>
                        <p className="text-sm text-gray-400 mt-2">Calcule o crescimento dos seus investimentos ao longo do tempo. (Em breve)</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white">Conversor de Moedas</h3>
                        <p className="text-sm text-gray-400 mt-2">Veja as taxas de câmbio mais recentes e converta valores. (Em breve)</p>
                    </div>
                </div>
            </div>
        </>
    );
};