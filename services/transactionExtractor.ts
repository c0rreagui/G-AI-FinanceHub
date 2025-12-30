import { linePatterns, parseBRL, normalizeDate } from './ocrBankPatterns';
import { Transaction, TransactionType } from '../types';

// O tipo de dado que será extraído e usado para preencher o formulário ou importar.
// FIX: Corrected the Omit<> to include user_id and category_id, as these cannot be extracted from OCR text.
export type ExtractedTransaction = Pick<Transaction, 'description' | 'amount' | 'date' | 'type'>;

/**
 * Analisa o texto bruto de um OCR, linha por linha, e extrai múltiplas transações.
 * @param text O texto bruto do OCR.
 * @returns Um array de objetos de transação extraídos.
 */
export const extractTransactionsFromText = (text: string): ExtractedTransaction[] => {
    const lines = text.split('\n');
    const transactions: ExtractedTransaction[] = [];

    for (const line of lines) {
        for (const pattern of linePatterns) {
            const match = line.match(pattern.regex);

            if (match && match.groups) {
                const { date, description, amount } = match.groups;

                if (description && amount) {
                    const parsedAmount = parseBRL(amount);
                    // Assume despesa por padrão, já que é o caso mais comum em extratos.
                    const finalAmount = -Math.abs(parsedAmount);

                    transactions.push({
                        description: description.trim(),
                        amount: finalAmount,
                        date: date ? normalizeDate(date) : new Date().toISOString().split('T')[0],
                        type: TransactionType.DESPESA,
                    });

                    // Uma vez que uma linha corresponde a um padrão, passe para a próxima linha.
                    break;
                }
            }
        }
    }
    return transactions;
};
