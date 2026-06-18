import React, { useState } from 'react';
import { CorteDeCaja, Sale } from '../types';
import { 
  Coins, 
  CreditCard, 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  History, 
  User, 
  ShieldAlert, 
  CalendarDays, 
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CorteModuleProps {
  sales: Sale[];
  cortes: CorteDeCaja[];
  role: 'Administrador General' | 'Gerente de Sucursal' | 'Cajero';
  cashierName: string;
  onAddCorte: (corte: CorteDeCaja) => void;
  onUpdateCorteStatus: (corteId: string, status: 'Aprobado' | 'Rechazado') => void;
}

export default function CorteModule({ 
  sales, 
  cortes, 
  role, 
  cashierName, 
  onAddCorte, 
  onUpdateCorteStatus 
}: CorteModuleProps) {
  // Cajero Inputs
  const [actualCash, setActualCash] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Admin Filters
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Aprobado' | 'Pendiente' | 'Rechazado'>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Calculate Expected Today's Sales for the logged-in Cashier (or total if Admin wants preview)
  const todayStr = new Date().toISOString().split('T')[0];
  
  // For cashier, only show their own today's sales
  const cashierTodaySales = sales.filter(s => {
    const isToday = s.date.includes(todayStr);
    const isOwner = role === 'Cajero' ? s.cashierName === cashierName : true;
    return isToday && isOwner;
  });

  const expectedCashAmount = cashierTodaySales
    .filter(s => s.paymentMethod === 'efectivo' || !s.paymentMethod) // default to cash if omitted
    .reduce((sum, s) => sum + s.total, 0);

  const expectedCardAmount = cashierTodaySales
    .filter(s => s.paymentMethod === 'tarjeta')
    .reduce((sum, s) => sum + s.total, 0);

  const expectedTotalSales = expectedCashAmount + expectedCardAmount;

  // Handle Cashier closeout submit
  const handleRegisterCorte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualCash) return;

    const actualCashNum = parseFloat(actualCash);
    const diff = actualCashNum - expectedCashAmount;

    const newCorte: CorteDeCaja = {
      id: 'CRT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: new Date().toISOString(),
      cashierName: cashierName,
      totalCash: expectedCashAmount,
      totalCard: expectedCardAmount,
      totalSales: expectedTotalSales,
      expectedCash: expectedCashAmount,
      actualCash: actualCashNum,
      difference: diff,
      notes: notes.trim() || undefined,
      status: 'Pendiente'
    };

    onAddCorte(newCorte);
    setSuccessMsg(`Corte registrado con éxito (${newCorte.id}) por un total de $${expectedTotalSales.toFixed(2)}.`);
    setActualCash('');
    setNotes('');

    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  // Filtered cortes for list
  const filteredCortes = cortes.filter(c => {
    const matchesRole = role === 'Cajero' ? c.cashierName === cashierName : true;
    const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
    const matchesSearch = c.cashierName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full space-y-8 animate-fade-in">
      
      {/* Banner / Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 bg-[#10B981]/10 text-[#047857] border border-[#10B981]/20 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
              <ClipboardList className="w-3.5 h-3.5" /> Módulo de Arqueos
            </span>
            <h2 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
              Corte de Caja (Cierre de Turno)
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xl font-medium">
              {role === 'Cajero' 
                ? 'Calcula las ventas en efectivo y tarjeta del día, ingresa el dinero físico contado y registra el cierre de tu turno de forma formal.'
                : 'Supervisa y dictamina los arqueos enviados por los cajeros de la sucursal. Aprueba o rechaza los cierres de caja.'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-center text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Coins className="w-3.5 h-3.5 animate-pulse" />
            <span>Canto de Caja Activo</span>
          </div>
        </div>
      </div>

      {/* SUCCESS ALERTS */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-2.5 shadow-2xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-black text-emerald-800">Corte Enviado a Revisión</p>
              <p className="text-emerald-600 font-medium mt-0.5">{successMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================= */}
        {/* LEFT PANEL: CASHIER INPUT OR ADMIN OVERVIEW             */}
        {/* ======================================================= */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {role === 'Cajero' ? (
            /* Cashier closeout drawer */
            <form onSubmit={handleRegisterCorte} className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/5 rounded-full blur-xl"></div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#064E3B] tracking-tight">Preparar Mi Corte</h3>
                <p className="text-xs text-gray-400 font-semibold font-mono uppercase tracking-wider">Hoy: {todayStr}</p>
              </div>

              {/* EXPECTED AMOUNTS PANEL */}
              <div className="bg-[#FEFCE8]/40 border border-amber-200/40 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center text-xs text-gray-500 pb-2 border-b border-amber-200/20">
                  <span className="font-extrabold text-[#064E3B] uppercase tracking-wider font-mono text-[10px]">Esperado en Sistema</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-mono font-black">{cashierTodaySales.length} órdenes</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                      <Coins className="w-3.5 h-3.5 text-amber-500" /> En Efectivo
                    </span>
                    <p className="text-base font-extrabold text-gray-800 font-mono">${expectedCashAmount.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> En Tarjeta
                    </span>
                    <p className="text-base font-extrabold text-gray-800 font-mono">${expectedCardAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500">Suma Total Esperada:</span>
                  <span className="text-lg font-black text-amber-600 font-mono">${expectedTotalSales.toFixed(2)}</span>
                </div>
              </div>

              {/* ACTUAL PHYSICAL COUNT */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono block">Efectivo Físico Contado ($)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono font-black text-sm select-none">$</span>
                    <input 
                      type="number"
                      required
                      step="any"
                      min="0"
                      placeholder="Dinero real en la gaveta..."
                      value={actualCash}
                      onChange={(e) => setActualCash(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-sm font-semibold text-gray-800 shadow-2xs"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    Ingresa exactamente el monto físico cobrado en efectivo para calcular si hay un sobrante o faltante.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono block">Notas / Observaciones</label>
                  <textarea 
                    placeholder="Menciona algún incidente con el cambio, tickets devueltos, etc..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-sm font-medium text-gray-800 shadow-2xs resize-none"
                  ></textarea>
                </div>
              </div>

              {/* PROJECTION COMPONENT */}
              {actualCash && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between transition-all">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">Diferencia de Arqueo</span>
                    <p className={`text-sm font-black font-mono leading-none mt-1 ${
                      parseFloat(actualCash) - expectedCashAmount === 0 
                        ? 'text-emerald-700' 
                        : parseFloat(actualCash) - expectedCashAmount < 0 
                          ? 'text-red-600' 
                          : 'text-amber-600'
                    }`}>
                      ${(parseFloat(actualCash) - expectedCashAmount).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    {parseFloat(actualCash) - expectedCashAmount === 0 ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md font-bold uppercase font-mono">Cuadrado Exacto</span>
                    ) : parseFloat(actualCash) - expectedCashAmount < 0 ? (
                      <span className="text-[10px] bg-red-100 text-red-800 px-2 py-1 rounded-md font-bold uppercase font-mono">Faltante</span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded-md font-bold uppercase font-mono">Sobrante</span>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-black text-sm py-3 px-4 rounded-xl transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Registrar & Enviar Corte
              </button>

            </form>
          ) : (
            /* Admin summary stats box */
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-[#064E3B]/5 rounded-full blur-xl"></div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#064E3B] tracking-tight">Tablero Administrador</h3>
                <p className="text-xs text-gray-400 font-semibold font-mono uppercase tracking-wider">Métricas de Arqueos</p>
              </div>

              {/* General Cortes indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 bg-[#FEFCE8]/40 border border-amber-200/30 p-4 rounded-2xl">
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                    <History className="w-3.5 h-3.5" /> Pendientes
                  </span>
                  <p className="text-2xl font-black text-[#064E3B] font-mono">
                    {cortes.filter(c => c.status === 'Pendiente').length}
                  </p>
                  <span className="text-[10px] text-gray-400 font-semibold block">Requieren dictamen</span>
                </div>

                <div className="space-y-1 bg-emerald-50/40 border border-emerald-200/30 p-4 rounded-2xl">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aprobados Hoy
                  </span>
                  <p className="text-2xl font-black text-emerald-700 font-mono">
                    {cortes.filter(c => c.status === 'Aprobado').length}
                  </p>
                  <span className="text-[10px] text-gray-400 font-semibold block">Cerrados formalmente</span>
                </div>
              </div>

              {/* Total money collected in Approved cuts */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-mono">Caja Total Consolidada</span>
                  <p className="text-xl font-black text-[#064E3B] font-mono">
                    ${cortes
                      .filter(c => c.status === 'Aprobado')
                      .reduce((sum, c) => sum + c.actualCash, 0).toFixed(2)
                    }
                  </p>
                </div>
                <div className="w-10 h-10 bg-[#064E3B]/10 rounded-xl flex items-center justify-center text-[#064E3B]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              {/* Alert standard helper text for admin auditor */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-amber-950">Lineamientos Generales</p>
                  <p className="text-[10px] text-amber-800 opacity-90 leading-relaxed font-sans">
                    Compare los depósitos del banco o arqueos físicos con el reporte en pantalla. Todo rechazo debe comunicarse al cajero responsable para su reintento y aclaración correspondiente.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ======================================================= */}
        {/* RIGHT PANEL: ARQUEO LOGS (TABLE/CARDS LIST)             */}
        {/* ======================================================= */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
          
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-[#064E3B] tracking-tight">Historial de Turnos</h3>
                <p className="text-xs text-gray-500 font-medium">Búsqueda y estado de los cortes de caja del local.</p>
              </div>

              {/* Admin filters action bar */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl px-2.5 py-1.5">
                  <ListFilter className="w-3.5 h-3.5 text-gray-400" />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="text-xs font-bold text-gray-700 bg-transparent border-none outline-none focus:ring-0"
                  >
                    <option value="todos">Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobar</option>
                    <option value="Rechazado">Rechazados</option>
                  </select>
                </div>

                {role !== 'Cajero' && (
                  <input 
                    type="text"
                    placeholder="Buscar cajero..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B] placeholder-gray-400 shadow-2xs max-w-[150px]"
                  />
                )}
              </div>
            </div>

            {/* LIST OF CORTES */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {filteredCortes.map((item) => {
                  const isNegativeDiff = item.difference < 0;
                  const absDiff = Math.abs(item.difference);

                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="border border-gray-100 rounded-2xl p-4 hover:shadow-xs transition-all bg-white relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            item.status === 'Aprobado' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : item.status === 'Rechazado' 
                                ? 'bg-red-50 text-red-600 border-red-100' 
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {item.status === 'Aprobado' ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : item.status === 'Rechazado' ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 animate-pulse" />
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-[#064E3B] text-sm tracking-tight font-sans">
                                {item.cashierName}
                              </span>
                              <span className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-400 font-semibold">
                                {item.id}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">
                              {new Date(item.date).toLocaleString('es-MX')}
                            </p>
                          </div>
                        </div>

                        {/* Status tag */}
                        <div className="self-start sm:self-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider border ${
                            item.status === 'Aprobado' 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : item.status === 'Rechazado' 
                                ? 'bg-red-100 text-red-800 border-red-200' 
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* Financial values overview */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-50 text-xs text-gray-600 select-none">
                        <div>
                          <span className="text-gray-400 font-semibold block text-[10px]">Esperado Cash</span>
                          <span className="font-mono font-bold text-gray-800">${item.totalCash.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold block text-[10px]">Contado Real</span>
                          <span className="font-mono font-black text-[#064E3B]">${item.actualCash.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold block text-[10px]">Ventas Tarjeta</span>
                          <span className="font-mono font-bold text-gray-800">${item.totalCard.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold block text-[10px]">Diferencia</span>
                          <span className={`font-mono font-black ${isNegativeDiff ? 'text-red-600' : item.difference > 0 ? 'text-amber-500' : 'text-emerald-700'}`}>
                            {item.difference > 0 ? '+' : ''}${item.difference.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Observation notes */}
                      {item.notes && (
                        <div className="mt-3 bg-[#FEFCE8]/35 p-2.5 rounded-xl border border-amber-100 text-[11px] text-amber-900 leading-normal font-sans">
                          <strong>Comentario del Cajero:</strong> {item.notes}
                        </div>
                      )}

                      {/* ADMIN DICTAME ACTION AREA */}
                      {role !== 'Cajero' && item.status === 'Pendiente' && (
                        <div className="flex gap-2.5 mt-4 pt-3 border-t border-gray-50 justify-end">
                          <button
                            onClick={() => onUpdateCorteStatus(item.id, 'Rechazado')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white transition-all text-xs font-black rounded-lg cursor-pointer border border-red-200 hover:border-transparent scale-[1.01] active:scale-[0.99]"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Rechazar Corte
                          </button>
                          <button
                            onClick={() => onUpdateCorteStatus(item.id, 'Aprobado')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-[#047857] hover:text-white transition-all text-xs font-black rounded-lg cursor-pointer border border-emerald-200 hover:border-transparent scale-[1.01] active:scale-[0.99]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Aprobar & Cerrar Caja
                          </button>
                        </div>
                      )}

                    </motion.div>
                  );
                })}

                {filteredCortes.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400">
                    <History className="w-10 h-10 mb-2 text-gray-200" />
                    <p className="text-xs font-extrabold uppercase tracking-widest text-[#064E3B] opacity-50">No hay arqueos para mostrar</p>
                    <p className="text-[11px] text-gray-400 mt-1">Los arqueos enviados aparecerán listados en este casillero.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
