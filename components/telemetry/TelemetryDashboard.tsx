import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { telemetry, EventCategory, EventSeverity, TelemetryEvent } from '../../services/telemetryService';
import { useTelemetrySubscription } from '../../hooks/useTelemetry';
import { Activity, AlertTriangle, Zap, Download, Trash2, Filter } from 'lucide-react';

export const TelemetryDashboard: React.FC = () => {
    const [events, setEvents] = useState<TelemetryEvent[]>([]);
    const [stats, setStats] = useState(telemetry.getStatistics());
    const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
    const [selectedSeverity, setSelectedSeverity] = useState<EventSeverity | null>(null);
    const [isLive, setIsLive] = useState(true);

    // Atualiza eventos em tempo real
    useTelemetrySubscription((event: TelemetryEvent) => {
        if (isLive) {
            setEvents(prev => [event, ...prev].slice(0, 100));
            setStats(telemetry.getStatistics());
        }
    });

    useEffect(() => {
        // Carrega eventos iniciais
        setEvents(telemetry.getEvents().slice(0, 100));
    }, []);

    const filteredEvents = events.filter(event => {
        if (selectedCategory && event.category !== selectedCategory) return false;
        if (selectedSeverity && event.severity !== selectedSeverity) return false;
        return true;
    });

    const handleExport = () => {
        const data = telemetry.exportEvents();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `telemetry-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        if (confirm('Limpar todos os eventos de telemetria?')) {
            telemetry.clearOldEvents(0);
            setEvents([]);
            setStats(telemetry.getStatistics());
        }
    };

    const getSeverityColor = (severity: EventSeverity): string => {
        switch (severity) {
            case EventSeverity.DEBUG: return 'bg-gray-500/20 text-gray-400';
            case EventSeverity.INFO: return 'bg-blue-500/20 text-blue-400';
            case EventSeverity.WARNING: return 'bg-yellow-500/20 text-yellow-400';
            case EventSeverity.ERROR: return 'bg-red-500/20 text-red-400';
            case EventSeverity.CRITICAL: return 'bg-red-700/20 text-red-300';
        }
    };

    const getCategoryIcon = (category: EventCategory) => {
        switch (category) {
            case EventCategory.PERFORMANCE: return <Zap className="w-4 h-4" />;
            case EventCategory.ERROR: return <AlertTriangle className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        Telemetria & Observabilidade
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Monitor em tempo real de todos os eventos da aplicação
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={isLive ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIsLive(!isLive)}
                    >
                        {isLive ? '🔴 Live' : '⏸️ Pausado'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-1" />
                        Exportar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClear}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Limpar
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total de Eventos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.totalEvents}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Taxa de Erros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stats.errorRate > 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {stats.errorRate.toFixed(1)}%
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Categorias Ativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {Object.keys(stats.byCategory).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Eventos Críticos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-400">
                            {stats.bySeverity[EventSeverity.CRITICAL] || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filtros:</span>
                
                <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value as EventCategory || null)}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                    aria-label="Filtrar por categoria"
                >
                    <option value="">Todas Categorias</option>
                    {Object.values(EventCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    value={selectedSeverity || ''}
                    onChange={(e) => setSelectedSeverity(e.target.value as EventSeverity || null)}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                    aria-label="Filtrar por severidade"
                >
                    <option value="">Todas Severidades</option>
                    {Object.values(EventSeverity).map(sev => (
                        <option key={sev} value={sev}>{sev}</option>
                    ))}
                </select>
            </div>

            {/* Events List */}
            <Card>
                <CardHeader>
                    <CardTitle>Eventos Recentes ({filteredEvents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {filteredEvents.map(event => (
                            <div
                                key={event.id}
                                className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="mt-1">
                                            {getCategoryIcon(event.category)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-white text-sm">
                                                    {event.name}
                                                </span>
                                                <Badge className={getSeverityColor(event.severity)}>
                                                    {event.severity}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {event.category}
                                                </Badge>
                                            </div>
                                            
                                            <div className="text-xs text-gray-400 space-y-1">
                                                <div>{new Date(event.timestamp).toLocaleString('pt-BR')}</div>
                                                {event.duration && (
                                                    <div className="text-cyan-400">
                                                        Duration: {event.duration.toFixed(2)}ms
                                                    </div>
                                                )}
                                                {event.tags.length > 0 && (
                                                    <div className="flex gap-1 flex-wrap mt-1">
                                                        {event.tags.map(tag => (
                                                            <span
                                                                key={tag}
                                                                className="px-1.5 py-0.5 bg-white/5 rounded text-xs"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <details className="text-xs">
                                        <summary className="cursor-pointer text-gray-400 hover:text-white">
                                            Metadata
                                        </summary>
                                        <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-auto max-w-md">
                                            {JSON.stringify(event.metadata, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
