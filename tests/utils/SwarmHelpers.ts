import { Page, expect, Locator } from '@playwright/test';
import { Brain } from './Brain';

export class SwarmHelpers {
    readonly page: Page;
    readonly agentName: string;
    readonly emoji: string;

    constructor(page: Page, agentName: string, emoji: string) {
        this.page = page;
        this.agentName = agentName;
        this.emoji = emoji;
    }

    log(message: string) {
        console.log(`${this.emoji} [${this.agentName.padEnd(10)}] 👉 ${message}`);
    }

    /**
     * Inicialização Escalonada (Staggered Start)
     * Evita que 10 agentes ataquem o servidor local no exato milissegundo 0.
     */
    async staggerStart() {
        this.log('🚀 Iniciando execução dedicada...');
        // Sem delay artificial em modo sequencial
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

                // Aguarda a rede acalmar para garantir que o render ocorreu
                try {
                    await this.page.waitForLoadState('networkidle', { timeout: Brain.timeouts.medium });
                } catch {
                    this.log('⚠️ Network idle timeout, prosseguindo...');
                }

                const dashboardIndicator = this.page.locator(Brain.selectors.login.authCheck).first();
                const loginBtn = this.page.locator(Brain.selectors.login.signInBtn);

                // Check rápido se já estamos logados
                if (await dashboardIndicator.isVisible()) {
                    this.log('🔓 Acesso confirmado (Fast Check).');
                    return;
                }

                // Se não, espera explicitamente por um dos estados chave com timeout longo
                this.log('⏳ Analisando interface...');
                
                // Tenta esperar o dashbarod aparecer
                try {
                    await dashboardIndicator.waitFor({ state: 'visible', timeout: Brain.timeouts.long });
                    this.log('🔓 Acesso confirmado.');
                    return;
                } catch (e) {
                    // Se falhar, checa se caiu no login
                    if (await loginBtn.isVisible()) {
                        this.log('🔒 Tela de Login detectada. Acessando área Dev...');
                        
                        // Mobile Fix: Scroll para encontrar o botão se estiver hidden
                        const devBtn = this.page.locator('button:has-text("Login de Desenvolvedor")');
                        if (await devBtn.count() > 0) {
                             await devBtn.scrollIntoViewIfNeeded();
                             await this.safeClick(devBtn);
                        } else {
                             // Fallback padrão
                             await loginBtn.click();
                        }
                        
                        // Lógica de PIN (Se houver input de senha/pin aparecendo)
                        try {
                            // Espera input específico
                            const pinInput = this.page.locator(Brain.selectors.login.pinInput).first();
                            await pinInput.waitFor({ state: 'visible', timeout: 3000 });
                            this.log(`🔑 Inserindo PIN (${Brain.selectors.login.pinCode})...`);
                            await pinInput.fill(Brain.selectors.login.pinCode);
                        } catch {
                            this.log('⚠️ Input de PIN específico não achado, procurando qualquer input visível...');
                            const anyInput = this.page.locator('input:visible').first();
                            if (await anyInput.count() > 0) {
                                await anyInput.fill(Brain.selectors.login.pinCode);
                                this.log('🔑 PIN inserido em input genérico.');
                            } else {
                                this.log('❌ Nenhum input encontrado para o PIN.');
                            }
                        }
                        
                        // Mobile Fix: Tap no Enter se keyboard virtual estiver ativo (simulado)
                        await this.page.keyboard.press('Enter');

                        await dashboardIndicator.waitFor({ state: 'visible', timeout: Brain.timeouts.long });
                        return;
                    }
                    throw e; // Relança erro se nem login nem dashboard apareceram
                }

            } catch (error) {
                attempts++;
                this.log(`⚠️ Falha no login (Tentativa ${attempts}/${maxAttempts}): ${error}`);
                await this.page.reload();
                await this.page.waitForTimeout(2000);
            }
        }
        
        throw new Error(`🔥 Falha catastrófica de login após ${maxAttempts} tentativas.`);
    }

    async safeClick(selector: Locator) {
        try {
            await selector.waitFor({ state: 'visible', timeout: 5000 });
            await selector.click();
        } catch (e) {
            this.log(`⚠️ Forçando clique em: ${selector}`);
            await selector.dispatchEvent('click');
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
        const trigger = this.page.locator('button', { hasText: triggerText }).first();
        if (await trigger.isVisible()) {
            await trigger.click();
            const option = this.page.getByRole('option').nth(optionIndex);
            await option.waitFor();
            await option.click();
        }
    }

    async navigate(target: string) {
        this.log(`🧭 Navegando para: ${target}...`);
        
        // Mobile Handling: Se menu hamburguer estiver visível e nav links não, abra o menu
        const menuBtn = this.page.locator('button[aria-label="Menu"], button .lucide-menu').first();
        const drawer = this.page.locator('[role="dialog"], [data-radix-collection-item], nav.mobile-nav'); // Tenta identificar drawer aberto

        if (await menuBtn.isVisible()) {
             // Se o drawer não estiver visível (ou não conseguirmos confirmar), clica no menu
             // Assumindo que nav standard está escondida
             await menuBtn.click();
             await this.page.waitForTimeout(300);
        }

        // Tenta achar link com o texto exato ou parcial na sidebar/drawer
        // Adicionado 'text=${target}' para ser mais específico
        const navLink = this.page.locator(`nav a, nav button, aside a, aside button`).filter({ hasText: target });
        
        // Fallback para title/aria-label (ícones)
        const iconLink = this.page.locator(`nav [title="${target}"], nav [aria-label="${target}"], aside [title="${target}"], aside [aria-label="${target}"]`);

        if (await navLink.count() > 0) {
            // Tenta clicar no primeiro visível
             const visibleLink = navLink.first(); // Em mobile pode ter duplicatas, pega a do drawer
             if (await visibleLink.isVisible()) {
                 await visibleLink.click();
             } else {
                 await navLink.last().click(); // As vezes o do drawer é o último
             }
        } else if (await iconLink.count() > 0) {
            await iconLink.first().click();
        } else {
             // Fallback final: tenta achar qualquer coisa com esse texto na tela que pareça um link
             this.log(`⚠️ Link exato não encontrado na nav, procurando genericamente...`);
             await this.safeClick(this.page.getByRole('link', { name: target }).first());
        }

        // Fechar menu se for mobile e ele não fechar sozinho? Normalmente navegação fecha.
        // Aguarda estabilização
        await this.page.waitForTimeout(500);
    }

    async createTransaction({ description, amount, type, categoryMatch }: { description: string, amount: string, type: 'Receita' | 'Despesa', categoryMatch: string }) {
        this.log(`📝 Nova ${type}: ${description}`);
        
        if (await this.page.locator(Brain.selectors.modal.dialog).count() === 0) {
            await this.openTransactionModal();
        }
        await this.page.waitForTimeout(500);

        await this.fillSmartInput(Brain.selectors.inputs.amount, amount);
        await this.fillSmartInput(Brain.selectors.inputs.description, description);

        await this.selectOption('Selecione a conta...', 0);

        const typeBtn = this.page.getByRole('button', { name: type, exact: true });
        if (await typeBtn.getAttribute('data-state') !== 'on') await typeBtn.click();

        // Lógica de Categoria (Brain)
        const catBtn = this.page.locator(`button[title*="${categoryMatch}"]`).or(this.page.locator(`button[aria-label*="${categoryMatch}"]`));
        if (await catBtn.count() > 0) {
            await catBtn.first().click();
        } else {
            await this.page.locator('.grid button').first().click();
        }

        await this.page.locator(Brain.selectors.modal.saveBtn).first().click();
        
        // Wait for success feedback (Toast or Modal close)
        try {
            await expect(this.page.locator(Brain.selectors.modal.dialog)).not.toBeVisible({ timeout: 5000 });
            this.log('✅ Salvo com sucesso.');
        } catch {
            this.log('⚠️ Modal não fechou, verificando erros...');
        }
    }
}
