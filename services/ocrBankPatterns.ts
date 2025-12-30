const monthMap: { [key: string]: string } = {
    'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04', 'mai': '05', 'jun': '06',
    'jul': '07', 'ago': '08', 'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
};

/**
 * Normaliza uma string de data (ex: '25/05' ou '25 MAI') para o formato ISO (YYYY-MM-DD).
 * Assume o ano corrente se não especificado.
 * @param dateStr A string de data para normalizar.
 * @returns A data no formato 'YYYY-MM-DD'.
 */
export const normalizeDate = (dateStr: string): string => {
    let processedStr = dateStr.toLowerCase();
    for (const monthName in monthMap) {
        if (processedStr.includes(monthName)) {
            processedStr = processedStr.replace(monthName, monthMap[monthName]);
            break;
        }
    }

    const parts = processedStr.replace(/\s+/g, '/').split('/');
    if (parts.length < 2) return new Date().toISOString().split('T')[0];
    
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    let year = new Date().getFullYear().toString();

    if (parts.length === 3) {
        year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    }
    
    // Validação básica
    if (Number.isNaN(parseInt(day)) || Number.isNaN(parseInt(month)) || Number.isNaN(parseInt(year))) {
        return new Date().toISOString().split('T')[0];
    }

    return `${year}-${month}-${day}`;
};

/**
 * Converte um valor de string BRL (ex: "1.234,56") para um número.
 * @param value A string para converter.
 * @returns O valor numérico.
 */
export const parseBRL = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
};

// Padrões de Regex para identificar linhas de transação em extratos.
// Usam named capture groups: (?<name>...)
export const linePatterns = [
    {
        name: 'PicPay Transferência Enviada',
        // Ex: 25/05 • PIX enviado - R$ 25,90 para IFOOD
        // Ex: 25/05 • Pagamento - R$ 50,00 para Netflix
        regex: /^(?<date>\d{2}\/\d{2})\s*•\s*.*-\s*R\$\s*(?<amount>[\d.,]+)\s*para\s*(?<description>.+)/i,
    },
    {
        name: 'Itaú Débito',
        // Ex: 25/05 PIX TRANSF - IFOOD -25,90
        regex: /^(?<date>\d{2}\/\d{2})\s+PIX\s\w+\s+-\s*(?<description>.+?)\s+-(?<amount>[\d.,]+)$/i,
    },
    {
        name: 'Itaú Cartão',
        // Ex: 25/05 COMPRA CARTAO UBER TRIP -15,45
        regex: /^(?<date>\d{2}\/\d{2})\s+COMPRA\sCARTAO\s(?<description>.+?)\s+-(?<amount>[\d.,]+)/i
    },
    {
        name: 'Nubank Cartão',
        // Ex: 25 MAI Uber Trip R$ 15,45
        regex: /^(?<date>\d{2}\s(?:JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ))\s+(?<description>.+?)\s+R\$\s+(?<amount>[\d.,]+)/i
    }
];
