import { createClient } from '@supabase/supabase-js';

// As credenciais do Supabase foram configuradas com as informações que você forneceu.
// Se o erro 'Failed to fetch' continuar, verifique as configurações de CORS no seu painel do Supabase.
const supabaseUrl = 'https://cftxralugjllwyqqoyn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdHhyYWx1bGdqbGx3eXFxb3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjEwMTUsImV4cCI6MjA3Nzg5NzAxNX0.kFk-DLBILsKvujnL1vCjzGYrbG2jH82oKEF1LcWOd5c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
