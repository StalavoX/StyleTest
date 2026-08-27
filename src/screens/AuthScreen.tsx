/**
 * Pantalla de Autenticación (AuthScreen).
 * Permite a los usuarios iniciar sesión, registrarse, recuperar su contraseña
 * e ingresar mediante simulación de Google OAuth.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { Role } from '@/types';

// Traducción para mostrar los nombres de los roles en la selección de tipo de cuenta
const roleLabels: Record<Role, string> = {
  CLIENT: 'Cliente',
  BARBER: 'Barbero',
  ADMIN: 'Administrador',
};

export function AuthScreen() {
  const { login, register, loginWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('CLIENT');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  // Procesa el envío del formulario de inicio de sesión o registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = mode === 'login'
      ? await login(email, password)
      : await register(name, email, password, role);
    setLoading(false);
    if (!result.success) setError(result.error || 'Ocurrió un error inesperado');
  };

  // Maneja el inicio de sesión con Google (Demo)
  const handleGoogle = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
  };

  // Procesa la solicitud de recuperación de contraseña
  const handleReset = async () => {
    const r = await resetPassword(resetEmail);
    setResetMsg(r.success ? 'Se ha enviado un enlace de restablecimiento a tu correo' : r.error || 'Error');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luces ambientales de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logotipo y Título */}
        <div className="flex flex-col items-center mb-8">
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
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === m ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                {m === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <Input
                    label="Nombre Completo"
                    placeholder="Juan Pérez"
                    icon={<UserIcon className="w-4 h-4" />}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </motion.div>
              )}
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
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo de Cuenta</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['CLIENT', 'BARBER', 'ADMIN'] as Role[]).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 text-xs font-medium rounded-lg border transition-all ${role === r ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/10 text-slate-400'}`}
                      >
                        {roleLabels[r]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" onClick={() => { setResetOpen(true); setResetMsg(''); }} className="text-xs text-blue-400 hover:text-blue-300">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
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
    </div>
  );
}
