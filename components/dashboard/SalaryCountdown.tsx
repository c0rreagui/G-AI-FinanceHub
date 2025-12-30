import React, { useMemo } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Clock } from 'lucide-react';
import { Text } from '../ui/AppTypography';

export const SalaryCountdown: React.FC = () => {
    const daysUntilSalary = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Assume 5th day of the month as salary day
        let salaryDate = new Date(currentYear, currentMonth, 5);

        // If today is past the 5th, target next month
        if (today.getDate() > 5) {
            salaryDate = new Date(currentYear, currentMonth + 1, 5);
        }

        // Calculate difference in days
        const diffTime = Math.abs(salaryDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        return diffDays;
    }, []);

    return (
        <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-500/30">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-full">
                        <Clock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex flex-col">
                        <Text size="xs" variant="muted" className="uppercase tracking-wider leading-none mb-1">Próximo Pagamento</Text>
                        <Text weight="bold" className="text-emerald-100 whitespace-nowrap truncate text-lg leading-none">
                            {daysUntilSalary === 0 ? 'É hoje! 🎉' : `em ${daysUntilSalary} dias`}
                        </Text>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
