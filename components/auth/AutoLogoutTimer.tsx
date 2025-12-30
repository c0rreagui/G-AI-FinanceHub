import React, { useEffect, useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Clock } from 'lucide-react';

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes
const WARNING_LIMIT = 14 * 60 * 1000; // 14 minutes (1 min warning)

export const AutoLogoutTimer: React.FC = () => {
    const { logout } = useAuth();
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const lastActivityRef = useRef(Date.now());
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const warningIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        lastActivityRef.current = Date.now();
        setShowWarning(false);
        setTimeLeft(60);
        if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
    };

    const checkInactivity = () => {
        const now = Date.now();
        const inactiveTime = now - lastActivityRef.current;

        if (inactiveTime >= INACTIVITY_LIMIT) {
            logout();
        } else if (inactiveTime >= WARNING_LIMIT) {
            if (!showWarning) {
                setShowWarning(true);
                warningIntervalRef.current = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            logout();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }
    };

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        
        const handleActivity = () => {
            if (!showWarning) {
                resetTimer();
            }
        };

        events.forEach(event => globalThis.addEventListener(event, handleActivity));
        
        timerRef.current = setInterval(checkInactivity, 1000);

        return () => {
            events.forEach(event => globalThis.removeEventListener(event, handleActivity));
            if (timerRef.current) clearInterval(timerRef.current);
            if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
        };
    }, [showWarning, logout]);

    const handleStayLoggedIn = () => {
        resetTimer();
    };

    if (!showWarning) return null;

    return (
        <Modal isOpen={showWarning} onClose={() => {}} title="Inatividade Detectada">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-lg font-medium text-white">
                    Sua sessão vai expirar em <span className="text-yellow-500 font-bold">{timeLeft}</span> segundos.
                </p>
                <p className="text-sm text-gray-400">
                    Por segurança, desconectamos usuários inativos. Deseja continuar logado?
                </p>
                <div className="flex gap-3 w-full mt-4">
                    <Button variant="secondary" onClick={logout} className="flex-1">
                        Sair Agora
                    </Button>
                    <Button variant="default" onClick={handleStayLoggedIn} className="flex-1">
                        Continuar Logado
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
