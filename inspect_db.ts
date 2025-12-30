
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function inspectDatabase() {
    console.log('🔍 Inspecting Supabase Tables...');

    // Queries metadata from the decision of what tables exist
    // We can't query information_schema directly with supabase-js easily without SQL function,
    // so we'll test access to the known tables found in your schema.sql
    const tables = [
        'user_profiles', 'categories', 'goals', 'debts',
        'investments', 'transactions', 'scheduled_transactions', 'families'
    ];

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`❌ ${table}: Error - ${error.message} (RLS or missing)`);
        } else {
            console.log(`✅ ${table}: Exists (${count} records)`);
        }
    }
}

inspectDatabase();
