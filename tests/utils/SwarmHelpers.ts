import { Page, expect, Locator } from '@playwright/test';
import { Brain } from './Brain';
import { SwarmMemory } from './SwarmMemory';
import { SwarmHunter } from './SwarmHunter';
import { SwarmDebugger } from './SwarmDebugger';
import * as fs from 'fs';

export class SwarmHelpers {
    readonly page: Page;
    readonly agentName: string;
    readonly emoji: string;
    readonly hunter: SwarmHunter;
    readonly debugger: SwarmDebugger;

    constructor(page: Page, agentName: string, emoji: string) {
        this.page = page;
        this.agentName = agentName;
        this.emoji = emoji;
        this.hunter = new SwarmHunter(page, this);
        this.debugger = new SwarmDebugger(page, agentName);
        
        // Load Memory
        const mem = SwarmMemory.getMemory(agentName);
        if (mem.successfulNavigations.length > 0) {
            this.log(`🧠 Memória carregada: ${mem.successfulNavigations.length} rotas conhecidas.`);
        }
    }

    log(message: string) {
        console.log(`${this.emoji} [${this.agentName.padEnd(10)}] 👉 ${message}`);
    }

    async captureEvidence(trigger: string, error?: Error) {
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const sanitizedTrigger = trigger.replace(/[^a-z0-9]/gi, '_');
        const basePath = `tests/evidence/${this.agentName}/${timestamp}_${sanitizedTrigger}`;
        
        try {
            await this.page.screenshot({ path: `${basePath}.png`, fullPage: false });
            
            if (error) {
                // Generate Black Box Dump
                const dump = this.debugger.getBlackBoxDump();
                fs.writeFileSync(`${basePath}_blackbox.txt`, dump);
                
                // Generate Repro Script
                const reproFile = await this.debugger.generateReproScript(error);
                this.log(`🔧 REPRO SCRIPT GERADO: tests/repros/${reproFile}`);
            }
        } catch (e) {
            console.error('Snapshot failed', e);
        }
    }

    /**
     * Inicialização Escalonada (Staggered Start)
     */
    async staggerStart() {
        this.log('🚀 Iniciando execução dedicada...');
    }

    async setupInterceptor() {
        await this.page.addInitScript(({ name, emoji }) => {
            (window as any).__agentName = name;
            console.log(`%c ${emoji} ${name} ACTIVATED`, 'background: #222; color: #bada55; font-size: 14px');
        }, { name: this.agentName, emoji: this.emoji });
    }

    /**
     * Login Robusto com Retry
     */
    async login() {
        await this.staggerStart();
        
        this.log('🔑 Iniciando autenticação segura...');
        this.hunter.startHunting(); // Start Bug Hunting Background Processes

        let attempts = 0;
// ... (rest of code managed by replace logic chunks below)
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                await this.page.goto(Brain.routes.home);
                this.log('🌍 Rota acessada. Aguardando carregamento...');

                try {
                    await this.page.waitForLoadState('networkidle', { timeout: Brain.timeouts.medium });
                } catch {
                    this.log('⚠️ Network idle timeout, prosseguindo...');
                }

                const dashboardIndicator = this.page.locator(Brain.selectors.login.authCheck).first();
                const loginBtn = this.page.locator(Brain.selectors.login.signInBtn);

                if (await dashboardIndicator.isVisible()) {
                    this.log('🔓 Acesso confirmado (Fast Check).');
                    return;
                }

                this.log('⏳ Analisando interface...');
                
                try {
                    await dashboardIndicator.waitFor({ state: 'visible', timeout: Brain.timeouts.long });
                    this.log('🔓 Acesso confirmado.');
                    await this.captureEvidence('login_success');
                    return;
                } catch (e) {
                    if (await loginBtn.isVisible()) {
                        this.log('🔒 Tela de Login detectada. Acessando área Dev...');
                        
                        const devBtn = this.page.locator('button:has-text("Login de Desenvolvedor")');
                        if (await devBtn.count() > 0) {
                             await devBtn.scrollIntoViewIfNeeded();
                             await this.safeClick(devBtn);
                        } else {
                             await loginBtn.click();
                        }
                        
                        try {
                            const pinInput = this.page.locator(Brain.selectors.login.pinInput).first();
                            await pinInput.waitFor({ state: 'visible', timeout: 3000 });
                            this.log(`🔑 Inserindo PIN (${Brain.selectors.login.pinCode})...`);
                            await pinInput.fill(Brain.selectors.login.pinCode);
                        } catch {
                            this.log('⚠️ Input de PIN específico não achado, procurando qualquer input visível...');
                            const anyInput = this.page.locator('input:visible').first();
                            if (await anyInput.count() > 0) {
                                await anyInput.fill(Brain.selectors.login.pinCode);
                            }
                        }
                        
                        await this.page.keyboard.press('Enter');
                        await dashboardIndicator.waitFor({ state: 'visible', timeout: Brain.timeouts.long });
                        
                        SwarmMemory.saveMemory(this.agentName, { lastLoginMethod: 'dev_bypass' });
                        await this.captureEvidence('login_dev_bypass');
                        return;
                    }
                    throw e;
                }

            } catch (error) {
                attempts++;
                this.log(`⚠️ Falha no login (Tentativa ${attempts}/${maxAttempts}): ${error}`);
                await this.page.reload();
                await this.page.waitForTimeout(2000);
            }
        }
        
        SwarmMemory.learn(this.agentName, 'error', 'Login Failure');
        throw new Error(`🔥 Falha catastrófica de login após ${maxAttempts} tentativas.`);
    }

    /**
     * Navegação Inteligente (Sidebar / Menu)
     */
    async navigateTo(destination: string) {
        this.log(`🧭 Navegando para: ${destination}...`);
        this.debugger.logAction('navigate', destination, `Navegar para ${destination}`, destination);
        
        // 1. Tentar Sidebar Desktop
        const navContainer = this.page.locator('nav, aside, [class*="sidebar"], [class*="menu"]').first();
        let trigger = navContainer.getByRole('button', { name: destination }).first();
        
        if (await trigger.count() === 0) {
            // Fallback: Busca global
            trigger = this.page.getByRole('button', { name: destination }).first();
        }
        
        if (await trigger.isVisible()) {
            await trigger.click();
            return;
        }

        // 2. Tentar Link
        const link = this.page.getByRole('link', { name: destination }).first();
        if (await link.isVisible()) {
            await link.click();
            return;
        }

        this.log(`⚠️ Não encontrei link de navegação para "${destination}". Tentando URL direta?`);
    }

    async logout() {
        this.log('🚪 Fazendo logout...');
        const userMenu = this.page.locator('button:has-text("Sair"), button[aria-label="Logout"]').first();
        if (await userMenu.isVisible()) {
            await userMenu.click();
        } else {
            await this.page.evaluate(() => localStorage.clear());
            await this.page.reload();
        }
    }

    async safeClick(selector: Locator) {
        try {
            await selector.waitFor({ state: 'visible', timeout: 5000 });
            this.debugger.logAction('click', String(selector), 'Clique seguro');
            await selector.click();
        } catch (e) {
            this.log(`⚠️ Forçando clique em: ${selector}`);
            await selector.click({ force: true });
        }
    }

    async openTransactionModal() {
        this.log('💸 Abrindo Modal...');
        const btn = this.page.locator(Brain.selectors.modal.trigger).or(this.page.locator('[aria-label="Nova Transação"]'));
        await this.safeClick(btn.first());
        await expect(this.page.locator(Brain.selectors.modal.dialog)).toBeVisible();
    }

    async fillSmartInput(identifier: string, value: string) {
        this.log(`⌨️ Preenchendo campo "${identifier}" com "${value}"...`);
        this.debugger.logAction('fill', identifier, `Preencher "${identifier}"`, value);
        
        // 1. Try by Label (Best Practice)
        let input = this.page.getByLabel(identifier, { exact: false }).first();
        if (await input.count() > 0 && await input.isVisible()) {
            await input.fill(value);
            return;
        }

        // 2. Try by Placeholder
        input = this.page.getByPlaceholder(identifier, { exact: false }).first();
        if (await input.count() > 0 && await input.isVisible()) {
            await input.fill(value);
            return;
        }

        // 3. Try by Text near Input (Fallback for Shadcn/Tailwind structures)
        // Find a label/div with text, then find input inside or near it
        const label = this.page.locator(`label:has-text("${identifier}"), div:has-text("${identifier}"), span:has-text("${identifier}")`).last();
        if (await label.isVisible()) {
            const associatedInput = label.locator('xpath=..//input').first(); // Parent -> Input
            if (await associatedInput.count() > 0 && await associatedInput.isVisible()) {
                 await associatedInput.fill(value);
                 return;
            }
             // Try sibling
            const siblingInput = label.locator('xpath=following-sibling::input').first();
             if (await siblingInput.count() > 0 && await siblingInput.isVisible()) {
                 await siblingInput.fill(value);
                 return;
            }
        }
        
        this.log(`⚠️ SmartInput não encontrou campo para "${identifier}". Tentando seletor direto...`);
        try {
             await this.page.locator(identifier).fill(value);
        } catch (e) {
             this.log(`❌ Falha total ao preencher "${identifier}".`);
        }
    }

    async ensureMenuClosed() {
        // Check for "Mais Opções" Title or Sheet
        const sheet = this.page.getByRole('dialog').filter({ hasText: 'Mais Opções' }).first();
        if (await sheet.isVisible()) {
            this.log('🧹 Fechando menu "Mais Opções" para liberar navegação...');
            // Try Close Button if exists
            const closeBtn = sheet.locator('button[aria-label="Close"], button.close');
            if (await closeBtn.count() > 0 && await closeBtn.isVisible()) {
                await closeBtn.click();
            } else {
                // Click outside (Backdrop) or Press Escape
                await this.page.mouse.click(10, 10);
                await this.page.keyboard.press('Escape');
            }
            await expect(sheet).not.toBeVisible({ timeout: 2000 });
        }
    }

    async navigate(target: string) {
        this.log(`🔍 Iniciando navegação complexa para: ${target}`);
        
        // Priority: Close menu if we are navigating to a Main Tab
        const mainTabs = ['Início', 'Transações', 'Metas', 'Mais'];
        if (mainTabs.includes(target) || target === 'Home') {
            await this.ensureMenuClosed();
        }

        const mem = SwarmMemory.getMemory(this.agentName);
        if (mem.failedNavigations.includes(target)) {
            this.log(`🧠 Lembro que falhei ao tentar ir para "${target}" antes. Vou tentar com mais cuidado.`);
        }

        this.log(`🧭 Navegando para: ${target}...`);
        
        const menuBtn = this.page.locator('button[aria-label="Menu"], button .lucide-menu').first();
        
        if (await menuBtn.isVisible()) {
             this.log('🍔 Menu Hambúrguer detectado, clicando...');
             await menuBtn.click();
             await this.page.waitForTimeout(300);
        }

        const navLink = this.page.locator(`nav a, nav button, aside a, aside button`).filter({ hasText: target });
        const iconLink = this.page.locator(`nav [title="${target}"], nav [aria-label="${target}"], aside [title="${target}"], aside [aria-label="${target}"]`);

        let success = false;
        
        const countNav = await navLink.count();
        this.log(`🔎 Encontrados ${countNav} links de texto em containers semânticos para "${target}"`);

        // 1. Semantic Nav Links
        if (countNav > 0) {
             const visibleLink = navLink.first();
             if (await visibleLink.isVisible()) {
                 this.log('✅ Link visível encontrado, clicando...');
                 await visibleLink.click();
                 success = true;
             } else {
                 this.log('🙈 Link existe mas não está visível. Tentando Menu Mais...');
                 const moreBtn = this.page.locator('button[aria-label="Mais"], button:has-text("Mais")');
                 if (await moreBtn.isVisible()) {
                     this.log(`📱 Abrindo menu Mais...`);
                     await moreBtn.click();
                     await this.page.waitForTimeout(500);
                     const sheetLink = this.page.locator(`[role="dialog"] button:has-text("${target}")`).first();
                     if (await sheetLink.isVisible()) {
                         this.log('📄 Link encontrado no Sheet, clicando...');
                         await sheetLink.click({ force: true });
                         success = true;
                     }
                 }
                 if (!success) {
                      this.log('⚠️ Tentando clique forçado no link invisível...');
                      await navLink.last().click({ force: true });
                      success = true;
                 }
             }
        }

        // 2. Global Button Fallback (Outside Nav)
        if (!success) {
            const globalBtn = this.page.getByRole('button', { name: target, exact: true }).or(this.page.locator(`button:has-text("${target}")`));
            if (await globalBtn.count() > 0 && await globalBtn.first().isVisible()) {
                this.log('🔎 Botão global encontrado fora de <nav>, usando ele.');
                await globalBtn.first().click();
                success = true;
            }
        }

        // 3. Icon Links
        if (!success && await iconLink.count() > 0) {
            this.log('🖼️ Link de ícone encontrado, clicando...');
            await iconLink.first().click();
            success = true;
        } 
        
        // 4. "Mais" Menu Fallback (Last Resort)
        if (!success) {
             this.log('❓ Link direto não encontrado. Procurando em Mais/Fallback...');
             const moreBtn = this.page.locator('button[aria-label="Mais"], button:has-text("Mais")');
             if (await moreBtn.isVisible()) {
                 await moreBtn.click();
                 await this.page.waitForTimeout(300);
                 const sheetLink = this.page.getByRole('button', { name: target }).first();
                 if (await sheetLink.isVisible()) {
                     this.log('📄 Link encontrado no Sheet (Fallback), clicando...');
                     await sheetLink.click({ force: true });
                     
                     // Wait for navigation or sheet close
                     const sheet = this.page.locator('[role="dialog"]').filter({ hasText: 'Mais Opções' }).first();
                     try {
                         await sheet.waitFor({ state: 'hidden', timeout: 3000 });
                         this.log('📄 Sheet fechou após clique.');
                     } catch {
                         this.log('⚠️ Sheet não fechou automaticamente. Tentando fechar...');
                         await this.ensureMenuClosed();
                     }

                     success = true;
                 }
             }

             if (!success) {
                this.log(`⚠️ Link exato não encontrado. Fallback genérico.`);
                const genericLink = this.page.getByRole('link', { name: target }).first();
                if (await genericLink.isVisible()) {
                    await this.safeClick(genericLink);
                    success = true;
                }
             }
        }

        await this.page.waitForTimeout(500);
        
        if (success) {
            SwarmMemory.learn(this.agentName, 'nav_success', target);
            await this.hunter.checkForGhosts(); // Scan page for errors after nav
            await this.hunter.checkResponsiveness(); // Check layout
            await this.captureEvidence(`nav_success_${target}`);
        } else {
            SwarmMemory.learn(this.agentName, 'nav_fail', target);
            this.log(`❌ Falha na navegação para ${target}. Aprendizado registrado.`);
        }
    }

    /**
     * Seleciona opção por Index ou Texto
     */
    async selectOption(triggerLabel: string, option: number | string = 0) {
        this.log(`🔽 Abrindo select "${triggerLabel}" para escolher "${option}"...`);
        this.debugger.logAction('select', triggerLabel, `Selecionar "${option}" em "${triggerLabel}"`, String(option));
        
        // Find trigger by Label or Text
        // Strategy: trigger usually usually has an aria-labelledby or just nearby text.
        // Or it IS the button with the label? 
        // Radix triggers usually don't contain the label text if selected.
        // But the test uses 'Categoria'. If the trigger is empty? 
        // Assuming trigger has aria-label or is near.
        
        let trigger = this.page.locator(`button[role="combobox"][aria-label="${triggerLabel}"]`).first();
        if (await trigger.count() === 0) {
             trigger = this.page.locator('button[role="combobox"]').filter({ hasText: triggerLabel }).first();
        }
        if (await trigger.count() === 0) {
             // Try standard Select trigger
             trigger = this.page.locator('select').filter({ hasText: triggerLabel }).first();
        }
        
        // Final fallback: any button with text
        if (await trigger.count() === 0) {
             trigger = this.page.getByRole('button', { name: triggerLabel }).first();
        }

        if (await trigger.isVisible({ timeout: 2000 }).catch(() => false)) {
            await trigger.click();
            await this.page.waitForTimeout(300);
            
            let optionLocator;
            if (typeof option === 'number') {
                optionLocator = this.page.getByRole('option').nth(option);
            } else {
                optionLocator = this.page.getByRole('option', { name: option, exact: false }).first();
            }

            if (await optionLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
                await optionLocator.click();
                this.log(`✅ Opção "${option}" selecionada.`);
            } else {
                this.log(`⚠️ Opção "${option}" não encontrada.`);
                await this.page.keyboard.press('Escape'); 
            }
        } else {
            this.log(`⚠️ Trigger "${triggerLabel}" não encontrado.`);
        }
    }

    async createTransaction({ description, amount, type, categoryMatch }: { description: string, amount: string, type: 'Receita' | 'Despesa', categoryMatch: string }) {
        this.log(`📝 Nova ${type}: ${description}`);
        
        // Ensure Modal Open
        if (await this.page.locator(Brain.selectors.modal.dialog).count() === 0) {
            await this.openTransactionModal();
        }
        await this.page.waitForTimeout(500);

        try {
            await this.fillSmartInput(Brain.selectors.inputs.amount, amount);
            await this.fillSmartInput(Brain.selectors.inputs.description, description);

            // Account Selection (Try both "Selecione a conta" and generic "Selecione")
            if (type === 'Despesa') {
                 await this.selectOption('Selecione', 0);
            }

            const typeBtn = this.page.getByRole('button', { name: type, exact: true });
            if (await typeBtn.count() > 0) {
                if (await typeBtn.getAttribute('data-state') !== 'on') await typeBtn.click();
            }

            // Category Selection
            const catBtn = this.page.locator(`button[title*="${categoryMatch}"]`).or(this.page.locator(`button[aria-label*="${categoryMatch}"]`));
            if (await catBtn.count() > 0) {
                await catBtn.first().click();
            } else {
                // Fallback: pick logic
                const gridBtns = this.page.locator('.grid button');
                if (await gridBtns.count() > 0) await gridBtns.first().click();
            }

            // Reference to submit buttons
            const saveBtns = this.page.locator('button[type="submit"], button:has-text("Salvar"), button:has-text("Adicionar")');
            if (await saveBtns.count() > 0) {
                const btn = saveBtns.last();
                await btn.scrollIntoViewIfNeeded();
                await btn.click({ force: true }); // Force click to be sure
            } else {
                this.log('❌ Botão Salvar não encontrado! Tentando Enter.');
                await this.page.keyboard.press('Enter');
            }
            
            // Success Verification
            await expect(this.page.locator(Brain.selectors.modal.dialog)).not.toBeVisible({ timeout: 5000 });
            this.log('✅ Modal fechado. Transação salva.');
            SwarmMemory.learn(this.agentName, 'transaction_success', type);
            await this.captureEvidence(`transaction_success_${type}`);

        } catch (e) {
            this.log(`⚠️ Erro no fluxo de transação: ${e}`);
            // Force Close via Escape
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(500);
            if (await this.page.locator(Brain.selectors.modal.dialog).isVisible()) {
                 await this.page.keyboard.press('Escape'); // Twice to be sure
            }
            SwarmMemory.learn(this.agentName, 'transaction_fail', type);
        }
    }
}
