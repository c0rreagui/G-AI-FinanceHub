// components/dashboard/FamilyInviteModal.tsx
import React, { useState } from 'react';
import { useFamily } from '../../hooks/useFamily';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';
import { Input } from '../ui/Input';

export const FamilyInviteModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const { familyId, inviteMember } = useFamily();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInvite = async () => {
        if (!familyId) return;
        setLoading(true);
        setError(null);
        try {
            await inviteMember(email);
            setEmail('');
            onClose();
        } catch (e: any) {
            setError(e.message || 'Erro ao enviar convite');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Convidar membro para a família</DialogTitle>
                    <DialogDescription>Envie um convite por e‑mail para alguém se juntar à sua família.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Input
                        placeholder="email@exemplo.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button onClick={handleInvite} disabled={loading || !email}>Convidar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
