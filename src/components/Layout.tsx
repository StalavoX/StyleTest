/**
 * Componente principal de Disposición / Layout de la aplicación.
 * Proporciona navegación lateral en escritorios y barra de navegación fija inferior en dispositivos móviles,
 * adaptando los elementos según el rol del usuario (Cliente, Barbero, Administrador).
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Package, User as UserIcon, Scissors, ShoppingBag, Users, LayoutDashboard, LogOut, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';

// Claves de navegación disponibles
export type NavKey = 'home' | 'bookings' | 'agenda' | 'inventory' | 'sales' | 'staff' | 'profile' | 'dashboard';

interface NavItem {
  key: NavKey;
  label: string;
  icon: React.ReactNode;
}

// Menú de navegación inferior en dispositivos móviles por rol
const navByRole: Record<Role, NavItem[]> = {
  CLIENT: [
    { key: 'home', label: 'Servicios', icon: <Home className="w-5 h-5" /> },
    { key: 'bookings', label: 'Mis Citas', icon: <Calendar className="w-5 h-5" /> },
    { key: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> },
  ],
  BARBER: [
    { key: 'agenda', label: 'Agenda', icon: <Clock className="w-5 h-5" /> },
    { key: 'bookings', label: 'Citas', icon: <Calendar className="w-5 h-5" /> },
    { key: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> },
  ],
  ADMIN: [
    { key: 'dashboard', label: 'Panel', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'agenda', label: 'Agenda', icon: <Calendar className="w-5 h-5" /> },
    { key: 'inventory', label: 'Inventario', icon: <Package className="w-5 h-5" /> },
    { key: 'sales', label: 'Ventas', icon: <ShoppingBag className="w-5 h-5" /> },
    { key: 'staff', label: 'Personal', icon: <Users className="w-5 h-5" /> },
    { key: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> },
  ],
};

// Menú de navegación lateral para pantallas de escritorio por rol
const desktopNavByRole: Record<Role, NavItem[]> = {
  CLIENT: [
    { key: 'home', label: 'Servicios', icon: <Home className="w-5 h-5" /> },
    { key: 'bookings', label: 'Mis Citas', icon: <Calendar className="w-5 h-5" /> },
    { key: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> },
  ],
  BARBER: [
    { key: 'agenda', label: 'Agenda de Hoy', icon: <Clock className="w-5 h-5" /> },
    { key: 'bookings', label: 'Todas las Citas', icon: <Calendar className="w-5 h-5" /> },
    { key: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> },
  ],
  ADMIN: [
    { key: 'dashboard', label: 'Panel Control', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'agenda', label: 'Agenda Global', icon: <Calendar className="w-5 h-5" /> },
    { key: 'inventory', label: 'Inventario', icon: <Package className="w-5 h-5" /> },
    { key: 'sales', label: 'Caja y Ventas', icon: <ShoppingBag className="w-5 h-5" /> },
    { key: 'staff', label: 'Gestión de Personal', icon: <Users className="w-5 h-5" /> },
    { key: 'profile', label: 'Perfil', icon: <UserIcon className="w-5 h-5" /> },
  ],
};

interface LayoutProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  children: React.ReactNode;
}

export function Layout({ active, onNavigate, children }: LayoutProps) {
  const { user, logout } = useAuth();
  if (!user) return <>{children}</>;
  const items = navByRole[user.role];
  const desktopItems = desktopNavByRole[user.role];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Barra lateral para vista en escritorio */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-white/10 flex-col z-30">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Luna Azul</h1>
            <p className="text-xs text-slate-500">Gestión de Barbería</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {desktopItems.map(item => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === item.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <img src={user.avatar} alt="" className="w-9 h-9 rounded-full" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="lg:pl-64">
        {/* Encabezado superior para vista móvil */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-white font-bold">Luna Azul</h1>
          </div>
          <div className="flex items-center gap-2">
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
          </div>
        </header>

        <main className="px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Barra de navegación inferior fija para vista móvil */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 py-2 safe-area-bottom">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors relative ${
              active === item.key ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            {active === item.key && (
              <motion.div layoutId="navIndicator" className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-400 rounded-full" />
            )}
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
