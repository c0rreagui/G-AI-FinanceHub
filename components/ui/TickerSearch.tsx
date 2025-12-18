import React, { useState, useEffect, useRef } from 'react';
import { Input } from './Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, DollarSign, Bitcoin } from 'lucide-react';

export interface Asset {
    ticker: string;
    name: string;
    type: 'acao' | 'fii' | 'cripto' | 'stock' | 'reit';
}

interface TickerSearchProps {
    value: string;
    onChange: (ticker: string) => void;
    onSelect?: (asset: Asset) => void;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
}

const POPULAR_ASSETS: Asset[] = [
    { ticker: 'PETR4', name: 'Petrobras PN', type: 'acao' },
    { ticker: 'VALE3', name: 'Vale ON', type: 'acao' },
    { ticker: 'ITUB4', name: 'Itaú Unibanco PN', type: 'acao' },
    { ticker: 'BBAS3', name: 'Banco do Brasil ON', type: 'acao' },
    { ticker: 'WEGE3', name: 'WEG ON', type: 'acao' },
    { ticker: 'MXRF11', name: 'Maxi Renda FII', type: 'fii' },
    { ticker: 'HGLG11', name: 'CSHG Logística FII', type: 'fii' },
    { ticker: 'KNIP11', name: 'Kinea Índices FII', type: 'fii' },
    { ticker: 'VISC11', name: 'Vinci Shopping FII', type: 'fii' },
    { ticker: 'AAPL', name: 'Apple Inc.', type: 'stock' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', type: 'stock' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', type: 'stock' },
    { ticker: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
    { ticker: 'BTC', name: 'Bitcoin', type: 'cripto' },
    { ticker: 'ETH', name: 'Ethereum', type: 'cripto' },
    { ticker: 'SOL', name: 'Solana', type: 'cripto' },
    { ticker: 'USDT', name: 'Tether USD', type: 'cripto' },
];

export const TickerSearch: React.FC<TickerSearchProps> = ({ 
    value, 
    onChange, 
    onSelect,
    placeholder = "Busque o ativo (ex: PETR4)", 
    className,
    autoFocus 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (query: string) => {
        onChange(query.toUpperCase());
        if (query.trim().length > 0) {
            const search = query.toLowerCase();
            const filtered = POPULAR_ASSETS.filter(asset => 
                asset.ticker.toLowerCase().includes(search) || 
                asset.name.toLowerCase().includes(search)
            ).slice(0, 5); // Limit to 5 results
            setFilteredAssets(filtered);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleSelect = (asset: Asset) => {
        onChange(asset.ticker);
        if (onSelect) onSelect(asset);
        setIsOpen(false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'cripto': return <Bitcoin className="w-4 h-4 text-orange-500" />;
            case 'fii': return <DollarSign className="w-4 h-4 text-emerald-500" />;
            case 'stock': return <DollarSign className="w-4 h-4 text-blue-500" />;
            default: return <TrendingUp className="w-4 h-4 text-violet-500" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'fii': return 'FII';
            case 'stock': return 'BDR/EUA';
            case 'cripto': return 'Cripto';
            default: return 'Ação';
        }
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="pl-9 bg-slate-900/50 border-white/10 focus:border-violet-500/50 font-mono uppercase transition-all"
                    autoFocus={autoFocus}
                    onFocus={() => {
                        if (value.trim().length > 0) setIsOpen(true);
                    }}
                />
            </div>

            <AnimatePresence>
                {isOpen && filteredAssets.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredAssets.map((asset) => (
                                <button
                                    key={asset.ticker}
                                    onClick={() => handleSelect(asset)}
                                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-violet-500/10 group-hover:scale-110 transition-all">
                                            {getIcon(asset.type)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-violet-400 transition-colors">
                                                {asset.ticker}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {asset.name}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">
                                        {getTypeLabel(asset.type)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
