import React from 'react';
import { Icons } from '../components/ui/Icons';

const iconMap: { [key: string]: React.ElementType } = {
    // Standard Lucide Names
    ...Icons,
    
    // Mappings for legacy/custom names
    Utensils: Icons.Utensils, // Assuming Icons.Utensils doesn't exist, we need to check. Lucide name is 'Utensils'. Icons.tsx might not have exported it?
    ShoppingCart: Icons.ShoppingCart, // Icons has ShoppingCart?
    Car: Icons.Car,
    HomeIcon: Icons.Home,
    Heart: Icons.Heart,
    BookOpen: Icons.BookOpen, // Icons has Education?
    Gamepad: Icons.Gamepad,
    Wallet: Icons.Wallet,
    PiggyBank: Icons.Money,
    Gift: Icons.Gift,
    Plane: Icons.Plane,
    Trophy: Icons.Trophy,
    AlertTriangle: Icons.Warning,
    ShoppingBag: Icons.ShoppingBag,
    Coffee: Icons.Coffee,
    Zap: Icons.Zap,
    Film: Icons.Film,
    Music: Icons.Music,
    Baby: Icons.Baby,
    Dog: Icons.Dog,
    Map: Icons.Map,
    Wifi: Icons.Wifi,
    Phone: Icons.Phone,
    Briefcase: Icons.Briefcase,
    DollarSign: Icons.Currency,
    TrendingUp: Icons.Investment,
    ArrowUpCircle: Icons.Income,
    ArrowDownCircle: Icons.Expense,
    Investimentos: Icons.Investment, // Fix missing icon
    Outros: Icons.Menu, // Generic icon for Others
    Lazer: Icons.Gamepad, // Fix generic match
    Saude: Icons.Heart, // Fix generic match
    Educacao: Icons.BookOpen // Fix generic match
};

export const getIconByName = (name: string): React.ElementType => {
    // Direct match in our map
    if (iconMap[name]) {
        return iconMap[name];
    }

    // Try finding in Icons directly (case sensitive)
    if ((Icons as any)[name]) {
        return (Icons as any)[name];
    }
    
    // Suporte para Emojis
    if (name && name.length <= 5) {
        return (props: any) => (
            <span 
                className={`${props.className} text-[1.2em] leading-none inline-block not-italic`}
                role="img" 
                aria-label="category icon"
            >
                {name}
            </span>
        );
    }

    // Default Fallback
    console.warn(`Icon not found for: ${name}`);
    return Icons.LayoutGrid; // Generic Category Icon
};

export const getAllIcons = () => iconMap;