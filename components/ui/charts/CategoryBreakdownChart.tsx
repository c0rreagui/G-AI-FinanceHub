import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
import { Category, Transaction, TransactionType } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

interface CategoryBreakdownChartProps {
    transactions: Transaction[];
    categories: Category[];
    type?: TransactionType;
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff" className="text-xs font-bold">{`${formatCurrency(value)}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ transactions, categories, type = TransactionType.DESPESA }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const isMobile = !useMediaQuery('(min-width: 768px)');

    const data = React.useMemo(() => {
        const filtered = transactions.filter(t => t.type === type);
        const grouped = filtered.reduce((acc, t) => {
            const catId = t.category_id;
            acc[catId] = (acc[catId] || 0) + Math.abs(t.amount);
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([catId, amount]) => {
                const cat = categories.find(c => c.id === catId);
                return {
                    name: cat?.name || 'Outros',
                    value: amount,
                    color: cat?.color || '#8884d8'
                };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 6); // Top 6 categories
    }, [transactions, categories, type]);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Sem dados para exibir
            </div>
        );
    }

    return (
        <motion.div 
            {...({ className: "w-full h-[350px]" } as any)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 50 : 70}
                        outerRadius={isMobile ? 70 : 90}
                        paddingAngle={2}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        activeShape={renderActiveShape as any}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                                stroke="rgba(0,0,0,0.2)" 
                                strokeWidth={activeIndex === index ? 4 : 2} 
                            />
                        ))}
                    </Pie>
                    {!isMobile && <Legend layout="vertical" verticalAlign="middle" align="right" />}
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
};
