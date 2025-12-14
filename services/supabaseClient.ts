import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nblzuljuuuvdzrqakccd.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibHp1bGp1dXV2ZHpycWFrY2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTM3NzIsImV4cCI6MjA3ODEyOTc3Mn0.NjXBIL3QBo8J9A0589-GvORaFNESHoI-CqiU3hd_mgI";

// Removing the check to allow fallback to work
// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error('Missing Supabase environment variables. Please verify .env.local');
// }

export const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseAnonKey as string
);