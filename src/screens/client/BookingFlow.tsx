/**
 * Flujo Interactivo de Reserva de Citas (BookingFlow).
 * Asistente de 4 pasos (Servicio, Barbero, Fecha y Hora, Confirmación)
 * con cálculo dinámico de franjas horarias y simulación de Google Calendar.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, Check, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { formatCurrency } from '@/utils/format';
import type { Service, Barber } from '@/types';

interface BookingFlowProps {
  onClose: () => void;
}

type Step = 'service' | 'barber' | 'datetime' | 'confirm';

export function BookingFlow({ onClose }: BookingFlowProps) {
  const { services, barbers, getAvailableSlots, addAppointment } = useData();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('service');
  const [service, setService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [confirmed, setConfirmed] = useState(false);

  const activeBarbers = barbers.filter(b => b.active);

  // Pasos traducidos del asistente
  const steps: { key: Step; label: string }[] = [
    { key: 'service', label: 'Servicio' },
    { key: 'barber', label: 'Barbero' },
    { key: 'datetime', label: 'Fecha y Hora' },
    { key: 'confirm', label: 'Confirmar' },
  ];
  const stepIndex = steps.findIndex(s => s.key === step);

  // Cálculo de horarios disponibles según el servicio y el barbero seleccionado
  const slots = barber && date ? getAvailableSlots(barber.id, date, service?.durationMin ?? 30) : [];

  // Datos para renderizar el calendario interactivo del mes actual
  const monthName = calendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const startWeekday = firstDay.getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Verifica si una fecha específica está disponible para el barbero seleccionado
  const isDateAvailable = (day: number) => {
    const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    d.setHours(0, 0, 0, 0);
    if (d < today) return false;
    if (!barber) return true;
    const dayName = d.getDay();
    return barber.workingHours.some(w => w.day === dayName);
  };

  // Guarda la cita y marca el flujo como confirmado
  const handleConfirm = () => {
    if (!service || !barber || !date || !time || !user) return;
    addAppointment({
      clientId: user.id,
      clientName: user.name,
      barberId: barber.id,
      barberName: barber.name,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      durationMin: service.durationMin,
      date, time,
      status: 'PENDING',
      googleEventId: `evt-${Date.now()}`,
    });
    setConfirmed(true);
  };

  // Pantalla final tras confirmar la cita
  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">¡Cita Confirmada!</h3>
        <p className="text-slate-400 mb-1">{service?.name} con {barber?.name}</p>
        <p className="text-slate-400 mb-6">{new Date(date + 'T00:00').toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })} a las {time}</p>
        <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
            <CalendarIcon className="w-4 h-4" />
            Evento creado en Google Calendar
          </div>
          <p className="text-xs text-slate-500">ID del Evento: {`evt-${Date.now()}`}</p>
        </div>
        <Button fullWidth onClick={onClose}>Finalizar</Button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Indicador de Pasos / Stepper */}
      <div className="flex items-center gap-1 mb-6">
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            <div className={`flex items-center gap-2 ${i <= stepIndex ? 'text-blue-400' : 'text-slate-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= stepIndex ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                {i < stepIndex ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className="text-xs hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < stepIndex ? 'bg-blue-600' : 'bg-slate-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Paso 1: Selección de Servicio */}
        {step === 'service' && (
          <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3 max-h-[50vh] overflow-y-auto">
            {services.map(s => (
              <Card key={s.id} hover onClick={() => { setService(s); setStep('barber'); }} className="p-4 flex gap-4">
                <ImageWithFallback src={s.image} alt={s.name} fallbackType="service" fallbackText={s.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-white">{s.name}</h4>
                    <span className="text-blue-400 font-bold">{formatCurrency(s.price)}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{s.description}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                    <Clock className="w-3 h-3" /> {s.durationMin} min
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Paso 2: Selección de Barbero */}
        {step === 'barber' && (
          <motion.div key="barber" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            {activeBarbers.map(b => (
              <Card key={b.id} hover onClick={() => { setBarber(b); setStep('datetime'); }} className="p-4 flex items-center gap-4">
                <ImageWithFallback src={b.avatar} alt={b.name} fallbackType="avatar" fallbackText={b.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{b.name}</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 mt-1">
                    <Star className="w-3 h-3 fill-current" /> {b.rating}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {b.specialties.map(s => <span key={s} className="text-[10px] px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">{s}</span>)}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </Card>
            ))}
            <Button variant="ghost" fullWidth onClick={() => setStep('service')}>Atrás</Button>
          </motion.div>
        )}

        {/* Paso 3: Selección de Fecha y Hora */}
        {step === 'datetime' && (
          <motion.div key="datetime" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {/* Calendario mensual */}
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="text-slate-400 hover:text-white">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-white capitalize">{monthName}</span>
                <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="text-slate-400 hover:text-white">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-1">
                {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startWeekday }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const available = isDateAvailable(day);
                  const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const selected = date === dateStr;
                  return (
                    <button
                      key={day}
                      disabled={!available}
                      onClick={() => { setDate(dateStr); setTime(''); }}
                      className={`aspect-square rounded-lg text-sm transition-all ${selected ? 'bg-blue-600 text-white' : available ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 cursor-not-allowed'}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Franjas Horarias Disponibles */}
            {date && (
              <div>
                <p className="text-sm text-slate-300 mb-2">Horas disponibles</p>
                {slots.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No hay horarios disponibles para este día</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {slots.map(t => (
                      <button
                        key={t}
                        onClick={() => setTime(t)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${time === t ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep('barber')}>Atrás</Button>
              <Button fullWidth disabled={!date || !time} onClick={() => setStep('confirm')}>Continuar</Button>
            </div>
          </motion.div>
        )}

        {/* Paso 4: Resumen y Confirmación */}
        {step === 'confirm' && service && barber && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <ImageWithFallback src={service.image} alt={service.name} fallbackType="service" fallbackText={service.name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <h4 className="font-semibold text-white">{service.name}</h4>
                  <p className="text-sm text-slate-400">{service.durationMin} min · {formatCurrency(service.price)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <ImageWithFallback src={barber.avatar} alt={barber.name} fallbackType="avatar" fallbackText={barber.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-medium text-white">{barber.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-amber-400"><Star className="w-3 h-3 fill-current" /> {barber.rating}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white capitalize">{new Date(date + 'T00:00').toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                  <p className="text-sm text-slate-400">a las {time}</p>
                </div>
              </div>
            </Card>

            <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-3 flex items-center gap-2 text-sm text-blue-400">
              <Sparkles className="w-4 h-4" />
              Se creará automáticamente un evento en Google Calendar
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep('datetime')}>Atrás</Button>
              <Button fullWidth variant="success" onClick={handleConfirm}>Confirmar Cita</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
