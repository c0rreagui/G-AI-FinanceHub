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
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const iconRef = React.useRef<SVGSVGElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (iconContainerRef.current) {
            iconContainerRef.current.style.setProperty('--category-color', category.color);
            // Dynamic background for icon container when selected
            if (isSelected) {
                iconContainerRef.current.style.backgroundColor = category.color;
                iconContainerRef.current.style.color = '#fff';
            } else {
                iconContainerRef.current.style.backgroundColor = ''; // Reset to class default (bg-muted)
                iconContainerRef.current.style.color = category.color; // Apply category color when not selected
            }
        }
        if (buttonRef.current) {
            buttonRef.current.style.borderColor = isSelected ? category.color : ''; // Apply border color directly
        }
    }, [isSelected, category.color]);

    const handleSelect = () => {
        triggerHapticFeedback();
        onSelect(category.id);
    };

    return (
        <motion.button
            ref={buttonRef} // Assign ref to the motion.button
            type="button"
            onClick={handleSelect}
            className={`relative flex flex-col items-center justify-between gap-2 p-3 rounded-xl border transition-all duration-200 ${
                isSelected ? 'bg-primary/5 shadow-sm' : 'border-border bg-card/50 hover:bg-card hover:border-primary/50'
            }`}
            title={category.name}
            aria-label={`Selecionar categoria: ${category.name}`}
            aria-pressed={isSelected}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
        >
            <div 
                ref={iconContainerRef}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${!isSelected ? 'bg-muted' : ''}`} 
            >
                <category.icon className="w-5 h-5" />
            </div>
            
            <span className={`text-xs font-medium text-center leading-tight line-clamp-2 w-full ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{category.name}</span>
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
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
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