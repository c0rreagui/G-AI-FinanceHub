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
    return iconMap[name] || Gift;
};