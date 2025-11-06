// FIX: Initialize the Supabase client. The previous content was invalid placeholder text.
// This resolves the module not found error in hooks/useDashboardData.ts and all syntax errors in this file.
import { createClient } from '@supabase/supabase-js';

// Adicione aqui a URL e a chave anônima (anon key) do seu projeto Supabase.
// Você pode encontrá-las no painel do seu projeto em: Settings > API.
// É recomendado usar variáveis de ambiente para isso em um projeto real.
const supabaseUrl = 'https://cftxralugjllwyqqoyn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdHhyYWx1bGdqbGx3eXFxb3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjEwMTUsImV4cCI6MjA3Nzg5NzAxNX0.kFk-DLBILsKvujnL1vCjzGYrbG2jH82oKEF1LcWOd5c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);