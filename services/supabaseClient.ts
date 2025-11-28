import { createClient } from '@supabase/supabase-js';

// As credenciais do Supabase foram configuradas com as informações que você forneceu.
// Se o erro 'Failed to fetch' continuar, verifique as configurações de CORS no seu painel do Supabase.

// AVISO DE SEGURANÇA: Em um ambiente de produção real, estas chaves NUNCA devem ser
// expostas diretamente no código-fonte do cliente. Elas devem ser gerenciadas
// como variáveis de ambiente (ex: process.env.REACT_APP_SUPABASE_URL) e carregadas
// através do processo de build para evitar o vazamento de credenciais.
const supabaseUrl = 'https://nblzuljuuuvdzrqakccd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibHp1bGp1dXV2ZHpycWFrY2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTM3NzIsImV4cCI6MjA3ODEyOTc3Mn0.NjXBIL3QBo8J9A0589-GvORaFNESHoI-CqiU3hd_mgI';

if (supabaseUrl && supabaseAnonKey) {
    console.warn(
        '%cAVISO DE SEGURANÇA',
        'color: yellow; font-size: 16px; font-weight: bold;',
        '\nAs chaves do Supabase estão expostas no lado do cliente. Em um ambiente de produção, use variáveis de ambiente para protegê-las.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);