import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Shield } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export type InvestorProfile = 'Conservador' | 'Moderado' | 'Arrojado';

interface Question {
    id: number;
    text: string;
    options: { text: string; points: number }[];
}

const questions: Question[] = [
    {
        id: 1,
        text: "Qual é o seu principal objetivo ao investir?",
        options: [
            { text: "Preservar meu patrimônio, evitando perdas.", points: 1 },
            { text: "Equilibrar segurança com algum ganho real.", points: 2 },
            { text: "Maximizar ganhos, aceitando riscos altos.", points: 3 }
        ]
    },
    {
        id: 2,
        text: "Por quanto tempo você pretende deixar o dinheiro investido?",
        options: [
            { text: "Menos de 1 ano (Curto Prazo).", points: 1 },
            { text: "De 1 a 5 anos (Médio Prazo).", points: 2 },
            { text: "Mais de 5 anos (Longo Prazo).", points: 3 }
        ]
    },
    {
        id: 3,
        text: "Como você reagiria se seus investimentos caíssem 10% em um mês?",
        options: [
            { text: "Venderia tudo para não perder mais.", points: 1 },
            { text: "Ficaria preocupado, mas aguardaria.", points: 2 },
            { text: "Aproveitaria para investir mais na baixa.", points: 3 }
        ]
    }
];

export const ProfileAnalysisQuiz: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState<InvestorProfile | null>(null);
    const { showToast } = useToast();

    const handleAnswer = (points: number) => {
        const newScore = score + points;
        if (step < questions.length - 1) {
            setScore(newScore);
            setStep(step + 1);
        } else {
            calculateProfile(newScore);
        }
    };

    const calculateProfile = (finalScore: number) => {
        let profile: InvestorProfile = 'Conservador';
        if (finalScore >= 8) profile = 'Arrojado';
        else if (finalScore >= 5) profile = 'Moderado';

        setResult(profile);
        localStorage.setItem('financehub_investor_profile', profile);
        showToast('Perfil Definido!', { description: `Você é um investidor ${profile}.`, type: 'success' });
    };

    const resetQuiz = () => {
        setStep(0);
        setScore(0);
        setResult(null);
    };

    const renderResult = () => {
        if (!result) return null;
        
        const info = {
            'Conservador': { icon: Shield, color: 'text-green-400', desc: "Você prioriza segurança. Indicações: Tesouro Selic, CDBs, LCI/LCA." },
            'Moderado': { icon: CheckCircle, color: 'text-yellow-400', desc: "Você aceita riscos moderados. Indicações: Fundos Multimercado, FIIs, Tesouro IPCA." },
            'Arrojado': { icon: TrendingUp, color: 'text-red-400', desc: "Você busca alta rentabilidade. Indicações: Ações, Criptomoedas, ETFs." }
        }[result];

        const Icon = info.icon;

        return (
            <div className="text-center space-y-6">
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                    {...({ className: "w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center" } as any)}
                >
                    <Icon className={`w-12 h-12 ${info.color}`} />
                </motion.div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Você é {result}!</h3>
                    <p className="text-gray-400">{info.desc}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={resetQuiz} className="flex-1">Refazer</Button>
                    <Button onClick={onClose} className="flex-1">Concluir</Button>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Análise de Perfil de Investidor">
            <div className="min-h-[300px] flex flex-col justify-center">
                {result ? (
                    renderResult()
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between text-xs text-gray-500 mb-4">
                            <span>Questão {step + 1} de {questions.length}</span>
                            <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
                        </div>
                        
                        <h3 className="text-xl font-medium text-white text-center">
                            {questions[step].text}
                        </h3>

                        <div className="space-y-3 pt-4">
                            {questions[step].options.map((opt, idx) => (
                                <motion.button
                                    key={idx}
                                    {...({
                                        whileHover: { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' },
                                        whileTap: { scale: 0.98 },
                                        onClick: () => handleAnswer(opt.points),
                                        className: "w-full p-4 text-left rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors"
                                    } as any)}
                                >
                                    {opt.text}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
