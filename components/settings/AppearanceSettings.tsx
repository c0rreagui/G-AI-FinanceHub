import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme, themes } from '../../contexts/ThemeContext';
import { Palette, Monitor, User, Image as ImageIcon, Layout, Sun, Moon } from 'lucide-react';

export const AppearanceSettings: React.FC = () => {
    const { 
        currentTheme, setTheme, 
        zenMode, toggleZenMode, 
        greetingName, setGreetingName,
        wallpaper, setWallpaper,
        density, setDensity,
        hiddenModules, toggleModuleVisibility,
        mode, toggleMode
    } = useTheme();

    const wallpapers = [
        { name: 'Nenhum', url: null },
        { name: 'Aurora', url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=1000&auto=format&fit=crop' },
        { name: 'Montanhas', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop' },
        { name: 'Cidade', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop' },
        { name: 'Abstrato', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop' },
    ];

    return (
        <div className="space-y-6">
            {/* Temas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-primary" />
                        Temas & Cores
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {themes.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => setTheme(theme.name)}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                                    currentTheme.name === theme.name 
                                        ? 'border-primary bg-primary/10' 
                                        : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                            >
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${theme.primary})` }} />
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${theme.secondary})` }} />
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${theme.accent})` }} />
                                </div>
                                <span className="text-sm font-medium text-foreground">{theme.name}</span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Modo de Aparência */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sun className="w-5 h-5 text-primary" />
                        Modo de Aparência
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => mode === 'dark' && toggleMode()}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                                mode === 'light'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                            }`}
                        >
                            <Sun className="w-8 h-8 text-yellow-500" />
                            <span className="text-sm font-medium text-foreground">Claro</span>
                        </button>
                        <button
                            onClick={() => mode === 'light' && toggleMode()}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                                mode === 'dark'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-transparent bg-muted/50 hover:bg-muted'
                            }`}
                        >
                            <Moon className="w-8 h-8 text-indigo-400" />
                            <span className="text-sm font-medium text-foreground">Escuro</span>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Personalização */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Personalização
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Como devemos te chamar?</label>
                        <Input 
                            value={greetingName} 
                            onChange={(e) => setGreetingName(e.target.value)} 
                            placeholder="Ex: Mestre, Chefe, Seu Nome..." 
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Monitor className="w-5 h-5 text-cyan-400" />
                            <div>
                                <p className="font-medium text-foreground">Modo Zen</p>
                                <p className="text-xs text-muted-foreground">Oculta detalhes e foca no essencial.</p>
                            </div>
                        </div>
                        <Button 
                            variant={zenMode ? "default" : "secondary"} 
                            onClick={toggleZenMode}
                        >
                            {zenMode ? 'Ativado' : 'Desativado'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Densidade & Layout */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layout className="w-5 h-5 text-primary" />
                        Layout & Módulos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Densidade */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">Densidade de Informação</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDensity(d)}
                                    className={`p-3 rounded-lg border text-sm capitalize transition-all ${
                                        density === d 
                                            ? 'border-primary bg-primary/10 text-foreground' 
                                            : 'border-border bg-muted/50 text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {d === 'compact' ? 'Compacto' : d === 'comfortable' ? 'Confortável' : 'Espaçoso'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Módulos Ocultos */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">Módulos Visíveis</label>
                        <div className="space-y-2">
                            {[
                                { id: 'investments', label: 'Investimentos (Funil)' },
                                { id: 'goals', label: 'Metas' },
                                { id: 'challenges', label: 'Desafios Mensais' },
                                { id: 'tips', label: 'Dica do Dia' },
                                { id: 'chart', label: 'Gráfico Mensal' }
                            ].map((module) => (
                                <div key={module.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm text-foreground">{module.label}</span>
                                    <Button
                                        size="sm"
                                        variant={hiddenModules.includes(module.id) ? "secondary" : "default"}
                                        onClick={() => toggleModuleVisibility(module.id)}
                                        className="h-8 w-24"
                                    >
                                        {hiddenModules.includes(module.id) ? 'Oculto' : 'Visível'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Papel de Parede */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        Papel de Parede
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {wallpapers.map((wp, idx) => (
                            <button
                                key={idx}
                                onClick={() => setWallpaper(wp.url)}
                                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                                    wallpaper === wp.url ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                            >
                                {wp.url ? (
                                    <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                        Padrão
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 w-full bg-black/50 p-1 text-xs text-center text-white">
                                    {wp.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
