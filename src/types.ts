/**
 * Tipos de datos y modelos del sistema para la gestión de barbería (Luna Azul).
 */

// Roles de usuario en el sistema: Cliente, Barbero o Administrador
export type Role = 'CLIENT' | 'BARBER' | 'ADMIN';

// Estados posibles de una cita reservada
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Métodos de pago aceptados en caja / sistema
export type PaymentMethod = 'CASH' | 'CARD' | 'DIGITAL';

/**
 * Modelo de Usuario genérico (Cliente, Barbero o Administrador)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  username?: string;
  firstName?: string;
  lastName?: string;
  cedula?: string;
  birthDate?: string;
  phone?: string;
  avatar?: string;
  active?: boolean;
  workingHours?: WorkingHours[];
  specialties?: string[];
  rating?: number;
}

/**
 * Estructura de datos para el registro de un nuevo cliente en la plataforma
 */
export interface RegisterData {
  username: string;
  firstName: string;
  lastName: string;
  cedula: string;
  birthDate: string;
  email: string;
  password: string;
}

/**
 * Horario laboral diario para barberos
 */
export interface WorkingHours {
  day: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  start: string; // Ejemplo: "09:00"
  end: string;   // Ejemplo: "17:00"
}

/**
 * Servicio ofrecido por la barbería (ej. Corte, Barba, etc.)
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  category: 'HAIRCUT' | 'BEARD' | 'COMBO' | 'KIDS' | 'STYLING';
  image?: string;
}

/**
 * Perfil y datos operativos de un Barbero
 */
export interface Barber {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  active: boolean;
  specialties: string[];
  rating: number;
  workingHours: WorkingHours[];
}

/**
 * Registro de una cita programada entre un Cliente y un Barbero
 */
export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  price: number;
  durationMin: number;
  date: string; // Formato fecha ISO "YYYY-MM-DD"
  time: string; // Formato hora "HH:MM"
  status: AppointmentStatus;
  googleEventId?: string;
  createdAt: string;
}

/**
 * Producto físico en inventario para venta al público
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stockActual: number;
  stockMinimo: number;
}

/**
 * Elemento individual dentro de una transacción de venta
 */
export interface SaleItem {
  productId?: string;
  serviceId?: string;
  name: string;
  price: number;
  qty: number;
}

/**
 * Registro de una transacción de venta realizada en caja
 */
export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  cashierId: string;
  cashierName: string;
  createdAt: string;
  type: 'SERVICE' | 'PRODUCT' | 'MIXED';
}
