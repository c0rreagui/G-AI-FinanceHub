
import React from 'react';

interface ProgressBarProps {
    percentage: number;
    color?: 'indigo' | 'green' | 'red';
}

const colorClasses = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color = 'indigo' }) => {
    return (
        <div className="w-full bg-gray-700 rounded-full h-2">
            <div
                className={`${colorClasses[color]} h-2 rounded-full`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};