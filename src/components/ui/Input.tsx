/**
 * Componentes de Formulario Reutilizables (Input, Select, Textarea).
 * Incluyen soporte para etiquetas (labels), manejo de errores e iconos integrados.
 */
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * Campo de texto general con icono y soporte de mensaje de error
 */
export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>}
        <input
          className={`w-full bg-slate-900/60 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

/**
 * Menú desplegable (Select) estilizado
 */
export function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <select
        className={`w-full bg-slate-900/60 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

/**
 * Campo de texto multilínea (Textarea)
 */
export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <textarea
        className={`w-full bg-slate-900/60 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
