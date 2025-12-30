import React from 'react';
import { Smartphone, Box } from 'lucide-react';
import { Button } from './Button';

export const ARVisualization = () => {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-black/90 flex flex-col items-center justify-center text-white p-6 border border-white/10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center" />
      
      <Box className="h-16 w-16 mb-4 text-primary animate-bounce" />
      
      <h3 className="text-xl font-bold mb-2">Visualização AR</h3>
      <p className="text-center text-gray-400 mb-6 max-w-md">
        Aponte sua câmera para visualizar seus cartões e metas financeiras em Realidade Aumentada no seu ambiente.
      </p>
      
      <Button className="gap-2 z-10">
        <Smartphone className="h-4 w-4" />
        Iniciar Experiência AR
      </Button>
      
      <div className="absolute bottom-4 text-xs text-gray-500">
        Requer dispositivo compatível com WebXR
      </div>
    </div>
  );
};
