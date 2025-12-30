import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Investment, NewInvestment } from '../types';
import { useToast } from './useToast';
import { useAuth } from './useAuth';

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchInvestments = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('amount', { ascending: false });

      if (error) throw error;

      setInvestments(data || []);
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao buscar investimentos:', error);
      setError(error.message || 'Erro desconhecido');
      showToast('Erro ao carregar investimentos', { type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  const addInvestment = async (investment: NewInvestment) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('investments')
        .insert([{ ...investment, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setInvestments(prev => [...prev, data]);
      showToast('Investimento adicionado com sucesso!', { type: 'success' });
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao adicionar investimento:', error);
      showToast('Erro ao adicionar investimento', { type: 'error' });
      return false;
    }
  };

  const updateInvestment = async (id: string, updates: Partial<Investment>) => {
    try {
      const { error } = await supabase
        .from('investments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setInvestments(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
      showToast('Investimento atualizado!', { type: 'success' });
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao atualizar investimento:', error);
      showToast('Erro ao atualizar investimento', { type: 'error' });
      return false;
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvestments(prev => prev.filter(inv => inv.id !== id));
      showToast('Investimento removido!', { type: 'success' });
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao remover investimento:', error);
      showToast('Erro ao remover investimento', { type: 'error' });
      return false;
    }
  };

  useEffect(() => {
    fetchInvestments();
    
    // Realtime subscription
    const subscription = supabase
      .channel('investments_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, () => {
        fetchInvestments();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchInvestments]);

  return {
    investments,
    loading,
    error,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    refreshInvestments: fetchInvestments
  };
}
