import { useState, useEffect } from 'react';

export type WidgetId =
    | 'daily_tip'
    | 'balance'
    | 'charts'
    | 'health'
    | 'quick-actions'
    | 'monthly_chart'
    | 'wealth_health'
    | 'budget_tracker'
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
    { id: 'daily_tip', isVisible: true, colSpan: { md: 3, lg: 3 } },
    { id: 'quick-actions', isVisible: true, colSpan: { md: 3, lg: 3 } }, // Ações rápidas no topo para fácil acesso
    { id: 'balance', isVisible: true, colSpan: { md: 3, lg: 3 } }, // Row 1: KPI Summary
    { id: 'charts', isVisible: true, colSpan: { md: 3, lg: 3 } }, // Row 2: Main Trend Chart (Full Width)
    { id: 'budget_tracker', isVisible: true, colSpan: { md: 3, lg: 1 } }, // Row 3 Col 1
    { id: 'health', isVisible: true, colSpan: { md: 3, lg: 1 } }, // Row 3 Col 2
    { id: 'challenges', isVisible: true, colSpan: { md: 3, lg: 1 } }, // Row 3 Col 3
    { id: 'recent_transactions', isVisible: true, colSpan: { md: 3, lg: 3 } }, // Row 5: Data List
];

const STORAGE_KEY = 'financehub_layout_v2';

export const useLayout = () => {
    const [layout, setLayout] = useState<WidgetConfig[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return DEFAULT_LAYOUT.map(def => {
                    const found = parsed.find((p: WidgetConfig) => p.id === def.id);
                    return found ? { ...def, ...found } : def;
                }).sort((a, b) => {
                    const idxA = parsed.findIndex((p: WidgetConfig) => p.id === a.id);
                    const idxB = parsed.findIndex((p: WidgetConfig) => p.id === b.id);
                    if (idxA === -1) return 1;
                    if (idxB === -1) return -1;
                    return idxA - idxB;
                });
            }
        } catch (e) {
            console.error("Failed to parse layout", e);
        }
        return DEFAULT_LAYOUT;
    });

    const [isEditMode, setIsEditMode] = useState(false);

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
