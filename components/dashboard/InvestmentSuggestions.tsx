import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Lightbulb, ArrowRight, AlertCircle } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { InvestorProfile } from '../onboarding/ProfileAnalysisQuiz';
import { useDialog } from '../../hooks/useDialog';

export const InvestmentSuggestions: React.FC = () => {
    const { summary } = useDashboardData();
    const { openDialog } = useDialog();
    const [profile, setProfile] = useState<InvestorProfile | null>(null);

    useEffect(() => {
        const savedProfile = localStorage.getItem('financehub_investor_profile') as InvestorProfile;
        if (savedProfile) setProfile(savedProfile);
    }, []);

    if (!profile) {
        return (
            <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Descubra seu Perfil</h3>
                        <p className="text-sm text-gray-400">Faça nossa análise rápida para receber recomendações de investimento personalizadas.</p>
                    </div>
                    <Button onClick={() => openDialog('profile-quiz')} className="w-full">
                        Fazer Análise de Perfil
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const suggestions = {
        'Conservador': [
            { name: 'Tesouro Selic', risk: 'Baixo', return: '10.75% a.a', desc: 'Segurança total, ideal para reserva de emergência.' },
            { name: 'CDB Liquidez Diária', risk: 'Baixo', return: '100% do CDI', desc: 'Acessível e seguro, com garantia do FGC.' }
        ],
        'Moderado': [
            { name: 'Fundos Imobiliários (FIIs)', risk: 'Médio', return: 'Dividendos Mensais', desc: 'Renda passiva isenta de IR.' },
            { name: 'Tesouro IPCA+', risk: 'Médio', return: 'IPCA + 6%', desc: 'Proteção contra inflação no longo prazo.' }
        ],
        'Arrojado': [
            { name: 'Ações (Blue Chips)', risk: 'Alto', return: 'Variável', desc: 'Potencial de valorização com grandes empresas.' },
            { name: 'ETFs (IVVB11)', risk: 'Alto', return: 'Dolarizado', desc: 'Exposição ao mercado americano (S&P 500).' }
        ]
    }[profile];

    const availableBalance = summary.totalBalance;
    const investableAmount = availableBalance > 0 ? availableBalance * 0.2 : 0; // Suggest investing 20% of balance

    return (
        <Card className="border-cyan-500/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Sugestões para {profile}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {availableBalance > 100 ? (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-3 items-start">
                        <ArrowRight className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-green-400">Oportunidade</p>
                            <p className="text-xs text-gray-300">
                                Você tem <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableBalance)}</strong> em caixa. 
                                Que tal investir <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(investableAmount)}</strong> (20%)?
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-yellow-400">Primeiro Passo</p>
                            <p className="text-xs text-gray-300">
                                Organize suas contas para sobrar dinheiro no fim do mês. Assim que tiver saldo, te daremos dicas!
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {suggestions.map((s, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-white group-hover:text-cyan-400 transition-colors">{s.name}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${s.risk === 'Alto' ? 'bg-red-500/20 text-red-400' : s.risk === 'Médio' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {s.risk}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{s.desc}</p>
                            <div className="text-xs font-mono text-cyan-300">Retorno Est.: {s.return}</div>
                        </div>
                    ))}
                </div>
                
                <Button variant="ghost" size="sm" onClick={() => openDialog('profile-quiz')} className="w-full text-xs text-gray-500 hover:text-white">
                    Refazer Análise de Perfil
                </Button>
            </CardContent>
        </Card>
    );
};
