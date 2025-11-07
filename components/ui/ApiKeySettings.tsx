import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { LockClosed } from '../Icons';

export const ApiKeySettings: React.FC = () => {
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [isKeySet, setIsKeySet] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setIsKeySet(true);
        }
    }, []);

    const handleSave = () => {
        if (!apiKeyInput.trim()) {
            setFeedback({ message: 'O campo da chave não pode estar vazio.', type: 'error' });
            setTimeout(() => setFeedback(null), 3000);
            return;
        }
        localStorage.setItem('gemini_api_key', apiKeyInput);
        setIsKeySet(true);
        setApiKeyInput(''); // Limpa o input após salvar por segurança
        setFeedback({ message: 'Chave de API salva com sucesso!', type: 'success' });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleRemove = () => {
        localStorage.removeItem('gemini_api_key');
        setIsKeySet(false);
        setFeedback({ message: 'Chave de API removida.', type: 'success' });
        setTimeout(() => setFeedback(null), 3000);
    };

    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-2">Configuração da API Gemini</h2>
            <p className="text-sm text-gray-400 mb-4">
                Para usar as funcionalidades de IA, você precisa de uma chave de API do Google AI Studio.
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline ml-1">Obtenha sua chave gratuita aqui.</a>
                <br />
                Sua chave é salva localmente no seu navegador e nunca é enviada para nossos servidores.
            </p>

            {isKeySet && (
                <div className="bg-green-500/10 text-green-300 text-sm p-3 rounded-md mb-4 flex items-center gap-2">
                    <LockClosed className="w-5 h-5 text-green-400" />
                    <span>Uma chave de API está salva no seu navegador. Para alterá-la, insira uma nova chave abaixo e salve.</span>
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="gemini-api-key" className="block text-sm font-medium text-gray-300">
                    Sua Chave de API
                </label>
                <div className="flex items-center gap-4">
                    <input
                        id="gemini-api-key"
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="Cole sua chave de API aqui"
                        className="flex-grow w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <Button onClick={handleSave}>Salvar</Button>
                    {isKeySet && <Button onClick={handleRemove} variant="secondary">Remover</Button>}
                </div>
            </div>

            {feedback && (
                <p className={`text-sm mt-2 ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {feedback.message}
                </p>
            )}
        </div>
    );
};
