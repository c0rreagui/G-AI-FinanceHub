// components/views/AuthView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { Zap } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';

const PinInput: React.FC<{ pin: string; onPinChange: (pin: string) => void; hasError: boolean }> = ({ pin, onPinChange, hasError }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 4) {
            onPinChange(value);
        }
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="tel"
                value={pin}
                onChange={handleInputChange}
                maxLength={4}
                className="absolute inset-0 w-full h-full bg-transparent border-0 text-transparent outline-none caret-transparent"
                aria-label="Insira o PIN de 4 dígitos"
            />
            <div className={`flex justify-center gap-3 cursor-text ${hasError ? 'animate-shake' : ''}`} onClick={() => inputRef.current?.focus()}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-10 h-12 flex items-center justify-center text-2xl font-bold border-b-2 transition-colors duration-200 ${
                            pin.length > index ? 'border-cyan-400 text-white' : 'border-gray-600'
                        }`}
                    >
                        {pin[index] ? '●' : ''}
                    </div>
                ))}
            </div>
        </div>
    );
};


export const AuthView: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [authMessage, setAuthMessage] = useState<string | null>(null);
    const [showPinInput, setShowPinInput] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState(false);
    const { setDeveloperMode, enterGuestMode } = useAuth();

    const DEV_PIN = '2609';

    useEffect(() => {
        if (pin.length === 4) {
            if (pin === DEV_PIN) {
                handleDevLogin();
                setShowPinInput(false);
            } else {
                setPinError(true);
                setTimeout(() => {
                    setPin('');
                    setPinError(false);
                }, 500);
            }
        }
    }, [pin]);


    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setAuthMessage(null);

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
        } else {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setError(error.message);
            } else if (data.user && data.user.identities && data.user.identities.length === 0) {
                 setError("Este e-mail já está em uso. Tente fazer login.");
            }
            else {
                setAuthMessage("Verifique seu e-mail para o link de confirmação!");
            }
        }
        setLoading(false);
    };
    
    const handleDevLogin = async () => {
        setLoading(true);
        setError(null);
        setAuthMessage(null);

        const devEmail = 'dev@financehub.com';
        const devPassword = 'password123';

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: devEmail,
            password: devPassword,
        });

        if (signInData.user) {
            setDeveloperMode(true);
            setLoading(false);
            return;
        }
        
        if (signInError && signInError.message.includes('Invalid login credentials')) {
            const { error: signUpError } = await supabase.auth.signUp({
                email: devEmail,
                password: devPassword,
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            const { data: finalSignInData, error: finalSignInError } = await supabase.auth.signInWithPassword({
                 email: devEmail,
                 password: devPassword,
            });

            if (finalSignInData.user) {
                setDeveloperMode(true);
            } else {
                setError(finalSignInError?.message || "Conta de dev criada, mas o login falhou.");
            }

        } else if (signInError) {
            setError(signInError.message);
        }
        
        setLoading(false);
    };
    
    const togglePinInput = () => {
        setShowPinInput(!showPinInput);
        setPin('');
        setError(null);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-transparent p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8 relative">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        FinanceHub
                    </h1>
                    <p className="mt-2 text-gray-400">Seu copiloto financeiro inteligente.</p>
                </div>
                <div className="card p-8 min-h-[440px]">
                    <AnimatePresence mode="wait">
                        {showPinInput ? (
                            <motion.div
                                key="pin"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center justify-center h-full"
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">Acesso de Desenvolvedor</h3>
                                <PinInput pin={pin} onPinChange={setPin} hasError={pinError} />
                                {loading && <LoadingSpinner />}
                                 <div className="mt-6 text-center">
                                    <button onClick={() => { togglePinInput(); }} className="text-sm text-cyan-400 hover:underline">
                                        Voltar para Login
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <h2 className="text-xl font-semibold text-white text-center mb-6">{isLogin ? 'Entrar' : 'Criar Conta'}</h2>
                                <form onSubmit={handleAuth} className="space-y-4">
                                    <Input id="email" label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                                    <Input id="password" label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete={isLogin ? "current-password" : "new-password"} />
                                    
                                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                                    {authMessage && <p className="text-green-400 text-sm text-center">{authMessage}</p>}

                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? <LoadingSpinner/> : (isLogin ? 'Entrar' : 'Criar Conta')}
                                    </Button>
                                </form>
                                <div className="mt-6 text-center">
                                    <button onClick={() => { setIsLogin(!isLogin); setError(null); setAuthMessage(null); }} className="text-sm text-cyan-400 hover:underline">
                                        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                                    </button>
                                </div>
                                <div className="mt-4 text-center">
                                     <Button onClick={enterGuestMode} variant="secondary" size="sm" disabled={loading} className="w-full">
                                        Continuar como Visitante
                                    </Button>
                                </div>
                                <div className="mt-4 text-center">
                                     <Button onClick={togglePinInput} variant="secondary" size="sm" disabled={loading} className="w-full">
                                        <Zap className="w-4 h-4 mr-2" />
                                        Login de Desenvolvedor
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};