/**
 * Componente Principal de la Aplicación (App).
 * Configura los proveedores de contexto (AuthProvider, DataProvider)
 * y enruta las pantallas según el rol del usuario autenticado y la pestaña de navegación seleccionada.
 */
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { AuthScreen } from '@/screens/AuthScreen';
import { Layout, type NavKey } from '@/components/Layout';
import { ClientHome } from '@/screens/client/ClientHome';
import { ClientAppointments } from '@/screens/client/ClientAppointments';
import { BarberAgenda } from '@/screens/barber/BarberAgenda';
import { AdminDashboard } from '@/screens/admin/AdminDashboard';
import { AdminInventory } from '@/screens/admin/AdminInventory';
import { AdminSales } from '@/screens/admin/AdminSales';
import { AdminStaff } from '@/screens/admin/AdminStaff';
import { ProfileScreen } from '@/screens/ProfileScreen';

function AppContent() {
  const { user, loading } = useAuth();
  const [nav, setNav] = useState<NavKey>('home');

  // Restablece la pestaña de navegación inicial según el rol al cambiar de usuario
  useEffect(() => {
    if (user?.role === 'CLIENT') setNav('home');
    else if (user?.role === 'BARBER') setNav('agenda');
    else if (user?.role === 'ADMIN') setNav('dashboard');
  }, [user?.id, user?.role]);

  // Pantalla de carga mientras se recupera la sesión almacenada
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Si no hay usuario autenticado, renderizar la pantalla de login/registro
  if (!user) return <AuthScreen />;

  // Enrutador interno según el rol del usuario y la pestaña de navegación activa
  const renderScreen = () => {
    // Vistas para el rol CLIENTE
    if (user.role === 'CLIENT') {
      if (nav === 'bookings') return <ClientAppointments />;
      if (nav === 'profile') return <ProfileScreen />;
      return <ClientHome />;
    }

    // Vistas para el rol BARBERO
    if (user.role === 'BARBER') {
      if (nav === 'bookings') return <ClientAppointments />;
      if (nav === 'profile') return <ProfileScreen />;
      return <BarberAgenda />;
    }

    // Vistas para el rol ADMINISTRADOR
    if (user.role === 'ADMIN') {
      if (nav === 'agenda') return <BarberAgenda />;
      if (nav === 'inventory') return <AdminInventory />;
      if (nav === 'sales') return <AdminSales />;
      if (nav === 'staff') return <AdminStaff />;
      if (nav === 'profile') return <ProfileScreen />;
      return <AdminDashboard />;
    }

    return <ClientHome />;
  };

  return (
    <Layout active={nav} onNavigate={setNav}>
      {renderScreen()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
