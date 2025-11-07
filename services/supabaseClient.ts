import { createClient } from '@supabase/supabase-js';

// As credenciais do Supabase foram configuradas com as informações que você forneceu.
// Se o erro 'Failed to fetch' continuar, verifique as configurações de CORS no seu painel do Supabase.
const supabaseUrl = 'https://nblzuljuuuvdzrqakccd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibHp1bGp1dXV2ZHpycWFrY2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTM3NzIsImV4cCI6MjA3ODEyOTc3Mn0.NjXBIL3QBo8J9A0589-GvORaFNESHoI-CqiU3hd_mgI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);