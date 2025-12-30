import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../services/supabaseClient';
import { TransactionComment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Send, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionCommentsProps {
    transactionId: string;
}

export const TransactionComments: React.FC<TransactionCommentsProps> = ({ transactionId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<TransactionComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from('transaction_comments')
                .select('*, user:user_profiles(*)')
                .eq('transaction_id', transactionId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            
            // Map the joined user data correctly
            const mappedComments = data?.map((c: any) => ({
                ...c,
                user: c.user
            })) || [];
            
            setComments(mappedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();

        // Realtime subscription
        const channel = supabase
            .channel(`comments:${transactionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'transaction_comments',
                    filter: `transaction_id=eq.${transactionId}`
                },
                (payload) => {
                    // Fetch again to get the user profile data
                    fetchComments();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [transactionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const handleSend = async () => {
        if (!newComment.trim() || !user) return;

        try {
            const { error } = await supabase
                .from('transaction_comments')
                .insert({
                    transaction_id: transactionId,
                    user_id: user.id,
                    content: newComment.trim()
                } as any);

            if (error) throw error;
            setNewComment('');
        } catch (error) {
            console.error('Error sending comment:', error);
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Carregando comentários...</div>;

    return (
        <div className="flex flex-col h-full max-h-[400px]">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
                <MessageSquare size={16} />
                <span className="text-sm font-medium">Comentários ({comments.length})</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                {comments.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 text-sm">
                        Nenhum comentário ainda. Seja o primeiro!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className={`flex gap-3 ${comment.user_id === user?.id ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                                {comment.user?.avatar_url ? (
                                    <img src={comment.user.avatar_url} alt={comment.user.full_name || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-primary to-purple-600">
                                        {comment.user?.full_name?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                            <div className={`flex flex-col max-w-[80%] ${comment.user_id === user?.id ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-2 rounded-2xl text-sm ${
                                    comment.user_id === user?.id 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-white/10 text-gray-200 rounded-tl-none'
                                }`}>
                                    {comment.content}
                                </div>
                                <span className="text-xs text-gray-500 mt-1 px-1">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/10">
                <div className="flex-1">
                    <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escreva um comentário..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                </div>
                <Button 
                    onClick={handleSend} 
                    disabled={!newComment.trim()}
                    className="bg-primary hover:bg-primary/90 w-10 h-10 p-0 rounded-full flex items-center justify-center"
                >
                    <Send size={18} />
                </Button>
            </div>
        </div>
    );
};
