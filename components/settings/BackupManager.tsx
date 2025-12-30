import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, Upload, Database } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useToast } from '../../hooks/useToast';

export const BackupManager: React.FC = () => {
    const { transactions, goals, debts, summary } = useDashboardData();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            transactions,
            goals,
            debts,
            summary // Optional, mostly calculated
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financehub_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Backup Realizado!', { description: 'O arquivo foi salvo no seu dispositivo.', type: 'success' });
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (json.version && json.transactions) {
                    // TODO: Implement actual restore logic (complex due to IDs/Backend)
                    // For now, just show success simulation or log it.
                    showToast('Arquivo Válido', { description: 'Funcionalidade de restauração completa em breve.', type: 'info' });
                } else {
                    throw new Error('Formato inválido');
                }
            } catch (error) {
                showToast('Erro ao ler arquivo', { description: 'O arquivo não é um backup válido.', type: 'error' });
            }
        };
        reader.readAsText(file);
        
        // Reset input
        if (event.target) event.target.value = '';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Backup e Dados
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Exporte seus dados para segurança ou transfira para outro dispositivo.
                </p>
                <div className="flex gap-4">
                    <Button onClick={handleExport} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Dados (JSON)
                    </Button>
                    <Button variant="secondary" onClick={handleImportClick} className="flex-1">
                        <Upload className="w-4 h-4 mr-2" />
                        Importar Dados
                    </Button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".json" 
                        className="hidden" 
                        aria-label="Importar Backup JSON"
                        title="Importar Backup JSON"
                    />
                </div>
            </CardContent>
        </Card>
    );
};
