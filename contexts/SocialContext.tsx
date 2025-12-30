import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Family, FamilyMember, FamilyInvite } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface SocialContextType {
    family: Family | null;
    members: FamilyMember[];
    invites: FamilyInvite[];
    loading: boolean;
    createFamily: (name: string) => Promise<void>;
    inviteMember: (email: string) => Promise<void>;
    joinFamily: (token: string) => Promise<void>;
    leaveFamily: () => Promise<void>;
    refreshSocialData: () => Promise<void>;
}

const SocialContext = createContext<SocialContextType>({} as SocialContextType);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [family, setFamily] = useState<Family | null>(null);
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [invites, setInvites] = useState<FamilyInvite[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshSocialData = async () => {
        if (!user) {
            // No user = no family data to load
            setLoading(false);
            setFamily(null);
            setMembers([]);
            setInvites([]);
            return;
        }
        setLoading(true);
        try {
            // 1. Get User's Family
            const { data: userFamily, error: ufError } = await supabase
                .from('user_families')
                .select('family_id, role')
                .eq('user_id', user.id)
                .maybeSingle() as { data: { family_id: string; role: string } | null; error: any };

            if (ufError) {
                console.error('Error fetching user family:', ufError);
            }

            if (userFamily) {
                // 2. Get Family Details
                const { data: familyData } = await supabase
                    .from('families')
                    .select('*')
                    .eq('id', userFamily.family_id)
                    .single();

                if (familyData) setFamily(familyData);

                // 3. Get Members with profiles (FK now exists, so nested select works)
                const { data: membersData, error: membersError } = await supabase
                    .from('user_families')
                    .select('*, user_profiles(*)')
                    .eq('family_id', userFamily.family_id);

                if (membersError) {
                    console.error('Error fetching members:', membersError);
                }

                if (membersData) {
                    const mappedMembers = membersData.map((m: any) => ({
                        ...m,
                        profile: m.user_profiles || null
                    }));
                    setMembers(mappedMembers);
                } else {
                    setMembers([]);
                }

                // 4. Get Invites (if admin or creator)
                const { data: invitesData } = await supabase
                    .from('family_invites')
                    .select('*')
                    .eq('family_id', userFamily.family_id)
                    .eq('status', 'pending');

                if (invitesData) setInvites((invitesData as any[]).map(i => ({ ...i, status: i.status as 'pending' | 'accepted' | 'expired' })));

            } else {
                setFamily(null);
                setMembers([]);
                setInvites([]);
            }
        } catch (error) {
            console.error('Error in refreshSocialData:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSocialData();
    }, [user]);

    const createFamily = async (name: string) => {
        if (!user) return;
        try {
            // 1. Create Family
            const { data: familyData, error: familyError } = await supabase
                .from('families')
                .insert({ name, created_by: user.id } as any)
                .select()
                .single();

            if (familyError) throw familyError;

            // 2. Add Creator to Family
            const { error: memberError } = await supabase
                .from('user_families')
                .insert({
                    user_id: user.id,
                    family_id: familyData?.id,
                    role: 'admin'
                } as any);

            if (memberError) throw memberError;

            showToast('Família criada com sucesso!', { type: 'success' });
            refreshSocialData();
        } catch (error) {
            console.error(error);
            showToast('Erro ao criar família.', { type: 'error' });
        }
    };

    const inviteMember = async (email: string) => {
        if (!family) return;
        try {
            const { error } = await supabase
                .from('family_invites')
                .insert({
                    family_id: family.id,
                    email,
                    created_by: user?.id
                } as any);

            if (error) throw error;
            showToast(`Convite enviado para ${email}!`, { type: 'success' });
            refreshSocialData();
        } catch (error) {
            console.error(error);
            showToast('Erro ao enviar convite.', { type: 'error' });
        }
    };

    const joinFamily = async (token: string) => {
        if (!user) return;
        try {
            // 1. Validate Token
            const { data: invite, error: inviteError } = await supabase
                .from('family_invites')
                .select('*')
                .eq('token', token)
                .eq('status', 'pending')
                .maybeSingle() as { data: any; error: any };

            if (inviteError || !invite) throw new Error('Convite inválido ou expirado.');

            // 2. Add User to Family
            const { error: joinError } = await supabase
                .from('user_families')
                .insert({
                    user_id: user.id,
                    family_id: invite.family_id,
                    role: 'member'
                } as any);

            if (joinError) throw joinError;

            // 3. Update Invite Status
            await supabase
                .from('family_invites')
                .update({ status: 'accepted' } as any)
                .eq('id', invite.id);

            showToast('Você entrou na família!', { type: 'success' });
            refreshSocialData();
        } catch (error: any) {
            console.error(error);
            showToast(error.message || 'Erro ao entrar na família.', { type: 'error' });
        }
    };

    const leaveFamily = async () => {
        if (!user || !family) return;
        try {
            const { error } = await supabase
                .from('user_families')
                .delete()
                .eq('user_id', user.id)
                .eq('family_id', family.id);

            if (error) throw error;

            showToast('Você saiu da família.', { type: 'info' });
            refreshSocialData();
        } catch (error) {
            console.error(error);
            showToast('Erro ao sair da família.', { type: 'error' });
        }
    };

    return (
        <SocialContext.Provider value={{
            family,
            members,
            invites,
            loading,
            createFamily,
            inviteMember,
            joinFamily,
            leaveFamily,
            refreshSocialData
        }}>
            {children}
        </SocialContext.Provider>
    );
};

export const useSocial = () => useContext(SocialContext);
