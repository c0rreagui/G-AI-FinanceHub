import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { XIcon } from '../Icons';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    themeColor?: string; // 'red' | 'green' | 'violet' | 'blue'
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const drawerVariants = {
    hidden: { y: '100%' },
    visible: { y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { y: '100%' }
} as const;

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, footer, themeColor = 'blue' }) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        globalThis.addEventListener('keydown', handleEsc);
        return () => globalThis.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const getColorClass = (color: string) => {
        switch (color) {
            case 'red': return 'text-red-500 border-red-500/20 bg-red-500/5';
            case 'green': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
            case 'violet': return 'text-violet-500 border-violet-500/20 bg-violet-500/5';
            default: return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                        className="fixed inset-0 bg-black/80 z-[110]"
                        onClick={onClose}
                    />

                    {/* Content */}
                    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center pointer-events-none">
                        {isDesktop ? (
                            // Desktop Modal
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className={`pointer-events-auto w-full max-w-2xl bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
                            >
                                <div className={`flex items-center justify-between p-6 border-b border-white/5 ${getColorClass(themeColor).split(' ')[2]}`}>
                                    <h2 className={`text-xl font-outfit font-semibold ${getColorClass(themeColor).split(' ')[0]}`}>{title}</h2>
                                    <button 
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                                        title="Pressione ESC para fechar"
                                    >
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto custom-scrollbar">
                                    {children}
                                </div>
                                {footer && (
                                    <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                                        {footer}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            // Mobile Drawer
                            <motion.div
                                variants={drawerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                drag="y"
                                dragConstraints={{ top: 0 }}
                                dragElastic={0.2}
                                onDragEnd={(_, info) => {
                                    if (info.offset.y > 100) onClose();
                                }}
                                className={`pointer-events-auto w-full bg-background/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-2xl flex flex-col max-h-[95vh]`}
                            >
                                {/* Handle */}
                                <div className="w-full flex justify-center pt-3 pb-1">
                                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                                </div>

                                <div className={`flex items-center justify-between px-6 py-4 border-b border-white/5 ${getColorClass(themeColor).split(' ')[2]}`}>
                                    <h2 className={`text-xl font-outfit font-semibold ${getColorClass(themeColor).split(' ')[0]}`}>{title}</h2>
                                    {/* No close button on mobile, swipe down to close */}
                                </div>

                                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                                    {children}
                                </div>

                                {footer && (
                                    <div className="p-6 border-t border-white/5 bg-white/[0.02] pb-safe">
                                        {footer}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
