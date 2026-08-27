/**
 * Componente Badge (Etiqueta de Estado).
 * Muestra el estado de las citas, métodos de pago o tipos de venta
 * con colores y textos traducidos al español.
 */
import type { AppointmentStatus, PaymentMethod } from '@/types';

interface BadgeProps {
  status: AppointmentStatus | PaymentMethod | string;
  className?: string;
}

// Configuración de textos en español y estilos CSS para cada estado
const statusConfig: Record<string, { label: string; cls: string }> = {
  PENDING:     { label: 'Pendiente',   cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  CONFIRMED:   { label: 'Confirmada',  cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  IN_PROGRESS: { label: 'En Proceso',  cls: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  COMPLETED:   { label: 'Completada',  cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  CANCELLED:   { label: 'Cancelada',   cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  CASH:        { label: 'Efectivo',    cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  CARD:        { label: 'Tarjeta',     cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  DIGITAL:     { label: 'Digital',     cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  SERVICE:     { label: 'Servicio',    cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  PRODUCT:     { label: 'Producto',    cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  MIXED:       { label: 'Mixto',       cls: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
};

export function Badge({ status, className = '' }: BadgeProps) {
  const cfg = statusConfig[status] ?? { label: status, cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls} ${className}`}>
      {cfg.label}
    </span>
  );
}
