import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AuditLog } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { History, Search, Filter, Trash2, RotateCcw, Edit2, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';

interface AuditLogDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuditLogDialog: React.FC<AuditLogDialogProps> = ({ isOpen, onClose }) => {
    const { auditLogs } = useDashboardData();

    const getActionIcon = (action: AuditLog['action']) => {
        switch (action) {
            case 'create': return <PlusCircle className="w-4 h-4 text-emerald-500" />;
            case 'update': return <Edit2 className="w-4 h-4 text-blue-500" />;
            case 'delete': return <Trash2 className="w-4 h-4 text-red-500" />;
            case 'restore': return <RotateCcw className="w-4 h-4 text-orange-500" />;
            case 'permanent_delete': return <Trash2 className="w-4 h-4 text-red-700" />;
            default: return <History className="w-4 h-4" />;
        }
    };

    const getActionLabel = (action: AuditLog['action']) => {
        switch (action) {
            case 'create': return 'Criação';
            case 'update': return 'Edição';
            case 'delete': return 'Exclusão';
            case 'restore': return 'Restauração';
            case 'permanent_delete': return 'Exclusão Permanente';
            default: return action;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <History className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Histórico de Alterações</DialogTitle>
                            <DialogDescription>
                                Registro de todas as atividades e modificações no sistema.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex items-center gap-2 py-4 border-b border-border/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            placeholder="Buscar no histórico..." 
                            className="w-full pl-9 pr-4 py-2 bg-secondary/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                    </div>
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground" title="Filtrar">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="space-y-4 py-4">
                        {auditLogs.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>Nenhum registro encontrado</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {auditLogs.map((log) => (
                                    <div key={log.id} className="flex gap-4 p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors">
                                        <div className="mt-1">
                                            <div className="p-2 bg-secondary rounded-full border border-border">
                                                {getActionIcon(log.action)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-medium text-sm text-foreground">
                                                        {log.details}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                                                            {getActionLabel(log.action)}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground capitalize">
                                                            {log.entity === 'transaction' ? 'Transação' : log.entity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="text-xs font-medium text-foreground">
                                                        {format(new Date(log.created_at), "d 'de' MMM", { locale: ptBR })}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {format(new Date(log.created_at), "HH:mm", { locale: ptBR })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
