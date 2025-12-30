import React, { useState, useEffect } from 'react';
import { TourGuide } from '../ui/TourGuide';
import { useAuth } from '../../hooks/useAuth';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Rocket, Trophy, BrainCircuit, UserCheck } from 'lucide-react';
import { triggerConfetti } from '../ui/Confetti';

interface ProfileOnboardingFlowProps {
    activeTab: string;
}

export const ProfileOnboardingFlow: React.FC<ProfileOnboardingFlowProps> = ({ activeTab }) => {
    const { user } = useAuth();
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

    useEffect(() => {
        if (activeTab === 'profile') {
            const hasCompletedOnboarding = localStorage.getItem('profile_onboarding_done');
            if (!hasCompletedOnboarding) {
                setIsWelcomeOpen(true);
            }
        }
    }, [activeTab]);

    const startTour = () => {
        setIsWelcomeOpen(false);
        setIsTourOpen(true);
    };

    const skipOnboarding = () => {
        setIsWelcomeOpen(false);
        localStorage.setItem('profile_onboarding_done', 'true');
    };

    const onTourClose = () => {
        setIsTourOpen(false);
        localStorage.setItem('profile_onboarding_done', 'true');
        triggerConfetti();
    };

    const steps = [
        {
            target: 'profile-avatar-step',
            title: 'Sua Identidade Visual',
            content: 'Adicione uma foto de perfil para tornar sua experiência mais pessoal. Isso ajuda na identificação em recursos de família e social.'
        },
        {
            target: 'profile-name-step',
            title: 'Como devemos te chamar?',
            content: 'Mude seu nome de exibição para que a IA e seus amigos saibam quem você é. É rápido e fácil!'
        },
        {
            target: 'profile-xp-step',
            title: 'Gamificação & Progresso',
            content: 'Aqui você acompanha seu nível. Ganhe XP adicionando transações, criando metas e economizando. Suba de rank e desbloqueie conquistas!'
        },
        {
            target: 'profile-api-step',
            title: 'Potencialize com IA',
            content: 'Configure sua chave do Gemini aqui para desbloquear insights profundos, previsões e o chat inteligente do FinanceHub.'
        }
    ];

    return (
        <>
            <Dialog open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-primary/20">
                    <DialogHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Rocket className="w-8 h-8 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-white">Bem-vindo ao seu Perfil!</DialogTitle>
                        <DialogDescription className="text-muted-foreground pt-2">
                            Vamos configurar seu espaço para você aproveitar ao máximo o FinanceHub.
                            Levará apenas 30 segundos!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-yellow-500/10 p-2 rounded-lg">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Suba de Nível</h4>
                                <p className="text-xs text-muted-foreground">Adicione transações e bata metas para evoluir seu rank.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-cyan-500/10 p-2 rounded-lg">
                                <BrainCircuit className="w-4 h-4 text-cyan-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">IA Personalizada</h4>
                                <p className="text-xs text-muted-foreground">Configure sua chave para ter um assistente financeiro real.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-purple-500/10 p-2 rounded-lg">
                                <UserCheck className="w-4 h-4 text-purple-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Perfil Completo</h4>
                                <p className="text-xs text-muted-foreground">Um perfil preenchido facilita o uso de recursos sociais e familiares.</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <Button variant="ghost" onClick={skipOnboarding} className="order-2 sm:order-1">Agora não</Button>
                        <Button onClick={startTour} className="order-1 sm:order-2 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                            Começar Guia <Rocket className="w-4 h-4" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <TourGuide isOpen={isTourOpen} steps={steps} onClose={onTourClose} />
        </>
    );
};
