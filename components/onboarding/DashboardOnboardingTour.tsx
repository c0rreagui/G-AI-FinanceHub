import React, { useState, useEffect } from 'react';
import { TourGuide } from '../ui/TourGuide';
import { triggerConfetti } from '../ui/Confetti';

export const DashboardOnboardingTour: React.FC = () => {
    const [isTourOpen, setIsTourOpen] = useState(false);

    useEffect(() => {
        // Verifica se o onboarding global foi concluído e se o tour do dashboard ainda não foi feito
        const globalOnboarded = localStorage.getItem('financehub_onboarded') === 'true';
        const tourDone = localStorage.getItem('dashboard_tour_done') === 'true';

        if (globalOnboarded && !tourDone) {
            // Pequeno delay para garantir que o dashboard renderizou completamente
            const timer = setTimeout(() => {
                setIsTourOpen(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const onTourClose = () => {
        setIsTourOpen(false);
        localStorage.setItem('dashboard_tour_done', 'true');
        triggerConfetti();
    };

    const steps = [
        {
            target: 'dashboard-balance-step',
            title: 'Seu Saldo Total',
            content: 'Aqui você vê o resumo de todas as suas contas e cartões em um só lugar.'
        },
        {
            target: 'dashboard-charts-step',
            title: 'Acompanhamento Mensal',
            content: 'Visualize suas receitas vs despesas ao longo do mês para não perder o controle.'
        },
        {
            target: 'dashboard-health-step',
            title: 'Saúde Financeira',
            content: 'Nossa IA analisa seus hábitos e dá uma nota para sua saúde financeira atual.'
        },
        {
            target: 'dashboard-budget-step',
            title: 'Orçamentos',
            content: 'Defina limites de gastos por categoria e receba alertas para não estourar.'
        },
        {
            target: 'dashboard-new-transaction-step',
            title: 'Comece Agora!',
            content: 'Tudo pronto! Use este botão para adicionar sua primeira transação e dar vida ao seu dashboard.'
        }
    ];

    return (
        <TourGuide isOpen={isTourOpen} steps={steps} onClose={onTourClose} />
    );
};
