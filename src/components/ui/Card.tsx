/**
 * Componente Tarjeta (Card) estilizado con bordes suaves y animación al pasar el cursor (hover).
 */
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      onClick={onClick}
      className={`bg-slate-800/60 border border-white/10 rounded-2xl ${hover ? 'cursor-pointer hover:border-white/20 transition-colors' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
