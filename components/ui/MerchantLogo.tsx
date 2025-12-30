import React, { useState } from 'react';
import { ShoppingBag, Coffee, Zap, Info } from 'lucide-react';

interface MerchantLogoProps {
    merchantName: string;
    categoryColor?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
};

const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
};

export const MerchantLogo: React.FC<MerchantLogoProps> = ({ 
    merchantName, 
    categoryColor = '#64748b', // Default slate-500
    size = 'md',
    className 
}) => {
    const [imageError, setImageError] = useState(false);

    // Clean name for display (first 2 chars)
    const initials = merchantName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Heuristic for simple icon mapping based on name
    // In a real app, this would be handled by the backend or a specialised service
    const getFallbackIcon = () => {
        const lowerName = merchantName.toLowerCase();
        if (lowerName.includes('uber') || lowerName.includes('99')) return <Zap className={iconSizes[size]} />;
        if (lowerName.includes('starbucks') || lowerName.includes('cafe')) return <Coffee className={iconSizes[size]} />;
        if (lowerName.includes('amazon') || lowerName.includes('mercado')) return <ShoppingBag className={iconSizes[size]} />;
        return <span className="font-bold tracking-tight">{initials}</span>;
    };

    // Try to get logo from clearbit (free logo API)
    // Note: In production, consider proxying this to avoid leaking IP or using a paid service
    const logoUrl = `https://logo.clearbit.com/${merchantName.toLowerCase().replace(/\s/g, '')}.com`;

    return (
        <div 
            className={`relative flex items-center justify-center rounded-xl shadow-sm overflow-hidden transition-transform hover:scale-105 ${sizeClasses[size]} ${className}`}
            ref={(el) => {
                if (el) {
                    el.style.backgroundColor = imageError ? `${categoryColor}20` : '#fff';
                }
            }}
        >
            {!imageError ? (
                <img 
                    src={logoUrl} 
                    alt={merchantName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none'; // Hide broken image immediately
                        setImageError(true);
                    }}
                    loading="lazy"
                />
            ) : (
                <div 
                    className="w-full h-full flex items-center justify-center"
                    ref={(el) => {
                        if (el) el.style.color = categoryColor;
                    }}
                >
                    {getFallbackIcon()}
                </div>
            )}
        </div>
    );
};
