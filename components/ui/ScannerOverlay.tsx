import React, { useRef, useEffect } from 'react';
import { Camera, X, Zap, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface ScannerOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (image: string) => void;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Mock camera initialization
    useEffect(() => {
        if (isOpen && videoRef.current) {
            // In a real implementation, we would use navigator.mediaDevices.getUserMedia
            // Here we just set a placeholder/black screen for safe demo
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] bg-black flex flex-col">
            {/* Header / Controls */}
            <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
                <button 
                    onClick={onClose} 
                    className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    aria-label="Fechar scanner"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="px-4 py-1.5 rounded-full bg-black/60 text-sm font-semibold text-white tracking-widest uppercase">
                    Scanner de Recibo
                </div>
                <button 
                    className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    aria-label="Ativar flash"
                >
                    <Zap className="w-5 h-5 text-yellow-400" />
                </button>
            </div>

            {/* Viewfinder Area */}
            <div className="relative flex-1 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-50 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80')]" />
                
                {/* Scanning Frame */}
                <div className="absolute inset-x-8 inset-y-32 border-2 border-white/30 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 border-[3px] border-primary/50 rounded-3xl animate-pulse" />
                    {/* Corner Guides */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                    
                    {/* Scan Line Animation */}
                    <motion.div 
                        className="absolute h-0.5 w-full bg-primary/80 shadow-[0_0_15px_rgba(56,189,248,0.8)]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                </div>

                <div className="absolute bottom-10 inset-x-0 text-center text-white/70 text-sm font-medium">
                    Posicione o recibo dentro da moldura
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="h-40 bg-black/90 flex items-center justify-around px-8 pb-6 pt-2">
                <button 
                    className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                    aria-label="Abrir galeria"
                >
                    <ImageIcon className="w-6 h-6" />
                </button>

                {/* Shutter Button */}
                <button 
                    onClick={() => onCapture('mock-capture.jpg')}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 group active:scale-95 transition-all"
                    aria-label="Capturar foto"
                >
                    <div className="w-full h-full rounded-full bg-white group-hover:bg-gray-200 transition-colors" />
                </button>
                
                <div className="w-12 h-12" /> {/* Spacer for balance */}
            </div>
        </div>
    );
};
