import React, { useState } from 'react';
import { Customer, Sale } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Coins, 
  Receipt, 
  FileEdit, 
  ChevronRight, 
  User, 
  ArrowLeft,
  Notebook,
  Heart,
  Plus,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientesModuleProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  sales: Sale[];
}

export default function ClientesModule({ customers, setCustomers, sales }: ClientesModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Handle Create Customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newCustomer: Customer = {
      id: 'CRM-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      name,
      phone,
      email: email || undefined,
      notes: notes || undefined,
      points: 0,
      visitCount: 0,
      totalSpent: 0,
    };

    setCustomers(prev => [...prev, newCustomer]);
    setIsAddingCustomer(false);
    
    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  // Filter customers
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Find sales for a specific customer
  const getCustomerSales = (customerId: string) => {
    return sales.filter(s => s.customerId === customerId);
  };

  return (
    <div className="w-full space-y-6 text-elote-dark animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-44 h-44 bg-blue-500/5 rounded-full blur-2xl"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2 select-none">
              <Users className="w-3.5 h-3.5" /> Clientes CRM
            </span>
            <h2 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
              Base de Datos Centralizada de Clientes
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl font-medium leading-relaxed">
              Registra consumidores, monitorea su frecuencia de compra, consulta su historial completo de consumo en el Punto de Venta y recompensa su lealtad con puntos canjeables de Elotelandia.
            </p>
          </div>
          
          <button
            onClick={() => setIsAddingCustomer(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
          >
            <UserPlus className="w-4 h-4" /> Registrar Cliente
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedCustomer ? (
          /* ==================================================== */
          /* CUSTOMER DETAIL VIEW                                 */
          /* ==================================================== */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedCustomer(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a la Lista de Clientes
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Profile Card & Stats (Col 4) */}
              <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-xl shrink-0">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">{selectedCustomer.name}</h3>
                    <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md font-mono mt-1 inline-block font-extrabold uppercase">
                      ID: {selectedCustomer.id}
                    </span>
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-3.5 text-xs text-gray-600">
                  <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-mono">Información de Contacto</h4>
                  
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="font-semibold">{selectedCustomer.phone}</span>
                  </div>

                  {selectedCustomer.email && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-semibold select-all">{selectedCustomer.email}</span>
                    </div>
                  )}

                  {selectedCustomer.notes && (
                    <div className="flex items-start gap-2.5 bg-gray-50 p-3 rounded-2xl border border-gray-100 mt-2">
                      <Notebook className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">Notas del Cliente</p>
                        <p className="text-[11px] text-gray-600 font-medium leading-relaxed mt-0.5">{selectedCustomer.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analytics Metrics Grid */}
                <div className="space-y-3.5 pt-4 border-t border-gray-100">
                  <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-mono">Métricas de Frecuencia y Consumo</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Points */}
                    <div className="bg-amber-50/50 border border-amber-200/40 p-4 rounded-2xl">
                      <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <Coins className="w-3 h-3" /> Puntos Acumulados
                      </span>
                      <p className="text-xl font-black text-[#064E3B] font-mono mt-1">{selectedCustomer.points} pts</p>
                    </div>

                    {/* Visit Count */}
                    <div className="bg-blue-50/50 border border-blue-200/40 p-4 rounded-2xl">
                      <span className="text-[9px] text-blue-800 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Frecuencia Visita
                      </span>
                      <p className="text-xl font-black text-blue-900 font-mono mt-1">{selectedCustomer.visitCount} {selectedCustomer.visitCount === 1 ? 'visita' : 'visitas'}</p>
                    </div>

                    {/* Total spent */}
                    <div className="bg-emerald-50/50 border border-emerald-200/40 p-4 rounded-2xl">
                      <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Consumo Total
                      </span>
                      <p className="text-xl font-black text-emerald-950 font-mono mt-1">${selectedCustomer.totalSpent.toFixed(2)}</p>
                    </div>

                    {/* Avg Ticket */}
                    <div className="bg-purple-50/50 border border-purple-200/40 p-4 rounded-2xl">
                      <span className="text-[9px] text-purple-800 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <Receipt className="w-3 h-3" /> Ticket Promedio
                      </span>
                      <p className="text-xl font-black text-purple-900 font-mono mt-1">
                        ${selectedCustomer.visitCount > 0 ? (selectedCustomer.totalSpent / selectedCustomer.visitCount).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>

                  {selectedCustomer.lastVisit && (
                    <p className="text-[10px] text-gray-400 font-medium font-mono text-center pt-2">
                      ÚLTIMA VISITA: {new Date(selectedCustomer.lastVisit).toLocaleString('es-MX')}
                    </p>
                  )}
                </div>
              </div>

              {/* Purchase History Ledger (Col 7) */}
              <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-gray-800">Historial de Consumo en Sucursales</h3>
                    <p className="text-xs text-gray-400 font-medium">Lista de tickets pagados por el cliente</p>
                  </div>
                  <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                    {getCustomerSales(selectedCustomer.id).length} COMPRAS
                  </span>
                </div>

                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {getCustomerSales(selectedCustomer.id).map((sale) => (
                    <div key={sale.id} className="p-4 bg-gray-50/55 hover:bg-gray-50 border border-gray-200/70 rounded-2xl transition-all space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-black text-gray-800">TICKET: #{sale.id}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{new Date(sale.date).toLocaleString('es-MX')}</p>
                        </div>
                        <span className="font-mono font-black text-emerald-700 text-sm">
                          ${sale.total.toFixed(2)}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="border-t border-gray-200/40 pt-2.5 space-y-1.5 text-xs text-gray-600 font-medium">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.productName}</span>
                            <span className="font-mono text-gray-400 text-[11px]">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono pt-1">
                        <span>PAGO: {sale.paymentMethod?.toUpperCase() || 'EFECTIVO'}</span>
                        <span>CAJERO: {sale.cashierName}</span>
                      </div>
                    </div>
                  ))}

                  {getCustomerSales(selectedCustomer.id).length === 0 && (
                    <div className="py-16 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                      <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-1.5 animate-pulse" />
                      <p className="text-xs font-bold text-gray-500">Ninguna compra registrada aún</p>
                      <p className="text-[11px] text-gray-400">Cuando este cliente se vincule en un ticket del Punto de Venta, aparecerá aquí.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ==================================================== */
          /* CUSTOMERS GRID / LIST VIEW                           */
          /* ==================================================== */
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-600 placeholder-gray-400 text-xs font-semibold shadow-2xs"
              />
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className="bg-white border border-gray-200 hover:border-blue-400 rounded-2xl p-5 hover:shadow-xs transition-all relative flex flex-col justify-between cursor-pointer group"
                >
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-16 h-16 bg-blue-500/5 group-hover:bg-blue-500/10 rounded-full blur-md transition-all"></div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-sm shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-black text-gray-800 truncate leading-tight group-hover:text-blue-600 transition-colors">
                          {customer.name}
                        </h4>
                        <span className="text-[9px] text-gray-400 font-mono font-bold tracking-wider">
                          CRM ID: {customer.id}
                        </span>
                      </div>
                    </div>

                    {/* Mini Stats Panel */}
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="bg-gray-50/70 p-2 rounded-xl border border-gray-100">
                        <span className="text-[8px] text-gray-400 font-bold uppercase font-mono tracking-wider block">Visitas</span>
                        <span className="text-xs font-black font-mono text-gray-800">{customer.visitCount}</span>
                      </div>
                      <div className="bg-gray-50/70 p-2 rounded-xl border border-gray-100">
                        <span className="text-[8px] text-gray-400 font-bold uppercase font-mono tracking-wider block">Consumo</span>
                        <span className="text-xs font-black font-mono text-emerald-700">${customer.totalSpent.toFixed(0)}</span>
                      </div>
                      <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-100/50">
                        <span className="text-[8px] text-amber-800 font-bold uppercase font-mono tracking-wider block">Puntos</span>
                        <span className="text-xs font-black font-mono text-amber-600">{customer.points}</span>
                      </div>
                    </div>

                    {/* Contact Details info row */}
                    <div className="space-y-1.5 text-[11px] text-gray-500 pt-1">
                      <p className="flex items-center gap-1.5 font-medium">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{customer.phone}</span>
                      </p>
                      {customer.email && (
                        <p className="flex items-center gap-1.5 font-medium truncate">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100/50 flex items-center justify-between text-[10px] text-blue-600 font-black uppercase tracking-wider mt-4">
                    <span>Ver Expediente de Consumo</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="col-span-full py-16 text-center text-gray-400 bg-white border border-gray-200 rounded-3xl">
                  <Users className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs font-black uppercase tracking-wider text-blue-800">Clientes no encontrados</p>
                  <p className="text-[11px] text-gray-400 mt-1">Intenta con otros términos de búsqueda o registra un nuevo cliente.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      /* REGISTER CUSTOMER DIALOG MODAL                       */
      /* ==================================================== */
      <AnimatePresence>
        {isAddingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-md border border-gray-100 text-gray-800 space-y-4"
            >
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Alta de Nuevo Cliente CRM</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Registra los datos de consumo del cliente</p>
                </div>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-500 uppercase font-mono tracking-wider block">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez García"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-gray-500 uppercase font-mono tracking-wider block">Teléfono Móvil (10 dígitos) *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="Ej. 4921002030"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').substring(0, 10))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-gray-500 uppercase font-mono tracking-wider block">Correo Electrónico (Opcional)</label>
                  <input
                    type="email"
                    placeholder="Ej. juan.perez@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-gray-500 uppercase font-mono tracking-wider block">Notas Especiales / Preferencias</label>
                  <textarea
                    placeholder="Ej. Prefiere elote desgranado muy cocido, con poca mayonesa"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomer(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-xs cursor-pointer transition-colors"
                  >
                    Agregar Cliente
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
