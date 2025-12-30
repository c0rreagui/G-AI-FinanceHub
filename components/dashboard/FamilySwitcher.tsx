// components/dashboard/FamilySwitcher.tsx
import React, { useState } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { ChevronDown, Users, UserPlus } from 'lucide-react';
import { useDialog } from '../../hooks/useDialog';

export const FamilySwitcher: React.FC = () => {
    const { family, loading } = useSocial();
    const { user } = useAuth();
    const { openDialog } = useDialog();
    const [showMenu, setShowMenu] = useState(false);

    // Don't render if user is not authenticated
    if (!user) return null;

    const handleFamilyClick = () => {
        if (family) {
            setShowMenu(!showMenu);
        } else {
            // No family, prompt to create/join
            openDialog('social');
        }
    };

    return (
        <div className="relative inline-block mr-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleFamilyClick}
                className="flex items-center gap-1 text-xs"
                disabled={loading}
            >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">
                    {family ? family.name : 'Família'}
                </span>
                {family && <ChevronDown className="w-3 h-3" />}
            </Button>

            {showMenu && family && (
                <div className="absolute left-0 mt-2 w-56 bg-card border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-medium">{family.name}</p>
                        <p className="text-xs text-muted-foreground">Família ativa</p>
                    </div>
                    <div className="p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                                openDialog('social');
                                setShowMenu(false);
                            }}
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Gerenciar Família
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
