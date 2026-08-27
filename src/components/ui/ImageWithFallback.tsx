import React, { useState } from 'react';
import { User, Scissors, Package } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'avatar' | 'service' | 'product';
  fallbackText?: string;
}

/**
 * Componente de imagen robusto con fallback automático ante errores de carga o URLs caídas.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackType = 'avatar',
  fallbackText = '',
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  // Genera iniciales a partir del nombre en fallbackText
  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  if (error || !src) {
    if (fallbackType === 'avatar') {
      const initials = getInitials(fallbackText);
      return (
        <div
          className={`bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shrink-0 select-none ${className}`}
          title={alt || fallbackText}
        >
          {initials || <User className="w-1/2 h-1/2" />}
        </div>
      );
    }

    if (fallbackType === 'service') {
      return (
        <div
          className={`bg-slate-800 border border-white/10 text-blue-400 flex items-center justify-center shrink-0 ${className}`}
          title={alt || fallbackText}
        >
          <Scissors className="w-1/2 h-1/2" />
        </div>
      );
    }

    return (
      <div
        className={`bg-slate-800 border border-white/10 text-slate-400 flex items-center justify-center shrink-0 ${className}`}
        title={alt || fallbackText}
      >
        <Package className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || fallbackText || ''}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
