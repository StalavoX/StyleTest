/**
 * Componente Botón Reutilizable (Button).
 * Soporta animaciones framer-motion, estado de carga (loading), variantes de color e iconos.
 */
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

// Mapeo de estilos CSS por variante visual
const variants: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
  ghost: 'hover:bg-white/5 text-slate-300',
  danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20',
  outline: 'border border-white/15 hover:border-white/30 text-slate-200 hover:bg-white/5',
};

// Mapeo de tamaños de botón
const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export function Button({ variant = 'primary', size = 'md', loading, icon, fullWidth, children, className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children as React.ReactNode}
    </motion.button>
  );
}
