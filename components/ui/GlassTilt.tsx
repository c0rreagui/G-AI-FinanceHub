import React, { useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/utils';

interface GlassTiltProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const GlassTilt: React.FC<GlassTiltProps> = ({ children, className, intensity = 15 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    setRotateX(yPct * -intensity);
    setRotateY(xPct * intensity);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("glass-card relative overflow-hidden transform-gpu", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ transform: "translateZ(50px)" }}>
        {children}
      </div>
      {/* Glossy reflection */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{ transform: "translateZ(20px)" }}
      />
    </motion.div>
  );
};
