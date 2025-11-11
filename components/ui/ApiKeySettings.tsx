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
        const devKey = 'AIzaSyCHGWfGwEg99FiBK-UYc5FwSEMQh-fpqSU';
        setInputValue(devKey);
    };

    return (
        <div className="card">
            <h2 className="text-xl font-semibold text-white mb-2">Configuração da API Gemini</h2>
            <p className="text-sm text-gray-400 mb-4">
                Insira sua chave de API do Google Gemini para habilitar as funcionalidades de IA.
            </p>
            <div className="space-y-4">
                <Input
                    id="api-key-input"
                    label="Sua Chave de API"
                    type="password"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Cole sua chave de API aqui"
                />
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