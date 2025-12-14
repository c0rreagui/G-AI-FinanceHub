import { Page, expect } from '@playwright/test';
import { SwarmHelpers } from './SwarmHelpers';

export class SwarmHunter {
    private page: Page;
    private helper: SwarmHelpers;
    private errors: string[] = [];
    private networkErrors: string[] = [];

    constructor(page: Page, helper: SwarmHelpers) {
        this.page = page;
        this.helper = helper;
    }

    /**
     * Inicia listeners passivos para erros de console e rede.
     */
    startHunting() {
        this.helper.log('🏹 Hunter Mode ACTIVATED: Scanning for anomalies...');

        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                this.errors.push(`[Console Error] ${text}`);
                this.helper.log(`🚩 ANOMALY DETECTED (Console): ${text.substring(0, 50)}...`);
            }
        });

        this.page.on('pageerror', err => {
            this.errors.push(`[Uncaught Exception] ${err.message}`);
            this.helper.log(`🚩 CRITICAL ERROR: ${err.message}`);
        });

        this.page.on('response', resp => {
            if (resp.status() >= 400) {
                const fail = `[Network ${resp.status()}] ${resp.url()}`;
                this.networkErrors.push(fail);
                this.helper.log(`🚩 NETWORK FAIL: ${fail}`);
            }
        });
    }

    /**
     * Procura por strings proibidas no DOM visível (NaN, undefined, null, etc).
     */
    async checkForGhosts() {
        this.helper.log('👻 Caçando fantasmas de dados (NaN/undefined)...');
        
        const ghosts = ['NaN', 'undefined', 'null', '[object Object]', 'Error:'];
        const bodyText = await this.page.evaluate(() => document.body.innerText);
        
        const foundGhosts = ghosts.filter(g => bodyText.includes(g));

        if (foundGhosts.length > 0) {
            // Refinamento: Verificar se não é falso positivo (ex: texto explicativo)
            // Para "Error:", as vezes é label.
            for (const ghost of foundGhosts) {
                 // Tenta achar o elemento exato
                 const locator = this.page.getByText(ghost).first();
                 if (await locator.isVisible()) {
                      this.helper.log(`👻 GHOST BUSTED: Encontrei "${ghost}" visível na tela!`);
                      // Screenshot da evidência
                      await this.page.screenshot({ path: `tests/evidence/ghost_${ghost}_${Date.now()}.png` });
                      this.errors.push(`[UI Integrity] Found "${ghost}" visible on screen.`);
                 }
            }
        } else {
             this.helper.log('✨ Área limpa. Nenhum fantasma detectado.');
        }
    }

    /**
     * Verifica layout quebrado (Scroll Horizontal indesejado no Mobile).
     */
    async checkResponsiveness() {
        const scrollWidth = await this.page.evaluate(() => document.body.scrollWidth);
        const innerWidth = await this.page.evaluate(() => window.innerWidth);

        // Permitimos pequena margem de erro (ex: 1px)
        if (scrollWidth > innerWidth + 1) {
            this.helper.log(`📐 Layout Broken? ScrollWidth (${scrollWidth}) > Window (${innerWidth})`);
            this.errors.push(`[Responsiveness] Horizontal scroll detected: ${scrollWidth} > ${innerWidth}`);
             await this.page.screenshot({ path: `tests/evidence/layout_break_${Date.now()}.png` });
        } else {
             // this.helper.log('📐 Layout OK (No horizontal overflow).');
        }
    }

    /**
     * Retorna relatório de erros encontrados na sessão.
     */
    getReport() {
        return {
            totalErrors: this.errors.length,
            networkFailures: this.networkErrors.length,
            errors: this.errors,
            networkErrors: this.networkErrors
        };
    }
}
