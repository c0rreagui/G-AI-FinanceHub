import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { XIcon } from '../Icons';

interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    side?: 'right' | 'left';
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const sheetVariants = {
    hidden: (side: string) => ({ x: side === 'right' ? '100%' : '-100%' }),
    visible: { x: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
    exit: (side: string) => ({ x: side === 'right' ? '100%' : '-100%' })
};

const drawerVariants = {
    hidden: { y: '100%' },
    visible: { y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
    exit: { y: '100%' }
};

export const Sheet: React.FC<SheetProps> = ({ isOpen, onClose, title, children, footer, side = 'right' }) => {
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
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

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
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" onClick={onClose}
                    />

                    {/* Content */}
                    <div className={`fixed inset-0 z-[110] flex pointer-events-none ${isDesktop ? (side === 'right' ? 'justify-end' : 'justify-start') : 'items-end justify-center'}`}>
                        {isDesktop ? (
                            // Desktop Side Sheet
                            <motion.div
                                key="desktop-sheet"
                                custom={side}
                                variants={sheetVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className={`pointer-events-auto w-full max-w-md h-full bg-background/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col`}
                                role="dialog"
                                aria-modal="true"
                            >
                                <div className="flex items-center justify-between p-6 border-b border-white/5 shadow-sm">
                                    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                                    <button 
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                        aria-label="Fechar"
                                    >
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                                    {children}
                                </div>
                                {footer && (
                                    <div className="p-6 border-t border-white/5 bg-white/5">
                                        {footer}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            // Mobile Bottom Sheet (Drawer)
                            <motion.div
                                key="mobile-drawer"
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
                                role="dialog"
                                aria-modal="true"
                            >
                                {/* Handle */}
                                <div className="w-full flex justify-center pt-3 pb-1">
                                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                                </div>

                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                                </div>

                                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                                    {children}
                                </div>

                                {footer && (
                                    <div className="p-6 border-t border-white/5 bg-white/5 pb-safe">
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
