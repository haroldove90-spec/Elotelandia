import React, { useState } from 'react';
import { Insumo, Product, Proveedor, OrdenCompra, RecetaItem } from '../types';
import { 
  Package, 
  AlertTriangle, 
  Truck, 
  FileSpreadsheet, 
  Plus, 
  Search, 
  X, 
  Check, 
  Settings2, 
  Edit3, 
  ChevronRight, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  PackageCheck,
  PackageX,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventarioModuleProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  insumos: Insumo[];
  setInsumos: React.Dispatch<React.SetStateAction<Insumo[]>>;
  proveedores: Proveedor[];
  setProveedores: React.Dispatch<React.SetStateAction<Proveedor[]>>;
  ordenesCompra: OrdenCompra[];
  setOrdenesCompra: React.Dispatch<React.SetStateAction<OrdenCompra[]>>;
}

type ActiveSubTab = 'insumos' | 'recetas' | 'proveedores' | 'ordenes';

export default function InventarioModule({
  products,
  setProducts,
  insumos,
  setInsumos,
  proveedores,
  setProveedores,
  ordenesCompra,
  setOrdenesCompra
}: InventarioModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<ActiveSubTab>('insumos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals / Form States
  const [isAddingInsumo, setIsAddingInsumo] = useState(false);
  const [isAddingProveedor, setIsAddingProveedor] = useState(false);
  const [isAddingOrden, setIsAddingOrden] = useState(false);

  // Success messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Insumo form states
  const [newInsumoName, setNewInsumoName] = useState('');
  const [newInsumoStock, setNewInsumoStock] = useState('');
  const [newInsumoUnit, setNewInsumoUnit] = useState<'g' | 'ml' | 'pzs' | 'kg' | 'l'>('g');
  const [newInsumoMin, setNewInsumoMin] = useState('');
  const [newInsumoCost, setNewInsumoCost] = useState('');
  const [newInsumoSupplier, setNewInsumoSupplier] = useState('');

  // New Proveedor form states
  const [newProvName, setNewProvName] = useState('');
  const [newProvContact, setNewProvContact] = useState('');
  const [newProvPhone, setNewProvPhone] = useState('');
  const [newProvEmail, setNewProvEmail] = useState('');
  const [newProvAddress, setNewProvAddress] = useState('');

  // New OrdenCompra form states
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [orderItems, setOrderItems] = useState<Array<{ insumoId: string; quantity: number; cost: number }>>([]);
  const [tempInsumoId, setTempInsumoId] = useState('');
  const [tempQty, setTempQty] = useState('');
  const [tempCost, setTempCost] = useState('');

  // Recipe editing states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
  const [isEditingRecipe, setIsEditingRecipe] = useState(false);
  const [recipeEditItems, setRecipeEditItems] = useState<RecetaItem[]>([]);
  const [addRecipeInsumoId, setAddRecipeInsumoId] = useState('');
  const [addRecipeQty, setAddRecipeQty] = useState('');

  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  // 1. ADD NEW INSUMO
  const handleCreateInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsumoName || !newInsumoStock || !newInsumoMin || !newInsumoCost) return;

    const added: Insumo = {
      id: 'ins-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      name: newInsumoName,
      stock: parseFloat(newInsumoStock),
      unit: newInsumoUnit,
      minStock: parseFloat(newInsumoMin),
      cost: parseFloat(newInsumoCost),
      supplierId: newInsumoSupplier || undefined
    };

    setInsumos(prev => [...prev, added]);
    setIsAddingInsumo(false);
    triggerNotification(`Insumo "${newInsumoName}" creado exitosamente.`);
    
    // reset form
    setNewInsumoName('');
    setNewInsumoStock('');
    setNewInsumoUnit('g');
    setNewInsumoMin('');
    setNewInsumoCost('');
    setNewInsumoSupplier('');
  };

  // 2. ADD NEW PROVEEDOR
  const handleCreateProveedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName) return;

    const added: Proveedor = {
      id: 'prov-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      name: newProvName,
      contactName: newProvContact || undefined,
      phone: newProvPhone || undefined,
      email: newProvEmail || undefined,
      address: newProvAddress || undefined
    };

    setProveedores(prev => [...prev, added]);
    setIsAddingProveedor(false);
    triggerNotification(`Proveedor "${newProvName}" agregado al catálogo.`);

    // reset form
    setNewProvName('');
    setNewProvContact('');
    setNewProvPhone('');
    setNewProvEmail('');
    setNewProvAddress('');
  };

  // 3. CREATE PURCHASE ORDER
  const handleAddOrderItem = () => {
    if (!tempInsumoId || !tempQty || !tempCost) return;
    const insumoObj = insumos.find(i => i.id === tempInsumoId);
    if (!insumoObj) return;

    // Check if item already exists in current list
    if (orderItems.some(item => item.insumoId === tempInsumoId)) {
      setOrderItems(prev => prev.map(item => 
        item.insumoId === tempInsumoId 
          ? { ...item, quantity: item.quantity + parseFloat(tempQty) } 
          : item
      ));
    } else {
      setOrderItems(prev => [...prev, {
        insumoId: tempInsumoId,
        quantity: parseFloat(tempQty),
        cost: parseFloat(tempCost)
      }]);
    }

    setTempInsumoId('');
    setTempQty('');
    setTempCost('');
  };

  const handleRemoveOrderItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePurchaseOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || orderItems.length === 0) return;

    const supplierObj = proveedores.find(p => p.id === selectedSupplierId);
    if (!supplierObj) return;

    const calculatedTotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

    const newOrder: OrdenCompra = {
      id: 'OC-' + (1000 + ordenesCompra.length + 1),
      date: new Date().toISOString(),
      supplierId: selectedSupplierId,
      supplierName: supplierObj.name,
      items: orderItems.map(item => {
        const insObj = insumos.find(i => i.id === item.insumoId);
        return {
          insumoId: item.insumoId,
          insumoName: insObj?.name || 'Insumo desconocido',
          quantity: item.quantity,
          cost: item.cost
        };
      }),
      total: calculatedTotal,
      status: 'Pendiente'
    };

    setOrdenesCompra(prev => [newOrder, ...prev]);
    setIsAddingOrden(false);
    setOrderItems([]);
    setSelectedSupplierId('');
    triggerNotification(`Orden ${newOrder.id} registrada en estado Pendiente.`);
  };

  // Receive purchase order items (increments stock)
  const handleReceiveOrder = (orderId: string) => {
    const order = ordenesCompra.find(o => o.id === orderId);
    if (!order || order.status !== 'Pendiente') return;

    // Update stocks
    setInsumos(prevInsumos => {
      return prevInsumos.map(insumo => {
        const boughtItem = order.items.find(item => item.insumoId === insumo.id);
        if (boughtItem) {
          return {
            ...insumo,
            stock: insumo.stock + boughtItem.quantity,
            cost: boughtItem.cost // Update cost to the latest cost
          };
        }
        return insumo;
      });
    });

    // Update order status
    setOrdenesCompra(prevOrders => {
      return prevOrders.map(o => o.id === orderId ? { ...o, status: 'Recibido' as const } : o);
    });

    triggerNotification(`La Orden ${orderId} ha sido recibida. El inventario físico se actualizó de inmediato.`);
  };

  // Cancel purchase order
  const handleCancelOrder = (orderId: string) => {
    setOrdenesCompra(prevOrders => {
      return prevOrders.map(o => o.id === orderId ? { ...o, status: 'Cancelado' as const } : o);
    });
    triggerNotification(`Orden ${orderId} cancelada.`);
  };

  // 4. RECIPE EDITS
  const handleStartEditRecipe = () => {
    if (!selectedProduct) return;
    setRecipeEditItems(selectedProduct.recipe || []);
    setIsEditingRecipe(true);
  };

  const handleAddRecipeItem = () => {
    if (!addRecipeInsumoId || !addRecipeQty) return;
    const qtyNum = parseFloat(addRecipeQty);

    if (recipeEditItems.some(item => item.insumoId === addRecipeInsumoId)) {
      setRecipeEditItems(prev => prev.map(item => 
        item.insumoId === addRecipeInsumoId ? { ...item, quantity: qtyNum } : item
      ));
    } else {
      setRecipeEditItems(prev => [...prev, { insumoId: addRecipeInsumoId, quantity: qtyNum }]);
    }

    setAddRecipeInsumoId('');
    setAddRecipeQty('');
  };

  const handleRemoveRecipeItem = (insumoId: string) => {
    setRecipeEditItems(prev => prev.filter(item => item.insumoId !== insumoId));
  };

  const handleSaveRecipe = () => {
    if (!selectedProduct) return;

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        if (p.id === selectedProduct.id) {
          const updated = { ...p, recipe: recipeEditItems };
          // Keep local selection synchronized
          setSelectedProduct(updated);
          return updated;
        }
        return p;
      });
    });

    setIsEditingRecipe(false);
    triggerNotification(`Fórmula/Receta para "${selectedProduct.name}" actualizada con éxito.`);
  };

  // Low Stock Alerts Calculations
  const lowStockInsumos = insumos.filter(i => i.stock <= i.minStock);

  // Filters logic
  const filteredInsumos = insumos.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProveedores = proveedores.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrdenes = ordenesCompra.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 animate-fade-in text-elote-dark">
      
      {/* SUCCESS ALERTS OVERLAY */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-4 md:right-8 z-50 p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-xl max-w-sm"
          >
            <div className="bg-emerald-500 text-white rounded-full p-1 shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="font-black text-emerald-800">Operación Exitosa</p>
              <p className="text-emerald-600 font-medium mt-0.5">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2 select-none">
              <Package className="w-3.5 h-3.5" /> Inventario & Recetarios
            </span>
            <h2 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
              Control de Insumos y Artículos Compuestos
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl font-medium leading-relaxed">
              Supervisa las existencias en tiempo real de tu materia prima, configura fórmulas que descuentan ingredientes en cada venta, gestiona proveedores y emite órdenes de reabastecimiento automático.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center text-xs font-mono text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Consumo Físico Automatizado</span>
          </div>
        </div>
      </div>

      {/* QUICK BENTO INDICATORS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Insumos */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">Insumos Totales</span>
            <p className="text-2xl font-black text-[#064E3B] font-mono leading-none">{insumos.length}</p>
            <span className="text-[10px] text-gray-500 font-medium block">Materias primas dadas de alta</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`border rounded-2xl p-4 flex items-center justify-between shadow-2xs transition-colors ${
          lowStockInsumos.length > 0 
            ? 'bg-rose-50/50 border-rose-200' 
            : 'bg-white border-[#E5E7EB]'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">Alertas Críticas</span>
            <p className={`text-2xl font-black font-mono leading-none ${lowStockInsumos.length > 0 ? 'text-rose-600 animate-pulse' : 'text-[#064E3B]'}`}>
              {lowStockInsumos.length}
            </p>
            <span className="text-[10px] text-gray-500 font-medium block">
              {lowStockInsumos.length > 0 ? '¡Requieren abasto urgente!' : 'Existencias seguras'}
            </span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            lowStockInsumos.length > 0 
              ? 'bg-rose-100 text-rose-600 border-rose-200' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">Abastos Pendientes</span>
            <p className="text-2xl font-black text-[#064E3B] font-mono leading-none">
              {ordenesCompra.filter(o => o.status === 'Pendiente').length}
            </p>
            <span className="text-[10px] text-gray-500 font-medium block">Órdenes en tránsito</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Valuation value */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">Inversión Recibida</span>
            <p className="text-2xl font-black text-[#064E3B] font-mono leading-none">
              ${ordenesCompra
                .filter(o => o.status === 'Recibido')
                .reduce((sum, o) => sum + o.total, 0)
                .toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              }
            </p>
            <span className="text-[10px] text-gray-500 font-medium block">Costo total acumulado de compras</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* SYSTEM CRITICAL NOTIFICATION BANNER IF LOW STOCK DETECTED */}
      {lowStockInsumos.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs animate-pulse">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 md:mt-0 animate-bounce" />
            <div>
              <p className="text-xs font-extrabold text-rose-950">Se detectaron insumos por debajo del stock mínimo recomendado</p>
              <p className="text-[10px] text-rose-700 font-medium mt-0.5 leading-normal">
                {lowStockInsumos.map(i => `${i.name} (${i.stock} ${i.unit} restantes)`).join(', ')}. Te sugerimos emitir una Orden de Compra urgente a tus proveedores autorizados.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveSubTab('ordenes');
              setIsAddingOrden(true);
            }}
            className="text-xs font-black bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-xl border border-transparent shadow-2xs shrink-0 cursor-pointer transition-colors"
          >
            Surtir Insumos
          </button>
        </div>
      )}

      {/* TABS NAVIGATION BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex flex-wrap gap-1.5 bg-gray-100/85 p-1 rounded-2xl border border-gray-200/55 select-none">
          <button
            onClick={() => { setActiveSubTab('insumos'); setSearchTerm(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'insumos' 
                ? 'bg-white text-[#064E3B] shadow-xs' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            📦 Catálogo de Insumos
          </button>
          <button
            onClick={() => { setActiveSubTab('recetas'); setSearchTerm(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'recetas' 
                ? 'bg-white text-[#064E3B] shadow-xs' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🧪 Fórmulas y Recetas
          </button>
          <button
            onClick={() => { setActiveSubTab('proveedores'); setSearchTerm(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'proveedores' 
                ? 'bg-white text-[#064E3B] shadow-xs' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🤝 Proveedores CRM
          </button>
          <button
            onClick={() => { setActiveSubTab('ordenes'); setSearchTerm(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'ordenes' 
                ? 'bg-white text-[#064E3B] shadow-xs' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🧾 Órdenes de Compra
          </button>
        </div>

        {/* Global Action Button & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {activeSubTab !== 'recetas' && (
            <div className="relative flex-1 md:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input 
                type="text"
                placeholder={`Buscar ${
                  activeSubTab === 'insumos' ? 'insumos...' : activeSubTab === 'proveedores' ? 'proveedores...' : 'órdenes...'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B] placeholder-gray-400 bg-white"
              />
            </div>
          )}

          {activeSubTab === 'insumos' && (
            <button
              onClick={() => setIsAddingInsumo(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black py-2 px-3.5 rounded-xl shadow-2xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Nuevo Insumo
            </button>
          )}

          {activeSubTab === 'proveedores' && (
            <button
              onClick={() => setIsAddingProveedor(true)}
              className="bg-[#064E3B] hover:bg-[#043E2F] text-white text-xs font-black py-2 px-3.5 rounded-xl shadow-2xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Agregar Proveedor
            </button>
          )}

          {activeSubTab === 'ordenes' && (
            <button
              onClick={() => setIsAddingOrden(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2 px-3.5 rounded-xl shadow-2xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar Compra
            </button>
          )}
        </div>
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="w-full">
        
        {/* ==================================================== */}
        {/* TAB 1: CATÁLOGO DE INSUMOS                           */}
        {/* ==================================================== */}
        {activeSubTab === 'insumos' && (
          <div className="space-y-6">
            {/* INSUMO FORM PANEL */}
            <AnimatePresence>
              {isAddingInsumo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50/40 border border-amber-200 rounded-3xl p-6 relative overflow-hidden"
                >
                  <button 
                    onClick={() => setIsAddingInsumo(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <form onSubmit={handleCreateInsumo} className="space-y-4">
                    <h3 className="text-sm font-black text-[#064E3B] uppercase tracking-wider font-mono">Alta de Nuevo Insumo / Materia Prima</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Nombre del Insumo *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ej. Elote Blanco Desgranado, Vasos 12oz"
                          value={newInsumoName}
                          onChange={(e) => setNewInsumoName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Unidad de Medida *</label>
                        <select
                          value={newInsumoUnit}
                          onChange={(e) => setNewInsumoUnit(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                        >
                          <option value="g">Gramos (g)</option>
                          <option value="ml">Mililitros (ml)</option>
                          <option value="pzs">Piezas (pzs)</option>
                          <option value="kg">Kilogramos (kg)</option>
                          <option value="l">Litros (l)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Existencia Inicial *</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          step="any"
                          placeholder="Ej. 15000"
                          value={newInsumoStock}
                          onChange={(e) => setNewInsumoStock(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B] font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Mínimo para Alerta Stock Bajo *</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          step="any"
                          placeholder="Ej. 3000"
                          value={newInsumoMin}
                          onChange={(e) => setNewInsumoMin(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B] font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Costo Unitario ($) *</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          step="any"
                          placeholder="Ej. 0.05"
                          value={newInsumoCost}
                          onChange={(e) => setNewInsumoCost(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B] font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Proveedor sugerido</label>
                        <select
                          value={newInsumoSupplier}
                          onChange={(e) => setNewInsumoSupplier(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                        >
                          <option value="">Seleccione proveedor (opcional)</option>
                          {proveedores.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsAddingInsumo(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black py-2 px-4 rounded-xl shadow-xs cursor-pointer"
                      >
                        Crear Insumo
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INSUMOS GRID LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInsumos.map((insumo) => {
                const isLow = insumo.stock <= insumo.minStock;
                const capacityPercent = Math.min(100, (insumo.stock / (insumo.minStock * 4)) * 100);

                return (
                  <div 
                    key={insumo.id} 
                    className={`bg-white border rounded-2xl p-5 hover:shadow-xs transition-all relative overflow-hidden flex flex-col justify-between ${
                      isLow ? 'border-rose-200 ring-1 ring-rose-50' : 'border-gray-200'
                    }`}
                  >
                    <div>
                      {/* Top status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[9px] bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-400 font-semibold uppercase">
                          {insumo.id}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono ${
                          isLow 
                            ? 'bg-rose-100 text-rose-800 animate-pulse' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isLow ? 'Stock Bajo' : 'Seguro'}
                        </span>
                      </div>

                      {/* Info */}
                      <h4 className="text-sm font-black text-gray-800 leading-tight mb-1">{insumo.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide font-mono">
                        Proveedor sugerido:{' '}
                        <span className="text-gray-600 font-sans font-medium text-xs">
                          {proveedores.find(p => p.id === insumo.supplierId)?.name || 'Ninguno'}
                        </span>
                      </p>

                      {/* Stock details */}
                      <div className="my-4 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Físico Disponible:</span>
                          <span className="text-base font-black font-mono text-gray-800 leading-none">
                            {insumo.stock.toLocaleString('es-MX')} {insumo.unit}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between text-xs text-gray-500">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">Stock Crítico:</span>
                          <span className="font-mono text-[11px] font-bold text-rose-600">
                            {insumo.minStock.toLocaleString('es-MX')} {insumo.unit}
                          </span>
                        </div>

                        {/* Level bar */}
                        <div className="space-y-1 pt-1">
                          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isLow ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${capacityPercent}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[9px] text-gray-400 font-semibold font-mono">
                            <span>Crítico</span>
                            <span>Seguro ({Math.round(capacityPercent)}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom values */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <div>
                        <span className="text-gray-400 block font-bold text-[9px] uppercase tracking-wider font-mono">Costo Adquisición:</span>
                        <span className="font-mono font-black text-[#064E3B]">${insumo.cost.toFixed(2)} por {insumo.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 block font-bold text-[9px] uppercase tracking-wider font-mono">Valor Total:</span>
                        <span className="font-mono font-bold text-gray-700">${(insumo.stock * insumo.cost).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredInsumos.length === 0 && (
                <div className="col-span-full py-16 text-center text-gray-400 bg-white border border-gray-200 rounded-3xl">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs font-black uppercase tracking-wider text-[#064E3B]">Insumos no encontrados</p>
                  <p className="text-[11px] text-gray-400 mt-1">Crea un nuevo insumo utilizando el botón superior.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: FÓRMULAS Y RECETAS (COMPOUND ITEMS)           */}
        {/* ==================================================== */}
        {activeSubTab === 'recetas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Products Left List (Col 5) */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-2xs space-y-4">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest font-mono">Catálogo de Venta</h3>
                <h4 className="text-sm font-black text-[#064E3B] tracking-tight">Seleccionar Producto para Configurar</h4>
              </div>

              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {products.map((p) => {
                  const itemsCount = p.recipe?.length || 0;
                  const isSelected = selectedProduct?.id === p.id;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelectedProduct(p); setIsEditingRecipe(false); }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-[#064E3B] text-white border-transparent shadow-xs' 
                          : 'bg-white hover:bg-gray-50 border-gray-200/70'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-black tracking-tight uppercase leading-snug">{p.name}</p>
                        <p className={`text-[10px] font-semibold ${isSelected ? 'text-amber-300' : 'text-[#064E3B]'}`}>
                          ${p.price} • {p.items.length} piezas comerciales
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs shrink-0 font-mono font-black">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                          isSelected 
                            ? 'bg-white/15 text-white border border-white/10' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {itemsCount} {itemsCount === 1 ? 'insumo' : 'insumos'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipe Details Dashboard (Col 8) */}
            <div className="lg:col-span-8">
              {selectedProduct ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-2xs space-y-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-32 h-32 bg-[#064E3B]/5 rounded-full blur-xl"></div>
                  
                  {/* Selected Product info card header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 rounded px-2 py-0.5 font-mono font-bold uppercase">
                        Fórmula de Descuento POS
                      </span>
                      <h3 className="text-lg font-black text-[#064E3B] tracking-tight uppercase leading-none">{selectedProduct.name}</h3>
                      <p className="text-[11px] text-gray-400 font-medium font-mono uppercase tracking-wider">ID PRODUCTO: {selectedProduct.id}</p>
                    </div>

                    {!isEditingRecipe ? (
                      <button
                        onClick={handleStartEditRecipe}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black py-2 px-3.5 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Editar Fórmula
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditingRecipe(false)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold py-2 px-3.5 rounded-xl cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveRecipe}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2 px-3.5 rounded-xl shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Guardar Fórmula
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ACTIVE LIST VIEW VS FORM EDIT VIEW */}
                  {!isEditingRecipe ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50/40 border border-amber-200/40 rounded-2xl flex items-start gap-3">
                        <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-amber-900 font-sans leading-relaxed">
                          Al vender este paquete en el módulo Punto de Venta, se restarán de forma automática las cantidades especificadas abajo de sus existencias físicas reales de forma inmediata y en tiempo real.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-mono">Insumos a Descontar:</h4>

                        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden">
                          {selectedProduct.recipe && selectedProduct.recipe.length > 0 ? (
                            selectedProduct.recipe.map((item) => {
                              const matchInsumo = insumos.find(i => i.id === item.insumoId);
                              return (
                                <div key={item.insumoId} className="p-3.5 flex items-center justify-between text-xs hover:bg-gray-50/50 transition-colors">
                                  <div className="space-y-0.5">
                                    <p className="font-extrabold text-gray-800">{matchInsumo?.name || 'Insumo eliminado'}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Unidad Base: {matchInsumo?.unit || '-'}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-mono font-black text-[#064E3B] text-sm">
                                      -{item.quantity.toLocaleString('es-MX')} {matchInsumo?.unit}
                                    </p>
                                    <p className="text-[9px] text-gray-400 font-semibold">Costo prorrateado: ${(item.quantity * (matchInsumo?.cost || 0)).toFixed(2)}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-8 text-center text-gray-400">
                              <Layers className="w-8 h-8 mx-auto mb-1 text-gray-300" />
                              <p className="text-[11px] font-black uppercase text-[#064E3B] opacity-40 tracking-wider">Sin Fórmula Vinculada</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">Ningún insumo se descontará al vender este producto comercial.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Total Cost calculations */}
                      {selectedProduct.recipe && selectedProduct.recipe.length > 0 && (
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-mono">
                          <span className="font-extrabold text-gray-500 uppercase tracking-wider text-[10px]">Costo de Producción Teórico:</span>
                          <span className="font-black text-gray-800 text-sm">
                            ${selectedProduct.recipe.reduce((sum, item) => {
                              const matchInsumo = insumos.find(i => i.id === item.insumoId);
                              return sum + (item.quantity * (matchInsumo?.cost || 0));
                            }, 0).toFixed(2)} MXN
                          </span>
                        </div>
                      )}

                    </div>
                  ) : (
                    /* EDITING FORM */
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#064E3B] uppercase tracking-widest font-mono">Agregar Insumo a la Fórmula</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          
                          <select
                            value={addRecipeInsumoId}
                            onChange={(e) => setAddRecipeInsumoId(e.target.value)}
                            className="px-3 py-2 border border-gray-300 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                          >
                            <option value="">Seleccionar ingrediente...</option>
                            {insumos.map(i => (
                              <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
                            ))}
                          </select>

                          <div className="relative">
                            <input 
                              type="number"
                              min="0.01"
                              step="any"
                              placeholder="Cantidad..."
                              value={addRecipeQty}
                              onChange={(e) => setAddRecipeQty(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B] font-mono"
                            />
                            {addRecipeInsumoId && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold font-mono">
                                {insumos.find(i => i.id === addRecipeInsumoId)?.unit}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={handleAddRecipeItem}
                            className="bg-[#064E3B] hover:bg-[#043E2F] text-white text-xs font-black py-2 px-4 rounded-xl shadow-2xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus className="w-4 h-4" /> Registrar en Lista
                          </button>

                        </div>
                      </div>

                      {/* Current temporary formula list */}
                      <div className="space-y-2.5">
                        <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-mono">Fórmula en Edición:</h4>
                        
                        <div className="border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden bg-white">
                          {recipeEditItems.length > 0 ? (
                            recipeEditItems.map((item) => {
                              const matchInsumo = insumos.find(i => i.id === item.insumoId);
                              return (
                                <div key={item.insumoId} className="p-3.5 flex items-center justify-between text-xs">
                                  <div className="space-y-0.5">
                                    <p className="font-extrabold text-gray-800">{matchInsumo?.name || 'Insumo desconocido'}</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Valor unitario: ${matchInsumo?.cost.toFixed(2)}</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="font-mono font-black text-amber-600 text-sm">
                                      {item.quantity.toLocaleString('es-MX')} {matchInsumo?.unit}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveRecipeItem(item.insumoId)}
                                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-8 text-center text-gray-400">
                              <p className="text-xs font-semibold">No has agregado ingredientes a esta fórmula aún.</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <div className="py-16 text-center text-gray-400 bg-white border border-gray-200 rounded-3xl">
                  <p className="text-xs font-black uppercase text-[#064E3B] opacity-50">Por favor, selecciona un producto comercial.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: PROVEEDORES CRM                               */}
        {/* ==================================================== */}
        {activeSubTab === 'proveedores' && (
          <div className="space-y-6">
            
            {/* ADD PROVEEDOR DRAWER */}
            <AnimatePresence>
              {isAddingProveedor && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50/40 border border-amber-200 rounded-3xl p-6 relative overflow-hidden"
                >
                  <button 
                    onClick={() => setIsAddingProveedor(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <form onSubmit={handleCreateProveedor} className="space-y-4">
                    <h3 className="text-sm font-black text-[#064E3B] uppercase tracking-wider font-mono">Alta de Proveedor Autorizado</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Razón Social / Nombre *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ej. Distribuidora Central"
                          value={newProvName}
                          onChange={(e) => setNewProvName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Nombre de Contacto</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Lic. José María"
                          value={newProvContact}
                          onChange={(e) => setNewProvContact(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Teléfono de Atención</label>
                        <input 
                          type="tel" 
                          placeholder="Ej. 492 100 0000"
                          value={newProvPhone}
                          onChange={(e) => setNewProvPhone(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Correo Electrónico</label>
                        <input 
                          type="email" 
                          placeholder="Ej. compras@distribuidora.com"
                          value={newProvEmail}
                          onChange={(e) => setNewProvEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Dirección Física / Almacén</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Calle Independencia #104, Centro, Zacatecas"
                          value={newProvAddress}
                          onChange={(e) => setNewProvAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                        />
                      </div>

                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsAddingProveedor(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="bg-[#064E3B] hover:bg-[#043E2F] text-white text-xs font-black py-2 px-4 rounded-xl shadow-xs cursor-pointer"
                      >
                        Registrar Proveedor
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PROVEEDORES LIST (TABLE OR CARDS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProveedores.map((p) => {
                const supplierInsumos = insumos.filter(i => i.supplierId === p.id);

                return (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xs transition-all relative overflow-hidden space-y-4">
                    <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 rounded px-1.5 py-0.5 font-mono font-bold uppercase">
                          {p.id}
                        </span>
                        <h4 className="text-base font-black text-gray-800 leading-snug">{p.name}</h4>
                      </div>
                      
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 font-sans">
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider font-mono">Contacto:</span>
                        <span className="font-semibold text-gray-700">{p.contactName || 'No registrado'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider font-mono">Teléfono:</span>
                        <span className="font-mono font-bold text-gray-700">{p.phone || 'No registrado'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider font-mono">Email:</span>
                        <span className="text-gray-700 font-medium">{p.email || 'No registrado'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider font-mono">Domicilio de Entrega:</span>
                        <span className="text-gray-700 font-medium text-[11px] leading-relaxed block">{p.address || 'No registrado'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] font-semibold text-gray-500 font-mono select-none">
                      <span>Insumos Asignados:</span>
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-bold">
                        {supplierInsumos.length} materias primas
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredProveedores.length === 0 && (
                <div className="col-span-full py-16 text-center text-gray-400 bg-white border border-gray-200 rounded-3xl">
                  <Truck className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs font-black uppercase tracking-wider text-[#064E3B]">Proveedores vacíos</p>
                  <p className="text-[11px] text-gray-400 mt-1">Registra tu primer proveedor oficial utilizando el botón superior.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: ÓRDENES DE COMPRA                             */}
        {/* ==================================================== */}
        {activeSubTab === 'ordenes' && (
          <div className="space-y-6">
            
            {/* ADD COMPRA FORM DRAWER */}
            <AnimatePresence>
              {isAddingOrden && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50/45 border border-blue-200 rounded-3xl p-6 relative overflow-hidden"
                >
                  <button 
                    onClick={() => { setIsAddingOrden(false); setOrderItems([]); }} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <form onSubmit={handleCreatePurchaseOrder} className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-blue-950 uppercase tracking-wider font-mono">Registrar Abasto / Compra de Materias Primas</h3>
                      <p className="text-[10px] text-blue-800 font-semibold leading-normal">Introduce los artículos comprados a tu proveedor para actualizar costos y automatizar reabastos en el stock.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Seleccione el Proveedor *</label>
                        <select
                          required
                          value={selectedSupplierId}
                          onChange={(e) => {
                            setSelectedSupplierId(e.target.value);
                            setOrderItems([]); // clear items when supplier changes
                          }}
                          className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                        >
                          <option value="">Buscar proveedor...</option>
                          {proveedores.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {selectedSupplierId && (
                      <div className="border-t border-blue-200/55 pt-4 space-y-4">
                        <h4 className="text-[11px] font-extrabold text-[#064E3B] uppercase tracking-widest font-mono">Añadir Insumo a Comprar:</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-200">
                          
                          <select
                            value={tempInsumoId}
                            onChange={(e) => {
                              const insId = e.target.value;
                              setTempInsumoId(insId);
                              const selectedInsObj = insumos.find(i => i.id === insId);
                              if (selectedInsObj) {
                                setTempCost(selectedInsObj.cost.toString());
                              }
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                          >
                            <option value="">Seleccione materia prima...</option>
                            {insumos
                              // Filter supplies that either have no supplier or belong to selected supplier
                              .filter(i => !i.supplierId || i.supplierId === selectedSupplierId)
                              .map(i => (
                                <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
                              ))
                            }
                          </select>

                          <div className="relative">
                            <input 
                              type="number"
                              min="0.1"
                              step="any"
                              placeholder="Cantidad..."
                              value={tempQty}
                              onChange={(e) => setTempQty(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600 font-mono"
                            />
                            {tempInsumoId && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold font-mono">
                                {insumos.find(i => i.id === tempInsumoId)?.unit}
                              </span>
                            )}
                          </div>

                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono font-black">$</span>
                            <input 
                              type="number"
                              min="0"
                              step="any"
                              placeholder="Costo Unitario ($)..."
                              value={tempCost}
                              onChange={(e) => setTempCost(e.target.value)}
                              className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600 font-mono"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleAddOrderItem}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2 px-4 rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Registrar Compra
                          </button>

                        </div>

                        {/* List of items added to order */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Partidas de Abasto:</span>
                          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                            {orderItems.length > 0 ? (
                              orderItems.map((item, index) => {
                                const matchedIns = insumos.find(i => i.id === item.insumoId);
                                return (
                                  <div key={item.insumoId} className="p-3 flex items-center justify-between text-xs">
                                    <div className="space-y-0.5">
                                      <p className="font-extrabold text-gray-800">{matchedIns?.name}</p>
                                      <p className="text-[9px] text-gray-400 font-semibold font-mono">Costo Unitario: ${item.cost.toFixed(2)} por {matchedIns?.unit}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs">
                                      <span className="font-mono font-black text-blue-600">
                                        +{item.quantity.toLocaleString('es-MX')} {matchedIns?.unit}
                                      </span>
                                      <span className="font-mono font-black text-gray-800">
                                        Subtotal: ${(item.quantity * item.cost).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveOrderItem(index)}
                                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-8 text-center text-gray-400">
                                <p className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">No hay partidas de abasto añadidas.</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order calculation info */}
                        {orderItems.length > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-2xl">
                            <div className="text-xs text-gray-600">
                              <span className="font-mono font-bold text-gray-500">Materia Prima Total de Abasto: </span>
                              <span className="font-mono font-black text-gray-800">{orderItems.length} insumos</span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-widest font-mono">Monto Total Estimado</span>
                                <span className="text-base font-mono font-black text-blue-600">
                                  ${orderItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              
                              <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                              >
                                Emitir Orden de Compra
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PURCHASE ORDERS LEDGER HISTORY */}
            <div className="space-y-4">
              {filteredOrdenes.map((order) => {
                const isPending = order.status === 'Pendiente';
                const isCancel = order.status === 'Cancelado';

                return (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xs transition-all space-y-4">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-50">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isPending 
                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                            : isCancel 
                              ? 'bg-rose-50 text-rose-600 border-rose-100' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {isPending ? (
                            <Truck className="w-5 h-5 animate-pulse" />
                          ) : isCancel ? (
                            <PackageX className="w-5 h-5" />
                          ) : (
                            <PackageCheck className="w-5 h-5" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[#064E3B] text-sm tracking-tight font-sans">
                              {order.supplierName}
                            </span>
                            <span className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-400 font-semibold">
                              {order.id}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-semibold font-mono">
                            Emitido: {new Date(order.date).toLocaleString('es-MX')}
                          </p>
                        </div>
                      </div>

                      <div className="self-start sm:self-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider border ${
                          isPending 
                            ? 'bg-amber-100 text-amber-800 border-amber-200' 
                            : isCancel 
                              ? 'bg-rose-100 text-rose-800 border-rose-200' 
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {order.status === 'Recibido' ? 'Recibido en Almacén' : order.status}
                        </span>
                      </div>
                    </div>

                    {/* Ordered items summary breakdown */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider font-mono">Insumos Solicitados:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {order.items.map((it) => (
                          <div key={it.insumoId} className="bg-gray-50/70 border border-gray-100 p-2.5 rounded-xl flex items-center justify-between">
                            <span className="font-semibold text-gray-700">{it.insumoName}</span>
                            <span className="font-mono font-black text-[#064E3B]">
                              +{it.quantity.toLocaleString('es-MX')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer values & administrative actions */}
                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-xs">
                        <span className="text-gray-400 font-semibold font-mono">Costo Consolidado del Surtido:</span>
                        <span className="font-mono font-black text-gray-800 text-sm ml-1.5">${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                      </div>

                      {isPending && (
                        <div className="flex gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-3.5 py-1.5 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all rounded-lg border border-rose-200 hover:border-transparent text-xs font-black cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReceiveOrder(order.id)}
                            className="px-3.5 py-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all rounded-lg border border-emerald-200 hover:border-transparent text-xs font-black flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Recibir en Almacén
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}

              {filteredOrdenes.length === 0 && (
                <div className="py-16 text-center text-gray-400 bg-white border border-gray-200 rounded-3xl">
                  <FileSpreadsheet className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs font-black uppercase tracking-wider text-[#064E3B]">Abastos limpios</p>
                  <p className="text-[11px] text-gray-400 mt-1">Registra las compras de insumos para llevar un historial ordenado.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
