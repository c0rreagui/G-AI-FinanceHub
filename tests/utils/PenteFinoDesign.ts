import { Page } from '@playwright/test';
import { SwarmHelpers } from './SwarmHelpers';

/**
 * Módulo de Design System e Visual do Pente Fino
 */
export class PenteFinoDesign {
    constructor(private page: Page, private helper: SwarmHelpers) {}

    async checkHierarchy() {
        this.helper.log('📊 Verificando hierarquia visual...');
        
        return await this.page.evaluate(() => {
            const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            const sizes: { tag: string; size: number }[] = [];
            const issues: string[] = [];
            
            headings.forEach(tag => {
                const el = document.querySelector(tag);
                if (el) {
                    const size = parseFloat(globalThis.getComputedStyle(el).fontSize);
                    sizes.push({ tag, size });
                }
            });
            
            // Check if sizes decrease properly
            for (let i = 1; i < sizes.length; i++) {
                if (sizes[i].size >= sizes[i - 1].size) {
                    issues.push(`${sizes[i].tag} >= ${sizes[i - 1].tag}`);
                }
            }
            
            return { sizes, issues };
        });
    }

    async checkGridAlignment() {
        this.helper.log('📐 Verificando alinhamento ao grid 8px...');
        
        return await this.page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            let offGrid = 0;
            const issues: string[] = [];
            
            elements.forEach(el => {
                const style = globalThis.getComputedStyle(el);
                const values = [
                    parseFloat(style.marginTop),
                    parseFloat(style.marginBottom),
                    parseFloat(style.paddingTop),
                    parseFloat(style.paddingBottom),
                    parseFloat(style.gap) || 0
                ].filter(v => v > 0);
                
                values.forEach(v => {
                    if (v % 4 !== 0 && v > 3) { // Allow 1, 2, 3px
                        offGrid++;
                    }
                });
            });
            
            return { offGrid, percentage: offGrid > 0 ? 'Alguns valores fora do grid 4px' : 'OK' };
        });
    }

    async checkWhitespace() {
        this.helper.log('⬜ Verificando whitespace...');
        
        return await this.page.evaluate(() => {
            const body = document.body;
            const rect = body.getBoundingClientRect();
            const children = body.querySelectorAll('main, .container, [class*="container"]');
            
            let hasBalancedPadding = true;
            children.forEach(child => {
                const style = globalThis.getComputedStyle(child);
                const pl = parseFloat(style.paddingLeft);
                const pr = parseFloat(style.paddingRight);
                if (Math.abs(pl - pr) > 8) hasBalancedPadding = false;
            });
            
            return { hasBalancedPadding };
        });
    }

    async checkTokenUsage() {
        this.helper.log('🎨 Verificando uso de design tokens...');
        
        return await this.page.evaluate(() => {
            let cssVarUsage = 0;
            let hardcodedColors = 0;
            
            document.querySelectorAll('*').forEach(el => {
                const style = globalThis.getComputedStyle(el);
                const color = style.color;
                const bg = style.backgroundColor;
                
                // Count CSS var usage (simplified check)
                const computed = el.getAttribute('style') || '';
                if (computed.includes('var(--')) cssVarUsage++;
                
                // Check for hardcoded hex colors in inline styles
                if (computed.match(/#[0-9a-fA-F]{3,6}/)) hardcodedColors++;
            });
            
            return { cssVarUsage, hardcodedColors };
        });
    }

    async checkIcons() {
        this.helper.log('🔣 Verificando consistência de ícones...');
        
        return await this.page.evaluate(() => {
            const svgs = document.querySelectorAll('svg');
            const sizes = new Map<string, number>();
            const strokeWidths = new Set<string>();
            
            svgs.forEach(svg => {
                const w = svg.getAttribute('width') || svg.clientWidth.toString();
                const h = svg.getAttribute('height') || svg.clientHeight.toString();
                const size = `${w}x${h}`;
                sizes.set(size, (sizes.get(size) || 0) + 1);
                
                const stroke = svg.getAttribute('stroke-width');
                if (stroke) strokeWidths.add(stroke);
            });
            
            return {
                total: svgs.length,
                sizeVariations: sizes.size,
                strokeVariations: strokeWidths.size
            };
        });
    }

    async checkShadows() {
        this.helper.log('🌫️ Verificando sistema de sombras...');
        
        return await this.page.evaluate(() => {
            const shadows = new Set<string>();
            
            document.querySelectorAll('*').forEach(el => {
                const style = globalThis.getComputedStyle(el);
                if (style.boxShadow && style.boxShadow !== 'none') {
                    // Normalize shadow for comparison
                    shadows.add(style.boxShadow.substring(0, 40));
                }
            });
            
            return { variations: shadows.size };
        });
    }

    async checkResponsiveBreakpoints() {
        this.helper.log('📱 Verificando breakpoints...');
        
        const viewport = this.page.viewportSize();
        return await this.page.evaluate((vp) => {
            // Check viewport meta
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            const hasViewportMeta = !!viewportMeta;
            const content = viewportMeta?.getAttribute('content') || '';
            const hasWidthDevice = content.includes('width=device-width');
            
            return {
                currentWidth: vp?.width || 0,
                hasViewportMeta,
                hasWidthDevice
            };
        }, viewport);
    }

    async checkSafeArea() {
        this.helper.log('📱 Verificando safe area...');
        
        return await this.page.evaluate(() => {
            const hasSafeArea = Array.from(document.styleSheets).some(sheet => {
                try {
                    return Array.from(sheet.cssRules || []).some(rule =>
                        rule.cssText?.includes('safe-area') || rule.cssText?.includes('env(')
                    );
                } catch { return false; }
            });
            
            return { hasSafeAreaSupport: hasSafeArea };
        });
    }

    /**
     * 📊 Check breakpoint consistency across viewports
     */
    async checkBreakpointConsistency(breakpoints: number[] = [375, 768, 1024, 1440]) {
        this.helper.log('📊 Verificando consistência de breakpoints...');
        
        const results: { width: number; columns: number; gaps: string[]; issues: string[] }[] = [];
        const originalViewport = this.page.viewportSize();
        
        for (const width of breakpoints) {
            await this.page.setViewportSize({ width, height: 800 });
            await this.page.waitForTimeout(200);
            
            const data = await this.page.evaluate(() => {
                const grids = document.querySelectorAll('.grid, [class*="grid"]');
                const columns = new Set<number>();
                const gaps = new Set<string>();
                const issues: string[] = [];
                
                grids.forEach(grid => {
                    const style = globalThis.getComputedStyle(grid);
                    const cols = style.gridTemplateColumns.split(' ').filter(c => c !== '').length;
                    columns.add(cols);
                    if (style.gap) gaps.add(style.gap);
                });
                
                // Check for horizontal overflow
                if (document.body.scrollWidth > globalThis.innerWidth + 5) {
                    issues.push('Overflow horizontal');
                }
                
                return {
                    columns: Math.max(...Array.from(columns), 1),
                    gaps: Array.from(gaps),
                    issues
                };
            });
            
            results.push({ width, ...data });
        }
        
        // Restore original viewport
        if (originalViewport) {
            await this.page.setViewportSize(originalViewport);
        }
        
        // Analyze consistency
        const allGaps = results.flatMap(r => r.gaps);
        const uniqueGaps = [...new Set(allGaps)];
        
        return {
            breakpoints: results,
            gapConsistency: uniqueGaps.length <= 3 ? 'OK' : `${uniqueGaps.length} gaps diferentes`,
            hasOverflowIssues: results.some(r => r.issues.length > 0)
        };
    }

    /**
     * 🔧 Run custom rules from config
     */
    async runCustomRules(rules: { name: string; selector: string; check: string; value?: number; message: string }[]) {
        this.helper.log('🔧 Executando regras customizadas...');
        
        const results: { rule: string; passed: boolean; message: string }[] = [];
        
        for (const rule of rules) {
            const result = await this.page.evaluate((r) => {
                const elements = document.querySelectorAll(r.selector);
                
                switch (r.check) {
                    case 'exists':
                        return elements.length > 0;
                    case 'notExists':
                        return elements.length === 0;
                    case 'minSize':
                        if (elements.length === 0) return false;
                        const rect = elements[0].getBoundingClientRect();
                        return rect.width >= (r.value || 0) && rect.height >= (r.value || 0);
                    case 'maxCount':
                        return elements.length <= (r.value || 0);
                    default:
                        return true;
                }
            }, rule);
            
            results.push({
                rule: rule.name,
                passed: result,
                message: result ? `✓ ${rule.name}` : `✗ ${rule.message}`
            });
        }
        
        return {
            total: rules.length,
            passed: results.filter(r => r.passed).length,
            failed: results.filter(r => !r.passed).length,
            results
        };
    }

    /**
     * 🎨 Comprehensive color palette analysis
     */
    async checkColorPalette() {
        this.helper.log('🎨 Analisando paleta de cores...');
        
        return await this.page.evaluate(() => {
            const colors = new Map<string, number>();
            const bgColors = new Map<string, number>();
            
            document.querySelectorAll('*').forEach(el => {
                const style = globalThis.getComputedStyle(el);
                
                if (style.color && style.color !== 'rgba(0, 0, 0, 0)') {
                    colors.set(style.color, (colors.get(style.color) || 0) + 1);
                }
                if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                    bgColors.set(style.backgroundColor, (bgColors.get(style.backgroundColor) || 0) + 1);
                }
            });
            
            // Sort by frequency
            const sortedColors = Array.from(colors.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([color, count]) => ({ color, count }));
            
            const sortedBgColors = Array.from(bgColors.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([color, count]) => ({ color, count }));
            
            return {
                textColors: sortedColors,
                bgColors: sortedBgColors,
                totalTextVariations: colors.size,
                totalBgVariations: bgColors.size
            };
        });
    }
}

