import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

const PinView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { setDeveloperMode } = useAuth();
    const [pin, setPin] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePinSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (pin === '2609') {
            setLoading(true);
            setDeveloperMode(true);
            const { error } = await supabase.auth.signInWithPassword({
                email: 'dev@financehub.com',
                password: 'financehub-dev-password',
            });
            if (error) setError(error.message);
            setLoading(false);
        } else {
            setError('PIN incorreto.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
             <h2 className="text-center text-xl font-semibold text-white">Acesso de Desenvolvedor</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
                Insira o PIN para continuar.
            </p>
            <form className="mt-8 space-y-6" onSubmit={handlePinSubmit}>
                <Input
                    id="pin"
                    label="PIN"
                    name="pin"
                    type="password"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                />
                 {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                <div>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <LoadingSpinner /> : 'Verificar'}
                    </Button>
                </div>
                 <div>
                    <Button type="button" onClick={onBack} variant="secondary" className="w-full">
                        Voltar
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};


export const AuthView: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showPinInput, setShowPinInput] = useState(false);

    const handleAuthAction = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
        } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setError(error.message);
            } else {
                setMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
            }
        }
        setLoading(false);
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        const { error } = await supabase.auth.signInWithPassword({
            email: 'guest@financehub.com',
            password: 'financehub-guest-password',
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-transparent p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8"
            >
                <div>
                    <h1 className="text-center text-6xl font-black bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        FinanceHub
                    </h1>
                </div>
                <div className="bg-[oklch(var(--card-oklch))] border border-[oklch(var(--border-oklch))] rounded-2xl shadow-2xl shadow-black/40 p-8 overflow-hidden">
                   <AnimatePresence mode="wait">
                    {!showPinInput ? (
                        <motion.div
                            key="auth-form"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                        >
                             <p className="text-center text-lg text-gray-400">
                                {isLogin ? 'Faça login para continuar' : 'Crie sua conta para começar'}
                            </p>
                            <form className="mt-8 space-y-6" onSubmit={handleAuthAction}>
                                <Input
                                    id="email"
                                    label="Endereço de e-mail"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Input
                                    id="password"
                                    label="Senha"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                                {message && <p className="text-sm text-green-400 text-center">{message}</p>}

                                <div>
                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? <LoadingSpinner /> : (isLogin ? 'Entrar' : 'Cadastrar')}
                                    </Button>
                                </div>
                            </form>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-[oklch(var(--border-oklch))]" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-[oklch(var(--card-oklch))] px-2 text-gray-500">ou</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button onClick={() => setShowPinInput(true)} variant="secondary" disabled={loading} className="w-full">
                                    Entrar como Desenvolvedor
                                </Button>
                                <Button onClick={handleGuestLogin} variant="secondary" disabled={loading} className="w-full">
                                    Entrar com Conta Teste
                                </Button>
                            </div>

                            <p className="mt-6 text-center text-sm text-gray-400">
                                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                                <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="ml-1 font-medium text-cyan-400 hover:text-cyan-300">
                                    {isLogin ? 'Cadastre-se' : 'Faça login'}
                                </button>
                            </p>
                        </motion.div>
                    ) : (
                         <PinView onBack={() => setShowPinInput(false)} />
                    )}
                   </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};