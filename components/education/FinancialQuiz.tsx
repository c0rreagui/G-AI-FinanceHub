import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { GraduationCap, Check, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerConfetti } from '../../utils/confetti';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; // index
    explanation: string;
}

const quizData: QuizQuestion[] = [
    {
        id: 1,
        question: "O que é a Taxa Selic?",
        options: [
            "Uma taxa cobrada pelos bancos em empréstimos.",
            "A taxa básica de juros da economia brasileira.",
            "Um imposto sobre investimentos.",
            "O lucro dos bancos."
        ],
        correctAnswer: 1,
        explanation: "A Selic é a taxa básica de juros, definida pelo Banco Central, que influencia todas as outras taxas da economia."
    },
    {
        id: 2,
        question: "Qual investimento é isento de Imposto de Renda?",
        options: [
            "CDB",
            "Tesouro Direto",
            "LCI e LCA",
            "Ações (Day Trade)"
        ],
        correctAnswer: 2,
        explanation: "LCI (Letra de Crédito Imobiliário) e LCA (Letra de Crédito do Agronegócio) são isentas de IR para pessoas físicas."
    },
    {
        id: 3,
        question: "O que significa 'Liquidez'?",
        options: [
            "A facilidade de transformar um ativo em dinheiro.",
            "O lucro de um investimento.",
            "O risco de perder dinheiro.",
            "O prazo de vencimento."
        ],
        correctAnswer: 0,
        explanation: "Liquidez é a velocidade e facilidade com que você consegue resgatar seu dinheiro de um investimento."
    }
];

export const FinancialQuiz: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const { showToast } = useToast();

    const handleAnswer = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);

        if (index === quizData[currentQuestion].correctAnswer) {
            setScore(score + 1);
            showToast('Correto!', { description: 'Você ganhou +10 XP', type: 'success' });
        } else {
            showToast('Incorreto', { description: 'Tente aprender com a explicação.', type: 'error' });
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
            if (score === quizData.length) {
                triggerConfetti();
            }
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        return (
            <Card className="h-full flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
                <GraduationCap className="w-16 h-16 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Quiz Finalizado!</h3>
                <p className="text-gray-300 mb-6">
                    Você acertou <span className="text-cyan-400 font-bold">{score}</span> de {quizData.length} questões.
                </p>
                <Button onClick={restartQuiz}>Jogar Novamente</Button>
            </Card>
        );
    }

    const question = quizData[currentQuestion];

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                    Quiz Financeiro
                    <span className="ml-auto text-xs font-normal text-gray-500">
                        {currentQuestion + 1}/{quizData.length}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between space-y-4">
                <div>
                    <h4 className="text-lg font-medium text-white mb-4">{question.question}</h4>
                    <div className="space-y-2">
                        {question.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={isAnswered}
                                className={`w-full p-3 text-left rounded-lg border transition-all ${
                                    isAnswered
                                        ? idx === question.correctAnswer
                                            ? 'bg-green-500/20 border-green-500 text-green-100'
                                            : idx === selectedOption
                                            ? 'bg-red-500/20 border-red-500 text-red-100'
                                            : 'bg-white/5 border-transparent opacity-50'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-400/50'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{option}</span>
                                    {isAnswered && idx === question.correctAnswer && <Check className="w-4 h-4 text-green-400" />}
                                    {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <X className="w-4 h-4 text-red-400" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {isAnswered && (
                        <motion.div 
                            {...({
                                initial: { opacity: 0, y: 10 },
                                animate: { opacity: 1, y: 0 },
                                className: "bg-blue-900/30 p-3 rounded-lg border border-blue-500/30"
                            } as any)}
                        >
                            <p className="text-sm text-blue-200">
                                <strong>Explicação:</strong> {question.explanation}
                            </p>
                            <Button onClick={nextQuestion} className="w-full mt-3" size="sm">
                                {currentQuestion < quizData.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};
