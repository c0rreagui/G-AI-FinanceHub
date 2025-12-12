/**
 * User Interaction Tracker
 * Rastreia TODAS as interações do usuário com a UI em tempo real
 */

import { telemetry, EventCategory } from './telemetryService';

interface InteractionEvent {
    type: 'click' | 'input' | 'focus' | 'blur' | 'keypress' | 'change' | 'submit' | 'scroll';
    timestamp: number;
    target: {
        tagName: string;
        id?: string;
        className?: string;
        name?: string;
        type?: string;
        value?: string;
        placeholder?: string;
        textContent?: string;
    };
    position?: {
        x: number;
        y: number;
    };
    key?: string;
    inputValue?: string;
    previousValue?: string;
}

class UserInteractionTracker {
    private interactions: InteractionEvent[] = [];
    private maxInteractions = 100; // Últimas 100 interações
    private isTracking = false;
    private inputValues: Map<Element, string> = new Map(); // Rastreia valores anteriores

    /**
     * Inicia o rastreamento
     */
    start(): void {
        if (this.isTracking) return;
        this.isTracking = true;

        // Click events
        document.addEventListener('click', this.handleClick, true);
        
        // Input events
        document.addEventListener('input', this.handleInput, true);
        
        // Focus/Blur events
        document.addEventListener('focus', this.handleFocus, true);
        document.addEventListener('blur', this.handleBlur, true);
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown, true);
        
        // Form events
        document.addEventListener('change', this.handleChange, true);
        document.addEventListener('submit', this.handleSubmit, true);
        
        // Scroll events (debounced)
        let scrollTimeout: number;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 200) as any;
        }, true);

        console.log('🎯 User Interaction Tracker: ACTIVE');
    }

    /**
     * Para o rastreamento
     */
    stop(): void {
        if (!this.isTracking) return;
        this.isTracking = false;

        document.removeEventListener('click', this.handleClick, true);
        document.removeEventListener('input', this.handleInput, true);
        document.removeEventListener('focus', this.handleFocus, true);
        document.removeEventListener('blur', this.handleBlur, true);
        document.removeEventListener('keydown', this.handleKeyDown, true);
        document.removeEventListener('change', this.handleChange, true);
        document.removeEventListener('submit', this.handleSubmit, true);

        console.log('🎯 User Interaction Tracker: STOPPED');
    }

    /**
     * Handler para clicks
     */
    private handleClick = (e: MouseEvent): void => {
        const target = e.target as HTMLElement;
        
        const interaction: InteractionEvent = {
            type: 'click',
            timestamp: Date.now(),
            target: this.extractTargetInfo(target),
            position: {
                x: e.clientX,
                y: e.clientY,
            },
        };

        this.recordInteraction(interaction);

        // Registra no telemetry
        telemetry.trackUserAction('CLICK', this.getTargetDescription(target), {
            position: { x: e.clientX, y: e.clientY },
            targetInfo: interaction.target,
        });
    };

    /**
     * Handler para inputs
     */
    private handleInput = (e: Event): void => {
        const target = e.target as HTMLInputElement;
        const previousValue = this.inputValues.get(target) || '';
        const currentValue = target.value;

        const interaction: InteractionEvent = {
            type: 'input',
            timestamp: Date.now(),
            target: this.extractTargetInfo(target),
            inputValue: this.sanitizeValue(currentValue),
            previousValue: this.sanitizeValue(previousValue),
        };

        this.recordInteraction(interaction);
        this.inputValues.set(target, currentValue);

        // Registra no telemetry (sem valores sensíveis)
        telemetry.trackUserAction('INPUT_CHANGE', this.getTargetDescription(target), {
            field: target.name || target.id || target.placeholder,
            valueLength: currentValue.length,
            previousLength: previousValue.length,
            inputType: target.type,
        });
    };

    /**
     * Handler para focus
     */
    private handleFocus = (e: FocusEvent): void => {
        const target = e.target as HTMLElement;
        
        const interaction: InteractionEvent = {
            type: 'focus',
            timestamp: Date.now(),
            target: this.extractTargetInfo(target),
        };

        this.recordInteraction(interaction);

        telemetry.trackUserAction('FIELD_FOCUS', this.getTargetDescription(target), {
            targetInfo: interaction.target,
        });
    };

    /**
     * Handler para blur
     */
    private handleBlur = (e: FocusEvent): void => {
        const target = e.target as HTMLElement;
        
        const interaction: InteractionEvent = {
            type: 'blur',
            timestamp: Date.now(),
            target: this.extractTargetInfo(target),
        };

        this.recordInteraction(interaction);

        telemetry.trackUserAction('FIELD_BLUR', this.getTargetDescription(target), {
            targetInfo: interaction.target,
        });
    };

    /**
     * Handler para keydown
     */
    private handleKeyDown = (e: KeyboardEvent): void => {
        // Ignora teclas de modificação sozinhas
        if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;

        const target = e.target as HTMLElement;
        
        const interaction: InteractionEvent = {
            type: 'keypress',
            timestamp: Date.now(),
            target: this.extractTargetInfo(target),
            key: e.key === ' ' ? 'Space' : e.key,
        };

        this.recordInteraction(interaction);

        // Só registra teclas especiais no telemetry
        if (['Enter', 'Escape', 'Tab', 'Backspace', 'Delete'].includes(e.key)) {
            telemetry.trackUserAction('KEY_PRESS', this.getTargetDescription(target), {
                key: e.key,
                targetInfo: interaction.target,
            });
        }
    };

    /**
     * Handler para change (selects, checkboxes, radios)
     */
    private handleChange = (e: Event): void => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        
        const interaction: InteractionEvent = {
            type: 'change',
            timestamp: Date.now(),
            target: this.extractTargetInfo(target),
            inputValue: this.sanitizeValue(target.value),
        };

        this.recordInteraction(interaction);

        telemetry.trackUserAction('FIELD_CHANGE', this.getTargetDescription(target), {
            field: target.name || target.id,
            type: (target as HTMLInputElement).type,
            value: target.type === 'checkbox' ? (target as HTMLInputElement).checked : undefined,
        });
    };

    /**
     * Handler para submit
     */
    private handleSubmit = (e: Event): void => {
        const target = e.target as HTMLFormElement;
        
        const interaction: InteractionEvent = {
            type: 'submit',
            timestamp: Date.now(),
            target: this.extractTargetInfo(target),
        };

        this.recordInteraction(interaction);

        telemetry.trackUserAction('FORM_SUBMIT', this.getTargetDescription(target), {
            formId: target.id,
            formName: target.name,
            fieldCount: target.elements.length,
        });
    };

    /**
     * Handler para scroll
     */
    private handleScroll = (): void => {
        const interaction: InteractionEvent = {
            type: 'scroll',
            timestamp: Date.now(),
            target: {
                tagName: 'WINDOW',
            },
            position: {
                x: window.scrollX,
                y: window.scrollY,
            },
        };

        this.recordInteraction(interaction);
    };

    /**
     * Extrai informações do elemento alvo
     */
    private extractTargetInfo(element: HTMLElement): InteractionEvent['target'] {
        return {
            tagName: element.tagName,
            id: element.id || undefined,
            className: element.className || undefined,
            name: (element as any).name || undefined,
            type: (element as any).type || undefined,
            placeholder: (element as any).placeholder || undefined,
            textContent: element.textContent?.substring(0, 50) || undefined,
        };
    }

    /**
     * Gera descrição legível do target
     */
    private getTargetDescription(element: HTMLElement): string {
        if (element.id) return `#${element.id}`;
        if ((element as any).name) return `[name="${(element as any).name}"]`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    }

    /**
     * Sanitiza valores (remove dados sensíveis)
     */
    private sanitizeValue(value: string): string {
        if (!value) return '';
        
        // Se parece com senha, email, CPF, etc, oculta
        if (value.length > 100) return '[LONG_VALUE]';
        
        // Retorna apenas tamanho para campos sensíveis
        return `[${value.length} chars]`;
    }

    /**
     * Registra interação no histórico
     */
    private recordInteraction(interaction: InteractionEvent): void {
        this.interactions.unshift(interaction);
        
        // Limita tamanho
        if (this.interactions.length > this.maxInteractions) {
            this.interactions = this.interactions.slice(0, this.maxInteractions);
        }
    }

    /**
     * Obtém últimas N interações
     */
    getRecentInteractions(count: number = 20): InteractionEvent[] {
        return this.interactions.slice(0, count);
    }

    /**
     * Obtém todas as interações
     */
    getAllInteractions(): InteractionEvent[] {
        return [...this.interactions];
    }

    /**
     * Gera resumo formatado das interações
     */
    generateInteractionSummary(count: number = 10): string {
        const recent = this.getRecentInteractions(count);
        
        return recent.map((interaction, index) => {
            const time = new Date(interaction.timestamp).toLocaleTimeString();
            const target = this.formatTargetForSummary(interaction.target);
            
            switch (interaction.type) {
                case 'click':
                    return `${index + 1}. [${time}] 🖱️ CLICK on ${target}`;
                
                case 'input':
                    return `${index + 1}. [${time}] ⌨️ INPUT in ${target}: ${interaction.inputValue}`;
                
                case 'focus':
                    return `${index + 1}. [${time}] 🎯 FOCUS on ${target}`;
                
                case 'blur':
                    return `${index + 1}. [${time}] 👁️ BLUR from ${target}`;
                
                case 'keypress':
                    return `${index + 1}. [${time}] ⌨️ KEY "${interaction.key}" on ${target}`;
                
                case 'change':
                    return `${index + 1}. [${time}] 🔄 CHANGE in ${target}`;
                
                case 'submit':
                    return `${index + 1}. [${time}] 📤 SUBMIT form ${target}`;
                
                case 'scroll':
                    return `${index + 1}. [${time}] 📜 SCROLL to (${interaction.position?.x}, ${interaction.position?.y})`;
                
                default:
                    return `${index + 1}. [${time}] ${interaction.type} on ${target}`;
            }
        }).join('\n');
    }

    /**
     * Formata target para resumo
     */
    private formatTargetForSummary(target: InteractionEvent['target']): string {
        if (target.id) return `#${target.id}`;
        if (target.name) return `[name="${target.name}"]`;
        if (target.placeholder) return `[placeholder="${target.placeholder}"]`;
        if (target.textContent) return `"${target.textContent}"`;
        return target.tagName;
    }

    /**
     * Limpa histórico
     */
    clear(): void {
        this.interactions = [];
        this.inputValues.clear();
    }
}

// Singleton instance
export const userInteractionTracker = new UserInteractionTracker();

// Auto-start quando módulo é importado
userInteractionTracker.start();

// Export para uso global
if (typeof window !== 'undefined') {
    (window as any).__USER_TRACKER__ = userInteractionTracker;
}
