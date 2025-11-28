import React from 'react';
import { Modal } from '../ui/Modal';
import { AchievementsList } from '../ui/AchievementsList';

interface AchievementsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AchievementsDialog: React.FC<AchievementsDialogProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Minhas Conquistas">
            <div className="max-h-[60vh] overflow-y-auto pr-2">
                <AchievementsList />
            </div>
        </Modal>
    );
};
