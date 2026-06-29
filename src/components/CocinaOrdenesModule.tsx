import React, { useState, useEffect } from 'react';
import { ComandaCocina, Product, SaleItem, Insumo } from '../types';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  CornerDownRight, 
  Utensils, 
  Flame, 
  Search, 
  Info,
  Layers,
  AlertTriangle,
  History,
  Timer,
  BookOpen,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CocinaOrdenesModuleProps {
  comandas: ComandaCocina[];
  setComandas: React.Dispatch<React.SetStateAction<ComandaCocina[]>>;
  products: Product[];
  insumos: Insumo[];
}

export default function CocinaOrdenesModule({ 
  comandas, 
  setComandas, 
  products,
  insumos
}: CocinaOrdenesModuleProps) {
  const [activeTab, setActiveTab] = useState<'activas' | 'historial'>('activas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComandaForRecipe, setSelectedComandaForRecipe] = useState<string | null>(null);
  
  // Track checklist per item in comanda: comandaId-itemIndex-ingredientIndex -> boolean
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Real-time ticking force-update
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter comandas
  const activeComandas = comandas.filter(c => c.status !== 'Entregado');
  const completedComandas = comandas.filter(c => c.status === 'Entregado');

  const displayedComandas = activeTab === 'activas' ? activeComandas : completedComandas;

  const filteredComandas = displayedComandas.filter(c => 
    c.orderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.items.some(i => i.productName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Status transitions
  const handleStartPrep = (id: string) => {
    setComandas(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Preparando',
          tiempoInicio: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const handleFinishPrep = (id: string) => {
    // Simulated bell ring audio if supported
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.1); // E6 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio feedback not allowed or supported yet');
    }

    setComandas(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Listo',
          tiempoFin: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const handleDeliverOrder = (id: string) => {
    setComandas(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Entregado'
        };
      }
      return c;
    }));
  };

  // Quick Injector for Testability
  const handleSimulateComanda = () => {
    const randomNames = ['Mesa 3 (María)', 'Para Llevar - Juan P.', 'Mesa 10 (Familia)', 'Pedido Rápido Carlos', 'Mesa 1 (VIP)'];
    const selectedName = randomNames[Math.floor(Math.random() * randomNames.length)];
    
    // Choose 1 or 2 products
    const activeProducts = products.filter(p => p.isActive);
    if (activeProducts.length === 0) return;
    
    const qtyProducts = Math.floor(Math.random() * 2) + 1;
    const items: SaleItem[] = [];
    
    for (let i = 0; i < qtyProducts; i++) {
      const prod = activeProducts[Math.floor(Math.random() * activeProducts.length)];
      
      // Random modifiers
      const mods = [];
      if (Math.random() > 0.4) {
        mods.push({ name: '+ Queso Cotija Extra', priceDelta: 10 });
      }
      if (Math.random() > 0.6) {
        mods.push({ name: 'Sin Chile', priceDelta: 0 });
      }
      if (Math.random() > 0.7) {
        mods.push({ name: 'Extra Salsa Jerezana', priceDelta: 0 });
      }

      items.push({
        productId: prod.id,
        productName: prod.name,
        quantity: Math.floor(Math.random() * 2) + 1,
        price: prod.price,
        modifiers: mods,
        notes: Math.random() > 0.5 ? 'Bien caliente y con bastante limón.' : ''
      });
    }

    const comandaId = 'COM-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newComanda: ComandaCocina = {
      id: comandaId,
      orderName: selectedName,
      date: new Date().toISOString(),
      items,
      status: 'Recibido',
      notes: Math.random() > 0.8 ? 'Cliente pide doble servilleta.' : undefined
    };

    setComandas(prev => [newComanda, ...prev]);
  };

  // Helper to calculate elapsed time in minutes & seconds
  const getElapsedTimeText = (dateString: string, endString?: string) => {
    const start = new Date(dateString).getTime();
    const end = endString ? new Date(endString).getTime() : Date.now();
    const diffMs = end - start;
    if (diffMs < 0) return '00:00';
    const totalSecs = Math.floor(diffMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getElapsedTimeValue = (dateString: string, endString?: string) => {
    const start = new Date(dateString).getTime();
    const end = endString ? new Date(endString).getTime() : Date.now();
    return Math.max(0, Math.floor((end - start) / 1000 / 60)); // in minutes
  };

  // Calculate status-based counters
  const totalReceived = activeComandas.filter(c => c.status === 'Recibido').length;
  const totalPreparing = activeComandas.filter(c => c.status === 'Preparando').length;
  const totalReady = activeComandas.filter(c => c.status === 'Listo').length;

  return (
    <div className="w-full space-y-6 text-elote-dark select-none animate-fade-in relative">
      
      {/* Overview stats header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Recibidas */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block font-mono">Nuevas (En Cola)</span>
            <span className="text-2xl font-black text-amber-500 font-mono">{totalReceived}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Preparando */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block font-mono">En Preparación</span>
            <span className="text-2xl font-black text-[#10B981] font-mono animate-pulse">{totalPreparing}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Flame className="w-5 h-5 animate-bounce" />
          </div>
        </div>

        {/* Listas */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block font-mono">Listas / Despacho</span>
            <span className="text-2xl font-black text-blue-600 font-mono">{totalReady}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Simulator injector trigger */}
        <button
          onClick={handleSimulateComanda}
          className="bg-amber-500 hover:bg-amber-600 border-2 border-dashed border-amber-600/30 text-white rounded-2xl p-4 flex flex-col justify-center items-center text-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span className="text-xs font-black uppercase tracking-wider">Simular Comanda POS</span>
          </div>
          <span className="text-[10px] text-amber-100 font-semibold leading-none">Inyectar orden de elote rápida</span>
        </button>

      </div>

      {/* Main filter tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex bg-gray-100 p-1 rounded-xl gap-1 border border-gray-200">
            <button
              onClick={() => setActiveTab('activas')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'activas'
                  ? 'bg-[#064E3B] text-white shadow-2xs'
                  : 'text-gray-500 hover:text-[#064E3B]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 inline mr-1.5" />
              <span>Línea de Preparación ({activeComandas.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'historial'
                  ? 'bg-[#064E3B] text-white shadow-2xs'
                  : 'text-gray-500 hover:text-[#064E3B]'
              }`}
            >
              <History className="w-3.5 h-3.5 inline mr-1.5" />
              <span>Historial de Entrega ({completedComandas.length})</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar comanda, cliente, producto..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#064E3B] placeholder-gray-400 text-xs font-semibold shadow-2xs"
            />
          </div>

        </div>
      </div>

      {/* Main Grid display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-semibold text-xs">
        <AnimatePresence mode="popLayout">
          {filteredComandas.map((comanda) => {
            const elapsedMins = getElapsedTimeValue(comanda.date, comanda.tiempoFin);
            
            // Visual warning code depending on time elapsed
            let alertBg = 'bg-emerald-50 border-emerald-100';
            let alertText = 'text-emerald-800';
            let alertBadge = 'bg-emerald-100 text-emerald-900';
            
            if (elapsedMins >= 3 && elapsedMins < 7) {
              alertBg = 'bg-amber-50/70 border-amber-200';
              alertText = 'text-amber-900';
              alertBadge = 'bg-amber-100 text-amber-900';
            } else if (elapsedMins >= 7) {
              alertBg = 'bg-red-50/70 border-red-200 animate-pulse';
              alertText = 'text-red-900';
              alertBadge = 'bg-red-100 text-red-900';
            }

            // If already complete, default to clean slate grey
            if (comanda.status === 'Listo') {
              alertBg = 'bg-blue-50 border-blue-200';
              alertText = 'text-blue-900';
              alertBadge = 'bg-blue-100 text-blue-900';
            } else if (comanda.status === 'Entregado') {
              alertBg = 'bg-gray-50 border-gray-200';
              alertText = 'text-gray-600';
              alertBadge = 'bg-gray-200 text-gray-700';
            }

            return (
              <motion.div
                key={comanda.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`border rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs bg-white ${alertBg}`}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100 space-y-1.5 bg-white">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-mono text-[9px] text-gray-400 font-extrabold block uppercase tracking-widest leading-none">CÓDIGO COMANDA</span>
                      <span className="text-sm font-black text-gray-900">{comanda.id}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {/* Status indicator badge */}
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        comanda.status === 'Recibido' ? 'bg-amber-100 text-amber-800' :
                        comanda.status === 'Preparando' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                        comanda.status === 'Listo' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {comanda.status}
                      </span>

                      {/* Wait timer */}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-black rounded px-1.5 py-0.5 ${alertBadge}`}>
                        <Clock className="w-3 h-3" />
                        <span>{getElapsedTimeText(comanda.date, comanda.tiempoFin)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <h3 className="font-black text-gray-800 text-sm leading-tight">
                      👤 {comanda.orderName}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-semibold font-mono block">
                      Enviado: {new Date(comanda.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Items and Ingredients details */}
                <div className="p-4 flex-1 space-y-4">
                  
                  {/* Items List */}
                  <div className="space-y-3">
                    {comanda.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-gray-50/50 rounded-xl p-3 border border-gray-200/50 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-gray-900 font-extrabold text-xs leading-snug">
                            <span className="inline-block font-mono bg-amber-500 text-white rounded-md px-1.5 py-0.5 text-[11px] font-black mr-1.5">
                              {item.quantity}x
                            </span>
                            {item.productName}
                          </p>
                        </div>

                        {/* Modifiers (toppings, exceptions) */}
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.modifiers.map((mod, modIdx) => (
                              <span key={modIdx} className="inline-flex items-center gap-0.5 text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-200">
                                <CornerDownRight className="w-2.5 h-2.5" />
                                <span>{mod.name}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Prep specific item notes */}
                        {item.notes && (
                          <div className="bg-amber-100/60 border border-amber-200 text-[#92400E] p-1.5 rounded-lg text-[10px] italic font-semibold leading-normal">
                            ⚠️ Nota: "{item.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* General order note if present */}
                  {comanda.notes && (
                    <div className="bg-orange-50 border border-orange-100 text-orange-900 rounded-xl p-2.5 text-[10px] italic leading-relaxed">
                      💡 <strong>Comentario General:</strong> "{comanda.notes}"
                    </div>
                  )}

                  {/* Interactive Recipe / Ingredient Checklist Drawer */}
                  <div className="border-t border-dashed border-gray-200 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedComandaForRecipe(selectedComandaForRecipe === comanda.id ? null : comanda.id)}
                      className="w-full flex items-center justify-between text-[10px] font-black uppercase text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Recetario y Checklist
                      </span>
                      <span>{selectedComandaForRecipe === comanda.id ? 'Ocultar' : 'Ver Receta'}</span>
                    </button>

                    <AnimatePresence>
                      {selectedComandaForRecipe === comanda.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-2 mt-2 pt-2 border-t border-gray-100 text-[10px]"
                        >
                          <p className="text-gray-400 font-extrabold text-[9px] uppercase tracking-wider font-mono">Checklist de Insumos Requeridos:</p>
                          <div className="space-y-1.5">
                            {comanda.items.map((item, itemIdx) => {
                              const matchedProd = products.find(p => p.id === item.productId);
                              if (!matchedProd || !matchedProd.recipe) {
                                return (
                                  <p key={itemIdx} className="text-gray-400 italic">No hay receta registrada para {item.productName}</p>
                                );
                              }

                              return (
                                <div key={itemIdx} className="space-y-1">
                                  <p className="font-extrabold text-[#064E3B]">{matchedProd.name} (Receta):</p>
                                  <div className="grid grid-cols-1 gap-1">
                                    {matchedProd.recipe.map((recipeItem, recipeIdx) => {
                                      const matchedInsumo = insumos.find(ins => ins.id === recipeItem.insumoId);
                                      const totalQty = recipeItem.quantity * item.quantity;
                                      const checklistKey = `${comanda.id}-${itemIdx}-${recipeIdx}`;
                                      const isChecked = !!checklist[checklistKey];

                                      return (
                                        <button
                                          key={recipeIdx}
                                          type="button"
                                          onClick={() => {
                                            setChecklist(prev => ({
                                              ...prev,
                                              [checklistKey]: !isChecked
                                            }));
                                          }}
                                          className={`flex items-center justify-between p-1.5 rounded border transition-colors text-left cursor-pointer ${
                                            isChecked 
                                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                          }`}
                                        >
                                          <span className="flex items-center gap-1.5 font-semibold">
                                            <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border text-[8px] font-black ${
                                              isChecked 
                                                ? 'bg-emerald-600 border-emerald-600 text-white' 
                                                : 'border-gray-300 bg-white'
                                            }`}>
                                              {isChecked && <Check className="w-2.5 h-2.5" />}
                                            </span>
                                            <span>{matchedInsumo ? matchedInsumo.name : 'Insumo desconocido'}</span>
                                          </span>
                                          <span className="font-mono text-[9px] text-gray-500 font-black shrink-0">
                                            {totalQty} {matchedInsumo?.unit || ''}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                {/* Staged state button controls */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                  {comanda.status === 'Recibido' && (
                    <button
                      onClick={() => handleStartPrep(comanda.id)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-2.5 rounded-xl shadow-2xs hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Iniciar Preparación</span>
                    </button>
                  )}

                  {comanda.status === 'Preparando' && (
                    <button
                      onClick={() => handleFinishPrep(comanda.id)}
                      className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-2.5 rounded-xl shadow-2xs hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Listo! Comida Terminada</span>
                    </button>
                  )}

                  {comanda.status === 'Listo' && (
                    <button
                      onClick={() => handleDeliverOrder(comanda.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl shadow-2xs hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 animate-bounce" />
                      <span>Entregar al Cliente</span>
                    </button>
                  )}

                  {comanda.status === 'Entregado' && (
                    <div className="text-[#166534] bg-emerald-100/50 py-2 px-3 border border-emerald-200 rounded-xl text-center font-black flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Orden Completada y Entregada</span>
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })}

          {filteredComandas.length === 0 && (
            <div className="col-span-full py-16 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center p-6 shadow-2xs">
              <ChefHat className="w-16 h-16 text-gray-300 mb-2 animate-bounce" />
              <p className="text-sm font-black text-[#064E3B] uppercase tracking-wider">No hay comandas que mostrar</p>
              <p className="text-xs text-gray-400 mt-1">Sube órdenes desde el POS o presiona "Simular Comanda POS" para crear una.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
