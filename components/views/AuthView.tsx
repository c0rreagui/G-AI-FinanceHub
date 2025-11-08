import React from 'react';
import { supabase } from '../../services/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export const AuthView: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-oklch-background p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          FinanceHub
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']} // Opcional: Adiciona login com Google
          localization={{
            variables: {
              sign_in: {
                email_label: 'Seu email',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre aqui',
              },
              sign_up: {
                email_label: 'Seu email',
                password_label: 'Crie uma senha',
                button_label: 'Cadastrar',
                link_text: 'Não tem uma conta? Cadastre-se',
              },
              forgotten_password: {
                email_label: 'Email',
                button_label: 'Enviar instruções',
                link_text: 'Esqueceu sua senha?',
              }
            },
          }}
        />
      </div>
    </div>
  );
};
