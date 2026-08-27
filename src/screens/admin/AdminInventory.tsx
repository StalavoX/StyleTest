/**
 * Pantalla de Gestión de Inventario para Administradores (AdminInventory).
 * Permite buscar productos, ver alertas de stock bajo, agregar, editar y eliminar productos.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Package, AlertTriangle, Search } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import type { Product } from '@/types';

// Formulario inicial vacío para nuevos productos
const emptyForm = { name: '', category: '', brand: '', price: 0, stockActual: 0, stockMinimo: 0 };

export function AdminInventory() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  // Filtrado reactivo de productos por búsqueda de nombre o categoría
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  const lowStockCount = products.filter(p => p.stockActual <= p.stockMinimo).length;

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, category: p.category, brand: p.brand, price: p.price, stockActual: p.stockActual, stockMinimo: p.stockMinimo }); setModalOpen(true); };

  // Guardar o actualizar producto en la base de datos local
  const handleSave = () => {
    if (!form.name || !form.category) return;
    if (editing) {
      updateProduct({ ...editing, ...form });
    } else {
      addProduct(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Encabezado y botón de nuevo producto */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Inventario de Productos</h2>
          <p className="text-slate-400 text-sm mt-1">{products.length} productos · {lowStockCount} con stock bajo</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>Agregar Producto</Button>
      </div>

      {/* Buscador de productos */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          placeholder="Buscar productos por nombre o categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Tabla completa para pantallas de escritorio */}
      <div className="hidden lg:block">
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Producto</th>
                <th className="text-left px-4 py-3 font-medium">Categoría</th>
                <th className="text-left px-4 py-3 font-medium">Precio</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Mínimo</th>
                <th className="text-right px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(p => (
                  <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-white font-medium">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.category}</td>
                    <td className="px-4 py-3 text-blue-400 font-medium">${p.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={p.stockActual <= p.stockMinimo ? 'text-red-400 font-medium' : 'text-white'}>{p.stockActual}</span>
                        {p.stockActual <= p.stockMinimo && (
                          <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                            <AlertTriangle className="w-3 h-3" /> Bajo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{p.stockMinimo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-blue-400"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDelete(p)} className="text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </Card>
      </div>

      {/* Vista en tarjetas para dispositivos móviles */}
      <div className="lg:hidden space-y-3">
        {filtered.map(p => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-white font-medium">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.brand} · {p.category}</p>
                </div>
              </div>
              <span className="text-blue-400 font-bold">${p.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Stock:</span>
                <span className={`text-sm font-medium ${p.stockActual <= p.stockMinimo ? 'text-red-400' : 'text-white'}`}>{p.stockActual}</span>
                <span className="text-xs text-slate-500">/ {p.stockMinimo} mín</span>
                {p.stockActual <= p.stockMinimo && (
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                    <AlertTriangle className="w-3 h-3" /> Bajo
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-blue-400"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setConfirmDelete(p)} className="text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal para agregar o editar producto */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Producto' : 'Agregar Producto'} size="md">
        <div className="space-y-4">
          <Input label="Nombre del Producto" placeholder="Ej. Pomada - Fijación Fuerte" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Categoría" placeholder="Cabello, Barba..." value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <Input label="Marca" placeholder="Nombre de la marca" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
          </div>
          <Input label="Precio ($)" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Stock Actual" type="number" value={form.stockActual} onChange={e => setForm({ ...form, stockActual: Number(e.target.value) })} />
            <Input label="Stock Mínimo" type="number" value={form.stockMinimo} onChange={e => setForm({ ...form, stockMinimo: Number(e.target.value) })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button fullWidth onClick={handleSave}>{editing ? 'Guardar Cambios' : 'Agregar Producto'}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmación para eliminar producto */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Eliminar Producto" size="sm">
        <p className="text-slate-300 mb-4">¿Estás seguro de que deseas eliminar <span className="text-white font-medium">{confirmDelete?.name}</span>?</p>
        <div className="flex gap-2">
          <Button variant="ghost" fullWidth onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          <Button variant="danger" fullWidth onClick={() => { if (confirmDelete) deleteProduct(confirmDelete.id); setConfirmDelete(null); }}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
