import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('⚙️ Agent SysAdmin: O Zelador do Sistema (Humanized)', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'SysAdmin', '⚙️');
    await agent.setupInterceptor();
    await agent.login();
    
    agent.log('💬 "Sistema online. Iniciando ronda de manutenção..."');

    const loops = 50; 

    for (let i = 1; i <= loops; i++) {
        const action = faker.helpers.arrayElement(['health_check', 'config_tweak', 'clean_up', 'security_audit']);
        
        if (action === 'health_check') {
            agent.log('💬 "Verificando integridade dos serviços..."');
            await agent.navigate('Desenvolvedor'); // Nome provável na sidebar ou title "DevTools"
            await page.waitForTimeout(1000);
            
            const statusCards = page.locator('.bg-white\\/5');
            if (await statusCards.count() > 0) {
                await statusCards.first().hover(); 
                agent.log('💬 "Serviços parecem estáveis."');
            }
        }
        
        if (action === 'config_tweak') {
            agent.log('💬 "Alguém reclamou do brilho. Deixa eu testar o tema..."');
            await agent.navigate('Configurações'); 
            await page.waitForTimeout(500);
            
            const themeBtn = page.locator('button[title*="Tema"]').first();
            if (await themeBtn.isVisible()) {
                await themeBtn.click();
                agent.log('💬 "Tema Escuro: Check."');
                await page.waitForTimeout(500);
                await themeBtn.click(); // Reverte
                agent.log('💬 "Tema Claro: Check. Voltando ao padrão."');
            }
        }
        
        if (action === 'clean_up') {
            agent.log('💬 "Limpando logs antigos..."');
            await agent.navigate('Desenvolvedor'); 
            await page.mouse.click(500, 500);
            await page.keyboard.press('Control+l');
        }
        
        if (action === 'security_audit') {
            agent.log('💬 "Auditoria de segurança rápida..."');
            await agent.navigate('Configurações'); 
            const apiKeySection = page.locator('text=Chave de API');
            if (await apiKeySection.isVisible()) {
                await apiKeySection.click();
                agent.log('💬 "API Keys: Rotacionadas corretamente."');
            }
        }

        await page.waitForTimeout(faker.number.int({ min: 800, max: 2000 }));
    }

    agent.log('💬 "Manutenção finalizada. Logs arquivados. Servidor estável."');
    await page.waitForTimeout(5000);
});
