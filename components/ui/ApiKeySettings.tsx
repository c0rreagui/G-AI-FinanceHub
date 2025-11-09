import React, { useState, useEffect } from 'react';
import { LockClosed } from '../Icons';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';

export const ApiKeySettings: React.FC = () => {
    const { apiKey, setApiKey } = useAuth();
    const [inputValue, setInputValue] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (apiKey) {
            setInputValue(apiKey);
        }
    }, [apiKey]);

    const handleSave = () => {
        setApiKey(inputValue);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDevKey = () => {
        const devKey = 'AIzaSyCHGWfGwEg99FiBK-UYc5FwSEMQh-fpqSU';
        setInputValue(devKey);
    };

    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-2">Configuração da API Gemini</h2>
            <p className="text-sm text-gray-400 mb-4">
                Insira sua chave de API do Google Gemini para habilitar as funcionalidades de IA.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-300">
                        Sua Chave de API
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                        <input
                            id="api-key-input"
                            type="password"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Cole sua chave de API aqui"
                            className="flex-grow block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button onClick={handleDevKey} variant="secondary">
                        Usar Chave DEV
                    </Button>
                    <Button onClick={handleSave} disabled={!inputValue}>
                        {saved ? 'Chave Salva!' : 'Salvar Chave'}
                    </Button>
                </div>
            </div>
        </div>
    );
};