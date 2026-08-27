/**
 * Datos simulados iniciales (Mock Data) para usuarios, servicios, citas, inventario y ventas.
 * Todos los textos visibles se presentan en español.
 */
import type { User, Service, Barber, Appointment, Product, Sale } from '@/types';

// Referencias de fecha actual para generar citas dinámicas
const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };

// Horarios de atención base de los barberos (Lunes a Sábado)
const baseHours = [
  { day: 1, start: '09:00', end: '18:00' },
  { day: 2, start: '09:00', end: '18:00' },
  { day: 3, start: '09:00', end: '18:00' },
  { day: 4, start: '09:00', end: '18:00' },
  { day: 5, start: '09:00', end: '20:00' },
  { day: 6, start: '09:00', end: '16:00' },
];

/**
 * Usuarios iniciales de prueba (Administrador, Barberos y Clientes)
 */
export const mockUsers: User[] = [
  {
    id: 'u-admin',
    name: 'Luna Azul',
    email: 'admin@lunazul.com',
    password: 'admin123',
    role: 'ADMIN',
    phone: '+1 555-0100',
    avatar: 'https://i.pravatar.cc/150?img=12',
    active: true,
  },
  {
    id: 'u-barber-1',
    name: 'Marco Reyes',
    email: 'marco@lunazul.com',
    password: 'marco123',
    role: 'BARBER',
    phone: '+1 555-0101',
    avatar: 'https://i.pravatar.cc/150?img=33',
    active: true,
    specialties: ['Cortes Clásicos', 'Degradados / Fades', 'Afeitado Toalla Caliente'],
    rating: 4.9,
    workingHours: baseHours,
  },
  {
    id: 'u-barber-2',
    name: 'Diego Santos',
    email: 'diego@lunazul.com',
    password: 'diego123',
    role: 'BARBER',
    phone: '+1 555-0200',
    avatar: 'https://i.pravatar.cc/150?img=51',
    active: true,
    specialties: ['Perfilado de Barba', 'Diseños de Estilo', 'Cortes Infantiles'],
    rating: 4.8,
    workingHours: baseHours,
  },
  {
    id: 'u-barber-3',
    name: 'Sofía Delgado',
    email: 'sofia@lunazul.com',
    password: 'sofia123',
    role: 'BARBER',
    phone: '+1 555-0103',
    avatar: 'https://i.pravatar.cc/150?img=45',
    active: false,
    specialties: ['Peinados', 'Tinte / Color', 'Tratamientos Capilares'],
    rating: 4.7,
    workingHours: baseHours,
  },
  {
    id: 'u-client-1',
    name: 'Carlos Méndez',
    email: 'carlos@email.com',
    password: 'carlos123',
    role: 'CLIENT',
    phone: '+1 555-0201',
    avatar: 'https://i.pravatar.cc/150?img=68',
  },
  {
    id: 'u-client-2',
    name: 'Ana Torres',
    email: 'ana@email.com',
    password: 'ana123',
    role: 'CLIENT',
    phone: '+1 555-0202',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
];

/**
 * Catálogo de servicios disponibles para reservar en la barbería
 */
export const mockServices: Service[] = [
  { id: 's-1', name: 'Corte de Cabello Clásico', description: 'Corte tradicional con tijera y acabado a máquina, peinado a la perfección.', price: 25, durationMin: 45, category: 'HAIRCUT', image: 'https://images.unsplash.com/photo-1599351431202-1e0f03078969?w=400' },
  { id: 's-2', name: 'Degradado / Skin Fade', description: 'Degradado de alta precisión difuminado sutilmente hasta la parte superior.', price: 30, durationMin: 50, category: 'HAIRCUT', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfae676b5?w=400' },
  { id: 's-3', name: 'Recorte y Perfilado de Barba', description: 'Tratamiento con toalla caliente, perfilado de barba y aceite hidratante.', price: 18, durationMin: 30, category: 'BEARD', image: 'https://images.unsplash.com/photo-1503951918679-fb7fb1b0e1aa?w=400' },
  { id: 's-4', name: 'Combo Corte + Barba', description: 'Paquete de cuidado completo: corte de cabello, arreglo de barba y peinado.', price: 40, durationMin: 75, category: 'COMBO', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400' },
  { id: 's-5', name: 'Corte Infantil (Menores de 12)', description: 'Corte paciente y cuidadoso adaptado para los más pequeños.', price: 15, durationMin: 30, category: 'KIDS', image: 'https://images.unsplash.com/photo-1519415510236-718bdf8aa8e8?w=400' },
  { id: 's-6', name: 'Afeitado Toalla Caliente', description: 'Afeitado tradicional con navaja barbera, espuma especial y bálsamo.', price: 22, durationMin: 40, category: 'BEARD', image: 'https://images.unsplash.com/photo-1503951918679-fb7fb1b0e1aa?w=400' },
  { id: 's-7', name: 'Tratamiento Capilar y Masaje', description: 'Acondicionamiento profundo y tratamiento revitalizante para el cuero cabelludo.', price: 28, durationMin: 35, category: 'STYLING', image: 'https://images.unsplash.com/photo-1599351431202-1e0f03078969?w=400' },
];

/**
 * Lista filtrada de barberos a partir de los usuarios registrados
 */
export const mockBarbers: Barber[] = mockUsers
  .filter(u => u.role === 'BARBER')
  .map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    active: u.active ?? true,
    specialties: u.specialties ?? [],
    rating: u.rating ?? 4.5,
    workingHours: u.workingHours ?? baseHours,
  }));

/**
 * Historial y agenda de citas registradas en el sistema
 */
export const mockAppointments: Appointment[] = [
  { id: 'a-1', clientId: 'u-client-1', clientName: 'Carlos Méndez', barberId: 'u-barber-1', barberName: 'Marco Reyes', serviceId: 's-1', serviceName: 'Corte de Cabello Clásico', price: 25, durationMin: 45, date: addDays(0), time: '09:00', status: 'CONFIRMED', googleEventId: 'evt-001', createdAt: addDays(-3) },
  { id: 'a-2', clientId: 'u-client-2', clientName: 'Ana Torres', barberId: 'u-barber-1', barberName: 'Marco Reyes', serviceId: 's-4', serviceName: 'Combo Corte + Barba', price: 40, durationMin: 75, date: addDays(0), time: '10:30', status: 'CONFIRMED', googleEventId: 'evt-002', createdAt: addDays(-2) },
  { id: 'a-3', clientId: 'u-client-1', clientName: 'Carlos Méndez', barberId: 'u-barber-2', barberName: 'Diego Santos', serviceId: 's-2', serviceName: 'Degradado / Skin Fade', price: 30, durationMin: 50, date: addDays(0), time: '11:00', status: 'IN_PROGRESS', googleEventId: 'evt-003', createdAt: addDays(-1) },
  { id: 'a-4', clientId: 'u-client-2', clientName: 'Ana Torres', barberId: 'u-barber-2', barberName: 'Diego Santos', serviceId: 's-3', serviceName: 'Recorte y Perfilado de Barba', price: 18, durationMin: 30, date: addDays(1), time: '14:00', status: 'PENDING', createdAt: addDays(0) },
  { id: 'a-5', clientId: 'u-client-1', clientName: 'Carlos Méndez', barberId: 'u-barber-1', barberName: 'Marco Reyes', serviceId: 's-6', serviceName: 'Afeitado Toalla Caliente', price: 22, durationMin: 40, date: addDays(2), time: '15:00', status: 'CONFIRMED', googleEventId: 'evt-005', createdAt: addDays(-1) },
  { id: 'a-6', clientId: 'u-client-1', clientName: 'Carlos Méndez', barberId: 'u-barber-1', barberName: 'Marco Reyes', serviceId: 's-2', serviceName: 'Degradado / Skin Fade', price: 30, durationMin: 50, date: addDays(-5), time: '13:00', status: 'COMPLETED', googleEventId: 'evt-006', createdAt: addDays(-8) },
  { id: 'a-7', clientId: 'u-client-2', clientName: 'Ana Torres', barberId: 'u-barber-2', barberName: 'Diego Santos', serviceId: 's-5', serviceName: 'Corte Infantil (Menores de 12)', price: 15, durationMin: 30, date: addDays(-7), time: '10:00', status: 'COMPLETED', createdAt: addDays(-10) },
  { id: 'a-8', clientId: 'u-client-2', clientName: 'Ana Torres', barberId: 'u-barber-1', barberName: 'Marco Reyes', serviceId: 's-4', serviceName: 'Combo Corte + Barba', price: 40, durationMin: 75, date: addDays(-3), time: '16:00', status: 'CANCELLED', createdAt: addDays(-6) },
];

/**
 * Catálogo de productos en inventario con control de existencias
 */
export const mockProducts: Product[] = [
  { id: 'p-1', name: 'Pomada - Fijación Fuerte', category: 'Cabello', brand: 'Luna Azul', price: 14, stockActual: 3, stockMinimo: 5 },
  { id: 'p-2', name: 'Aceite para Barba - Cedro', category: 'Barba', brand: 'Luna Azul', price: 12, stockActual: 8, stockMinimo: 4 },
  { id: 'p-3', name: 'Loción Para Después del Afeitado', category: 'Afeitado', brand: 'Barber Co', price: 16, stockActual: 2, stockMinimo: 3 },
  { id: 'p-4', name: 'Tónico Capilar Revitalizante', category: 'Cabello', brand: 'Luna Azul', price: 10, stockActual: 15, stockMinimo: 6 },
  { id: 'p-5', name: 'Cera para Peinar - Acabado Mate', category: 'Cabello', brand: 'Classic Cuts', price: 13, stockActual: 7, stockMinimo: 4 },
  { id: 'p-6', name: 'Set de Peines de Acero Inoxidable', category: 'Herramientas', brand: 'Pro Barber', price: 9, stockActual: 20, stockMinimo: 5 },
  { id: 'p-7', name: 'Crema de Afeitar - Piel Sensible', category: 'Afeitado', brand: 'Barber Co', price: 11, stockActual: 1, stockMinimo: 3 },
];

/**
 * Historial de ventas realizadas en el punto de venta (POS)
 */
export const mockSales: Sale[] = [
  { id: 'v-1', items: [{ serviceId: 's-1', name: 'Corte de Cabello Clásico', price: 25, qty: 1 }], total: 25, paymentMethod: 'CASH', cashierId: 'u-barber-1', cashierName: 'Marco Reyes', createdAt: addDays(0), type: 'SERVICE' },
  { id: 'v-2', items: [{ serviceId: 's-4', name: 'Combo Corte + Barba', price: 40, qty: 1 }, { productId: 'p-2', name: 'Aceite para Barba - Cedro', price: 12, qty: 1 }], total: 52, paymentMethod: 'CARD', cashierId: 'u-barber-2', cashierName: 'Diego Santos', createdAt: addDays(0), type: 'MIXED' },
  { id: 'v-3', items: [{ productId: 'p-4', name: 'Tónico Capilar Revitalizante', price: 10, qty: 2 }], total: 20, paymentMethod: 'DIGITAL', cashierId: 'u-admin', cashierName: 'Luna Azul', createdAt: addDays(-1), type: 'PRODUCT' },
  { id: 'v-4', items: [{ serviceId: 's-2', name: 'Degradado / Skin Fade', price: 30, qty: 1 }], total: 30, paymentMethod: 'CASH', cashierId: 'u-barber-2', cashierName: 'Diego Santos', createdAt: addDays(-1), type: 'SERVICE' },
  { id: 'v-5', items: [{ serviceId: 's-3', name: 'Recorte y Perfilado de Barba', price: 18, qty: 1 }, { productId: 'p-1', name: 'Pomade - Fijación Fuerte', price: 14, qty: 1 }], total: 32, paymentMethod: 'CARD', cashierId: 'u-barber-1', cashierName: 'Marco Reyes', createdAt: addDays(-2), type: 'MIXED' },
];
