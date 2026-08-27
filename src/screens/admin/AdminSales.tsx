/**
 * Pantalla de Caja y Punto de Venta (POS) para Administradores (AdminSales).
 * Permite registrar ventas de servicios y productos, seleccionar métodos de pago
 * y consultar transacciones recientes.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShoppingBag, Scissors, Receipt, DollarSign } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import type { SaleItem, PaymentMethod, Sale } from '@/types';

// Traducciones para métodos de pago
const paymentLabels: Record<PaymentMethod, string> = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  DIGITAL: 'Digital',
};

export function AdminSales() {
  const { services, products, sales, addSale } = useData();
  const { user } = useAuth();
  const [registerOpen, setRegisterOpen] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const todaySales = sales.filter(s => s.createdAt === today);
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-5">
      {/* Título y botón para nueva venta */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Registro de Caja y Ventas</h2>
          <p className="text-slate-400 text-sm mt-1">Registra los servicios realizados y ventas de productos</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setRegisterOpen(true)}>Nueva Venta</Button>
      </div>

      {/* Tarjetas resumen de caja del día */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/15 flex items-center justify-center text-emerald-400 mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xl font-bold text-white">${todayTotal}</p>
          <p className="text-xs text-slate-400">Total de Hoy</p>
        </Card>
        <Card className="p-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center text-blue-400 mb-2">
            <Receipt className="w-5 h-5" />
          </div>
          <p className="text-xl font-bold text-white">{todaySales.length}</p>
          <p className="text-xs text-slate-400">Transacciones</p>
        </Card>
        <Card className="p-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center text-indigo-400 mb-2">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <p className="text-xl font-bold text-white">{sales.length}</p>
          <p className="text-xs text-slate-400">Histórico Total</p>
        </Card>
      </div>

      {/* Lista de transacciones recientes */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Transacciones Recientes</h3>
        <AnimatePresence>
          {sales.slice(0, 20).map(s => (
            <motion.div key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge status={s.type} />
                    <Badge status={s.paymentMethod} />
                  </div>
                  <span className="text-emerald-400 font-bold">${s.total}</span>
                </div>
                <div className="space-y-1">
                  {s.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.qty}× {item.name}</span>
                      <span className="text-slate-400">${item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-white/5">
                  <span>Cajero: {s.cashierName}</span>
                  <span>{s.createdAt}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <SaleRegister open={registerOpen} onClose={() => setRegisterOpen(false)} services={services} products={products} onAdd={addSale} user={user} />
    </div>
  );
}

interface SaleRegisterProps {
  open: boolean;
  onClose: () => void;
  services: ReturnType<typeof useData>['services'];
  products: ReturnType<typeof useData>['products'];
  onAdd: ReturnType<typeof useData>['addSale'];
  user: ReturnType<typeof useAuth>['user'];
}

/**
 * Modal interactivo para el registro de ventas (Punto de Venta POS)
 */
function SaleRegister({ open, onClose, services, products, onAdd, user }: SaleRegisterProps) {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [tab, setTab] = useState<'service' | 'product'>('service');

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const type = items.some(i => i.serviceId) && items.some(i => i.productId) ? 'MIXED' : items.some(i => i.serviceId) ? 'SERVICE' : 'PRODUCT';

  // Añade un ítem al carrito o incrementa la cantidad si ya existe
  const addItem = (item: SaleItem) => {
    setItems(prev => {
      const existing = prev.find(i => (i.serviceId && i.serviceId === item.serviceId) || (i.productId && i.productId === item.productId));
      if (existing) {
        return prev.map(i => i === existing ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, item];
    });
  };

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  // Procesa y confirma la venta en caja
  const handleCheckout = () => {
    if (items.length === 0 || !user) return;
    onAdd({ items, total, paymentMethod, cashierId: user.id, cashierName: user.name, type: type as Sale['type'] });
    setItems([]);
    setPaymentMethod('CASH');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Registrar Nueva Venta" size="lg">
      {/* Pestañas de categoría (Servicios / Productos) */}
      <div className="flex gap-1 bg-slate-900/50 rounded-xl p-1 mb-4">
        {(['service', 'product'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${tab === t ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
            {t === 'service' ? <Scissors className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            {t === 'service' ? 'Servicios' : 'Productos'}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Catálogo seleccionable */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {tab === 'service' ? (
            services.map(s => (
              <button key={s.id} onClick={() => addItem({ serviceId: s.id, name: s.name, price: s.price, qty: 1 })} className="w-full flex items-center justify-between p-3 bg-slate-900/40 rounded-xl hover:bg-slate-900/70 transition-colors text-left">
                <div>
                  <p className="text-sm text-white font-medium">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.durationMin} min</p>
                </div>
                <span className="text-blue-400 font-medium">${s.price}</span>
              </button>
            ))
          ) : (
            products.map(p => (
              <button key={p.id} onClick={() => addItem({ productId: p.id, name: p.name, price: p.price, qty: 1 })} className="w-full flex items-center justify-between p-3 bg-slate-900/40 rounded-xl hover:bg-slate-900/70 transition-colors text-left">
                <div>
                  <p className="text-sm text-white font-medium">{p.name}</p>
                  <p className="text-xs text-slate-500">Stock: {p.stockActual}</p>
                </div>
                <span className="text-blue-400 font-medium">${p.price}</span>
              </button>
            ))
          )}
        </div>

        {/* Resumen de Carrito */}
        <div>
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No se han agregado elementos al carrito
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-900/40 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.qty}× ${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">${item.price * item.qty}</span>
                    <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selección de Método de Pago */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Método de Pago</label>
            <div className="grid grid-cols-3 gap-2">
              {(['CASH', 'CARD', 'DIGITAL'] as PaymentMethod[]).map(m => (
                <button key={m} onClick={() => setPaymentMethod(m)} className={`py-2 text-xs font-medium rounded-lg border transition-all ${paymentMethod === m ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/10 text-slate-400'}`}>
                  {paymentLabels[m]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Total a Pagar y Botones de Acción */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
        <div>
          <p className="text-xs text-slate-500">Total a Pagar</p>
          <p className="text-2xl font-bold text-emerald-400">${total}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => { setItems([]); onClose(); }}>Cancelar</Button>
          <Button variant="success" disabled={items.length === 0} onClick={handleCheckout}>Completar Venta</Button>
        </div>
      </div>
    </Modal>
  );
}
