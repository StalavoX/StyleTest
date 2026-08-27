/**
 * Contexto de Autenticación de Usuarios.
 * Administra la sesión del usuario actual, inicio de sesión, registro,
 * simulación de Google OAuth y restablecimiento de contraseña.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Role } from '@/types';
import { mockUsers } from '@/data/mockData';

// Interfaz para el valor proveído por AuthContext
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: Role) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Clave para guardar la sesión en el almacenamiento local del navegador
const STORAGE_KEY = 'luna_azul_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar el componente, intentamos recuperar la sesión almacenada en localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* Ignorar errores de parseo */ }
    }
    setLoading(false);
  }, []);

  // Función auxiliar para actualizar el estado del usuario y la persistencia local
  const persist = (u: User | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
    setUser(u);
  };

  // Iniciar sesión con correo y contraseña
  const login = useCallback(async (email: string, password: string) => {
    const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { success: false, error: 'Correo o contraseña incorrectos' };
    const { password: _, ...safe } = found;
    persist(safe as User);
    return { success: true };
  }, []);

  // Registrar un nuevo usuario
  const register = useCallback(async (name: string, email: string, password: string, role: Role) => {
    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'El correo electrónico ya se encuentra registrado' };
    }
    const newUser: User = {
      id: `u-${Date.now()}`,
      name, email, password, role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      active: true,
    };
    const { password: _, ...safe } = newUser;
    persist(safe as User);
    return { success: true };
  }, []);

  // Simulación de inicio de sesión con Google OAuth (permite elegir cuenta)
  const loginWithGoogle = useCallback(async (email?: string) => {
    const found = email ? mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) : null;
    const target = found || mockUsers.find(u => u.role === 'CLIENT') || mockUsers[0];
    const { password: _, ...safe } = target;
    persist(safe as User);
  }, []);

  // Cerrar la sesión actual
  const logout = useCallback(() => persist(null), []);

  // Simulación de envío de enlace para restablecer la contraseña
  const resetPassword = useCallback(async (email: string) => {
    const found = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, error: 'No existe ninguna cuenta asociada a este correo electrónico' };
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para acceder al contexto de autenticación de forma segura
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  return ctx;
}
