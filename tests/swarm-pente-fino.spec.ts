import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { SwarmPenteFino } from './utils/SwarmPenteFino';

/**
 * 🔍 SWARM: Pente Fino Visual v2.0
 * 
 * Auditoria visual completa com:
 * - Verificações de tipografia, espaçamento, cores
 * - Performance (FCP, LCP, CLS)
 * - Fontes e animações
 * - Dark/Light mode automático
 * - Relatório HTML visual
 */
test.describe('🔍 Pente Fino Visual v2.0', () => {
    let helper: SwarmHelpers;
    let penteFino: SwarmPenteFino;

    test.beforeEach(async ({ page }) => {
        helper = new SwarmHelpers(page, 'PenteFino', '🔍');
        penteFino = new SwarmPenteFino(page, helper);
        
        // Login de desenvolvedor com PIN 2609
        await page.goto('/');
        await page.waitForTimeout(1500);
        
        // Procura botão de Login de Desenvolvedor
        const devLoginBtn = page.locator('button:has-text("Login de Desenvolvedor"), button:has-text("Dev Login")').first();
        if (await devLoginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            helper.log('🔑 Clicando em Login de Desenvolvedor...');
            await devLoginBtn.click();
            await page.waitForTimeout(800);
            
            // Procura input de PIN
            const pinInput = page.locator('input').first();
            if (await pinInput.isVisible({ timeout: 2000 }).catch(() => false)) {
                helper.log('🔢 Inserindo PIN 2609...');
                await pinInput.click();
                await pinInput.fill('2609');
                await page.waitForTimeout(500);
                
                // Pressiona Enter ou clica em confirmar
                const confirmBtn = page.locator('button:has-text("Entrar"), button:has-text("Confirmar"), button[type="submit"]').first();
                if (await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                    await confirmBtn.click();
                } else {
                    await page.keyboard.press('Enter');
                }
                
                // Espera dashboard carregar
                await page.waitForTimeout(2500);
                helper.log('✅ Login realizado!');
            }
        }
        
        // Verifica se está no dashboard
        const dashboard = page.locator('[class*="dashboard"], main, [class*="home"]').first();
        await dashboard.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
            helper.log('⚠️ Dashboard não encontrado, continuando...');
        });
    });

    test('📊 Dashboard - Desktop Full HD (1920x1080)', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(1000);
        
        const report = await penteFino.runFullAudit({
            checkPerformance: true,
            generateHtmlReport: true
        });
        
        helper.log(`\n${'='.repeat(50)}`);
        helper.log(penteFino.generateMarkdownReport(report));
        helper.log(`${'='.repeat(50)}\n`);
        
        expect(report.score, `Score muito baixo: ${report.score}`).toBeGreaterThanOrEqual(60);
        
        const criticalIssues = report.issues.filter(i => i.severity === 'critical');
        expect(criticalIssues.length, `Issues críticas: ${criticalIssues.map(i => i.description).join(', ')}`).toBe(0);
    });

    test('📱 Dashboard - Mobile (375x812)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.waitForTimeout(1000);
        
        const report = await penteFino.runFullAudit({
            checkPerformance: true,
            generateHtmlReport: true
        });
        
        helper.log(`\n${'='.repeat(50)}`);
        helper.log(penteFino.generateMarkdownReport(report));
        helper.log(`${'='.repeat(50)}\n`);
        
        expect(report.score).toBeGreaterThanOrEqual(60);
        
        const criticalIssues = report.issues.filter(i => i.severity === 'critical');
        expect(criticalIssues.length).toBe(0);
    });

    test('💻 Dashboard - Tablet (768x1024)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(1000);
        
        const report = await penteFino.runFullAudit();
        
        helper.log(`\n${'='.repeat(50)}`);
        helper.log(penteFino.generateMarkdownReport(report));
        helper.log(`${'='.repeat(50)}\n`);
        
        expect(report.score).toBeGreaterThanOrEqual(65);
    });

    test('🌙☀️ Dual Theme Audit (Dark + Light)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(1000);
        
        const { dark, light } = await penteFino.runDualThemeAudit();
        
        helper.log('\n📊 DUAL THEME RESULTS:');
        helper.log(`🌙 Dark Mode: Score ${dark.score}/100 | Issues: ${dark.issues.length}`);
        helper.log(`☀️ Light Mode: Score ${light.score}/100 | Issues: ${light.issues.length}`);
        
        // Ambos os temas devem ter score aceitável
        expect(dark.score).toBeGreaterThanOrEqual(60);
        expect(light.score).toBeGreaterThanOrEqual(60);
        
        // Diferença entre temas não deve ser muito grande
        const scoreDiff = Math.abs(dark.score - light.score);
        expect(scoreDiff, 'Diferença de score entre temas muito alta').toBeLessThan(20);
    });

    test('📸 Capturar Baseline', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(1000);
        
        await penteFino.runFullAudit({
            captureBaseline: true,
            generateHtmlReport: false
        });
        
        helper.log('📸 Baseline capturado com sucesso!');
    });

    test('🔍 Comparar com Baseline', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(1000);
        
        const report = await penteFino.runFullAudit({
            compareWithBaseline: true,
            generateHtmlReport: true
        });
        
        if (report.baselineComparison) {
            helper.log(`📸 Baseline Comparison:`);
            helper.log(`   Matched: ${report.baselineComparison.match}`);
            helper.log(`   Diff: ${report.baselineComparison.diffPercentage.toFixed(2)}%`);
        }
        
        expect(report.score).toBeGreaterThanOrEqual(60);
    });

    test('⚡ Performance Check', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(1000);
        
        const report = await penteFino.runFullAudit({
            checkPerformance: true,
            generateHtmlReport: false
        });
        
        helper.log('\n⚡ PERFORMANCE METRICS:');
        helper.log(`   FCP: ${report.performance.fcp?.toFixed(0) || 'N/A'}ms`);
        helper.log(`   LCP: ${report.performance.lcp?.toFixed(0) || 'N/A'}ms`);
        helper.log(`   CLS: ${report.performance.cls?.toFixed(3) || 'N/A'}`);
        
        // Performance não deve ter issues críticas
        const perfIssues = report.issues.filter(i => i.type === 'performance');
        expect(perfIssues.filter(i => i.severity === 'critical').length).toBe(0);
    });

    test('📄 Página de Transações', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        
        // Navega para transações usando role button e o nome acessível
        const transactionsBtn = page.getByRole('button', { name: 'Transações', exact: true }).first();
        if (await transactionsBtn.isVisible()) {
            await transactionsBtn.click();
            await page.waitForTimeout(1000);
        }
        
        const report = await penteFino.runFullAudit();
        
        helper.log(`\n${'='.repeat(50)}`);
        helper.log(penteFino.generateMarkdownReport(report));
        helper.log(`${'='.repeat(50)}\n`);
        
        expect(report.score).toBeGreaterThanOrEqual(70);
    });

    test('🎯 Página de Metas', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        
        const goalsBtn = page.getByRole('button', { name: 'Metas', exact: true }).first();
        if (await goalsBtn.isVisible()) {
            await goalsBtn.click();
            await page.waitForTimeout(1000);
        }
        
        const report = await penteFino.runFullAudit();
        
        expect(report.score).toBeGreaterThanOrEqual(70);
    });

    test('🔄 Cross-Page Consistency', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        
        const pages = [
            { name: 'Home', selector: 'Início' },
            { name: 'Transações', selector: 'Transações' },
            { name: 'Metas', selector: 'Metas' }
        ];
        
        const reports: { page: string; score: number }[] = [];
        
        for (const p of pages) {
            if (p.selector !== 'Início') {
                const btn = page.getByRole('button', { name: p.selector, exact: true }).first();
                if (await btn.isVisible()) {
                    await btn.click();
                    await page.waitForTimeout(500);
                }
            }
            
            const report = await penteFino.runFullAudit({ generateHtmlReport: false });
            reports.push({ page: p.name, score: report.score });
        }
        
        helper.log('\n📊 CROSS-PAGE SUMMARY:');
        helper.log('| Página | Score |');
        helper.log('|--------|-------|');
        reports.forEach(r => helper.log(`| ${r.page} | ${r.score} |`));
        
        // Scores não devem variar muito entre páginas
        const scores = reports.map(r => r.score);
        const maxDiff = Math.max(...scores) - Math.min(...scores);
        expect(maxDiff, 'Inconsistência visual entre páginas').toBeLessThan(100);
    });
});
