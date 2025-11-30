import { useState, useEffect } from 'react';

export type WidgetId = 
    | 'daily_tip' 
    | 'kpi_overview' 
    | 'monthly_chart' 
    | 'wealth_health' 
    | 'quick_actions_goals' 
    | 'challenges' 
    | 'recent_transactions';

export interface WidgetConfig {
    id: WidgetId;
    isVisible: boolean;
    colSpan: {
        md: number; // Grid columns on medium screens (out of 4)
        lg: number; // Grid columns on large screens (out of 3 or 4 depending on section)
    };
}

const DEFAULT_LAYOUT: WidgetConfig[] = [
    { id: 'daily_tip', isVisible: true, colSpan: { md: 4, lg: 4 } }, // Full width
    { id: 'kpi_overview', isVisible: true, colSpan: { md: 2, lg: 1 } },
    { id: 'monthly_chart', isVisible: true, colSpan: { md: 2, lg: 2 } },
    { id: 'wealth_health', isVisible: true, colSpan: { md: 4, lg: 1 } },
    { id: 'quick_actions_goals', isVisible: true, colSpan: { md: 4, lg: 1 } },
    { id: 'challenges', isVisible: true, colSpan: { md: 4, lg: 1 } },
    { id: 'recent_transactions', isVisible: true, colSpan: { md: 4, lg: 1 } },
];

const STORAGE_KEY = 'financehub_layout_v1';

export const useLayout = () => {
    const [layout, setLayout] = useState<WidgetConfig[]>(DEFAULT_LAYOUT);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with default to ensure all widgets exist (in case of updates)
                const merged = DEFAULT_LAYOUT.map(def => {
                    const found = parsed.find((p: WidgetConfig) => p.id === def.id);
                    return found ? { ...def, ...found } : def;
                }).sort((a, b) => {
                    // Sort by the order in the saved layout if possible
                    const idxA = parsed.findIndex((p: WidgetConfig) => p.id === a.id);
                    const idxB = parsed.findIndex((p: WidgetConfig) => p.id === b.id);
                    if (idxA === -1) return 1;
                    if (idxB === -1) return -1;
                    return idxA - idxB;
                });
                setLayout(merged);
            } catch (e) {
                console.error("Failed to parse layout", e);
            }
        }
    }, []);

    const saveLayout = (newLayout: WidgetConfig[]) => {
        setLayout(newLayout);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
    };

    const toggleEditMode = () => setIsEditMode(prev => !prev);

    const resetLayout = () => {
        saveLayout(DEFAULT_LAYOUT);
    };

    return {
        layout,
        setLayout: saveLayout,
        isEditMode,
        toggleEditMode,
        resetLayout
    };
};
