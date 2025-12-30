import { Page } from '@playwright/test';
import { SwarmHelpers } from './SwarmHelpers';

/**
 * Módulo de Acessibilidade do Pente Fino
 */
export class PenteFinoA11y {
    constructor(private page: Page, private helper: SwarmHelpers) {}

    async checkARIA() {
        this.helper.log('♿ Verificando ARIA...');
        return await this.page.evaluate(() => {
            const issues: string[] = [];
            
            // Buttons without accessible name
            document.querySelectorAll('button').forEach(btn => {
                const name = btn.getAttribute('aria-label') || btn.textContent?.trim();
                if (!name) issues.push('Button sem nome acessível');
            });

            // Images without alt
            document.querySelectorAll('img').forEach(img => {
                if (!img.alt) issues.push('Imagem sem alt');
            });

            // Form inputs without labels
            document.querySelectorAll('input, select, textarea').forEach(input => {
                const id = input.id;
                const label = id ? document.querySelector(`label[for="${id}"]`) : null;
                const ariaLabel = input.getAttribute('aria-label');
                if (!label && !ariaLabel) issues.push(`Input sem label: ${input.type}`);
            });

            // Interactive elements without role
            document.querySelectorAll('[onclick]').forEach(el => {
                if (!el.getAttribute('role') && el.tagName !== 'BUTTON' && el.tagName !== 'A') {
                    issues.push('Elemento clicável sem role');
                }
            });

            return issues.slice(0, 10);
        });
    }

    async checkTabOrder() {
        this.helper.log('⌨️ Verificando tab order...');
        return await this.page.evaluate(() => {
            const focusables = Array.from(document.querySelectorAll(
                'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ));
            
            const issues: string[] = [];
            let lastTop = 0;
            
            focusables.forEach((el, i) => {
                const rect = el.getBoundingClientRect();
                const tabIndex = parseInt(el.getAttribute('tabindex') || '0');
                
                // Check for positive tabindex (anti-pattern)
                if (tabIndex > 0) {
                    issues.push(`tabindex positivo: ${tabIndex}`);
                }
                
                // Check if tab order matches visual order (simplified)
                if (rect.top < lastTop - 50) {
                    issues.push('Tab order pode não seguir ordem visual');
                }
                lastTop = rect.top;
            });
            
            return { total: focusables.length, issues: issues.slice(0, 5) };
        });
    }

    async checkSkipLinks() {
        this.helper.log('🔗 Verificando skip links...');
        return await this.page.evaluate(() => {
            const skipLink = document.querySelector('a[href="#main"], a[href="#content"], .skip-link');
            return { hasSkipLink: !!skipLink };
        });
    }

    async checkKeyboardNav() {
        this.helper.log('⌨️ Verificando navegação por teclado...');
        return await this.page.evaluate(() => {
            const interactive = document.querySelectorAll('button, a, input, select, [role="button"]');
            let noFocusStyle = 0;
            
            interactive.forEach(el => {
                const style = globalThis.getComputedStyle(el);
                // Check if focus is removed (bad practice)
                if (style.outline === 'none' && !el.className.includes('focus')) {
                    noFocusStyle++;
                }
            });
            
            return { total: interactive.length, noFocusStyle };
        });
    }

    async checkColorBlindness() {
        this.helper.log('🎨 Verificando para daltonismo...');
        return await this.page.evaluate(() => {
            // Check if color is the only differentiator
            const issues: string[] = [];
            
            // Check for red/green combinations (problematic for deuteranopia)
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                const style = globalThis.getComputedStyle(btn);
                const bg = style.backgroundColor;
                if (bg.includes('rgb(') && !btn.textContent?.trim() && !btn.querySelector('svg')) {
                    issues.push('Botão depende apenas de cor');
                }
            });
            
            return issues.slice(0, 5);
        });
    }

    async checkTouchTargets() {
        this.helper.log('👆 Verificando touch targets (44x44px)...');
        return await this.page.evaluate(() => {
            const interactive = document.querySelectorAll('button, a, input, [role="button"]');
            const tooSmall: string[] = [];
            
            interactive.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    if (rect.width < 44 || rect.height < 44) {
                        tooSmall.push(`${el.tagName}: ${Math.round(rect.width)}x${Math.round(rect.height)}px`);
                    }
                }
            });
            
            return { total: interactive.length, tooSmall: tooSmall.slice(0, 5) };
        });
    }

    /**
     * 🔊 Screen Reader Compatibility Check
     */
    async checkScreenReader() {
        this.helper.log('🔊 Verificando compatibilidade com screen readers...');
        
        return await this.page.evaluate(() => {
            const issues: string[] = [];
            const fixes: { element: string; issue: string; fix: string }[] = [];
            
            // Check for live regions
            const liveRegions = document.querySelectorAll('[aria-live], [role="alert"], [role="status"]');
            
            // Check for landmark roles
            const landmarks = {
                main: document.querySelector('main, [role="main"]'),
                nav: document.querySelector('nav, [role="navigation"]'),
                banner: document.querySelector('header, [role="banner"]'),
                contentinfo: document.querySelector('footer, [role="contentinfo"]')
            };
            
            const missingLandmarks: string[] = [];
            if (!landmarks.main) missingLandmarks.push('main');
            if (!landmarks.nav) missingLandmarks.push('navigation');
            
            // Check for heading structure
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const h1Count = document.querySelectorAll('h1').length;
            if (h1Count === 0) issues.push('Sem h1 na página');
            if (h1Count > 1) issues.push(`Múltiplos h1: ${h1Count}`);
            
            // Check for accessible names on interactive elements
            document.querySelectorAll('button, a, input').forEach(el => {
                const hasAccessibleName = 
                    el.getAttribute('aria-label') ||
                    el.getAttribute('aria-labelledby') ||
                    el.textContent?.trim() ||
                    (el as HTMLInputElement).placeholder;
                    
                if (!hasAccessibleName) {
                    fixes.push({
                        element: el.tagName,
                        issue: 'Sem nome acessível',
                        fix: 'Adicione aria-label="descrição"'
                    });
                }
            });
            
            // Check for form associations
            document.querySelectorAll('input, select, textarea').forEach(input => {
                const id = input.id;
                const hasLabel = id && document.querySelector(`label[for="${id}"]`);
                const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
                
                if (!hasLabel && !hasAriaLabel) {
                    fixes.push({
                        element: `input[type="${(input as HTMLInputElement).type || 'text'}"]`,
                        issue: 'Input sem label associado',
                        fix: 'Adicione <label for="id"> ou aria-label'
                    });
                }
            });
            
            return {
                liveRegions: liveRegions.length,
                missingLandmarks,
                headingCount: headings.length,
                issues: issues.slice(0, 5),
                fixes: fixes.slice(0, 5)
            };
        });
    }

    /**
     * 🔧 Auto-fix Suggestions
     */
    async getAutoFixSuggestions() {
        this.helper.log('🔧 Gerando sugestões de auto-fix...');
        
        return await this.page.evaluate(() => {
            const suggestions: { selector: string; issue: string; fix: string; code: string }[] = [];
            
            // Images without alt
            document.querySelectorAll('img:not([alt])').forEach((img, i) => {
                suggestions.push({
                    selector: `img:nth-of-type(${i + 1})`,
                    issue: 'Imagem sem atributo alt',
                    fix: 'Adicionar alt descritivo',
                    code: `<img src="..." alt="Descrição da imagem" />`
                });
            });
            
            // Buttons without accessible name
            document.querySelectorAll('button').forEach((btn, i) => {
                if (!btn.textContent?.trim() && !btn.getAttribute('aria-label')) {
                    suggestions.push({
                        selector: `button:nth-of-type(${i + 1})`,
                        issue: 'Botão sem texto ou aria-label',
                        fix: 'Adicionar aria-label',
                        code: `<button aria-label="Descrição da ação">...</button>`
                    });
                }
            });
            
            // Links without href or empty
            document.querySelectorAll('a').forEach((link, i) => {
                if (!link.href || link.href === '#' || link.href.endsWith('#')) {
                    if (!link.getAttribute('role')) {
                        suggestions.push({
                            selector: `a:nth-of-type(${i + 1})`,
                            issue: 'Link com href="#" ou vazio',
                            fix: 'Usar button ou adicionar role="button"',
                            code: `<button type="button">...</button>`
                        });
                    }
                }
            });
            
            // Missing viewport meta
            if (!document.querySelector('meta[name="viewport"]')) {
                suggestions.push({
                    selector: 'head',
                    issue: 'Sem meta viewport',
                    fix: 'Adicionar meta viewport',
                    code: `<meta name="viewport" content="width=device-width, initial-scale=1" />`
                });
            }
            
            // Missing lang attribute
            if (!document.documentElement.lang) {
                suggestions.push({
                    selector: 'html',
                    issue: 'Sem atributo lang',
                    fix: 'Adicionar lang ao html',
                    code: `<html lang="pt-BR">`
                });
            }
            
            return suggestions.slice(0, 10);
        });
    }

    /**
     * 📋 Heading Structure Analysis
     */
    async checkHeadingStructure() {
        this.helper.log('📋 Analisando estrutura de headings...');
        
        return await this.page.evaluate(() => {
            const headings: { level: number; text: string; issues: string[] }[] = [];
            let lastLevel = 0;
            const issues: string[] = [];
            
            document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
                const level = parseInt(h.tagName.substring(1));
                const text = h.textContent?.trim().substring(0, 30) || '';
                const headingIssues: string[] = [];
                
                // Check for skipped levels
                if (level > lastLevel + 1 && lastLevel > 0) {
                    headingIssues.push(`Pulou nível: h${lastLevel} -> h${level}`);
                    issues.push(`Heading h${level} pula nível`);
                }
                
                // Check for empty headings
                if (!text) {
                    headingIssues.push('Heading vazio');
                    issues.push(`h${level} vazio`);
                }
                
                headings.push({ level, text, issues: headingIssues });
                lastLevel = level;
            });
            
            return {
                headings,
                issues,
                structure: headings.map(h => `h${h.level}`).join(' > ')
            };
        });
    }
}

