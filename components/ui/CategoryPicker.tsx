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
    
    const handleSelect = () => {
        triggerHapticFeedback();
        onSelect(category.id);
    };

    return (
        <motion.button
            type="button"
            onClick={handleSelect}
            className={`relative flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 transition-all duration-200 ${
                isSelected ? 'border-cyan-500/80 bg-cyan-500/20' : 'border-transparent bg-white/5 hover:bg-white/10'
            }`}
            title={category.name}
            aria-label={`Selecionar categoria: ${category.name}`}
            aria-pressed={isSelected}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                <category.icon className="w-5 h-5" style={{ color: category.color }} />
            </div>
            <span className={`text-xs text-center truncate w-full ${isSelected ? 'text-white font-semibold' : 'text-gray-300'}`}>{category.name}</span>
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
        <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
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