import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { Transaction } from '../types';

interface DateRange {
    startDate: string | null; // ISO string YYYY-MM-DD
    endDate: string | null;   // ISO string YYYY-MM-DD
}

interface ReportContextType {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    filterTransactions: (transactions: Transaction[]) => Transaction[];
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Default to current month
    const [dateRange, setDateRangeState] = useState<DateRange>(() => {
        const now = new Date();
        return {
            startDate: startOfMonth(now).toISOString().split('T')[0],
            endDate: endOfMonth(now).toISOString().split('T')[0]
        };
    });

    const setDateRange = (range: DateRange) => {
        setDateRangeState(range);
    };

    const filterTransactions = useCallback((transactions: Transaction[]) => {
        if (!dateRange.startDate || !dateRange.endDate) return transactions;

        const start = parseISO(dateRange.startDate);
        const end = parseISO(dateRange.endDate);
        // Set end date to end of day to include transactions on that day
        end.setHours(23, 59, 59, 999);

        return transactions.filter(tx => {
            const txDate = parseISO(tx.date);
            return isWithinInterval(txDate, { start, end });
        });
    }, [dateRange]);

    return (
        <ReportContext.Provider value={{ dateRange, setDateRange, filterTransactions }}>
            {children}
        </ReportContext.Provider>
    );
};

export const useReport = () => {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error('useReport must be used within a ReportProvider');
    }
    return context;
};
