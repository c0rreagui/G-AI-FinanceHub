import { Page, expect } from '@playwright/test';

/**
 * 🌪️ ChaosHelpers
 * Utilitários para simular comportamentos destrutivos, redes lentas e usuários "malvados".
 * Usado pelo QA & Security Squad.
 */
export class ChaosHelpers {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private log(message: string) {
        console.log(`🌪️ [Chaos]: ${message}`);
    }

    /**
     * 🤬 Rage Clicker
     * Clica repetidamente num elemento em curto espaço de tempo.
     * Testa Race Conditions e validação de duplo-submit.
     */
    async rageClick(selector: string, clicks: number = 5, intervalMs: number = 50) {
        this.log(`Iniciando Rage Click (${clicks}x) em "${selector}"...`);
        const element = this.page.locator(selector).first();
        await expect(element).toBeVisible();

        for (let i = 0; i < clicks; i++) {
            await element.click({ force: true });
            await this.page.waitForTimeout(intervalMs);
        }
        this.log('🤬 Rage Click finalizado.');
    }

    /**
     * 🐌 Network Simpson
     * Simula condições de rede adversas via CDP Session.
     */
    async simulateNetworkCondition(condition: 'Slow 3G' | 'Offline' | 'Fast 3G') {
        this.log(`Aplicando condição de rede: ${condition}...`);
        const client = await this.page.context().newCDPSession(this.page);
        
        switch (condition) {
            case 'Slow 3G':
                await client.send('Network.emulateNetworkConditions', {
                    offline: false,
                    downloadThroughput: 500 * 1024 / 8, // 500 kbps
                    uploadThroughput: 500 * 1024 / 8,
                    latency: 400
                });
                break;
            case 'Fast 3G':
                await client.send('Network.emulateNetworkConditions', {
                    offline: false,
                    downloadThroughput: 1.6 * 1024 * 1024 / 8,
                    uploadThroughput: 750 * 1024 / 8,
                    latency: 150
                });
                break;
            case 'Offline':
                await client.send('Network.emulateNetworkConditions', {
                    offline: true,
                    downloadThroughput: 0,
                    uploadThroughput: 0,
                    latency: 0
                });
                break;
        }
        this.log(`🐌 Rede configurada para ${condition}.`);
    }

    /**
     * 😵 Fuzz Input
     * Digita strings gigantes, emojis ou caracteres especiais.
     */
    async fuzzInput(selector: string, type: 'BigString' | 'Emojis' | 'SQLi' | 'XSS') {
        this.log(`Injetando payload ${type} em "${selector}"...`);
        const input = this.page.locator(selector).first();
        
        let payload = '';
        switch (type) {
            case 'BigString':
                payload = 'A'.repeat(1000); // 1000 chars
                break;
            case 'Emojis':
                payload = '😀😎🚀🌈🦄🔥💀👽👾🤖👻💩🐵🐶🐱🦁🐯🐻🐼🐨🐯🦁🐮🐷'; 
                break;
            case 'SQLi':
                payload = "' OR '1'='1";
                break;
            case 'XSS':
                payload = "<script>alert('XSS')</script>";
                break;
        }

        await input.fill(payload);
        this.log(`😵 Payload injetado.`);
    }

    /**
     * 🔙 Back Button Addict
     * Navega para frente e para trás rapidamente.
     */
    async crazyNavigation() {
        this.log('🔄 Iniciando navegação maluca (Back/Forward)...');
        await this.page.goBack();
        await this.page.waitForTimeout(200);
        await this.page.goForward();
        await this.page.waitForTimeout(200);
        await this.page.reload();
        this.log('🔄 Sismografia de navegação concluída.');
    }
}
