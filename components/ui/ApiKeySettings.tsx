import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';
import { Input } from './Input';

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
        const devKey = import.meta.env.VITE_GEMINI_API_KEY || '';
        if (devKey) {
            setInputValue(devKey);
        } else {
            alert('Chave DEV não configurada no arquivo .env');
        }
    };

    return (
        <div className="card">
            <h2 className="text-xl font-semibold text-white mb-2">Configuração da API Gemini</h2>
            <p className="text-sm text-gray-400 mb-4">
                Insira sua chave de API do Google Gemini para habilitar as funcionalidades de IA.
            </p>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <Input
                    id="api-key-input"
                    label="Sua Chave de API"
                    type="password"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Cole sua chave de API aqui"
                />
                <div className="flex flex-row justify-center items-center gap-3 flex-wrap">
                    <Button type="button" onClick={handleDevKey} variant="secondary">
                        Usar Chave DEV
                    </Button>
                    <Button type="submit" disabled={!inputValue}>
                        {saved ? 'Chave Salva!' : 'Salvar Chave'}
                    </Button>
                </div>
            </form>
        </div>
    );
};