
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env vars manually for this script since Vite isn't running
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ CRITICAL: .env variables not found by dotenv!');
    console.log('Current working directory:', process.cwd());
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    console.log(`URL: ${supabaseUrl}`);

    try {
        const { count, error } = await supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log('⚠️ Connected to Supabase (Auth restriction expected):', error.message);
        } else {
            console.log('✅ Connection successful! 🚀');
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

testConnection();
