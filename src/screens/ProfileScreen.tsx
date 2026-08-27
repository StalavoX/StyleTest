/**
 * Pantalla de Perfil de Usuario (ProfileScreen).
 * Muestra información personal, métricas de actividad según el rol (Cliente, Barbero, Admin)
 * y opciones para cerrar sesión.
 */
import { LogOut, Mail, Phone, Shield, Scissors, Calendar, Package, DollarSign, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Diccionario de etiquetas traducidas para los roles de usuario
const roleLabels = {
  CLIENT: 'Cliente',
  BARBER: 'Barbero',
  ADMIN: 'Administrador',
};

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { appointments, sales, products } = useData();
  if (!user) return null;

  // Cálculo de estadísticas específicas para el usuario actual
  const myAppts = appointments.filter(a => a.clientId === user.id);
  const completedAppts = myAppts.filter(a => a.status === 'COMPLETED');
  const mySales = sales.filter(s => s.cashierId === user.id);
  const myRevenue = mySales.reduce((sum, s) => sum + s.total, 0);

  const roleIcon = user.role === 'ADMIN' ? <Shield className="w-4 h-4" /> : user.role === 'BARBER' ? <Scissors className="w-4 h-4" /> : <Calendar className="w-4 h-4" />;

  return (
    <div className="space-y-5">
      {/* Encabezado del perfil con avatar y rol */}
      <Card className="p-6 text-center">
        <img src={user.avatar} alt="" className="w-20 h-20 rounded-full mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">{user.name}</h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="flex items-center gap-1 text-sm text-blue-400">{roleIcon} {roleLabels[user.role]}</span>
          {user.role === 'BARBER' && user.rating && (
            <span className="flex items-center gap-1 text-sm text-amber-400"><Star className="w-3 h-3 fill-current" /> {user.rating}</span>
          )}
        </div>
      </Card>

      {/* Tarjetas estadísticas específicas para CLIENTE */}
      {user.role === 'CLIENT' && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center text-blue-400 mb-2"><Calendar className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-white">{myAppts.length}</p>
            <p className="text-xs text-slate-400">Total Citas</p>
          </Card>
          <Card className="p-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 flex items-center justify-center text-emerald-400 mb-2"><Calendar className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-white">{completedAppts.length}</p>
            <p className="text-xs text-slate-400">Visitas Completadas</p>
          </Card>
        </div>
      )}

      {/* Tarjetas estadísticas específicas para BARBERO */}
      {user.role === 'BARBER' && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center text-blue-400 mb-2"><Calendar className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-white">{appointments.filter(a => a.barberId === user.id).length}</p>
            <p className="text-xs text-slate-400">Citas Asignadas</p>
          </Card>
          <Card className="p-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 flex items-center justify-center text-emerald-400 mb-2"><DollarSign className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-white">${myRevenue}</p>
            <p className="text-xs text-slate-400">Ingresos Generados</p>
          </Card>
        </div>
      )}

      {/* Tarjetas estadísticas específicas para ADMINISTRADOR */}
      {user.role === 'ADMIN' && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center text-blue-400 mb-2"><Calendar className="w-5 h-5" /></div>
            <p className="text-xl font-bold text-white">{appointments.length}</p>
            <p className="text-xs text-slate-400">Total Citas</p>
          </Card>
          <Card className="p-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 flex items-center justify-center text-emerald-400 mb-2"><DollarSign className="w-5 h-5" /></div>
            <p className="text-xl font-bold text-white">${sales.reduce((s, x) => s + x.total, 0)}</p>
            <p className="text-xs text-slate-400">Ventas Totales</p>
          </Card>
          <Card className="p-4">
            <div className="w-10 h-10 rounded-xl bg-amber-600/15 flex items-center justify-center text-amber-400 mb-2"><Package className="w-5 h-5" /></div>
            <p className="text-xl font-bold text-white">{products.length}</p>
            <p className="text-xs text-slate-400">Productos</p>
          </Card>
        </div>
      )}

      {/* Información de contacto */}
      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Información de Contacto</h3>
        <div className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-slate-500" />
          <span className="text-white">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-slate-500" />
            <span className="text-white">{user.phone}</span>
          </div>
        )}
        {user.specialties && user.specialties.length > 0 && (
          <div>
            <p className="text-sm text-slate-300 mb-2">Especialidades</p>
            <div className="flex flex-wrap gap-1">
              {user.specialties.map(s => <span key={s} className="text-xs px-2.5 py-1 bg-slate-700 rounded-full text-slate-300">{s}</span>)}
            </div>
          </div>
        )}
      </Card>

      {/* Botón de cerrar sesión */}
      <Button variant="danger" fullWidth icon={<LogOut className="w-4 h-4" />} onClick={logout}>
        Cerrar Sesión
      </Button>
    </div>
  );
}
