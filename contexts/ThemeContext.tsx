import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = {
    name: string;
    primary: string; // HSL value
    secondary: string; // HSL value
    accent: string; // HSL value
};

export const themes: ThemeColor[] = [
    { name: 'FinanceHub (Padrão)', primary: '183 100% 50%', secondary: '217 33% 17%', accent: '262 83% 58%' },
    { name: 'Ocean', primary: '200 100% 50%', secondary: '220 40% 20%', accent: '180 100% 50%' },
    { name: 'Sunset', primary: '10 90% 60%', secondary: '20 40% 20%', accent: '40 100% 50%' },
    { name: 'Forest', primary: '140 70% 50%', secondary: '150 40% 20%', accent: '80 80% 50%' },
    { name: 'Purple Rain', primary: '270 80% 60%', secondary: '280 40% 20%', accent: '300 100% 50%' },
    { name: 'Monochrome', primary: '0 0% 100%', secondary: '0 0% 20%', accent: '0 0% 50%' },
];

interface ThemeContextType {
    currentTheme: ThemeColor;
    setTheme: (themeName: string) => void;
    mode: 'light' | 'dark';
    toggleMode: () => void;
    zenMode: boolean;
    toggleZenMode: () => void;
    greetingName: string;
    setGreetingName: (name: string) => void;
    wallpaper: string | null;
    setWallpaper: (url: string | null) => void;
    density: 'compact' | 'comfortable' | 'spacious';
    setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
    hiddenModules: string[];
    toggleModuleVisibility: (moduleId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeColor>(themes[0]);
    const [mode, setMode] = useState<'light' | 'dark'>('dark');
    const [zenMode, setZenMode] = useState(false);
    const [greetingName, setGreetingName] = useState('');
    const [wallpaper, setWallpaper] = useState<string | null>(null);
    const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
    const [hiddenModules, setHiddenModules] = useState<string[]>([]);

    // Load saved settings
    useEffect(() => {
        const savedTheme = localStorage.getItem('financehub_theme');
        if (savedTheme) {
            const found = themes.find(t => t.name === savedTheme);
            if (found) setCurrentTheme(found);
        }

        const savedMode = localStorage.getItem('financehub_mode');
        if (savedMode) {
            setMode(savedMode as 'light' | 'dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            setMode('light');
        }

        const savedZen = localStorage.getItem('financehub_zen_mode');
        if (savedZen) setZenMode(savedZen === 'true');

        const savedGreeting = localStorage.getItem('financehub_greeting_name');
        if (savedGreeting) setGreetingName(savedGreeting);

        const savedWallpaper = localStorage.getItem('financehub_wallpaper');
        if (savedWallpaper) setWallpaper(savedWallpaper);

        const savedDensity = localStorage.getItem('financehub_density');
        if (savedDensity) setDensity(savedDensity as any);

        const savedHiddenModules = localStorage.getItem('financehub_hidden_modules');
        if (savedHiddenModules) setHiddenModules(JSON.parse(savedHiddenModules));
    }, []);

    // Apply Theme & Mode
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary', currentTheme.primary);
        root.style.setProperty('--secondary', currentTheme.secondary);
        root.style.setProperty('--accent', currentTheme.accent);
        
        // Also update ring to match primary
        root.style.setProperty('--ring', currentTheme.primary);
        
        // Apply Mode
        if (mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        localStorage.setItem('financehub_theme', currentTheme.name);
        localStorage.setItem('financehub_mode', mode);
    }, [currentTheme, mode]);

    const setTheme = (themeName: string) => {
        const theme = themes.find(t => t.name === themeName);
        if (theme) setCurrentTheme(theme);
    };

    const toggleMode = () => {
        setMode(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const toggleZenMode = () => {
        const newState = !zenMode;
        setZenMode(newState);
        localStorage.setItem('financehub_zen_mode', String(newState));
    };

    const handleSetGreetingName = (name: string) => {
        setGreetingName(name);
        localStorage.setItem('financehub_greeting_name', name);
    };

    const handleSetWallpaper = (url: string | null) => {
        setWallpaper(url);
        if (url) localStorage.setItem('financehub_wallpaper', url);
        else localStorage.removeItem('financehub_wallpaper');
    };

    const handleSetDensity = (d: 'compact' | 'comfortable' | 'spacious') => {
        setDensity(d);
        localStorage.setItem('financehub_density', d);
    };

    const toggleModuleVisibility = (moduleId: string) => {
        setHiddenModules(prev => {
            const newModules = prev.includes(moduleId) 
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId];
            localStorage.setItem('financehub_hidden_modules', JSON.stringify(newModules));
            return newModules;
        });
    };

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            setTheme,
            mode,
            toggleMode,
            zenMode,
            toggleZenMode,
            greetingName,
            setGreetingName: handleSetGreetingName,
            wallpaper,
            setWallpaper: handleSetWallpaper,
            density,
            setDensity: handleSetDensity,
            hiddenModules,
            toggleModuleVisibility
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
