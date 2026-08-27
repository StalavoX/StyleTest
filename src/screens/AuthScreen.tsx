/**
 * Pantalla de Autenticación (AuthScreen).
 * Permite a los usuarios iniciar sesión, registrarse como clientes con campos completos
 * (Usuario, Nombres, Apellidos, Cédula, Fecha de Nacimiento, Correo y Contraseña),
 * validar errores y simular autenticación con Google OAuth.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, CheckCircle2, IdCard, Calendar, AtSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export function AuthScreen() {
  const { login, register, loginWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Campos para Registro de Usuario / Cliente
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cedula, setCedula] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [googleOpen, setGoogleOpen] = useState(false);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState<string | null>(null);

  // Validador de formulario de registro
  const validateRegister = (): string[] => {
    const errs: string[] = [];
    if (!username.trim()) errs.push('El nombre de usuario es obligatorio.');
    else if (username.trim().length < 3) errs.push('El usuario debe tener al menos 3 caracteres.');

    if (!firstName.trim()) errs.push('El campo de nombres es obligatorio.');
    if (!lastName.trim()) errs.push('El campo de apellidos es obligatorio.');

    if (!cedula.trim()) errs.push('La cédula de ciudadanía es obligatoria.');
    else if (!/^\d{5,12}$/.test(cedula.trim())) errs.push('La cédula debe ser numérica (entre 5 y 12 dígitos).');

    if (!birthDate) errs.push('La fecha de nacimiento es obligatoria.');

    if (!email.trim()) errs.push('El correo electrónico es obligatorio.');
    else if (!/\S+@\S+\.\S+/.test(email)) errs.push('El formato del correo electrónico es inválido.');

    if (!password) errs.push('La contraseña es obligatoria.');
    else if (password.length < 6) errs.push('La contraseña debe tener al menos 6 caracteres.');

    return errs;
  };

  // Procesa el envío del formulario de inicio de sesión o registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (mode === 'register') {
      const valErrors = validateRegister();
      if (valErrors.length > 0) {
        setErrors(valErrors);
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setErrors(['Por favor ingresa tu correo y contraseña.']);
        return;
      }
    }

    setLoading(true);
    if (mode === 'login') {
      const result = await login(email, password);
      setLoading(false);
      if (!result.success) setErrors([result.error || 'Ocurrió un error al iniciar sesión']);
    } else {
      const result = await register({
        username,
        firstName,
        lastName,
        cedula,
        birthDate,
        email,
        password,
      });
      setLoading(false);
      if (!result.success) setErrors([result.error || 'Ocurrió un error al crear la cuenta']);
    }
  };

  // Abre el popup simulado de Google para seleccionar cuenta
  const handleGoogle = () => {
    setGoogleOpen(true);
    setSelectedGoogleEmail(null);
  };

  // Procesa la selección de una cuenta en el modal de Google
  const handleSelectGoogleAccount = async (accountEmail: string) => {
    setSelectedGoogleEmail(accountEmail);
    setTimeout(async () => {
      await loginWithGoogle(accountEmail);
      setGoogleOpen(false);
      setSelectedGoogleEmail(null);
    }, 900);
  };

  // Procesa la solicitud de recuperación de contraseña
  const handleReset = async () => {
    const r = await resetPassword(resetEmail);
    setResetMsg(r.success ? 'Se ha enviado un enlace de restablecimiento a tu correo' : r.error || 'Error');
  };

  const googleAccounts = [
    { name: 'Carlos Mendoza', email: 'carlos@email.com', role: 'Cliente', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Marco Reyes', email: 'marco@lunazul.com', role: 'Barbero', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Luna Azul Admin', email: 'admin@lunazul.com', role: 'Administrador', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luces ambientales de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md my-8"
      >
        {/* Logotipo y Título */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/30 mb-4"
          >
            <Scissors className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Barbería Luna Azul</h1>
          <p className="text-slate-400 mt-1">Gestión Premium de Barbería</p>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          {/* Alternador de Modo (Iniciar Sesión / Crear Cuenta) */}
          <div className="flex gap-1 bg-slate-900/50 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setErrors([]); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === m ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                {m === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' ? (
                <motion.div
                  key="register-fields"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3"
                >
                  <Input
                    label="Nombre de Usuario"
                    placeholder="ej. juanperez99"
                    icon={<AtSign className="w-4 h-4 text-slate-400" />}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Nombres"
                      placeholder="Juan Carlos"
                      icon={<UserIcon className="w-4 h-4 text-slate-400" />}
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                    />
                    <Input
                      label="Apellidos"
                      placeholder="Pérez Gómez"
                      icon={<UserIcon className="w-4 h-4 text-slate-400" />}
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Cédula de Ciudadanía"
                      placeholder="1098765432"
                      icon={<IdCard className="w-4 h-4 text-slate-400" />}
                      value={cedula}
                      onChange={e => setCedula(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <Input
                      label="Fecha de Nacimiento"
                      type="date"
                      icon={<Calendar className="w-4 h-4 text-slate-400" />}
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-slate-500 hover:text-slate-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Pantalla y Contenedor de Posibles Errores */}
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-300 space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-red-400 mb-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Se encontraron los siguientes errores:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setResetOpen(true); setResetMsg(''); }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              {mode === 'login' ? 'Iniciar Sesión' : 'Registrarme como Cliente'}
            </Button>
          </form>

          {/* Separador visual */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">O</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Inicio de sesión rápido con Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/15 text-slate-200 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Continuar con Google
          </button>
        </div>

        {/* Indicación de cuentas de demostración */}
        <div className="mt-6 bg-slate-800/40 border border-white/5 rounded-xl p-4 text-xs text-slate-400">
          <p className="text-slate-300 font-medium mb-2">Cuentas de Demostración:</p>
          <p>Cliente: carlos@email.com / carlos123</p>
          <p>Barbero: marco@lunazul.com / marco123</p>
          <p>Admin: admin@lunazul.com / admin123</p>
        </div>
      </motion.div>

      {/* Modal para restablecer contraseña */}
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Restablecer Contraseña" size="sm">
        <div className="space-y-4">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            icon={<Mail className="w-4 h-4" />}
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
          />
          {resetMsg && (
            <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${resetMsg.includes('enviado') ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
              {resetMsg.includes('enviado') ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {resetMsg}
            </div>
          )}
          <Button fullWidth onClick={handleReset}>Enviar Enlace de Restablecimiento</Button>
        </div>
      </Modal>

      {/* Modal Simulado de Inicio de Sesión con Google */}
      <Modal open={googleOpen} onClose={() => !selectedGoogleEmail && setGoogleOpen(false)} title="" size="sm">
        <div className="text-center pb-2">
          {/* Logo Google oficial */}
          <div className="flex justify-center mb-3">
            <svg className="w-10 h-10" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-white">Elige una cuenta</h3>
          <p className="text-xs text-slate-400 mt-1">para continuar en <span className="text-blue-400 font-medium">Barbería Luna Azul</span></p>
        </div>

        <div className="mt-4 space-y-2">
          {googleAccounts.map(acc => {
            const isLoading = selectedGoogleEmail === acc.email;
            return (
              <button
                key={acc.email}
                disabled={!!selectedGoogleEmail}
                onClick={() => handleSelectGoogleAccount(acc.email)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isLoading
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5 text-white'
                }`}
              >
                <img src={acc.avatar} alt={acc.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/20" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white truncate">{acc.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                      {acc.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{acc.email}</p>
                </div>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {selectedGoogleEmail ? (
          <div className="mt-4 pt-3 border-t border-white/10 text-center">
            <p className="text-xs text-blue-400 animate-pulse">Autenticando cuenta con Google OAuth...</p>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setGoogleOpen(false)}>
              Cancelar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
