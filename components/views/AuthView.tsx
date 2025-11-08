import React from 'react';
import { supabase } from '../../services/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

// Tema customizado para alinhar o Auth UI com o design do FinanceHub
// A estrutura foi corrigida para ser compatível com a versão de @supabase/auth-ui-shared
// que está sendo usada, que tem a definição do tema diretamente em `ThemeSupa.default`.
const customTheme = {
  default: {
    ...ThemeSupa.default,
    colors: {
      ...ThemeSupa.default.colors,
      brand: 'oklch(var(--primary-oklch))',
      brandAccent: 'hsl(266 70% 60%)', // Cor de hover mais clara
      brandButtonText: 'oklch(var(--primary-foreground-oklch))',

      defaultButtonBackground: 'oklch(var(--primary-oklch))',
      defaultButtonBackgroundHover: 'hsl(266 70% 60%)',
      defaultButtonBorder: 'transparent',
      defaultButtonText: 'oklch(var(--primary-foreground-oklch))',

      dividerBackground: 'oklch(var(--border-oklch) / 0.2)',

      inputBackground: 'rgba(0,0,0,0.2)',
      inputBorder: 'oklch(var(--border-oklch) / 0.5)',
      inputBorderHover: 'oklch(var(--primary-oklch))',
      inputBorderFocus: 'oklch(var(--primary-oklch))',
      inputText: 'oklch(var(--foreground-oklch))',
      inputLabelText: 'oklch(var(--muted-foreground-oklch))',
      inputPlaceholder: 'oklch(var(--muted-foreground-oklch) / 0.5)',

      messageText: 'oklch(var(--muted-foreground-oklch))',
      messageTextDanger: 'oklch(0.8 0.15 25)', // Tom de vermelho claro para o texto
      messageBackgroundDanger: 'oklch(var(--destructive-oklch) / 0.15)', // Fundo vermelho translúcido

      anchorTextColor: 'oklch(var(--muted-foreground-oklch))',
      anchorTextHoverColor: 'oklch(var(--foreground-oklch))',
    },
    radii: {
        ...ThemeSupa.default.radii,
        borderRadiusButton: '0.5rem',
        buttonBorderRadius: '0.5rem',
        inputBorderRadius: '0.5rem',
    }
  },
};


export const AuthView: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-oklch-background p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          FinanceHub
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: customTheme }}
          providers={['google']}
          theme="dark" // Força o tema escuro para garantir consistência
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
              },
              update_password: {
                password_label: 'Nova senha',
                button_label: 'Atualizar senha',
              },
              validation: {
                password_length_must_be_at_least: 'A senha deve ter pelo menos 6 caracteres',
              }
            },
          }}
        />
      </div>
    </div>
  );
};