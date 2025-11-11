// utils/haptics.ts
import { logger } from '../services/loggingService';

/**
 * Dispara uma vibração sutil para fornecer feedback tátil.
 * Usa a API de Vibração do navegador.
 * @param duration A duração da vibração em milissegundos.
 */
export const triggerHapticFeedback = (duration: number = 10): void => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (error) {
      logger.warn('Não foi possível acionar o feedback tátil.', { error });
    }
  }
};