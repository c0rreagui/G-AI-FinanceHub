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

    const onTourClose = () => {
        setIsTourOpen(false);
        localStorage.setItem('profile_onboarding_done', 'true');
        triggerConfetti();
    };

    const steps = [
        {
            target: 'profile-xp-step',
            title: 'Seu Progresso',
            content: 'Aqui você acompanha sua evolução. Ganhe XP e suba de nível ao usar o app!'
        },
        {
            target: 'profile-api-step',
            title: 'Inteligência Artificial',
            content: 'Configure sua chave do Gemini aqui para desbloquear insights personalizados.'
        }
    ];

    return (
        <TourGuide isOpen={isTourOpen} steps={steps} onClose={onTourClose} />
    );
};
