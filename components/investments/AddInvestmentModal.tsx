import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { useInvestments } from '../../hooks/useInvestments';
import { InvestmentType, NewInvestment } from '../../types';
import { Loader2 } from 'lucide-react';

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({ isOpen, onClose }) => {
  const { addInvestment } = useInvestments();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewInvestment>({
    name: '',
    ticker: '',
    type: InvestmentType.RENDA_FIXA,
    amount: 0,
    quantity: 1,
    purchase_date: new Date().toISOString().split('T')[0],
    sector: '',
    current_price: 0
  });

  const handleChange = (field: keyof NewInvestment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await addInvestment({
        ...formData,
        amount: Number(formData.amount),
        quantity: Number(formData.quantity),
        current_price: Number(formData.current_price || 0),
        purchase_date: new Date(formData.purchase_date).toISOString()
      });

      if (success) {
        onClose();
        // Reset form
        setFormData({
            name: '',
            ticker: '',
            type: InvestmentType.RENDA_FIXA,
            amount: 0,
            quantity: 1,
            purchase_date: new Date().toISOString().split('T')[0],
            sector: '',
            current_price: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Aporte</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Investimento</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange('type', value as InvestmentType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={InvestmentType.RENDA_FIXA}>Renda Fixa</SelectItem>
                  <SelectItem value={InvestmentType.ACOES}>Ações</SelectItem>
                  <SelectItem value={InvestmentType.FIIS}>FIIs</SelectItem>
                  <SelectItem value={InvestmentType.CRIPTO}>Criptomoedas</SelectItem>
                  <SelectItem value={InvestmentType.EXTERIOR}>Exterior</SelectItem>
                  <SelectItem value={InvestmentType.OUTROS}>Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase_date">Data da Compra</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => handleChange('purchase_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Ativo</Label>
            <Input
              id="name"
              placeholder="Ex: Tesouro Selic 2029, Petrobras..."
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker (Opcional)</Label>
              <Input
                id="ticker"
                placeholder="Ex: PETR4"
                value={formData.ticker}
                onChange={(e) => handleChange('ticker', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">Setor (Opcional)</Label>
              <Input
                id="sector"
                placeholder="Ex: Bancos, Tecnologia"
                value={formData.sector}
                onChange={(e) => handleChange('sector', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                step="0.0001"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor Total (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="current_price">Preço Atual (R$)</Label>
              <Input
                id="current_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.current_price}
                onChange={(e) => handleChange('current_price', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar Investimento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
