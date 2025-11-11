import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Settings } from '../Icons';
import { ApiKeySettings } from '../ui/ApiKeySettings';
import { Button } from '../ui/Button';
import { supabase } from '../../services/supabaseClient';
import { motion } from 'framer-motion';
import { APP_VERSION } from '../../config';

export const SettingsView: React.FC = () => {

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
        }
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
      }
    };
  
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    };

    return (
        <>
            <PageHeader 
                icon={Settings} 
                title="Ajustes e Perfil" 
                breadcrumbs={['FinanceHub', 'Ajustes']}
                actions={<Button onClick={handleLogout} variant="secondary">Sair</Button>}
            />
            <motion.div 
                className="flex-grow overflow-y-auto pr-2 space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}><ApiKeySettings /></motion.div>

                 <motion.div variants={itemVariants} className="card">
                    <h2 className="text-xl font-semibold text-white mb-2">Sobre</h2>
                    <p className="text-sm text-gray-400">
                        FinanceHub é seu assistente financeiro pessoal com tecnologia de IA.
                    </p>
                    <p className="text-xs text-gray-500 mt-4">Versão {APP_VERSION}</p>
                </motion.div>
            </motion.div>
        </>
    );
};