import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minimize2, Maximize2, Activity } from 'lucide-react';

interface LogMessage {
    id: string;
    type: 'log' | 'error' | 'warn' | 'info';
    message: string;
    timestamp: number;
}

export const RobotConsole: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Activate only if specific flag is set
        const checkActivation = () => {
            const isRobot = (window as any).__ROBOT_MODE__ === true || sessionStorage.getItem('ROBOT_MODE') === 'true';
            if (isRobot && !isVisible) {
                setIsVisible(true);
            }
        };

        checkActivation();
        const interval = setInterval(checkActivation, 1000);

        // Intercept console methods
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        const addLog = (type: LogMessage['type'], ...args: any[]) => {
            const message = args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');

            setLogs(prev => {
                const newLogs = [...prev, {
                    id: Math.random().toString(36).substr(2, 9),
                    type,
                    message,
                    timestamp: Date.now()
                }];
                return newLogs.slice(-50); // Keep last 50 logs
            });
        };

        if (isVisible) {
            console.log = (...args) => {
                addLog('log', ...args);
                originalLog.apply(console, args);
            };
            console.error = (...args) => {
                addLog('error', ...args);
                originalError.apply(console, args);
            };
            console.warn = (...args) => {
                addLog('warn', ...args);
                originalWarn.apply(console, args);
            };
        }

        return () => {
            clearInterval(interval);
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, [isVisible]);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    if (!isVisible) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={`fixed bottom-4 right-4 z-[9999] bg-black/90 text-green-400 font-mono text-sm rounded-lg shadow-2xl border border-green-500/30 backdrop-blur-md transition-all duration-300 ${isMinimized ? 'w-64 h-12' : 'w-[500px] h-[300px]'
                    }`}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-2 border-b border-white/10 bg-white/5 rounded-t-lg cursor-pointer"
                    onClick={() => setIsMinimized(!isMinimized)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setIsMinimized(!isMinimized);
                        }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 animate-pulse text-green-500" />
                        <span className="font-bold">🤖 Robot Debug Console</span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                            className="p-1 hover:bg-white/10 rounded"
                            title={isMinimized ? "Maximizar" : "Minimizar"}
                            aria-label={isMinimized ? "Maximizar console" : "Minimizar console"}
                        >
                            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
                            className="p-1 hover:bg-red-500/20 text-red-400 rounded"
                            title="Fechar Console"
                            aria-label="Fechar console"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {!isMinimized && (
                    <div className="p-2 h-[calc(100%-40px)] overflow-y-auto overflow-x-hidden custom-scrollbar">
                        {logs.length === 0 && (
                            <div className="text-center text-white/30 italic mt-10">Aguardando logs do sistema...</div>
                        )}
                        {logs.map(log => (
                            <div key={log.id} className="mb-1 break-words">
                                <span className="opacity-50 text-xs mr-2">
                                    {new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}
                                </span>
                                <span className={`
                                    ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                                    ${log.type === 'warn' ? 'text-yellow-400' : ''}
                                    ${log.type === 'info' ? 'text-blue-400' : ''}
                                `}>
                                    {log.type.toUpperCase()}:
                                </span>
                                <span className="ml-1 text-white/90">{log.message}</span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                )}
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};
