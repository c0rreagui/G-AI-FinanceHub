// components/views/AuthView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { Label } from '../ui/Label';
import { Zap, Eye, EyeOff } from '../Icons';
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
            <div
                className={`flex justify-center gap-3 cursor-text ${hasError ? 'animate-shake' : ''}`}
                onClick={() => inputRef.current?.focus()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        inputRef.current?.focus();
                    }
                }}
            >
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-10 h-12 flex items-center justify-center text-2xl font-bold border-b-2 transition-colors duration-200 ${pin.length > index ? 'border-cyan-400 text-white' : 'border-gray-600'
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
    const { signIn, signUp, loginWithPin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [authMessage, setAuthMessage] = useState<string | null>(null);
    const [showPinInput, setShowPinInput] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem('financehub_saved_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                await signIn(email, password);
                if (rememberMe) {
                    localStorage.setItem('financehub_saved_email', email);
                } else {
                    localStorage.removeItem('financehub_saved_email');
                }
            } else {
                await signUp(email, password);
                setAuthMessage('Verifique seu e-mail para confirmar o cadastro!');
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro na autenticação.');
        } finally {
            setLoading(false);
        }
    };

    const enterGuestMode = () => {
        sessionStorage.setItem('guest_mode', 'true');
        window.location.reload();
    };

    const togglePinInput = () => {
        setShowPinInput(!showPinInput);
        setPin('');
        setPinError(false);
    };

    const handlePinSubmit = async (enteredPin: string) => {
        setPin(enteredPin);
        if (enteredPin.length === 4) {
            setLoading(true);
            try {
                const success = await loginWithPin(enteredPin);
                if (!success) {
                    setPinError(true);
                    setPin('');
                    setTimeout(() => setPinError(false), 500);
                }
            } catch (e) {
                setPinError(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAuthMessage(`Um link de recuperação foi enviado para ${email}`);
        setLoading(false);
        setTimeout(() => {
            setShowForgotPassword(false);
            setAuthMessage(null);
        }, 3000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/20">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">FinanceHub</h1>
                    <p className="text-gray-400 mt-2">Seu assistente financeiro inteligente</p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {showForgotPassword ? (
                            <motion.div
                                key="forgot-password"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <h2 className="text-xl font-semibold text-white text-center mb-6">Recuperar Senha</h2>
                                <p className="text-sm text-gray-400 text-center mb-6">
                                    Digite seu e-mail para receber um link de redefinição de senha.
                                </p>
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <Input id="email-recovery" label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

                                    {authMessage && <p className="text-green-400 text-sm text-center">{authMessage}</p>}

                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? <LoadingSpinner /> : 'Enviar Link'}
                                    </Button>
                                </form>
                                <div className="mt-6 text-center">
                                    <button onClick={() => { setShowForgotPassword(false); setAuthMessage(null); }} className="text-sm text-cyan-400 hover:underline">
                                        Voltar para Login
                                    </button>
                                </div>
                            </motion.div>
                        ) : showPinInput ? (
                            <motion.div
                                key="pin"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <h2 className="text-xl font-semibold text-white text-center mb-6">Acesso Rápido</h2>
                                <p className="text-sm text-gray-400 text-center mb-6">Digite seu PIN de 4 dígitos</p>

                                <div className="mb-8">
                                    <PinInput pin={pin} onPinChange={handlePinSubmit} hasError={pinError} />
                                </div>

                                <div className="text-center">
                                    <button onClick={togglePinInput} className="text-sm text-cyan-400 hover:underline">
                                        Usar e-mail e senha
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
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-200">Senha</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                onFocus={() => setIsPasswordFocused(true)}
                                                onBlur={() => setIsPasswordFocused(false)}
                                                required
                                                autoComplete={isLogin ? "current-password" : "new-password"}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className={`absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all duration-200 focus:outline-none ${isPasswordFocused || password.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                                    }`}
                                            >
                                                {showPassword ? <EyeOff width={16} height={16} /> : <Eye width={16} height={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    {isLogin && (
                                        <div className="flex justify-end mt-1">
                                            <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-gray-400 hover:text-cyan-400">
                                                Esqueceu a senha?
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-800"
                                        />
                                        <label htmlFor="rememberMe" className="text-sm text-gray-400 select-none cursor-pointer">
                                            Lembrar de mim
                                        </label>
                                    </div>

                                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                                    {authMessage && <p className="text-green-400 text-sm text-center">{authMessage}</p>}

                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? <LoadingSpinner /> : (isLogin ? 'Entrar' : 'Criar Conta')}
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
                                        Login de Desenvolvedor
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
};