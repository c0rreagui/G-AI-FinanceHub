import React, { useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHapticFeedback } from '../../utils/haptics';

interface MicrophoneButtonProps {
    onRecordingStart?: () => void;
    onRecordingStop?: (transcript: string) => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
};

const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
};

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ 
    onRecordingStart, 
    onRecordingStop,
    className,
    size = 'md'
}) => {
    const [isRecording, setIsRecording] = useState(false);

    const toggleRecording = () => {
        triggerHapticFeedback(isRecording ? 10 : 20); // Heavier impact on start
        
        if (isRecording) {
            setIsRecording(false);
            // Mock transcript for now - in a real app this would come from Web Speech API
            onRecordingStop?.('Café na padaria 15 reais');
        } else {
            setIsRecording(true);
            onRecordingStart?.();
        }
    };

    return (
        <button
            onClick={toggleRecording}
            className={`
                relative flex items-center justify-center rounded-full transition-all duration-300
                ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-primary/10 text-primary hover:bg-primary/20'}
                ${sizeClasses[size]}
                ${className || ''}
            `}
            aria-label={isRecording ? "Parar gravação" : "Iniciar gravação de voz"}
        >
            {/* Pulsing ring when recording */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ scale: 1, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-red-500 z-0"
                    />
                )}
            </AnimatePresence>

            {/* Icon transition */}
            <div className="z-10 relative">
                <AnimatePresence mode="wait">
                    {isRecording ? (
                        <motion.div
                            key="stop"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            <Square className={`${iconSizes[size]} fill-current`} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mic"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            <Mic className={iconSizes[size]} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </button>
    );
};
