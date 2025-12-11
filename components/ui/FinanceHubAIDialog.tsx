import React from 'react';
import { Modal } from './Modal';
import { AIChat } from './AIChat';

interface FinanceHubAIDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FinanceHubAIDialog: React.FC<FinanceHubAIDialogProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="FinanceHub AI">
            <AIChat />
        </Modal>
    );
};
