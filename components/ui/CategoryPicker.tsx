import React from 'react';
import { Category } from '../../types';

interface CategoryGridItemProps {
    category: Category;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const CategoryGridItem: React.FC<CategoryGridItemProps> = ({ category, isSelected, onSelect }) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(category.id)}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all duration-200 ${
                isSelected ? 'border-indigo-500 bg-indigo-500/20' : 'border-transparent bg-white/5 hover:bg-white/10'
            }`}
            title={category.name}
        >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                <category.icon className="w-5 h-5" style={{ color: category.color }} />
            </div>
            <span className={`text-xs text-center truncate w-full ${isSelected ? 'text-white font-semibold' : 'text-gray-300'}`}>{category.name}</span>
        </button>
    );
};

interface CategoryPickerProps {
    categories: Category[];
    selectedCategoryId: string | null;
    onSelectCategory: (id: string) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({ categories, selectedCategoryId, onSelectCategory }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300">
                Categoria
            </label>
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
        </div>
    );
};