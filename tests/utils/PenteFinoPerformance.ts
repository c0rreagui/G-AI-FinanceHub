import { Page } from '@playwright/test';
import { SwarmHelpers } from './SwarmHelpers';

export interface PerformanceMetrics {
    fcp?: number;
    lcp?: number;
    cls?: number;
    ttfb?: number;
    fps?: number;
    jsHeapSize?: number;
    domNodes?: number;
    jsExecutionTime?: number;
}

/**
 * Módulo de Performance do Pente Fino
 */
export class PenteFinoPerformance {
    constructor(private page: Page, private helper: SwarmHelpers) {}

    async getMetrics(): Promise<PerformanceMetrics> {
        this.helper.log('⚡ Coletando métricas de performance...');
        
        return await this.page.evaluate(() => {
            const metrics: any = {};
            
            // Paint metrics
            const paint = performance.getEntriesByType('paint');
            const fcp = paint.find(e => e.name === 'first-contentful-paint');
            if (fcp) metrics.fcp = fcp.startTime;
            
            // Navigation timing
            const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (nav) {
                metrics.ttfb = nav.responseStart - nav.requestStart;
            }
            
            // LCP
            try {
                const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
                if (lcpEntries.length) {
                    metrics.lcp = (lcpEntries[lcpEntries.length - 1] as any).startTime;
                }
            } catch {}
            
            // CLS
            try {
                let cls = 0;
                performance.getEntriesByType('layout-shift').forEach((entry: any) => {
                    if (!entry.hadRecentInput) cls += entry.value;
                });
                metrics.cls = cls;
            } catch {}
            
            // DOM nodes
            metrics.domNodes = document.querySelectorAll('*').length;
            
            // Memory (if available)
            if ((performance as any).memory) {
                metrics.jsHeapSize = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
            }
            
            return metrics;
        });
    }

    async measureFPS(durationMs = 1000): Promise<number> {
        this.helper.log('🎬 Medindo FPS...');
        
        return await this.page.evaluate((duration) => {
            return new Promise<number>((resolve) => {
                let frames = 0;
                const start = performance.now();
                
                function count() {
                    frames++;
                    if (performance.now() - start < duration) {
                        requestAnimationFrame(count);
                    } else {
                        resolve(Math.round(frames / (duration / 1000)));
                    }
                }
                requestAnimationFrame(count);
            });
        }, durationMs);
    }

    async checkImages() {
        this.helper.log('🖼️ Verificando otimização de imagens...');
        
        return await this.page.evaluate(() => {
            const images = document.querySelectorAll('img');
            const issues: string[] = [];
            let totalSize = 0;
            let noLazy = 0;
            let noWebP = 0;
            
            images.forEach(img => {
                // Check lazy loading
                if (!img.loading || img.loading !== 'lazy') {
                    const rect = img.getBoundingClientRect();
                    if (rect.top > globalThis.innerHeight) noLazy++;
                }
                
                // Check WebP
                const src = img.src || img.currentSrc;
                if (src && !src.includes('.webp') && !src.includes('data:')) {
                    noWebP++;
                }
                
                // Check sizes attribute
                if (!img.sizes && img.srcset) {
                    issues.push('Imagem com srcset sem sizes');
                }
            });
            
            return { total: images.length, noLazy, noWebP, issues: issues.slice(0, 3) };
        });
    }

    async checkBundleSize() {
        this.helper.log('📦 Verificando tamanho de recursos...');
        
        return await this.page.evaluate(() => {
            const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            let totalJS = 0;
            let totalCSS = 0;
            let totalImages = 0;
            
            resources.forEach(r => {
                const size = r.transferSize || 0;
                if (r.name.includes('.js')) totalJS += size;
                else if (r.name.includes('.css')) totalCSS += size;
                else if (r.name.match(/\.(png|jpg|jpeg|gif|webp|svg)/)) totalImages += size;
            });
            
            return {
                js: Math.round(totalJS / 1024),
                css: Math.round(totalCSS / 1024),
                images: Math.round(totalImages / 1024),
                total: Math.round((totalJS + totalCSS + totalImages) / 1024)
            };
        });
    }

    async checkAnimations() {
        this.helper.log('🎬 Verificando animações...');
        
        return await this.page.evaluate(() => {
            let backdropFilterCount = 0;
            let infiniteAnimations = 0;
            let heavyTransitions = 0;
            const animations: string[] = [];
            
            document.querySelectorAll('*').forEach(el => {
                const style = globalThis.getComputedStyle(el);
                
                if (style.backdropFilter && style.backdropFilter !== 'none') {
                    backdropFilterCount++;
                }
                
                if (style.animationName && style.animationName !== 'none') {
                    animations.push(style.animationName);
                    if (style.animationIterationCount === 'infinite') {
                        const duration = Number.parseFloat(style.animationDuration);
                        if (duration < 0.3) infiniteAnimations++;
                    }
                }
                
                // Check for layout-triggering transitions
                if (style.transition.includes('width') || 
                    style.transition.includes('height') ||
                    style.transition.includes('top') ||
                    style.transition.includes('left')) {
                    heavyTransitions++;
                }
            });
            
            return {
                backdropFilterCount,
                infiniteAnimations,
                heavyTransitions,
                uniqueAnimations: [...new Set(animations)].length
            };
        });
    }

    async checkReducedMotion() {
        this.helper.log('🎭 Verificando suporte a reduced motion...');
        
        return await this.page.evaluate(() => {
            // Check if CSS respects prefers-reduced-motion
            const hasMediaQuery = Array.from(document.styleSheets).some(sheet => {
                try {
                    return Array.from(sheet.cssRules || []).some(rule => 
                        rule.cssText?.includes('prefers-reduced-motion')
                    );
                } catch { return false; }
            });
            
            return { hasReducedMotionSupport: hasMediaQuery };
        });
    }

    /**
     * 🌊 Network Waterfall Analysis
     */
    async checkNetworkWaterfall() {
        this.helper.log('🌊 Analisando network waterfall...');
        
        return await this.page.evaluate(() => {
            const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            
            const waterfall = resources.map(r => ({
                name: r.name.split('/').pop() || r.name,
                type: r.initiatorType,
                duration: Math.round(r.duration),
                size: r.transferSize || 0,
                blocked: Math.round(r.fetchStart - r.startTime),
                dns: Math.round(r.domainLookupEnd - r.domainLookupStart),
                connect: Math.round(r.connectEnd - r.connectStart),
                wait: Math.round(r.responseStart - r.requestStart),
                receive: Math.round(r.responseEnd - r.responseStart)
            })).sort((a, b) => b.duration - a.duration);

            const slowest = waterfall.slice(0, 5);
            const totalDuration = resources.reduce((sum, r) => sum + r.duration, 0);
            const renderBlocking = resources.filter(r => 
                r.initiatorType === 'link' || 
                (r.initiatorType === 'script' && !r.name.includes('async'))
            ).length;

            return {
                totalResources: resources.length,
                totalDuration: Math.round(totalDuration),
                renderBlocking,
                slowest
            };
        });
    }

    /**
     * 📱 Landscape/Portrait check
     */
    async checkOrientation() {
        this.helper.log('📱 Verificando orientação...');
        
        const viewport = this.page.viewportSize();
        if (!viewport) return { orientation: 'unknown' };
        
        const isLandscape = viewport.width > viewport.height;
        
        return await this.page.evaluate((landscape) => {
            // Check if layout adapts to orientation
            const body = document.body;
            const hasOrientationMedia = Array.from(document.styleSheets).some(sheet => {
                try {
                    return Array.from(sheet.cssRules || []).some(rule =>
                        rule.cssText?.includes('orientation')
                    );
                } catch { return false; }
            });

            return {
                orientation: landscape ? 'landscape' : 'portrait',
                hasOrientationSupport: hasOrientationMedia,
                aspectRatio: landscape ? 'wide' : 'tall'
            };
        }, isLandscape);
    }
}

