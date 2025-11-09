import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../LoadingSpinner';

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
            // Handle Login
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
        } else {
            // Handle Sign Up
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a001a] to-[#1e103f] p-4">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h1 className="text-center text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                        FinanceHub
                    </h1>
                    <p className="mt-2 text-center text-lg text-gray-400">
                        {isLogin ? 'Faça login para continuar' : 'Crie sua conta para começar'}
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 p-8">
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
                                    className="block w-full appearance-none rounded-md border border-white/20 bg-black/20 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                                    className="block w-full appearance-none rounded-md border border-white/20 bg-black/20 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-400">{error}</p>}
                        {message && <p className="text-sm text-green-400">{message}</p>}

                        <div>
                            <Button type="submit" disabled={loading} className="flex w-full justify-center">
                                {loading ? <LoadingSpinner /> : (isLogin ? 'Entrar' : 'Cadastrar')}
                            </Button>
                        </div>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-oklch-card px-2 text-gray-500">ou</span>
                        </div>
                    </div>

                    <div>
                        <Button onClick={handleDevLogin} variant="secondary" disabled={loading} className="flex w-full justify-center">
                             {loading ? <LoadingSpinner /> : 'Entrar como Desenvolvedor'}
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="ml-1 font-medium text-indigo-400 hover:text-indigo-300">
                            {isLogin ? 'Cadastre-se' : 'Faça login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};