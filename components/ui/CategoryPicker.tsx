import React from 'react';
import { Category } from '../../types';
import { motion } from 'framer-motion';
import { triggerHapticFeedback } from '../../utils/haptics';

interface CategoryGridItemProps {
    category: Category;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const CategoryGridItem: React.FC<CategoryGridItemProps> = ({ category, isSelected, onSelect }) => {
    
    const iconContainerRef = React.useRef<HTMLDivElement>(null);
    const iconRef = React.useRef<SVGSVGElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (iconContainerRef.current) {
            iconContainerRef.current.style.setProperty('--category-color', category.color);
        }
        if (iconRef.current) {
             iconRef.current.style.color = isSelected ? 'currentColor' : 'var(--category-color)';
        }
        if (overlayRef.current) {
            overlayRef.current.style.backgroundColor = isSelected ? 'transparent' : `color-mix(in srgb, ${category.color} 20%, transparent)`;
        }
    }, [category.color, isSelected]);

    const handleSelect = () => {
        triggerHapticFeedback();
        onSelect(category.id);
    };

    return (
        <motion.button
            {...({
                type: "button",
                onClick: handleSelect,
                className: `relative flex flex-col items-center justify-between gap-2 p-3 rounded-xl border transition-all duration-200 min-w-[80px] flex-1 ${
                    isSelected ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-border bg-card/50 hover:bg-card hover:border-primary/50'
                }`,
                title: category.name,
                "aria-label": `Selecionar categoria: ${category.name}`,
                "aria-pressed": isSelected,
                whileHover: { scale: 1.05, y: -2 },
                whileTap: { scale: 0.95 }
            } as any)}
        >
            <div 
                ref={iconContainerRef}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`} 
            >
                <category.icon ref={iconRef} className="w-5 h-5" />
            </div>
            <div ref={overlayRef} className="absolute inset-0 rounded-xl transition-colors pointer-events-none" />
            <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight line-clamp-2 w-full ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{category.name}</span>
        </motion.button>
    );
};

interface CategoryPickerProps {
    categories: Category[];
    selectedCategoryId: string | null;
    onSelectCategory: (id: string) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({ categories, selectedCategoryId, onSelectCategory }) => {
    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {categories.map(cat => (
                <CategoryGridItem 
                    key={cat.id}
                    category={cat}
                    isSelected={selectedCategoryId === cat.id}
                    onSelect={onSelectCategory}
                />
            ))}
        </div>
    );
};