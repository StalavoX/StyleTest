/**
 * Pantalla de Agenda para Barberos (BarberAgenda).
 * Permite a los barberos visualizar y gestionar las citas asignadas día por día,
 * actualizar su disponibilidad en tiempo real, cambiar el estado de atención y configurar su horario laboral.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CalendarOff } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/utils/format';
import type { Appointment, AppointmentStatus } from '@/types';

// Nombres cortos de días en español para la barra de navegación semanal
const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function BarberAgenda() {
  const { appointments, updateAppointmentStatus, users, toggleBarberActive } = useData();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const barberUser = users.find(u => u.id === user?.id);

  // Obtener citas asignadas al barbero para la fecha seleccionada
  const myAppts = appointments
    .filter(a => a.barberId === user?.id && a.date === selectedDate && a.status !== 'CANCELLED')
    .sort((a, b) => a.time.localeCompare(b.time));

  const today = new Date().toISOString().slice(0, 10);

  // Cambiar de fecha usando los botones de navegación
  const shiftDate = (delta: number) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  // Determinar la acción y el siguiente estado correspondiente para la cita
  const getAction = (a: Appointment) => {
    if (a.status === 'PENDING') return { label: 'Confirmar', icon: <CheckCircle2 className="w-3 h-3" />, next: 'CONFIRMED' as AppointmentStatus, variant: 'secondary' as const };
    if (a.status === 'CONFIRMED') return { label: 'Iniciar', icon: <Play className="w-3 h-3" />, next: 'IN_PROGRESS' as AppointmentStatus, variant: 'primary' as const };
    if (a.status === 'IN_PROGRESS') return { label: 'Completar', icon: <CheckCircle2 className="w-3 h-3" />, next: 'COMPLETED' as AppointmentStatus, variant: 'success' as const };
    return null;
  };

  const workingDays = barberUser?.workingHours ?? [];
  const isWorkingDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    return workingDays.some(w => w.day === d.getDay());
  };

  // Generación de los días de la semana actual
  const weekStart = new Date(selectedDate + 'T00:00:00');
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-5">
      {/* Encabezado y configuración de horario */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Agenda del Día</h2>
          <p className="text-slate-400 text-sm mt-1">{barberUser?.active ? 'Estás disponible para recibir reservas' : 'Actualmente estás inactivo'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>
          Configurar Horario
        </Button>
      </div>

      {/* Control de disponibilidad del barbero */}
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${barberUser?.active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          <div>
            <p className="text-sm font-medium text-white">Estado de Disponibilidad</p>
            <p className="text-xs text-slate-500">{barberUser?.active ? 'Aceptando nuevas citas' : 'No se aceptan citas'}</p>
          </div>
        </div>
        <button
          onClick={() => user && toggleBarberActive(user.id)}
          className={`relative w-12 h-6 rounded-full transition-colors ${barberUser?.active ? 'bg-emerald-600' : 'bg-slate-700'}`}
        >
          <motion.div animate={{ x: barberUser?.active ? 24 : 0 }} className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white" />
        </button>
      </Card>

      {/* Selector semanal interactivio */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => shiftDate(-1)} className="text-slate-400 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
        <div className="flex gap-1 flex-1 justify-center">
          {weekDays.map(d => {
            const dStr = d.toISOString().slice(0, 10);
            const selected = dStr === selectedDate;
            const isToday = dStr === today;
            return (
              <button
                key={dStr}
                onClick={() => setSelectedDate(dStr)}
                className={`flex flex-col items-center py-2 px-2 sm:px-3 rounded-xl transition-all ${selected ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <span className="text-[10px]">{dayNames[d.getDay()]}</span>
                <span className={`text-sm font-bold ${isToday && !selected ? 'text-blue-400' : ''}`}>{d.getDate()}</span>
              </button>
            );
          })}
        </div>
        <button onClick={() => shiftDate(1)} className="text-slate-400 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Cronograma de citas */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3 capitalize">
          {new Date(selectedDate + 'T00:00').toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
          <span className="text-slate-500 ml-2">({myAppts.length} {myAppts.length === 1 ? 'cita' : 'citas'})</span>
        </h3>

        {myAppts.length === 0 ? (
          <Card className="p-8 text-center">
            {isWorkingDay() ? <CalendarIcon className="w-10 h-10 text-slate-700 mx-auto mb-2" /> : <CalendarOff className="w-10 h-10 text-slate-700 mx-auto mb-2" />}
            <p className="text-slate-400 text-sm">{isWorkingDay() ? 'No hay citas programadas para este día' : 'Día libre — Sin horario laboral configurado'}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {myAppts.map(a => {
                const action = getAction(a);
                return (
                  <motion.div key={a.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <Card className={`p-4 ${a.status === 'IN_PROGRESS' ? 'border-blue-500/30 bg-blue-500/5' : ''}`}>
                      <div className="flex items-start gap-3">
                        {/* Hora y Duración */}
                        <div className="text-center shrink-0 w-16">
                          <p className="text-lg font-bold text-white">{a.time}</p>
                          <p className="text-xs text-slate-500">{a.durationMin}m</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        {/* Detalles de la cita */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white truncate">{a.serviceName}</h4>
                            <Badge status={a.status} />
                          </div>
                          <p className="text-sm text-slate-400">{a.clientName}</p>
                          <p className="text-xs text-blue-400 font-medium mt-0.5">{formatCurrency(a.price)}</p>
                        </div>
                        {/* Botón de cambio de estado */}
                        {action && (
                          <Button size="sm" variant={action.variant} icon={action.icon} onClick={() => updateAppointmentStatus(a.id, action.next)}>
                            <span className="hidden sm:inline">{action.label}</span>
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}

/**
 * Modal para la edición del horario de atención semanal del barbero
 */
function ScheduleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { users, updateUser } = useData();
  const barberUser = users.find(u => u.id === user?.id);
  const [hours, setHours] = useState(barberUser?.workingHours ?? []);

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Activa o desactiva un día laborable
  const toggleDay = (day: number) => {
    const existing = hours.find(h => h.day === day);
    if (existing) {
      setHours(hours.filter(h => h.day !== day));
    } else {
      setHours([...hours, { day, start: '09:00', end: '17:00' }]);
    }
  };

  // Modifica las horas de inicio o fin
  const updateTime = (day: number, field: 'start' | 'end', value: string) => {
    setHours(hours.map(h => h.day === day ? { ...h, [field]: value } : h));
  };

  // Guarda los cambios del horario
  const handleSave = () => {
    if (user) updateUser({ ...barberUser!, workingHours: hours });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Horario de Trabajo" size="md">
      <div className="space-y-2">
        {days.map((name, idx) => {
          const wh = hours.find(h => h.day === idx);
          return (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl">
              <button
                onClick={() => toggleDay(idx)}
                className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${wh ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <motion.div animate={{ x: wh ? 20 : 0 }} className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white" />
              </button>
              <span className="text-sm text-white w-24 shrink-0">{name}</span>
              {wh ? (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" value={wh.start} onChange={e => updateTime(idx, 'start', e.target.value)} className="bg-slate-800 text-white text-sm rounded-lg px-2 py-1 border border-white/10" />
                  <span className="text-slate-500">—</span>
                  <input type="time" value={wh.end} onChange={e => updateTime(idx, 'end', e.target.value)} className="bg-slate-800 text-white text-sm rounded-lg px-2 py-1 border border-white/10" />
                </div>
              ) : (
                <span className="text-sm text-slate-600">Libre</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-5">
        <Button variant="ghost" fullWidth onClick={onClose}>Cancelar</Button>
        <Button fullWidth onClick={handleSave}>Guardar Horario</Button>
      </div>
    </Modal>
  );
}
