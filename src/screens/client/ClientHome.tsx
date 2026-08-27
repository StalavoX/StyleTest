/**
 * Pantalla Principal para Clientes (ClientHome).
 * Muestra el banner de bienvenida, la lista de barberos destacados y el catálogo de servicios
 * con filtrado por categoría y botón para iniciar el flujo de reserva.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Plus, Scissors } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { formatCurrency } from '@/utils/format';
import { BookingFlow } from './BookingFlow';

// Mapeo de categorías a español para los filtros
const categoryLabels: Record<string, string> = {
  ALL: 'Todos',
  HAIRCUT: 'Cortes',
  BEARD: 'Barba',
  COMBO: 'Combos',
  KIDS: 'Infantil',
  STYLING: 'Peinados',
};

export function ClientHome() {
  const { services, barbers } = useData();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [category, setCategory] = useState<string>('ALL');

  // Categorías de servicio disponibles para el filtro
  const categories = ['ALL', ...Array.from(new Set(services.map(s => s.category)))];
  const filtered = category === 'ALL' ? services : services.filter(s => s.category === category);

  // Barberos activos en la plataforma
  const activeBarbers = barbers.filter(b => b.active);

  return (
    <div className="space-y-6">
      {/* Banner Principal / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-slate-800 p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="w-5 h-5 text-white" />
            <span className="text-white/80 text-sm font-medium">Bienvenido a Luna Azul</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Reserva Tu Próximo Corte</h2>
          <Button onClick={() => setBookingOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Nueva Reserva
          </Button>
        </div>
      </div>

      {/* Barberos destacados */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Nuestros Barberos</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {activeBarbers.map(b => (
            <Card key={b.id} className="p-4 min-w-[140px] text-center">
              <ImageWithFallback src={b.avatar} alt={b.name} fallbackType="avatar" fallbackText={b.name} className="w-14 h-14 rounded-full mx-auto mb-2 object-cover" />
              <p className="text-sm font-medium text-white">{b.name}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-amber-400 mt-1">
                <Star className="w-3 h-3 fill-current" /> {b.rating}
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Disponible
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Catálogo de Servicios */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Servicios</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-3">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${category === c ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {categoryLabels[c] || c}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map(s => (
            <motion.div key={s.id} layout>
              <Card className="p-4 flex gap-3">
                <ImageWithFallback src={s.image} alt={s.name} fallbackType="service" fallbackText={s.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-white text-sm">{s.name}</h4>
                    <span className="text-blue-400 font-bold text-sm">{formatCurrency(s.price)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{s.description}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                    <Clock className="w-3 h-3" /> {s.durationMin} min
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal para el flujo interactivo de reserva */}
      <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title="Reservar Cita" size="md">
        <BookingFlow onClose={() => setBookingOpen(false)} />
      </Modal>
    </div>
  );
}
