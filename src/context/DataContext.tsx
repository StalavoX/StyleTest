/**
 * Contexto Central de Datos del Sistema (DataContext).
 * Gestiona el estado reactivo y la persistencia local de citas, productos,
 * ventas, usuarios, cálculo de horarios y disponibilidad de barberos.
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Appointment, Product, Sale, User, Service, Barber, AppointmentStatus } from '@/types';
import { mockAppointments, mockProducts, mockSales, mockUsers, mockServices, mockBarbers } from '@/data/mockData';

// Definición de las propiedades y funciones provistas por el contexto de datos
interface DataContextValue {
  appointments: Appointment[];
  services: Service[];
  barbers: Barber[];
  products: Product[];
  sales: Sale[];
  users: User[];
  addAppointment: (a: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addSale: (s: Omit<Sale, 'id' | 'createdAt'>) => void;
  addUser: (u: Omit<User, 'id'>) => void;
  updateUser: (u: User) => void;
  deleteUser: (id: string) => void;
  toggleBarberActive: (id: string) => void;
  isSlotAvailable: (barberId: string, date: string, time: string, durationMin: number, excludeId?: string) => boolean;
  getAvailableSlots: (barberId: string, date: string, serviceDuration: number) => string[];
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

// Clave para guardar el estado del negocio en el almacenamiento local del navegador
const STORAGE_KEY = 'luna_azul_data';

interface StoredData {
  appointments: Appointment[];
  products: Product[];
  sales: Sale[];
  users: User[];
}

// Carga inicial desde el almacenamiento local
function loadStored(): StoredData | null {
  const s = localStorage.getItem(STORAGE_KEY);
  if (s) { try { return JSON.parse(s); } catch { /* Ignorar si no existe */ } }
  return null;
}

// Guarda los datos en el almacenamiento local
function saveStored(d: StoredData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const stored = loadStored();
  const [appointments, setAppointments] = useState<Appointment[]>(stored?.appointments ?? mockAppointments);
  const [products, setProducts] = useState<Product[]>(stored?.products ?? mockProducts);
  const [sales, setSales] = useState<Sale[]>(stored?.sales ?? mockSales);
  const [users, setUsers] = useState<User[]>(stored?.users ?? mockUsers);
  const services = mockServices;
  const barbers = mockBarbers;

  // Persistir cambios parciales o totales
  const persist = (partial: Partial<StoredData>) => {
    const current: StoredData = { appointments, products, sales, users };
    saveStored({ ...current, ...partial });
  };

  // Agregar una nueva cita
  const addAppointment = useCallback((a: Omit<Appointment, 'id' | 'createdAt'>) => {
    const appt: Appointment = { ...a, id: `a-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) };
    setAppointments(prev => {
      const next = [appt, ...prev];
      persist({ appointments: next });
      return next;
    });
    return appt;
  }, [appointments]);

  // Actualizar el estado de una cita existente (CONFIRMED, COMPLETED, CANCELLED, etc.)
  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments(prev => {
      const next = prev.map(a => a.id === id ? { ...a, status } : a);
      persist({ appointments: next });
      return next;
    });
  }, [appointments]);

  // Cancelar una cita dada su ID
  const cancelAppointment = useCallback((id: string) => {
    updateAppointmentStatus(id, 'CANCELLED');
  }, [updateAppointmentStatus]);

  // Registrar un producto en el inventario
  const addProduct = useCallback((p: Omit<Product, 'id'>) => {
    const prod: Product = { ...p, id: `p-${Date.now()}` };
    setProducts(prev => {
      const next = [...prev, prod];
      persist({ products: next });
      return next;
    });
  }, [products]);

  // Actualizar la información de un producto
  const updateProduct = useCallback((p: Product) => {
    setProducts(prev => {
      const next = prev.map(x => x.id === p.id ? p : x);
      persist({ products: next });
      return next;
    });
  }, [products]);

  // Eliminar un producto del inventario
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const next = prev.filter(x => x.id !== id);
      persist({ products: next });
      return next;
    });
  }, [products]);

  // Registrar una nueva venta en el sistema POS
  const addSale = useCallback((s: Omit<Sale, 'id' | 'createdAt'>) => {
    const sale: Sale = { ...s, id: `v-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) };
    setSales(prev => {
      const next = [sale, ...prev];
      persist({ sales: next });
      return next;
    });
  }, [sales]);

  // Agregar un usuario al sistema (barbero o cliente)
  const addUser = useCallback((u: Omit<User, 'id'>) => {
    const user: User = { ...u, id: `u-${Date.now()}` };
    setUsers(prev => {
      const next = [...prev, user];
      persist({ users: next });
      return next;
    });
  }, [users]);

  // Actualizar la información de un usuario
  const updateUser = useCallback((u: User) => {
    setUsers(prev => {
      const next = prev.map(x => x.id === u.id ? u : x);
      persist({ users: next });
      return next;
    });
  }, [users]);

  // Eliminar un usuario del sistema
  const deleteUser = useCallback((id: string) => {
    setUsers(prev => {
      const next = prev.filter(x => x.id !== id);
      persist({ users: next });
      return next;
    });
  }, [users]);

  // Alternar el estado activo/inactivo de un barbero
  const toggleBarberActive = useCallback((id: string) => {
    setUsers(prev => {
      const next = prev.map(x => x.id === id ? { ...x, active: !x.active } : x);
      persist({ users: next });
      return next;
    });
  }, [users]);

  // Comprueba si una franja horaria está libre para un barbero específico sin traslape de citas
  const isSlotAvailable = useCallback((barberId: string, date: string, time: string, durationMin: number, excludeId?: string) => {
    const [h, m] = time.split(':').map(Number);
    const start = h * 60 + m;
    const end = start + durationMin;
    const conflicts = appointments.filter(a =>
      a.barberId === barberId &&
      a.date === date &&
      a.id !== excludeId &&
      a.status !== 'CANCELLED'
    );
    for (const a of conflicts) {
      const [ah, am] = a.time.split(':').map(Number);
      const aStart = ah * 60 + am;
      const aEnd = aStart + a.durationMin;
      if (start < aEnd && end > aStart) return false;
    }
    return true;
  }, [appointments]);

  // Calcula todas las horas disponibles para reservar con un barbero en una fecha determinada
  const getAvailableSlots = useCallback((barberId: string, date: string, serviceDuration: number) => {
    const barber = mockBarbers.find(b => b.id === barberId);
    if (!barber || !barber.active) return [];
    const d = new Date(date + 'T00:00:00');
    const dayName = d.getDay();
    const wh = barber.workingHours.find(w => w.day === dayName);
    if (!wh) return [];
    const [sh, sm] = wh.start.split(':').map(Number);
    const [eh, em] = wh.end.split(':').map(Number);
    const workStart = sh * 60 + sm;
    const workEnd = eh * 60 + em;
    const slots: string[] = [];
    for (let t = workStart; t + serviceDuration <= workEnd; t += 15) {
      const hh = Math.floor(t / 60).toString().padStart(2, '0');
      const mm = (t % 60).toString().padStart(2, '0');
      const time = `${hh}:${mm}`;
      if (isSlotAvailable(barberId, date, time, serviceDuration)) slots.push(time);
    }
    return slots;
  }, [isSlotAvailable]);

  return (
    <DataContext.Provider value={{
      appointments, services, barbers, products, sales, users,
      addAppointment, updateAppointmentStatus, cancelAppointment,
      addProduct, updateProduct, deleteProduct,
      addSale, addUser, updateUser, deleteUser, toggleBarberActive,
      isSlotAvailable, getAvailableSlots,
    }}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * Hook personalizado para utilizar los datos y métodos globales de la aplicación
 */
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe ser utilizado dentro de un DataProvider');
  return ctx;
}
