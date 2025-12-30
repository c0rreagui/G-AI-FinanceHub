import { useCallback } from 'react';

// Note: In a real app, you would preload these audio files
// For this demo, we'll use simple synthesized beeps if possible or placeholders
// Since we can't easily add assets, we'll assume they exist in /sounds/ or use AudioContext

export const useSound = () => {
  const play = useCallback((type: 'click' | 'success' | 'error' | 'notification') => {
    // Simple AudioContext beep for demo purposes without external assets
    try {
        const AudioContext = globalThis.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const now = ctx.currentTime;
        
        if (type === 'click') {
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.05, now);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            gain.gain.setValueAtTime(0.05, now);
            osc.start(now);
            osc.stop(now + 0.2);
        }
    } catch (e) {
        console.error("Audio playback failed", e);
    }
  }, []);

  return { play };
};
