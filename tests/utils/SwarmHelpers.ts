import { Page, expect, Locator } from '@playwright/test';
import { Brain } from './Brain';
import { SwarmMemory } from './SwarmMemory';

export class SwarmHelpers {
    readonly page: Page;
    readonly agentName: string;
    readonly emoji: string;

    constructor(page: Page, agentName: string, emoji: string) {
        this.page = page;
        this.agentName = agentName;
        this.emoji = emoji;
        
        // Load Memory
        const mem = SwarmMemory.getMemory(agentName);
        if (mem.successfulNavigations.length > 0) {
            this.log(`🧠 Memória carregada: ${mem.successfulNavigations.length} rotas conhecidas.`);
        }
    }

    log(message: string) {
        console.log(`${this.emoji} [${this.agentName.padEnd(10)}] 👉 ${message}`);
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
        let attempts = 0;
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

    async safeClick(selector: Locator) {
        try {
            await selector.waitFor({ state: 'visible', timeout: 5000 });
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

    async fillSmartInput(placeholder: string, value: string) {
        const input = this.page.getByPlaceholder(placeholder).first();
        await input.fill(value);
    }

    async selectOption(triggerText: string, optionIndex: number = 0) {
        const trigger = this.page.locator('button', { hasText: triggerText }).last();
        // Short timeout check
        if (await trigger.isVisible({ timeout: 2000 }).catch(() => false)) {
            await trigger.click();
            await this.page.waitForTimeout(200);
            const option = this.page.getByRole('option').nth(optionIndex);
            if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                await option.click();
            } else {
                await this.page.keyboard.press('Escape'); 
            }
        } else {
            this.log(`⚠️ Select com texto "${triggerText}" não encontrado. Ignorando.`);
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
            await expect(this.page.locator(Brain.selectors.modal.dialog)).not.toBeVisible({ timeout: 3000 });
            this.log('✅ Modal fechado. Transação salva.');
            SwarmMemory.learn(this.agentName, 'transaction_success', type);

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
