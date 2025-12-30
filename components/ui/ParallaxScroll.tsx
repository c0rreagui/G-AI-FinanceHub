import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxScrollProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const ParallaxScroll: React.FC<ParallaxScrollProps> = ({ children, offset = 50, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
};
