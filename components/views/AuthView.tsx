import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../LoadingSpinner';
import { motion } from 'framer-motion';

export const AuthView: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

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

    const handleDevLogin = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        const { error } = await supabase.auth.signInWithPassword({
            email: 'dev@financehub.com',
            password: 'financehub-dev-password',
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
                    <p className="mt-2 text-center text-lg text-gray-400">
                        {isLogin ? 'Faça login para continuar' : 'Crie sua conta para começar'}
                    </p>
                </div>
                <div className="bg-[oklch(var(--card-oklch))] border border-[oklch(var(--border-oklch))] rounded-2xl shadow-2xl shadow-black/40 p-8">
                    <form className="space-y-6" onSubmit={handleAuthAction}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Endereço de e-mail
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border border-[oklch(var(--border-oklch))] bg-[oklch(var(--background-oklch))] px-4 py-3 text-white placeholder-gray-500 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border border-[oklch(var(--border-oklch))] bg-[oklch(var(--background-oklch))] px-4 py-3 text-white placeholder-gray-500 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm transition"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-400">{error}</p>}
                        {message && <p className="text-sm text-green-400">{message}</p>}

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

                    <div>
                        <Button onClick={handleDevLogin} variant="secondary" disabled={loading} className="w-full">
                             {loading ? <LoadingSpinner /> : 'Entrar como Desenvolvedor'}
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="ml-1 font-medium text-cyan-400 hover:text-cyan-300">
                            {isLogin ? 'Cadastre-se' : 'Faça login'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
