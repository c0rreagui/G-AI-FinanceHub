import React from 'react';
import { ApiKeySettings } from '../ui/ApiKeySettings';

export const ApiKeySetupView: React.FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a001a] to-[#1e103f] p-4">
            <div className="w-full max-w-2xl">
                 <div>
                    <h1 className="text-center text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                        FinanceHub
                    </h1>
                    <p className="mt-4 text-center text-xl text-gray-300">
                       Primeiro Passo: Configure sua Chave de API
                    </p>
                    <p className="mt-2 text-center text-md text-gray-400 max-w-xl mx-auto">
                        Para ativar as funcionalidades de Inteligência Artificial, você precisa de uma chave de API do Google Gemini. Você pode obter uma gratuitamente no Google AI Studio.
                    </p>
                </div>

                <div className="mt-8">
                    <ApiKeySettings />
                </div>
                 <div className="text-center mt-6">
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                        Não tem uma chave? Obtenha uma aqui.
                    </a>
                </div>
            </div>
        </div>
    );
};