/**
 * Panel de Control de Administración (AdminDashboard).
 * Muestra resumen métrico del día (ingresos, citas, barberos activos, stock bajo),
 * un gráfico de ingresos semanales y la vista previa de la agenda diaria.
 */
import { motion } from 'framer-motion';
import { DollarSign, Calendar as CalendarIcon, Scissors, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/format';

export function AdminDashboard() {
  const { appointments, products, sales, barbers } = useData();
  const today = new Date().toISOString().slice(0, 10);

  // Cálculos de métricas globales del día
  const todaySales = sales.filter(s => s.createdAt === today);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const todayAppts = appointments.filter(a => a.date === today && a.status !== 'CANCELLED');
  const activeBarbers = barbers.filter(b => b.active);
  const lowStock = products.filter(p => p.stockActual <= p.stockMinimo);

  // Tarjetas métricas estadísticas principales
  const stats = [
    { label: "Ingresos de Hoy", value: formatCurrency(todayRevenue), icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-600/15' },
    { label: "Citas de Hoy", value: todayAppts.length, icon: <CalendarIcon className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-600/15' },
    { label: 'Barberos Activos', value: activeBarbers.length, icon: <Scissors className="w-5 h-5" />, color: 'text-indigo-400', bg: 'bg-indigo-600/15' },
    { label: 'Alertas Stock Bajo', value: lowStock.length, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-600/15' },
  ];

  // Cálculo de ingresos de los últimos 7 días para el gráfico de barras
  const weekRevenue = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().slice(0, 10);
    return sales.filter(s => s.createdAt === dStr).reduce((sum, s) => sum + s.total, 0);
  });
  const maxRev = Math.max(...weekRevenue, 1);

  return (
    <div className="space-y-6">
      {/* Título y fecha actual */}
      <div>
        <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
        <p className="text-slate-400 text-sm mt-1 capitalize">{new Date().toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Rejilla de métricas estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Gráfico de barras de ingresos semanales */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Ingresos Semanales</h3>
            <p className="text-xs text-slate-500">Últimos 7 días</p>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {weekRevenue.map((rev, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(rev / maxRev) * 100}%` }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg min-h-[2px]"
                  style={{ minHeight: rev > 0 ? '4px' : '2px' }}
                />
                <span className="text-[10px] text-slate-500">{['D', 'L', 'M', 'X', 'J', 'V', 'S'][d.getDay()]}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Alertas de inventario con stock bajo */}
      {lowStock.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white">Alertas de Stock Bajo</h3>
          </div>
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{p.stockActual} / {p.stockMinimo} mín</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/15 text-red-400 border border-red-500/30">Bajo</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Vista previa de las citas de hoy */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white">Agenda de Hoy</h3>
        </div>
        {todayAppts.length === 0 ? (
          <p className="text-sm text-slate-500">No hay citas programadas para hoy</p>
        ) : (
          <div className="space-y-2">
            {todayAppts.sort((a, b) => a.time.localeCompare(b.time)).map(a => (
              <div key={a.id} className="flex items-center justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 font-medium w-12">{a.time}</span>
                  <span className="text-white">{a.serviceName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">{a.barberName}</span>
                  <Badge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
