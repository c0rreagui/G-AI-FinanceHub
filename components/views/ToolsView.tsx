import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Tool } from '../Icons';

export const ToolsView: React.FC = () => {
    return (
        <>
            <PageHeader icon={Tool} title="Ferramentas" breadcrumbs={['FinanceHub', 'Ferramentas']} />
            <div className="mt-6 flex-grow flex items-center justify-center">
                <p className="text-gray-400">Página de Ferramentas em construção.</p>
            </div>
        </>
    );
};