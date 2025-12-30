
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function testAuth() {
    console.log('🔐 Iniciando Testes de Autenticação...\n');

    // 1. Teste Conta Pessoal
    console.log('👤 Testando Conta Pessoal (guilhermecorreasp11@gmail.com)...');
    const personal = await supabase.auth.signInWithPassword({
        email: 'guilhermecorreasp11@gmail.com',
        password: '@Correa1'
    });

    if (personal.error) {
        console.error('❌ Falha no login Pessoal:', personal.error.message);
    } else {
        console.log('✅ Login Pessoal: SUCESSO!');
        console.log('   ID:', personal.data.user.id);
        await supabase.auth.signOut();
    }

    console.log('\n-----------------------------------\n');

    // 2. Teste Conta Desenvolvedor (PIN 2609)
    // O código do app usa email 'dev@financehub.com' e senha '2609'
    console.log('🛠️  Testando Conta Desenvolvedor (PIN 2609)...');
    const dev = await supabase.auth.signInWithPassword({
        email: 'dev@financehub.com',
        password: '2609'
    });

    if (dev.error) {
        console.error('❌ Falha no login Dev:', dev.error.message);

        // Se falhar porque não existe, tentamos criar (apenas para teste, se cadastro estiver aberto)
        if (dev.error.message.includes('Invalid login credentials')) {
            console.log('⚠️  Nota: A conta de DEV parece não existir ainda no Supabase.');
        }
    } else {
        console.log('✅ Login Dev: SUCESSO!');
        console.log('   ID:', dev.data.user.id);
        await supabase.auth.signOut();
    }
}

testAuth();
