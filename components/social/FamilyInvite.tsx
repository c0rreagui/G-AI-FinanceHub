import React, { useState } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Copy, Check, Clock } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const FamilyInvite: React.FC = () => {
    const { family, invites, inviteMember, loading } = useSocial();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [copiedToken, setCopiedToken] = useState<string | null>(null);

    const handleInvite = async () => {
        if (!email) return;
        await inviteMember(email);
        setEmail('');
    };

    const copyToken = (token: string) => {
        navigator.clipboard.writeText(token);
        setCopiedToken(token);
        showToast('Token copiado!', { type: 'success' });
        setTimeout(() => setCopiedToken(null), 2000);
    };

    if (!family) return null;

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Convidar Membro</h3>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email do membro"
                        />
                    </div>
                    <Button 
                        onClick={handleInvite} 
                        disabled={loading || !email}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Enviar
                    </Button>
                </div>
            </div>

            {invites.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-400">Convites Pendentes</h4>
                    <div className="space-y-2">
                        {invites.map((invite) => (
                            <div key={invite.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{invite.email}</p>
                                        <p className="text-xs text-gray-500">Expira em: {new Date(invite.expires_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToken(invite.token)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    {copiedToken === invite.token ? <Check size={16} /> : <Copy size={16} />}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
