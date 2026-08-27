/**
 * Pantalla de Gestión de Personal para Administradores (AdminStaff).
 * Permite listar barberos y administradores, crear personal nuevo,
 * editar datos, cambiar especialidades, activar/desactivar y eliminar.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Star, Power } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { User, Role } from '@/types';

// Formulario inicial para el alta de miembros del equipo
const emptyForm = { name: '', email: '', password: '', role: 'BARBER' as Role, phone: '', specialties: '' };

export function AdminStaff() {
  const { users, addUser, updateUser, deleteUser, toggleBarberActive } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  // Filtrado de usuarios del equipo (Barberos y Admins)
  const barbers = users.filter(u => u.role === 'BARBER' || u.role === 'ADMIN');

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, phone: u.phone ?? '', specialties: u.specialties?.join(', ') ?? '' });
    setModalOpen(true);
  };

  // Guardar o actualizar la información del barbero/administrador
  const handleSave = () => {
    if (!form.name || !form.email) return;
    const specialties = form.specialties.split(',').map(s => s.trim()).filter(Boolean);
    if (editing) {
      updateUser({ ...editing, name: form.name, email: form.email, role: form.role, phone: form.phone, specialties });
    } else {
      addUser({ name: form.name, email: form.email, password: form.password || 'pass123', role: form.role, phone: form.phone, avatar: `https://i.pravatar.cc/150?u=${form.email}`, active: true, specialties, rating: 4.5 });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Título de la sección y botón de agregar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Personal</h2>
          <p className="text-slate-400 text-sm mt-1">Administra barberos y cuentas de administrador</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Agregar Personal</Button>
      </div>

      {/* Listado de personal en tarjetas */}
      <div className="grid sm:grid-cols-2 gap-3">
        <AnimatePresence>
          {barbers.map(u => (
            <motion.div key={u.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <Card className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <img src={u.avatar} alt="" className="w-12 h-12 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white truncate">{u.name}</h4>
                      {u.role === 'ADMIN' && <Badge status="ADMIN" className="bg-blue-500/15 text-blue-400 border-blue-500/30" />}
                    </div>
                    <p className="text-sm text-slate-400 truncate">{u.email}</p>
                    {u.phone && <p className="text-xs text-slate-500 mt-0.5">{u.phone}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(u)} className="text-slate-400 hover:text-blue-400"><Pencil className="w-4 h-4" /></button>
                    {u.role !== 'ADMIN' && (
                      <button onClick={() => setConfirmDelete(u)} className="text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>

                {/* Especialidades */}
                {u.specialties && u.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {u.specialties.map(s => <span key={s} className="text-[10px] px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">{s}</span>)}
                  </div>
                )}

                {/* Controles de estado para barberos */}
                {u.role === 'BARBER' && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      {u.rating && (
                        <span className="flex items-center gap-1 text-xs text-amber-400"><Star className="w-3 h-3 fill-current" /> {u.rating}</span>
                      )}
                      <span className={`flex items-center gap-1 text-xs ${u.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        {u.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleBarberActive(u.id)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors ${u.active ? 'text-amber-400 hover:bg-amber-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
                    >
                      <Power className="w-3 h-3" />
                      {u.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal para agregar o editar un miembro del personal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Personal' : 'Agregar Personal'} size="md">
        <div className="space-y-4">
          <Input label="Nombre Completo" placeholder="Juan Pérez" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Correo Electrónico" type="email" placeholder="barbero@lunazul.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          {!editing && <Input label="Contraseña" placeholder="Por defecto: pass123" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />}
          <div className="grid grid-cols-2 gap-3">
            <Select label="Rol" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })}>
              <option value="BARBER">Barbero</option>
              <option value="ADMIN">Administrador</option>
            </Select>
            <Input label="Teléfono" placeholder="+1 555-0100" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <Input label="Especialidades (separadas por comas)" placeholder="Degradados, Perfilado de Barba, Cortes Infantiles" value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button fullWidth onClick={handleSave}>{editing ? 'Guardar Cambios' : 'Agregar Personal'}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmación para eliminar miembro del personal */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Eliminar Miembro del Personal" size="sm">
        <p className="text-slate-300 mb-4">¿Deseas eliminar a <span className="text-white font-medium">{confirmDelete?.name}</span> del equipo de personal?</p>
        <div className="flex gap-2">
          <Button variant="ghost" fullWidth onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          <Button variant="danger" fullWidth onClick={() => { if (confirmDelete) deleteUser(confirmDelete.id); setConfirmDelete(null); }}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
