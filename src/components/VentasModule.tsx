import React, { useState } from 'react';
import { Product, Sale, SaleItem } from '../types';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  CreditCard, 
  Coins, 
  Receipt, 
  Pizza, 
  Search, 
  FolderHeart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VentasModuleProps {
  products: Product[];
  onAddSale: (sale: Sale) => void;
  cashierName: string;
}

export default function VentasModule({ products, onAddSale, cashierName }: VentasModuleProps) {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta'>('efectivo');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceipt, setShowReceipt] = useState<Sale | null>(null);

  // Filter only active products
  const activeProducts = products.filter(p => p.isActive);
  const filteredProducts = activeProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price
      }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const changeDue = paymentMethod === 'efectivo' && cashReceived 
    ? Math.max(0, parseFloat(cashReceived) - cartTotal) 
    : 0;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newSale: Sale = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal,
      cashierName: cashierName || 'Cajero de Turno'
    };

    onAddSale(newSale);
    setShowReceipt(newSale);
    setCart([]);
    setCashReceived('');
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Banner de Bienvenida y POS */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-[#166534] border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
              <ShoppingCart className="w-3.5 h-3.5" /> Punto de Venta (POS)
            </span>
            <h2 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
              Módulo de Ventas Activo
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xl">
              Registra comandas, calcula totales y procesa pedidos al instante. Los datos alimentan en tiempo real los tableros globales y de administración.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center text-xs font-mono text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>Atendiendo: <strong className="font-extrabold">{cashierName}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Catálogo de Paquetes/Productos (Col de 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Barra de Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar paquete o ingrediente..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-[#064E3B] placeholder-gray-400 text-sm shadow-2xs font-medium"
            />
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleAddToCart(product)}
                  className="bg-white border hover:border-amber-400 border-gray-100 rounded-2xl p-4 shadow-2xs cursor-pointer flex flex-col justify-between hover:shadow-xs transition-all relative group overflow-hidden"
                >
                  <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-amber-500/5 group-hover:bg-amber-500/10 rounded-full blur-md transition-all"></div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-[#064E3B] text-sm group-hover:text-amber-600 transition-colors tracking-tight line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="font-sans font-black text-amber-600 text-sm bg-amber-50 px-2 py-0.5 rounded-lg shrink-0">
                        ${product.price}
                      </span>
                    </div>

                    <ul className="space-y-1">
                      {product.items.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="text-[10px] text-gray-500 flex items-center gap-1 truncate">
                          <span className="w-1 h-1 bg-amber-500 rounded-full shrink-0"></span>
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                      {product.items.length > 3 && (
                        <li className="text-[9px] text-[#166534] font-bold font-mono">
                          +{product.items.length - 3} ingredientes más
                        </li>
                      )}
                    </ul>
                  </div>

                  <button className="w-full mt-4 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white font-extrabold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Agregar Orden
                  </button>
                </motion.div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center p-6">
                  <FolderHeart className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-400">No se encontraron paquetes activos</p>
                  <p className="text-xs text-gray-400 mt-1">Verifica la búsqueda o el estatus de productos en el administrador.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Carrito de Compra (Ticket - Col de 5) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Header del Ticket */}
            <div className="bg-[#064E3B] text-white p-4 flex items-center justify-between">
              <span className="flex items-center gap-2 font-serif font-black text-sm tracking-wide">
                <ShoppingCart className="w-4 h-4 text-amber-400" /> Ticket Actual
              </span>
              <span className="bg-amber-500/20 text-amber-200 border border-amber-500/30 px-2 py-0.5 rounded-md font-mono text-[10px]">
                {cart.length} Paquetes
              </span>
            </div>

            {/* Lista de Items */}
            <div className="p-4 space-y-3 min-h-[180px] max-h-[300px] overflow-y-auto border-b border-gray-100">
              <AnimatePresence initial={false}>
                {cart.map((item) => (
                  <motion.div 
                    key={item.productId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between gap-3 bg-[#FEFCE8]/40 p-2.5 rounded-xl border border-amber-100"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="text-xs font-black text-gray-800 truncate leading-tight">
                        {item.productName}
                      </p>
                      <p className="text-[10px] text-amber-600 font-bold font-mono">
                        ${item.price} c/u
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, -1)}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-black text-gray-800 w-5 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId, 1)}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      
                      <button 
                        onClick={() => handleRemoveFromCart(item.productId)}
                        className="w-6 h-6 rounded-md bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center shrink-0 ml-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {cart.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8 text-gray-400">
                    <Pizza className="w-10 h-10 mb-2 text-[#FEF3C7] animate-bounce" />
                    <p className="text-xs font-extrabold text-[#064E3B] opacity-60 uppercase tracking-wider">La charola está vacía</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Selecciona paquetes del catálogo para preparar la comanda.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Sección de Pago */}
            <form onSubmit={handleCheckout} className="p-4 bg-[#FEFCE8]/20 space-y-4">
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'efectivo' 
                      ? 'bg-emerald-600 text-white border-emerald-700' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" /> Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tarjeta')}
                  className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'tarjeta' 
                      ? 'bg-[#064E3B] text-white border-emerald-800' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Tarjeta
                </button>
              </div>

              {paymentMethod === 'efectivo' && cart.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-wider">Dinero Recibido ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="Ej. 1000"
                    min={cartTotal}
                    step="any"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#064E3B] text-sm font-semibold"
                  />
                </div>
              )}

              {/* Totales */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-mono">${cartTotal.toFixed(2)}</span>
                </div>
                {paymentMethod === 'efectivo' && parseFloat(cashReceived) >= cartTotal && (
                  <div className="flex justify-between items-center text-xs text-[#166534]">
                    <span>Cambio de deudor</span>
                    <span className="font-bold font-mono">${changeDue.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 text-[#064E3B]">
                  <span className="font-black text-sm uppercase">Total a Cobrar</span>
                  <span className="text-xl font-black font-mono text-amber-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Confirmación */}
              <button
                type="submit"
                disabled={cart.length === 0}
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm py-3 rounded-xl transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Registrar Venta en Caja
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* Recibo / Modal de Venta exitosa */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-gray-100 text-gray-800 space-y-4"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-1">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#064E3B]">Venta Registrada</h3>
                <p className="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-3 py-1 rounded-full inline-block font-mono">
                  Ticket #{showReceipt.id}
                </p>
              </div>

              <div className="border-t border-b border-gray-100 py-3 text-xs space-y-2 font-mono">
                {showReceipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.productName}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between font-black text-sm text-gray-900">
                  <span>TOTAL COBRADO</span>
                  <span>${showReceipt.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Cajero</span>
                  <span className="font-sans">{showReceipt.cashierName}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Fecha/Hora</span>
                  <span>{new Date(showReceipt.date).toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowReceipt(null)}
                className="w-full bg-[#064E3B] hover:bg-emerald-800 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cerrar Ticket & Continuar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
