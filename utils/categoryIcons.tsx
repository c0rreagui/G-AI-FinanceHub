// utils/categoryIcons.ts
import React from 'react';
import {
    Utensils, ShoppingCart, Car, Shirt, PiggyBank, Heart, BookOpen, Gift, Plane, HomeIcon, Dumbbell, Gamepad, Film,
    ArrowUpRight, TrendingDown, Wallet, Lightbulb, Target
} from '../components/Icons';

const iconMap: { [key: string]: React.ElementType } = {
    Utensils,
    ShoppingCart,
    Car,
    Shirt,
    PiggyBank,
    Heart,
    BookOpen,
    Gift,
    Plane,
    HomeIcon,
    Dumbbell,
    Gamepad,
    Film,
    ArrowUpRight,
    TrendingDown,
    Wallet,
    Lightbulb,
    Target
};

/**
 * Retorna um componente de ícone React com base em seu nome (string).
 * Fornece um ícone de fallback ('Gift') se o nome não for encontrado.
 * @param name O nome do ícone como string.
 * @returns Um componente React de ícone.
 */
export const getIconByName = (name: string): React.ElementType => {
    if (iconMap[name]) {
        return iconMap[name];
    }
    
    // Suporte para Emojis: Se não estiver no mapa e for curto, assumimos que é um emoji
    if (name && name.length <= 5) {
        return (props: any) => (
            <span 
                className={props.className} 
                style={{ fontSize: '1.2em', lineHeight: '1', display: 'inline-block', fontStyle: 'normal' }}
                role="img" 
                aria-label="category icon"
            >
                {name}
            </span>
        );
    }

    return Gift;
};