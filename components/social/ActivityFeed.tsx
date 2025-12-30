import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useSocial } from '../../contexts/SocialContext';
import { formatCurrency } from '../../utils/formatters';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
    const { family } = useSocial();
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!family) return;

        const fetchActivity = async () => {
            try {
                // Fetch recent transactions with user profiles
                // Note: We are using the 'transactions' table which has RLS for family visibility
                const { data: transactions, error } = await supabase
                    .from('transactions')
                    .select('*, user:user_profiles(*), category:categories(*)')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (error) throw error;

                setActivities(transactions || []);
            } catch (error) {
                console.error('Error fetching activity:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [family]);

    if (!family) return null;
    if (loading) return <div className="text-center text-gray-500 py-4">Carregando atividades...</div>;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary" />
                Atividade Recente
            </h3>
            
            <div className="space-y-3">
                {activities.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center py-4 bg-white/5 rounded-xl border border-white/10">
                        Nenhuma atividade recente.
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                                {activity.user?.avatar_url ? (
                                    <img src={activity.user.avatar_url} alt={activity.user.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600">
                                        {activity.user?.full_name?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    <span className="font-bold text-primary">{activity.user?.full_name || 'Alguém'}</span>
                                    {' '}adicionou{' '}
                                    <span className="text-gray-300">{activity.description}</span>
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: ptBR })}
                                    <span>•</span>
                                    <span style={{ color: activity.category?.color }}>{activity.category?.name}</span>
                                </p>
                            </div>

                            <div className={`text-sm font-bold ${activity.type === 'despesa' ? 'text-red-400' : 'text-green-400'}`}>
                                {activity.type === 'despesa' ? '-' : '+'} {formatCurrency(activity.amount)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
