import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrency } from '../../utils/formatters';
import { Target, Calendar, Calculator, ArrowRight, ArrowLeft } from 'lucide-react';
import { addMonths, differenceInMonths, format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

interface SmartGoalWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

type WizardStep = 'type' | 'details' | 'review';

const GOAL_TYPES = [
    { id: 'emergency', label: 'Reserva de Emergência', icon: '🛡️', description: '3 a 6 meses de gastos' },
    { id: 'car', label: 'Carro Novo', icon: '🚗', description: 'Entrada ou valor total' },
    { id: 'house', label: 'Casa Própria', icon: '🏠', description: 'Entrada do financiamento' },
    { id: 'trip', label: 'Viagem', icon: '✈️', description: 'Férias dos sonhos' },
    { id: 'custom', label: 'Outro', icon: '🎯', description: 'Defina seu próprio objetivo' },
];

export const SmartGoalWizard: React.FC<SmartGoalWizardProps> = ({ isOpen, onClose }) => {
    const { addGoal } = useDashboardData();
    const [step, setStep] = useState<WizardStep>('type');
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        deadline: '',
        type: '',
    });
    
    // Calculation State
    const [monthlySavings, setMonthlySavings] = useState(0);

    // Date Logic
    const today = new Date();
    const minDate = format(addMonths(today, 1), 'yyyy-MM-dd');

    useEffect(() => {
        if (formData.targetAmount && formData.deadline) {
            const target = parseFloat(formData.targetAmount);
            const months = differenceInMonths(new Date(formData.deadline), today);
            if (target > 0 && months > 0) {
                setMonthlySavings(target / months);
            } else {
                setMonthlySavings(0);
            }
        }
    }, [formData.targetAmount, formData.deadline]);

    const handleNext = () => {
        if (step === 'type') setStep('details');
        else if (step === 'details') setStep('review');
    };

    const handleBack = () => {
        if (step === 'details') setStep('type');
        else if (step === 'review') setStep('details');
    };

    const handleSave = async () => {
        await addGoal({
            name: formData.name,
            targetAmount: parseFloat(formData.targetAmount),
            deadline: formData.deadline,
            created_at: new Date().toISOString()
        });
        onClose();
        setStep('type');
        setFormData({ name: '', targetAmount: '', deadline: '', type: '' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Nova Meta Inteligente
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-6">
                        <div className={`h-1 flex-1 rounded-full ${step === 'type' ? 'bg-primary' : 'bg-primary/30'}`} />
                        <div className={`h-1 flex-1 rounded-full ${step === 'details' ? 'bg-primary' : 'bg-primary/30'}`} />
                        <div className={`h-1 flex-1 rounded-full ${step === 'review' ? 'bg-primary' : 'bg-primary/30'}`} />
                    </div>

                    {step === 'type' && (
                        <div className="grid grid-cols-2 gap-3">
                            {GOAL_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    className={`p-4 rounded-xl border2 text-left transition-all ${
                                        formData.type === type.id 
                                            ? 'bg-primary/10 border-primary ring-1 ring-primary' 
                                            : 'bg-secondary/50 border-transparent hover:bg-secondary'
                                    }`}
                                    onClick={() => {
                                        setFormData({ ...formData, type: type.id, name: type.id !== 'custom' ? type.label : '' });
                                        setStep('details');
                                    }}
                                >
                                    <span className="text-2xl mb-2 block">{type.icon}</span>
                                    <span className="font-semibold block">{type.label}</span>
                                    <span className="text-xs text-muted-foreground">{type.description}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'details' && (
                        <div className="space-y-4">
                             <div>
                                <Label>Nome da Meta</Label>
                                <Input 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="Ex: Minha Casa"
                                />
                            </div>
                            <div>
                                <Label>Quanto você quer juntar?</Label>
                                <Input 
                                    type="number"
                                    value={formData.targetAmount} 
                                    onChange={e => setFormData({...formData, targetAmount: e.target.value})}
                                    placeholder="R$ 0,00"
                                />
                            </div>
                            <div>
                                <Label>Para quando?</Label>
                                <Input 
                                    type="date"
                                    min={minDate}
                                    value={formData.deadline} 
                                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'review' && (
                        <div className="space-y-6">
                            <div className="bg-primary/10 p-6 rounded-xl text-center border border-primary/20">
                                <p className="text-sm text-muted-foreground mb-1">Para juntar</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(parseFloat(formData.targetAmount || '0'))}</p>
                                <p className="text-sm text-muted-foreground mt-1">até {formData.deadline && format(new Date(formData.deadline), 'dd/MM/yyyy')}</p>
                            </div>

                            <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-lg">
                                <Calculator className="w-8 h-8 text-yellow-400" />
                                <div>
                                    <p className="text-sm font-medium">Esforço Mensal Estimado</p>
                                    <p className="text-lg font-bold text-white">
                                        {monthlySavings > 0 ? formatCurrency(monthlySavings) : '---'} / mês
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
                        {step !== 'type' && (
                            <Button variant="ghost" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Button>
                        )}
                        <div className="flex-1" />
                        {step === 'details' && (
                            <Button onClick={handleNext} disabled={!formData.name || !formData.targetAmount || !formData.deadline}>
                                Próximo
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                        {step === 'review' && (
                            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                                <Target className="w-4 h-4 mr-2" />
                                Criar Meta
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
