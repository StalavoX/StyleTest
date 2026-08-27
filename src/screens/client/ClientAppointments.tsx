/**
 * Pantalla de Citas del Cliente (ClientAppointments).
 * Muestra el listado de citas activas / próximas y el historial de citas pasadas,
 * con opción para cancelar reservas activas.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Scissors, X, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { AppointmentStatus } from '@/types';

// Iconos asociables a cada estado de cita
const statusIcon: Record<AppointmentStatus, React.ReactNode> = {
  PENDING: <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />,
  CONFIRMED: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
  IN_PROGRESS: <Scissors className="w-4 h-4 text-indigo-400" />,
  COMPLETED: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-400" />,
};

export function ClientAppointments() {
  const { appointments, cancelAppointment } = useData();
  const { user } = useAuth();

  // Filtrado y ordenamiento de las citas del cliente actual
  const myAppts = appointments
    .filter(a => a.clientId === user?.id)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const active = myAppts.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS');
  const past = myAppts.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  return (
    <div className="space-y-6">
      {/* Título de sección */}
      <div>
        <h2 className="text-2xl font-bold text-white">Mis Citas</h2>
        <p className="text-slate-400 text-sm mt-1">Gestiona tus reservas de citas</p>
      </div>

      {/* Citas activas o en progreso */}
      {active.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3">Próximas y Activas</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {active.map(a => (
                <motion.div key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {statusIcon[a.status]}
                        <Badge status={a.status} />
                      </div>
                      {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                        <Button size="sm" variant="danger" icon={<X className="w-3 h-3" />} onClick={() => cancelAppointment(a.id)}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                        <Scissors className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white">{a.serviceName}</h4>
                        <p className="text-sm text-slate-400">con {a.barberName}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(a.date + 'T00:00').toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.time}</span>
                          <span className="text-blue-400 font-medium">${a.price}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Historial de citas completadas o canceladas */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3">Historial de Citas</h3>
          <div className="space-y-2">
            {past.map(a => (
              <Card key={a.id} className="p-3 opacity-70">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {statusIcon[a.status]}
                    <div>
                      <p className="text-sm font-medium text-white">{a.serviceName}</p>
                      <p className="text-xs text-slate-500">{a.barberName} · {new Date(a.date + 'T00:00').toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} · {a.time}</p>
                    </div>
                  </div>
                  <Badge status={a.status} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío cuando no existen citas registradas */}
      {myAppts.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400">Aún no tienes citas registradas</p>
          <p className="text-sm text-slate-600 mt-1">Reserva tu primer corte desde la pestaña Servicios</p>
        </div>
      )}
    </div>
  );
}
