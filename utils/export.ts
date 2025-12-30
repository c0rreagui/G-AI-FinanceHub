import { Transaction } from '../types';
import { formatCurrency } from './formatters';

export const exportToCSV = (transactions: Transaction[], filename: string = 'relatorio-financeiro.csv') => {
    // CSV Header
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Status'];

    // Map content
    const rows = transactions.map(tx => {
        const date = new Date(tx.date).toLocaleDateString('pt-BR');
        const description = `"${tx.description.replace(/"/g, '""')}"`; // Escape quotes
        const category = tx.category?.name || 'Outros';
        const type = tx.type === 'receita' ? 'Receita' : 'Despesa';
        
        // Format amount for Excel (pt-BR uses comma for decimals)
        // We output raw number or localized string? Excel prefers raw numbers usually, but CSV is text.
        // For best compatibility in BR locale Excel, we use comma decimal separator.
        const amount = tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        const status = tx.status === 'completed' ? 'Realizado' : 'Pendente';

        return [date, description, category, type, amount, status].join(';');
    });

    // Combine header and rows with proper separator (semicolon is common for BR Excel)
    const csvContent = [
        headers.join(';'),
        ...rows
    ].join('\n');

    // Create Blob with BOM for UTF-8 (essential for Excel to read accents)
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
