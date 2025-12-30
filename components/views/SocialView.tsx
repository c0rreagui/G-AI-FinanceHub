import React, { useState } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Users, UserPlus, LogOut, Shield } from 'lucide-react';
import { FamilyInvite } from '../social/FamilyInvite';
import { ActivityFeed } from '../social/ActivityFeed';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';

export const SocialView: React.FC = () => {
    const { family, members, createFamily, leaveFamily, joinFamily, loading } = useSocial();
    const [familyName, setFamilyName] = useState('');
    const [inviteToken, setInviteToken] = useState('');
    const [showInvite, setShowInvite] = useState(false);

    // Cast framer-motion component to any to avoid strict type issues
    const MotionDiv = motion.div as any;

    const handleCreate = async () => {
        if (!familyName) return;
        await createFamily(familyName);
    };

    const handleJoin = async () => {
        if (!inviteToken) return;
        await joinFamily(inviteToken);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Carregando informações da família...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-background text-white overflow-y-auto pb-20">
            <PageHeader
                icon={Users}
                title="Família & Social"
                subtitle="Gerencie seu grupo familiar e compartilhamento"
            />

            <div className="p-6 max-w-4xl mx-auto w-full space-y-8">
                {!family ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Create Family */}
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="h-full">
                                <CardContent className="p-6 space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold">Criar nova Família</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Crie um grupo para compartilhar despesas e gerenciar finanças em conjunto.
                                    </p>
                                    <div className="space-y-3 pt-4">
                                        <Input
                                            value={familyName}
                                            onChange={(e) => setFamilyName(e.target.value)}
                                            placeholder="Nome da Família (ex: Família Silva)"
                                            className="bg-background/50"
                                        />
                                        <Button
                                            onClick={handleCreate}
                                            disabled={!familyName}
                                            className="w-full bg-primary hover:bg-primary/90"
                                        >
                                            Criar Família
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </MotionDiv>

                        {/* Join Family */}
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="h-full">
                                <CardContent className="p-6 space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 mb-4">
                                        <UserPlus size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold">Entrar em uma Família</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Recebeu um convite? Cole o token abaixo para entrar no grupo.
                                    </p>
                                    <div className="space-y-3 pt-4">
                                        <Input
                                            value={inviteToken}
                                            onChange={(e) => setInviteToken(e.target.value)}
                                            placeholder="Token do convite"
                                            className="bg-background/50"
                                        />
                                        <Button
                                            onClick={handleJoin}
                                            disabled={!inviteToken}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Entrar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </MotionDiv>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Family Header */}
                        <div className="bg-gradient-to-r from-primary/20 to-purple-600/20 p-8 rounded-3xl border border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{family.name}</h2>
                                <p className="text-gray-300 flex items-center gap-2">
                                    <Users size={16} />
                                    {members.length} membros
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={leaveFamily}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                            >
                                <LogOut size={16} className="mr-2" />
                                Sair da Família
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Members List */}
                            <div className="md:col-span-2 space-y-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <Users size={20} className="text-primary" />
                                    Membros
                                </h3>
                                <div className="grid gap-4">
                                    {members.map((member) => (
                                        <div key={member.user_id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                                    {member.profile?.avatar_url ? (
                                                        <img src={member.profile.avatar_url} alt={member.profile.full_name || ''} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-gray-600 to-gray-800">
                                                            {member.profile?.full_name?.charAt(0) || '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">
                                                        {member.profile?.full_name || 'Usuário sem nome'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                                                </div>
                                            </div>
                                            {member.role === 'admin' && (
                                                <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full flex items-center gap-1">
                                                    <Shield size={12} />
                                                    Admin
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <ActivityFeed />
                            </div>

                            {/* Invite Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <UserPlus size={20} className="text-primary" />
                                    Convites
                                </h3>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <FamilyInvite />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
