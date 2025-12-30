// components/dashboard/FamilyList.tsx
import React from 'react';
import { useSocial } from '../../contexts/SocialContext';
import { Button } from '../ui/Button';
import { Users, RefreshCw, UserPlus, Crown, User, Mail, Trash2 } from 'lucide-react';
import { useDialog } from '../../hooks/useDialog';

export const FamilyList: React.FC = () => {
    const { family, members, invites, loading, refreshSocialData, inviteMember } = useSocial();
    const { openDialog } = useDialog();

    if (!family) return null; // only show when a family is selected

    return (
        <div className="p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {family.name}
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshSocialData}
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Members List */}
            <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Membros ({members.length})</h3>
                {members.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum membro encontrado.</p>
                ) : (
                    <ul className="space-y-2">
                        {members.map((m, idx) => (
                            <li key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    {m.role === 'admin' || m.role === 'owner' ? (
                                        <Crown className="w-4 h-4 text-white" />
                                    ) : (
                                        <User className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm font-medium">
                                        {(m as any).profile?.full_name || m.user_id.substring(0, 8) + '...'}
                                    </span>
                                    <span className="ml-2 text-xs text-muted-foreground capitalize">
                                        ({m.role === 'admin' ? 'Admin' : m.role === 'owner' ? 'Dono' : 'Membro'})
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Pending Invites */}
            {invites.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Convites Pendentes ({invites.length})</h3>
                    <ul className="space-y-2">
                        {invites.map((invite, idx) => (
                            <li key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <Mail className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm flex-1">{invite.email}</span>
                                <span className="text-xs text-muted-foreground">Pendente</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="pt-4 border-t border-white/10">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openDialog('family-invite')}
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Convidar Membro
                </Button>
            </div>
        </div>
    );
};
