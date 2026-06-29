import React, { useState, useEffect } from 'react';
import { Product, Sale, SaleItem, ModifierItem, Customer } from '../types';
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
  FolderHeart,
  Wifi,
  WifiOff,
  Clock,
  Printer,
  Tag,
  Bookmark,
  Users,
  CornerDownRight,
  Sparkles,
  Play,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VentasModuleProps {
  products: Product[];
  onAddSale: (sale: Sale) => void;
  cashierName: string;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

interface StandbyTicket {
  id: string;
  name: string;
  items: SaleItem[];
  customer?: Customer;
  globalDiscount?: {
    type: 'fixed' | 'percent';
    value: number;
  };
  notes?: string;
  date: string;
}

export default function VentasModule({ 
  products, 
  onAddSale, 
  cashierName, 
  customers, 
  setCustomers 
}: VentasModuleProps) {
  // POS Cart State
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta'>('efectivo');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceipt, setShowReceipt] = useState<Sale & { changeDue?: number, paperSize?: '58mm' | '80mm', printerType?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'catalogo' | 'ticket'>('catalogo');

  // CRM integration
  const [linkedCustomer, setLinkedCustomer] = useState<Customer | null>(null);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [crmSearchQuery, setCrmSearchQuery] = useState('');

  // Modifiers Dialog State
  const [selectedCartItemForModifiers, setSelectedCartItemForModifiers] = useState<number | null>(null); // Index in cart
  const [customPrepNote, setCustomPrepNote] = useState('');

  // Discount States
  const [globalDiscountType, setGlobalDiscountType] = useState<'fixed' | 'percent' | 'none'>('none');
  const [globalDiscountValue, setGlobalDiscountValue] = useState<number>(0);
  const [itemDiscountIndex, setItemDiscountIndex] = useState<number | null>(null);
  const [tempItemDiscountType, setTempItemDiscountType] = useState<'fixed' | 'percent'>('percent');
  const [tempItemDiscountValue, setTempItemDiscountValue] = useState<number>(0);

  // Standby Tickets (Tickets Abiertos)
  const [standbyTickets, setStandbyTickets] = useState<StandbyTicket[]>(() => {
    const saved = localStorage.getItem('elotelandia_standby');
    return saved ? JSON.parse(saved) : [];
  });
  const [showStandbyModal, setShowStandbyModal] = useState(false);
  const [standbyTicketName, setStandbyTicketName] = useState('');

  // Offline Simulation
  const [isOffline, setIsOffline] = useState(false);
  const [offlineSalesQueue, setOfflineSalesQueue] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('elotelandia_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Printer configuration
  const [printerConnection, setPrinterConnection] = useState<'usb' | 'bluetooth' | 'wifi'>('usb');
  const [printerPaperSize, setPrinterPaperSize] = useState<'58mm' | '80mm'>('80mm');
  const [isPrinterConnected, setIsPrinterConnected] = useState(true);
  const [showPrinterConfig, setShowPrinterConfig] = useState(false);

  // Sync standby to LocalStorage
  useEffect(() => {
    localStorage.setItem('elotelandia_standby', JSON.stringify(standbyTickets));
  }, [standbyTickets]);

  // Sync offline queue to LocalStorage
  useEffect(() => {
    localStorage.setItem('elotelandia_offline_queue', JSON.stringify(offlineSalesQueue));
  }, [offlineSalesQueue]);

  // Handle Offline toggling and auto-sync simulation
  const handleToggleOffline = () => {
    setIsOffline(prev => {
      const next = !prev;
      if (!next && offlineSalesQueue.length > 0) {
        // Trigger auto-sync simulation
        setSyncMessage(`⚡ Red recuperada. Sincronizando ${offlineSalesQueue.length} comandas guardadas localmente...`);
        
        // Feed offline sales to main DB sequentially
        offlineSalesQueue.forEach(sale => {
          onAddSale(sale);
        });

        // Clear queue
        setOfflineSalesQueue([]);
        setTimeout(() => {
          setSyncMessage(null);
        }, 4000);
      }
      return next;
    });
  };

  // Preset modifiers
  const presetModifiers: ModifierItem[] = [
    { name: '+ Queso Cotija', priceDelta: 10 },
    { name: 'Extra Arrachera', priceDelta: 30 },
    { name: 'Sin Chile', priceDelta: 0 },
    { name: 'Con extra Limón', priceDelta: 0 },
    { name: 'Poco Tajín', priceDelta: 0 }
  ];

  // Helper: filter only active products
  const activeProducts = products.filter(p => p.isActive);
  const filteredProducts = activeProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Add product to cart (Default state)
  const handleAddToCart = (product: Product) => {
    const defaultItem: SaleItem = {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      price: product.price,
      modifiers: [],
      notes: ''
    };
    setCart(prev => [...prev, defaultItem]);
    setActiveTab('ticket');
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty > 0) {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Open Modifier Dialog
  const handleOpenModifiers = (index: number) => {
    setSelectedCartItemForModifiers(index);
    setCustomPrepNote(cart[index].notes || '');
  };

  // Toggle modifier on active item
  const handleToggleModifierOnItem = (modifier: ModifierItem) => {
    if (selectedCartItemForModifiers === null) return;
    const index = selectedCartItemForModifiers;

    setCart(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      const mods = item.modifiers ? [...item.modifiers] : [];
      
      const existingIdx = mods.findIndex(m => m.name === modifier.name);
      if (existingIdx > -1) {
        // Remove modifier
        mods.splice(existingIdx, 1);
      } else {
        // Add modifier
        mods.push(modifier);
      }

      item.modifiers = mods;
      updated[index] = item;
      return updated;
    });
  };

  const handleSaveModifiersAndNotes = () => {
    if (selectedCartItemForModifiers === null) return;
    const index = selectedCartItemForModifiers;

    setCart(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        notes: customPrepNote
      };
      return updated;
    });
    setSelectedCartItemForModifiers(null);
  };

  // Open Item Discount Dialog
  const handleOpenItemDiscount = (index: number) => {
    setItemDiscountIndex(index);
    const existing = cart[index].itemDiscount;
    if (existing) {
      setTempItemDiscountType(existing.type);
      setTempItemDiscountValue(existing.value);
    } else {
      setTempItemDiscountType('percent');
      setTempItemDiscountValue(0);
    }
  };

  // Apply item-specific discount
  const handleApplyItemDiscount = () => {
    if (itemDiscountIndex === null) return;
    const index = itemDiscountIndex;

    setCart(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      const originalSub = item.price * item.quantity;
      
      let amount = 0;
      if (tempItemDiscountType === 'percent') {
        amount = originalSub * (tempItemDiscountValue / 100);
      } else {
        amount = Math.min(originalSub, tempItemDiscountValue);
      }

      item.itemDiscount = tempItemDiscountValue > 0 ? {
        type: tempItemDiscountType,
        value: tempItemDiscountValue,
        amount: amount
      } : undefined;

      updated[index] = item;
      return updated;
    });

    setItemDiscountIndex(null);
  };

  // ==========================================
  // CALCULATE BALANCES
  // ==========================================
  // Calculate raw total before any ticket/item discounts, incorporating modifier pricing
  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => {
      const modifierSum = (item.modifiers || []).reduce((mSum, m) => mSum + m.priceDelta, 0);
      const itemBase = (item.price + modifierSum) * item.quantity;
      
      // Subtract item discount if present
      const disc = item.itemDiscount ? item.itemDiscount.amount : 0;
      return sum + (itemBase - disc);
    }, 0);
  };

  const getGlobalDiscountAmount = (subtotal: number) => {
    if (globalDiscountType === 'percent') {
      return subtotal * (globalDiscountValue / 100);
    } else if (globalDiscountType === 'fixed') {
      return Math.min(subtotal, globalDiscountValue);
    }
    return 0;
  };

  const cartSubtotal = getCartSubtotal();
  const ticketDiscountAmount = getGlobalDiscountAmount(cartSubtotal);
  const cartTotal = Math.max(0, cartSubtotal - ticketDiscountAmount);

  const changeDue = paymentMethod === 'efectivo' && cashReceived 
    ? Math.max(0, parseFloat(cashReceived) - cartTotal) 
    : 0;

  // ==========================================
  // STANDBY COMMANDS (CUENTAS EN ESPERA)
  // ==========================================
  const handleSaveToStandby = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !standbyTicketName.trim()) return;

    const newStandby: StandbyTicket = {
      id: 'ESP-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      name: standbyTicketName.trim(),
      items: [...cart],
      customer: linkedCustomer || undefined,
      globalDiscount: globalDiscountType !== 'none' ? {
        type: globalDiscountType as 'fixed' | 'percent',
        value: globalDiscountValue
      } : undefined,
      date: new Date().toISOString()
    };

    setStandbyTickets(prev => [...prev, newStandby]);
    
    // Clear Active POS
    setCart([]);
    setLinkedCustomer(null);
    setGlobalDiscountType('none');
    setGlobalDiscountValue(0);
    setStandbyTicketName('');
    setShowStandbyModal(false);
  };

  const handleRestoreStandbyTicket = (ticket: StandbyTicket) => {
    setCart(ticket.items);
    setLinkedCustomer(ticket.customer || null);
    if (ticket.globalDiscount) {
      setGlobalDiscountType(ticket.globalDiscount.type);
      setGlobalDiscountValue(ticket.globalDiscount.value);
    } else {
      setGlobalDiscountType('none');
      setGlobalDiscountValue(0);
    }
    
    // Remove from standby
    setStandbyTickets(prev => prev.filter(t => t.id !== ticket.id));
    setShowStandbyModal(false);
    setActiveTab('ticket');
  };

  // ==========================================
  // CRM LINK CUSTOMER
  // ==========================================
  const filteredCrmCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(crmSearchQuery.toLowerCase()) ||
    c.phone.includes(crmSearchQuery)
  );

  const handleLinkCustomer = (customer: Customer) => {
    setLinkedCustomer(customer);
    setShowCRMModal(false);
  };

  // ==========================================
  // FINAL CHECKOUT
  // ==========================================
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newSaleId = Math.random().toString(36).substring(2, 9).toUpperCase();

    const newSale: Sale = {
      id: newSaleId,
      date: new Date().toISOString(),
      items: cart.map(item => {
        const modifierSum = (item.modifiers || []).reduce((mSum, m) => mSum + m.priceDelta, 0);
        return {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price + modifierSum,
          modifiers: item.modifiers,
          itemDiscount: item.itemDiscount,
          notes: item.notes
        };
      }),
      total: cartTotal,
      cashierName: cashierName || 'Cajero de Turno',
      paymentMethod: paymentMethod,
      customerId: linkedCustomer?.id,
      customerName: linkedCustomer?.name,
      discountAmount: ticketDiscountAmount + cart.reduce((sum, i) => sum + (i.itemDiscount?.amount || 0), 0)
    };

    if (isOffline) {
      // Save in queue
      setOfflineSalesQueue(prev => [...prev, newSale]);
      setShowReceipt({
        ...newSale,
        changeDue,
        paperSize: printerPaperSize,
        printerType: printerConnection.toUpperCase()
      });
    } else {
      // Direct update
      onAddSale(newSale);

      setShowReceipt({
        ...newSale,
        changeDue,
        paperSize: printerPaperSize,
        printerType: printerConnection.toUpperCase()
      });
    }

    // Reset current ticket
    setCart([]);
    setLinkedCustomer(null);
    setGlobalDiscountType('none');
    setGlobalDiscountValue(0);
    setCashReceived('');
    setActiveTab('catalogo');
  };

  return (
    <div className="w-full space-y-6 text-elote-dark select-none animate-fade-in relative">
      
      {/* Sync Warning Banner */}
      {syncMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-black text-xs px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4.5 h-4.5 animate-spin" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* POS Quick Control Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-[#166534] border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider select-none">
                <ShoppingCart className="w-3.5 h-3.5" /> Punto de Venta (POS)
              </span>

              {/* Status Indicator */}
              <button
                onClick={handleToggleOffline}
                className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border cursor-pointer uppercase tracking-wider transition-colors ${
                  isOffline 
                    ? 'bg-amber-100 border-amber-200 text-amber-800' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
                title="Haga clic para simular desconexión a internet de la sucursal"
              >
                {isOffline ? (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-600 animate-pulse" />
                    <span>Modo Offline Simulado</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-600" />
                    <span>Conexión Segura (Sinc)</span>
                  </>
                )}
              </button>
            </div>
            
            <h2 className="text-xl font-extrabold text-[#064E3B] tracking-tight mt-1.5">
              Terminal POS Elotelandia
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Standby Accounts Button */}
            <button
              onClick={() => setShowStandbyModal(true)}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#92400E] text-xs font-black py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer relative"
            >
              <Bookmark className="w-4 h-4" />
              <span>Cuentas en Espera</span>
              {standbyTickets.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white font-black rounded-full text-[9px] w-5 h-5 flex items-center justify-center animate-pulse">
                  {standbyTickets.length}
                </span>
              )}
            </button>

            {/* Printer Setup Button */}
            <button
              onClick={() => setShowPrinterConfig(prev => !prev)}
              className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-xs font-black py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Impresora ({printerPaperSize})</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isPrinterConnected ? 'bg-emerald-600' : 'bg-red-500'}`}></span>
            </button>

            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Caja: <strong className="font-extrabold">{cashierName}</strong></span>
            </div>
          </div>
        </div>

        {/* Offline Alert Warning */}
        {isOffline && (
          <div className="mt-4 bg-amber-500/10 border border-amber-300 text-amber-900 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2.5 animate-pulse">
            <BadgeAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Sucursal Offline (Sin Internet)</p>
              <p className="text-[11px] text-amber-800 font-medium">Las ventas se guardan en la cola de contingencia de su navegador. Se sincronizarán automáticamente con el panel de administración al restablecer la red.</p>
            </div>
          </div>
        )}
      </div>

      {/* Printer Setup Drawer inside layout */}
      {showPrinterConfig && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h4 className="text-xs font-black text-[#064E3B] uppercase tracking-wider flex items-center gap-1">
              <Printer className="w-4 h-4" /> Configuración Física de Impresora de Tickets
            </h4>
            <button onClick={() => setShowPrinterConfig(false)} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 cursor-pointer">Cerrar</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            {/* Puerto de conexión */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider font-mono">Puerto / Conexión Física</span>
              <div className="flex gap-1">
                {(['usb', 'bluetooth', 'wifi'] as const).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPrinterConnection(c)}
                    className={`flex-1 py-1 px-2 border rounded-lg text-[10px] font-black uppercase transition-colors cursor-pointer ${
                      printerConnection === c 
                        ? 'bg-blue-600 text-white border-blue-700' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Ancho del papel */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider font-mono">Ancho del Papel Térmico</span>
              <div className="flex gap-1">
                {(['58mm', '80mm'] as const).map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPrinterPaperSize(size)}
                    className={`flex-1 py-1 px-2 border rounded-lg text-[10px] font-black uppercase transition-colors cursor-pointer ${
                      printerPaperSize === size 
                        ? 'bg-[#064E3B] text-white border-emerald-800' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Simular encendido */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider font-mono">Estatus Impresora Térmica</span>
              <button
                type="button"
                onClick={() => setIsPrinterConnected(prev => !prev)}
                className={`w-full py-1 border rounded-lg text-[10px] font-black uppercase transition-colors cursor-pointer ${
                  isPrinterConnected 
                    ? 'bg-emerald-600 text-white border-emerald-700' 
                    : 'bg-red-500 text-white border-red-600'
                }`}
              >
                {isPrinterConnected ? 'CONECTADA / LISTA' : 'DESCONECTADA'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selector de Pestañas en Móvil */}
      <div className="flex lg:hidden bg-[#064E3B]/5 p-1.5 rounded-2xl border border-[#064E3B]/10 gap-1.5 w-full">
        <button
          type="button"
          onClick={() => setActiveTab('catalogo')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'catalogo'
              ? 'bg-[#064E3B] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#064E3B] hover:bg-white/50'
          }`}
        >
          <Pizza className="w-4 h-4" />
          <span>Catálogo Elotes</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ticket')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all relative cursor-pointer ${
            activeTab === 'ticket'
              ? 'bg-[#064E3B] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#064E3B] hover:bg-white/50'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Ver Ticket</span>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white ring-2 ring-[#FEFCE8]">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* ==================================================== */}
        {/* CATÁLOGO PRODUCTOS (COL 7)                           */}
        {/* ==================================================== */}
        <div className={`${activeTab === 'catalogo' ? 'block' : 'hidden'} lg:block lg:col-span-7 space-y-4`}>
          
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
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
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span>
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

                  <button className="w-full mt-4 bg-emerald-50 text-emerald-800 hover:bg-[#064E3B] hover:text-white font-extrabold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Agregar Orden
                  </button>
                </motion.div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center p-6">
                  <FolderHeart className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-400">No se encontraron paquetes activos</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* ==================================================== */}
        {/* CARRITO Y COBRO (COL 5)                              */}
        {/* ==================================================== */}
        <div className={`${activeTab === 'ticket' ? 'block' : 'hidden'} lg:block lg:col-span-5 space-y-4`}>
          
          <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-xs overflow-hidden flex flex-col font-semibold">
            
            {/* Header del Ticket */}
            <div className="bg-[#064E3B] text-white p-4 flex items-center justify-between">
              <span className="flex items-center gap-2 font-serif font-black text-sm tracking-wide">
                <ShoppingCart className="w-4 h-4 text-amber-400" /> Ticket Actual
              </span>
              
              {/* Hold (standby) button */}
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setStandbyTicketName(`Mesa ${standbyTickets.length + 1} o Cajero`);
                    setShowStandbyModal(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                >
                  Poner en Espera
                </button>
              )}
            </div>

            {/* CRM Customer Linking Info bar */}
            <div className="bg-blue-50/50 border-b border-gray-100 px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-blue-900">
                <Users className="w-4 h-4 text-blue-600" />
                {linkedCustomer ? (
                  <div>
                    <span className="font-extrabold text-blue-950">{linkedCustomer.name}</span>
                    <span className="text-[9px] text-blue-700 bg-blue-100/50 px-1.5 py-0.5 rounded-md font-mono font-bold ml-1.5">
                      Puntos: {linkedCustomer.points} pts
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">Comanda General (Sin registrar)</span>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setCrmSearchQuery('');
                  setShowCRMModal(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-[10px] font-black tracking-wide uppercase"
              >
                {linkedCustomer ? 'Cambiar Cliente' : 'Vincular Cliente CRM'}
              </button>
            </div>

            {/* Lista de Items */}
            <div className="p-4 space-y-3.5 min-h-[180px] max-h-[300px] overflow-y-auto border-b border-gray-100">
              <AnimatePresence initial={false}>
                {cart.map((item, index) => {
                  const modifierSum = (item.modifiers || []).reduce((sum, m) => sum + m.priceDelta, 0);
                  const effectivePrice = item.price + modifierSum;
                  const rawItemTotal = effectivePrice * item.quantity;
                  const finalItemTotal = Math.max(0, rawItemTotal - (item.itemDiscount?.amount || 0));

                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="bg-[#FEFCE8]/40 p-3 rounded-2xl border border-amber-100 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <p className="text-xs font-black text-gray-800 truncate leading-tight">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-amber-600 font-bold font-mono">
                            ${effectivePrice} c/u {item.modifiers && item.modifiers.length > 0 && <span className="text-emerald-700">({item.modifiers.length} mod)</span>}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(index, -1)}
                            className="w-5 h-5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-mono text-xs font-black text-gray-800 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(index, 1)}
                            className="w-5 h-5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          
                          <button 
                            type="button"
                            onClick={() => handleRemoveFromCart(index)}
                            className="w-5 h-5 rounded bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center shrink-0 ml-1 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      {/* Display modifiers list & prep notes */}
                      {((item.modifiers && item.modifiers.length > 0) || item.notes) && (
                        <div className="bg-white/75 border border-amber-100 rounded-lg p-2 text-[10px] space-y-1.5 text-gray-600">
                          {item.modifiers && item.modifiers.map((mod, mIdx) => (
                            <p key={mIdx} className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                              <CornerDownRight className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{mod.name} {mod.priceDelta > 0 ? `(+$${mod.priceDelta})` : ''}</span>
                            </p>
                          ))}
                          {item.notes && (
                            <p className="italic text-gray-500 font-medium">Nota: "{item.notes}"</p>
                          )}
                        </div>
                      )}

                      {/* Item Discount display */}
                      {item.itemDiscount && (
                        <div className="bg-red-50 text-red-800 text-[10px] rounded-lg p-1.5 border border-red-100 flex items-center justify-between font-bold">
                          <span>Rebaja aplicada ({item.itemDiscount.type === 'percent' ? `${item.itemDiscount.value}%` : `$${item.itemDiscount.value}`})</span>
                          <span className="font-mono">-${item.itemDiscount.amount.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Quick Item action bar (Add notes / Apply Discount) */}
                      <div className="flex justify-between text-[10px] pt-1.5 border-t border-amber-100/40 font-black uppercase tracking-wider text-gray-500">
                        <button
                          type="button"
                          onClick={() => handleOpenModifiers(index)}
                          className="hover:text-emerald-700 cursor-pointer flex items-center gap-1"
                        >
                          + Modificar / Notas
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenItemDiscount(index)}
                          className="hover:text-red-700 cursor-pointer flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" /> % Rebaja Artículo
                        </button>
                        <span className="font-mono text-gray-700 text-right shrink-0">Subtotal: ${finalItemTotal.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  );
                })}

                {cart.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8 text-gray-400">
                    <Pizza className="w-10 h-10 mb-2 text-[#FEF3C7] animate-bounce" />
                    <p className="text-xs font-extrabold text-[#064E3B] opacity-60 uppercase tracking-wider">La charola está vacía</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Seleccione paquetes del catálogo.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Sección de Pago */}
            <form onSubmit={handleCheckout} className="p-4 bg-[#FEFCE8]/20 space-y-4 font-semibold text-xs text-gray-700">
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'tarjeta' 
                      ? 'bg-[#064E3B] text-white border-emerald-800' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Tarjeta
                </button>
              </div>

              {/* Direct discount option */}
              <div className="bg-gray-50/80 p-2.5 rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-extrabold uppercase tracking-wider font-mono">
                  <span>Rebaja Directa al Ticket</span>
                  <Tag className="w-3 h-3 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => { setGlobalDiscountType('none'); setGlobalDiscountValue(0); }}
                      className={`px-2 py-1 text-[10px] font-black ${globalDiscountType === 'none' ? 'bg-[#064E3B] text-white' : 'bg-white text-gray-500'}`}
                    >
                      Sin rebaja
                    </button>
                    <button
                      type="button"
                      onClick={() => setGlobalDiscountType('percent')}
                      className={`px-2.5 py-1 text-[10px] font-black ${globalDiscountType === 'percent' ? 'bg-[#064E3B] text-white' : 'bg-white text-gray-500'}`}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => setGlobalDiscountType('fixed')}
                      className={`px-2.5 py-1 text-[10px] font-black ${globalDiscountType === 'fixed' ? 'bg-[#064E3B] text-white' : 'bg-white text-gray-500'}`}
                    >
                      $
                    </button>
                  </div>

                  {globalDiscountType !== 'none' && (
                    <input
                      type="number"
                      min={0}
                      className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#064E3B]"
                      placeholder={globalDiscountType === 'percent' ? "Ej. 10%" : "Ej. 50"}
                      value={globalDiscountValue || ''}
                      onChange={(e) => setGlobalDiscountValue(parseFloat(e.target.value) || 0)}
                    />
                  )}
                </div>
              </div>

              {paymentMethod === 'efectivo' && cart.length > 0 && (
                <div className="space-y-1">
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
              <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Subtotal Comanda</span>
                  <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                </div>
                {ticketDiscountAmount > 0 && (
                  <div className="flex justify-between items-center text-red-700 font-semibold">
                    <span>Rebaja Ticket</span>
                    <span className="font-mono">-${ticketDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                {paymentMethod === 'efectivo' && parseFloat(cashReceived) >= cartTotal && (
                  <div className="flex justify-between items-center text-[#166534] font-bold">
                    <span>Cambio Cliente</span>
                    <span className="font-mono text-sm">${changeDue.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1.5 text-[#064E3B] border-t border-dashed border-gray-100">
                  <span className="font-black text-sm uppercase">Total Neto</span>
                  <span className="text-xl font-black font-mono text-amber-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Confirmación */}
              <button
                type="submit"
                disabled={cart.length === 0}
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm py-3 rounded-xl transition-all shadow-2xs hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" /> 
                <span>{isOffline ? 'Registrar Venta (Offline)' : 'Registrar Venta en Caja'}</span>
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* ==================================================== */}
      {/* DIALOG MODAL: STANDBY TICKET CREATOR                  */}
      {/* ==================================================== */}`
      <AnimatePresence>
        {showStandbyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-md border border-gray-100 text-gray-800 space-y-4 text-xs font-semibold"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Bookmark className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-base font-black text-gray-900">Cuentas en Espera (Standby)</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Guarda la orden actual temporalmente para atender al siguiente en la fila</p>
                </div>
              </div>

              {/* Activa el guardado o listado de standby */}
              {cart.length > 0 && (
                <form onSubmit={handleSaveToStandby} className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-mono tracking-wider block">Identificador de Comanda (ej. Mesa 4, Cliente Gorra)</label>
                    <input
                      type="text"
                      required
                      placeholder="Mesa 5 o Llevar Sr. José"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                      value={standbyTicketName}
                      onChange={(e) => setStandbyTicketName(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => { setStandbyTicketName(''); setShowStandbyModal(false); }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-2xs transition-colors cursor-pointer"
                    >
                      Guardar en Espera
                    </button>
                  </div>
                </form>
              )}

              {/* List of current standby tickets */}
              <div className="space-y-3.5 pt-3">
                <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-mono border-b border-gray-100 pb-1.5">Comandas en Espera Activas</h4>
                
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {standbyTickets.map((t) => (
                    <div key={t.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200/60 flex items-center justify-between gap-3 hover:border-amber-400 transition-colors">
                      <div>
                        <p className="text-xs font-black text-gray-800">{t.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{t.items.length} paquetes • {new Date(t.date).toLocaleTimeString('es-MX')}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRestoreStandbyTicket(t)}
                        className="bg-[#064E3B] hover:bg-emerald-800 text-white font-black text-[10px] py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        Recuperar
                      </button>
                    </div>
                  ))}

                  {standbyTickets.length === 0 && (
                    <p className="text-center py-6 text-gray-400 italic">No hay comandas en espera actualmente.</p>
                  )}
                </div>
              </div>

              {cart.length === 0 && (
                <button
                  type="button"
                  onClick={() => setShowStandbyModal(false)}
                  className="w-full bg-gray-100 py-2 rounded-xl text-gray-600 font-black cursor-pointer"
                >
                  Cerrar
                </button>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* DIALOG MODAL: CRM LINK CUSTOMER SELECTOR              */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showCRMModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-md border border-gray-100 text-gray-800 space-y-4 text-xs font-semibold"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-black text-gray-900">Asociar Cliente CRM al Ticket</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Busque y seleccione un cliente de Elotelandia para registrar visitas y puntos</p>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o teléfono..."
                  value={crmSearchQuery}
                  onChange={(e) => setCrmSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {filteredCrmCustomers.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => handleLinkCustomer(c)}
                    className="p-2.5 bg-gray-50/50 hover:bg-blue-50 border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-extrabold text-gray-800">{c.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">TEL: {c.phone} • PUNTOS: {c.points} pts</p>
                    </div>
                    <span className="text-[10px] text-blue-600 font-extrabold uppercase">Seleccionar</span>
                  </div>
                ))}

                {filteredCrmCustomers.length === 0 && (
                  <p className="text-center py-6 text-gray-400 italic">No se encontraron clientes.</p>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                {linkedCustomer && (
                  <button
                    type="button"
                    onClick={() => { setLinkedCustomer(null); setShowCRMModal(false); }}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100"
                  >
                    Desvincular Cliente
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowCRMModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* DIALOG MODAL: PRODUCT MODIFIERS & PREP NOTES          */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedCartItemForModifiers !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-md border border-gray-100 text-gray-800 space-y-4 text-xs font-semibold"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
                <div>
                  <h3 className="text-base font-black text-[#064E3B]">Modificadores y Preparación</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Añada ingredientes adicionales con cargo, o especifique notas de cocina gratis</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-mono">Modificadores de Elotes (Con cargo o sin cargo)</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {presetModifiers.map((mod) => {
                    const item = cart[selectedCartItemForModifiers!];
                    const isSelected = item?.modifiers?.some(m => m.name === mod.name);

                    return (
                      <button
                        key={mod.name}
                        type="button"
                        onClick={() => handleToggleModifierOnItem(mod)}
                        className={`p-3 rounded-xl border text-left font-black transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-2xs' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs">{mod.name}</span>
                        <span className="text-[9px] font-mono mt-1 font-bold">
                          {mod.priceDelta > 0 ? `+$${mod.priceDelta} MXN` : 'Sin costo adicional'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Prep note */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono block">Notas específicas de preparación</label>
                <input
                  type="text"
                  placeholder="Ej. Sin limón y doble porción de chile de árbol"
                  value={customPrepNote}
                  onChange={(e) => setCustomPrepNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#064E3B]"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedCartItemForModifiers(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveModifiersAndNotes}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black hover:bg-[#064E3B]"
                >
                  Confirmar Ajustes
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* DIALOG MODAL: ITEM DISCOUNT SELECTOR                 */}
      {/* ==================================================== */}
      <AnimatePresence>
        {itemDiscountIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm border border-gray-100 text-gray-800 space-y-4 text-xs font-semibold"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Tag className="w-5 h-5 text-red-500 animate-pulse" />
                <div>
                  <h3 className="text-base font-black text-gray-900">Aplicar Descuento Especial</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Rebaja de último momento por porcentaje o monto fijo a este artículo</p>
                </div>
              </div>

              <div className="space-y-3.5 pt-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTempItemDiscountType('percent')}
                    className={`flex-1 py-2 border rounded-xl font-black text-center cursor-pointer uppercase text-[10px] ${
                      tempItemDiscountType === 'percent' 
                        ? 'bg-red-600 text-white border-red-700' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Porcentaje (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempItemDiscountType('fixed')}
                    className={`flex-1 py-2 border rounded-xl font-black text-center cursor-pointer uppercase text-[10px] ${
                      tempItemDiscountType === 'fixed' 
                        ? 'bg-red-600 text-white border-red-700' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Monto Fijo ($)
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400 uppercase tracking-wider font-mono">Valor de Rebaja</label>
                  <input
                    type="number"
                    min={0}
                    required
                    placeholder={tempItemDiscountType === 'percent' ? "Ej. 10 para 10%" : "Ej. 15 para $15"}
                    value={tempItemDiscountValue || ''}
                    onChange={(e) => setTempItemDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    // Quick clear discount
                    setCart(prev => {
                      const up = [...prev];
                      up[itemDiscountIndex!] = { ...up[itemDiscountIndex!], itemDiscount: undefined };
                      return up;
                    });
                    setItemDiscountIndex(null);
                  }}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100"
                >
                  Quitar Rebaja
                </button>
                <button
                  type="button"
                  onClick={() => setItemDiscountIndex(null)}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyItemDiscount}
                  className="px-3 py-2 bg-[#064E3B] text-white rounded-xl font-black hover:bg-emerald-800"
                >
                  Aplicar
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* FINAL RECEIPT VIEW: SIMULATED PHYSICAL THERMAL TICKET */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="my-8 w-full max-w-sm text-gray-900 space-y-5"
            >
              
              {/* Thermal receipt roll container */}
              <div 
                style={{ width: showReceipt.paperSize === '58mm' ? '280px' : '360px' }}
                className="bg-white border-2 border-gray-300 p-5 shadow-2xl mx-auto relative overflow-hidden"
              >
                
                {/* Toothed jagged edge of paper tear-off top & bottom */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(45deg,transparent_25%,#E5E7EB_25%,#E5E7EB_50%,transparent_50%,transparent_75%,#E5E7EB_75%)] bg-[length:10px_10px]"></div>
                
                {/* Simulated thermal ticket content */}
                <div className="space-y-4 font-mono text-center text-xs pt-2">
                  <div className="space-y-1">
                    <h3 className="font-serif font-black text-base tracking-wider uppercase">ELOTELANDIA</h3>
                    <p className="text-[10px] text-gray-500">SUCURSAL VIALIDAD GUADALUPE</p>
                    <p className="text-[9px] text-gray-400">ZACATECAS, MÉXICO</p>
                    <p className="text-[9px] text-gray-400">TEL: 492 101 2030</p>
                  </div>

                  <div className="border-t border-b border-dashed border-gray-400 py-2.5 text-left space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span>TICKET:</span>
                      <span className="font-extrabold">#{showReceipt.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FECHA:</span>
                      <span>{new Date(showReceipt.date).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CAJERO:</span>
                      <span>{showReceipt.cashierName.toUpperCase()}</span>
                    </div>
                    {showReceipt.customerName && (
                      <div className="flex justify-between text-blue-900 font-bold">
                        <span>CLIENTE CRM:</span>
                        <span>{showReceipt.customerName.toUpperCase()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>ESTATUS:</span>
                      <span className="text-emerald-800">{isOffline ? 'OFFLINE (Caché)' : 'CONCILIADO'}</span>
                    </div>
                  </div>

                  {/* Items ledger */}
                  <div className="space-y-2 text-left text-[11px]">
                    <div className="flex justify-between font-black border-b border-dashed border-gray-300 pb-1 text-[10px] uppercase">
                      <span>DESCRIPCIÓN</span>
                      <span>IMPORTE</span>
                    </div>
                    
                    {showReceipt.items.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-extrabold">{item.quantity}x {item.productName}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        {/* Display modifiers inside physical ticket */}
                        {item.modifiers && item.modifiers.map((mod, mIdx) => (
                          <div key={mIdx} className="pl-3 text-[10px] text-gray-500 flex justify-between">
                            <span>* {mod.name}</span>
                            {mod.priceDelta > 0 && <span>+${mod.priceDelta.toFixed(2)}</span>}
                          </div>
                        ))}
                        {item.notes && (
                          <p className="pl-3 text-[9px] text-gray-400 italic">Prepara: "{item.notes}"</p>
                        )}
                        {item.itemDiscount && (
                          <div className="pl-3 text-[10px] text-red-600 flex justify-between">
                            <span>Rebaja ({item.itemDiscount.type === 'percent' ? `${item.itemDiscount.value}%` : `$${item.itemDiscount.value}`})</span>
                            <span>-${item.itemDiscount.amount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary of invoice */}
                  <div className="border-t border-dashed border-gray-400 pt-2.5 text-right text-[11px] space-y-1">
                    {showReceipt.discountAmount && showReceipt.discountAmount > 0 ? (
                      <div className="flex justify-between">
                        <span>REBAJA TOTAL:</span>
                        <span>-${showReceipt.discountAmount.toFixed(2)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between font-black text-sm text-gray-900 border-b border-dashed border-gray-400 pb-1.5 pt-1">
                      <span>TOTAL NETO:</span>
                      <span>${showReceipt.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>PAGO:</span>
                      <span>{showReceipt.paymentMethod?.toUpperCase() || 'EFECTIVO'}</span>
                    </div>
                    {showReceipt.paymentMethod === 'efectivo' && showReceipt.changeDue !== undefined && (
                      <div className="flex justify-between font-bold text-[#166534]">
                        <span>CAMBIO ENTREGADO:</span>
                        <span>${showReceipt.changeDue.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Physical ticket footer */}
                  <div className="space-y-1.5 pt-4 text-center border-t border-dashed border-gray-300 text-[9px] text-gray-400">
                    <p className="font-extrabold uppercase">¡Gracias por su antojo en Elotelandia!</p>
                    <p>Sabor 100% Zacatecano original</p>
                    <p className="font-mono mt-1 text-[8px]">PREVIEW THERMAL {showReceipt.paperSize} ({showReceipt.printerType})</p>
                  </div>

                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[linear-gradient(45deg,transparent_25%,#E5E7EB_25%,#E5E7EB_50%,transparent_50%,transparent_75%,#E5E7EB_75%)] bg-[length:10px_10px]"></div>
              </div>

              {/* simulated actions */}
              <div className="flex gap-2.5 font-semibold text-xs text-white max-w-sm mx-auto">
                <button
                  onClick={() => {
                    // Play simulated print noise via a dynamic audio alert (or visual success fallback)
                    const utterance = new SpeechSynthesisUtterance("Imprimiendo ticket térmico");
                    utterance.rate = 1.3;
                    window.speechSynthesis?.speak(utterance);
                    alert(`🖨️ Mandando a imprimir ticket #${showReceipt.id} (${showReceipt.paperSize}) vía puerto ${showReceipt.printerType}...`);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 p-3 rounded-xl transition-colors cursor-pointer text-center font-black flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Re-imprimir Físico
                </button>
                <button 
                  onClick={() => setShowReceipt(null)}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 p-3 rounded-xl transition-colors cursor-pointer text-center font-black"
                >
                  Continuar Nueva Venta
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
