import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('♿ Enterprise Swarm - A11y Squad', () => {

    // ⌨️ Agent 16: The Keyboard Warrior (No Mouse)
    // Valida navegação apenas por teclado e Focus Traps.
    test('⌨️ The Keyboard Warrior (Keyboard Nav)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'A11y_Keyboard', '⌨️');
        
        await agent.log('⌨️ Desconectando mouse... Iniciando navegação Tab.');
        await agent.login();

        // Tentar focar no primeiro elemento via Tab
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        
        let focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent || document.activeElement?.tagName);
        await agent.log(`🔵 Foco atual: ${focused}`);

        // Navegar até o menu "Transações" via teclado
        // Isso assume uma ordem de tabulação lógica. Vamos tentar tabular 10x e ver se chegamos no aside.
        let foundTransactions = false;
        for (let i = 0; i < 20; i++) {
            await page.keyboard.press('Tab');
            const text = await page.evaluate(() => document.activeElement?.textContent?.trim());
            if (text === 'Transações') {
                foundTransactions = true;
                await agent.log('✅ Botão "Transações" alcançado via Teclado!');
                await page.keyboard.press('Enter');
                break;
            }
        }

        if (!foundTransactions) {
            await agent.log('⚠️ Não foi possível alcançar "Transações" em 20 Tabs (Skip Links ausentes?).');
        }

        await agent.captureEvidence('keyboard_nav');
    });

    // 🗣️ Agent 17: The Screen Reader (Semantics)
    // Verifica atributos ARIA críticos.
    test('🗣️ The Screen Reader (ARIA Checks)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'A11y_ScreenReader', '🗣️');
        
        await agent.log('🗣️ Buscando imagens sem descrição e botões mudos...');
        await agent.login();
        await agent.navigateTo('Transações');

        // 1. Verificar Imagens sem Alt
        const badImages = await page.locator('img:not([alt])').count();
        if (badImages > 0) {
            await agent.log(`❌ Encontradas ${badImages} imagens sem texto alternativo (alt).`);
        } else {
            await agent.log('✅ Todas as imagens possuem atributo alt.');
        }

        // 2. Verificar Botões sem Texto ou Label
        // Botões que só têm ícone (sem texto visível)
        const allButtons = page.locator('button');
        const count = await allButtons.count();
        
        let unlabeledButtons = 0;
        for (let i = 0; i < count; i++) {
            const btn = allButtons.nth(i);
            const textContent = (await btn.textContent())?.trim();
            const label = await btn.getAttribute('aria-label');
            const hiddenSpan = await btn.locator('.sr-only').count(); // Tailwind sr-only class
            
            // Se não tem texto visível E não tem aria-label E não tem span oculto
            if (!textContent && !label && hiddenSpan === 0) {
                unlabeledButtons++;
            }
        }

        if (unlabeledButtons > 0) {
            await agent.log(`⚠️ Encontrados ${unlabeledButtons} botões de ícone sem 'aria-label' ou '.sr-only'.`);
        } else {
            await agent.log('✅ Botões de ícone parecem acessíveis.');
        }

        await agent.captureEvidence('screen_reader_audit');
    });

    // 👁️‍🗨️ Agent 18: The Vision Impaired (Zoom & Contrast)
    // Simula zoom de 200% para verificar quebra de layout.
    test('👁️‍🗨️ The Vision Impaired (200% Zoom)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'A11y_LowVision', '👁️‍🗨️');
        
        await agent.log('👁️‍🗨️ Aplicando Zoom 200% e Fonte Grande...');
        
        // Simular Zoom via Viewport pequeno e DPI alto OU CSS
        await page.setViewportSize({ width: 1280, height: 720 });
        
        await agent.login();
        
        // Injetar CSS para forçar fonte grande (simulando config de OS)
        await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
        await agent.log('🔍 Fonte base duplicada.');

        await agent.navigateTo('Dashboard');

        // Verificar se houve sobreposição crítica (overlap)
        // Difícil automatizar sem ferramentas visuais, mas vamos checar scrollbar horizontal indesejado
        const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);

        if (scrollWidth > viewportWidth) {
            await agent.log('⚠️ Scroll Horizontal detectado (conteúdo vazou da tela).');
        } else {
            await agent.log('✅ Layout responsivo segurou o Zoom 200%.');
        }

        await agent.captureEvidence('high_zoom_mode');
    });

});
