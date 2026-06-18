import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Power, 
  Eye, 
  Sparkles, 
  DollarSign, 
  ListPlus, 
  Search, 
  X, 
  CornerDownRight, 
  CheckCircle2, 
  AlertCircle,
  Undo2
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProductsModuleProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function ProductsModule({ products, setProducts }: ProductsModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Form States
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Form input fields
  const [formId, setFormId] = useState<string | null>(null); // null means adding new
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formItemText, setFormItemText] = useState('');
  const [formItemsList, setFormItemsList] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  // Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Switch form to Add Mode
  const handleOpenAddForm = () => {
    setFormId(null);
    setFormName('');
    setFormPrice('');
    setFormItemText('');
    setFormItemsList([]);
    setFormError('');
    setIsOpenForm(true);
  };

  // Switch form to Edit Mode
  const handleOpenEditForm = (product: Product) => {
    setFormId(product.id);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormItemText('');
    setFormItemsList([...product.items]);
    setFormError('');
    setIsOpenForm(true);
  };

  // Add item to temporary item list in form
  const handleAddItemToFormList = () => {
    if (!formItemText.trim()) return;
    setFormItemsList([...formItemsList, formItemText.trim()]);
    setFormItemText('');
  };

  // Remove item from temporary list
  const handleRemoveItemFromFormList = (indexToRemove: number) => {
    setFormItemsList(formItemsList.filter((_, idx) => idx !== indexToRemove));
  };

  // Save/Submit Form (handles both Create and Update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Por favor redacta el nombre del paquete.');
      return;
    }
    const parsedPrice = parseFloat(formPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Escribe un precio numérico válido y mayor a $0.');
      return;
    }
    if (formItemsList.length === 0) {
      setFormError('Agrega al menos un componente/producto a la lista.');
      return;
    }

    if (formId) {
      // Edit mode
      setProducts(products.map(p => p.id === formId ? {
        ...p,
        name: formName.trim().toUpperCase(),
        price: parsedPrice,
        items: formItemsList
      } : p));
      triggerNotification(`¡Producto "${formName.toUpperCase()}" actualizado con éxito!`, 'success');
    } else {
      // Add mode
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formName.trim().toUpperCase(),
        price: parsedPrice,
        isActive: true,
        items: formItemsList
      };
      setProducts([...products, newProduct]);
      triggerNotification(`¡Paquete "${newProduct.name}" registrado correctamente!`, 'success');
    }

    setIsOpenForm(false);
  };

  // Toggle active / deactivated status
  const handleToggleStatus = (id: string) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const nextStatus = !p.isActive;
        triggerNotification(
          `Sabor alternado: "${p.name}" ahora está ${nextStatus ? 'ACTIVO' : 'DESACTIVADO'}`,
          nextStatus ? 'success' : 'info'
        );
        return { ...p, isActive: nextStatus };
      }
      return p;
    }));
  };

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    setProducts(products.filter(p => p.id !== id));
    triggerNotification(`Se eliminó el paquete "${name}" definitivamente del catálogo.`, 'danger');
  };

  // View details
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsOpenView(true);
  };

  // Filter products by search query
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full space-y-6">
      
      {/* Dynamic Action & Toast Notifications */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border text-sm font-semibold max-w-sm ${
            notification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : notification.type === 'danger'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="flex-1">{notification.message}</p>
        </motion.div>
      )}

      {/* Promotional/Instruction Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Paquetes del Mundial 2026
          </span>
          <h2 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
            Catálogo de Productos y Promociones
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Gestiona de forma dinámica los paquetes mundialistas de Elotelandia. Modifica precios, alterna el estado, elimina o añade nuevos combos directamente desde este administrador.
          </p>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="bg-[#064E3B] text-white hover:bg-[#065F46] font-bold text-sm px-5 py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 self-start md:self-center shadow-md active:scale-95 shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Registrar Producto
        </button>
      </div>

      {/* Search Bar filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
        <input 
          type="text"
          placeholder="Buscar paquete o ingrediente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] text-[#111827] placeholder:text-gray-400 font-medium"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:bg-gray-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Products List as requested (en forma de lista cada uno, sin foto) */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white/80 border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500/60" />
            <h3 className="font-bold text-gray-700">No se encontraron productos</h3>
            <p className="text-xs mt-1">Prueba reescribiendo el término de búsqueda o crea uno nuevo.</p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-xs font-bold text-[#064E3B] hover:underline"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              className={`bg-white border rounded-2xl shadow-xs transition-colors duration-200 overflow-hidden ${
                product.isActive ? 'border-gray-200' : 'border-gray-200 bg-gray-50/50 opacity-75'
              }`}
            >
              {/* Product row header */}
              <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Product Name & Items Checklist */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className={`text-lg font-black tracking-tight ${product.isActive ? 'text-[#064E3B]' : 'text-gray-400 line-through'}`}>
                      {product.name}
                    </h3>

                    {/* Price Tag with logo color */}
                    <span className="font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200/60 text-sm px-2.5 py-0.5 rounded-lg">
                      ${product.price} MXN
                    </span>

                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5. font-bold rounded-full ${
                      product.isActive 
                        ? 'bg-emerald-50 text-[#166534] border border-emerald-200' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'}`}></span>
                      {product.isActive ? 'Activo' : 'Desactivado'}
                    </span>
                  </div>

                  {/* List items representation (sin fotos, solo texto de lista) */}
                  <div className="bg-[#FEFCE8]/40 border border-gray-100 rounded-xl p-3.5 space-y-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Componentes del Combo:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {product.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <CornerDownRight className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                          <span className={product.isActive ? '' : 'line-through text-gray-400'}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Operations Control buttons */}
                <div className="flex flex-wrap items-center gap-2 self-stretch md:self-center justify-end sm:border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 shrink-0">
                  
                  {/* VER Button */}
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition flex items-center justify-center gap-1.5 text-xs font-semibold"
                    title="Ver Detalle"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden lg:inline">Ver</span>
                  </button>

                  {/* EDITAR Button */}
                  <button
                    onClick={() => handleOpenEditForm(product)}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition flex items-center justify-center gap-1.5 text-xs font-semibold"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden lg:inline">Editar</span>
                  </button>

                  {/* DESACTIVAR Button */}
                  <button
                    onClick={() => handleToggleStatus(product.id)}
                    className={`p-2 rounded-lg border transition flex items-center justify-center gap-1.5 text-xs font-semibold ${
                      product.isActive
                        ? 'border-gray-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                    title={product.isActive ? 'Desactivar' : 'Re-activar'}
                  >
                    <Power className="w-4 h-4" />
                    <span>{product.isActive ? 'Desactivar' : 'Activar'}</span>
                  </button>

                  {/* BORRAR Button */}
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition flex items-center justify-center gap-1.5 text-xs font-semibold"
                    title="Borrar paquete"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Borrar</span>
                  </button>

                </div>

              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* FORM MODAL (Add / Edit Product) */}
      {isOpenForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-lg w-full"
          >
            {/* Header */}
            <div className="bg-[#064E3B] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold font-serif text-lg">
                  {formId ? 'Editar Paquete' : 'Registrar Nuevo Producto'}
                </h3>
              </div>
              <button 
                onClick={() => setIsOpenForm(false)}
                className="p-1 rounded-full text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-600" />
                  <p>{formError}</p>
                </div>
              )}

              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Nombre del Producto / Combo</label>
                <input 
                  type="text"
                  placeholder="Eje: PAQUETE ESPECIAL"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm font-semibold uppercase"
                  required
                />
              </div>

              {/* Product Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Precio ($ MXN)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="number"
                    placeholder="350"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Components / List Items Setup */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Agregar Fila / Componente de la Lista</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Eje: 3 elotes empanizados con ajonjolí"
                    value={formItemText}
                    onChange={(e) => setFormItemText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItemToFormList();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddItemToFormList}
                    className="bg-[#064E3B]/10 hover:bg-[#064E3B] text-[#064E3B] hover:text-white px-4 rounded-xl transition font-bold text-sm shrink-0 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar</span>
                  </button>
                </div>

                {/* Added Items List */}
                <div className="border border-dashed border-gray-200 bg-gray-50 rounded-2xl p-4 gap-2 space-y-1.5 max-h-36 overflow-y-auto">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider font-mono">Componentes Agregados:</span>
                  {formItemsList.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2 italic">Sin elementos en la lista. Redacta componentes arriba.</p>
                  ) : (
                    formItemsList.map((itm, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 bg-white p-2 border border-gray-100 rounded-lg shadow-2xs">
                        <span className="text-xs text-gray-700 font-medium truncate">{itm}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItemFromFormList(idx)}
                          className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded-full transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 font-sans">
                <button
                  type="button"
                  onClick={() => setIsOpenForm(false)}
                  className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-100 rounded-xl py-3 font-semibold transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#064E3B] text-white hover:bg-[#065F46] rounded-xl py-3 font-bold transition text-sm shadow-md"
                >
                  {formId ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* VIEW MODAL (Details Display) */}
      {isOpenView && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-md w-full"
          >
            {/* Upper banner with brand color */}
            <div className="bg-[#FEFCE8] p-6 border-b border-gray-100 flex flex-col items-center text-center relative">
              <button 
                onClick={() => setIsOpenView(false)}
                className="absolute right-4 top-4 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-[#166534] border border-gray-200/50 shadow-xs mb-3">
                <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              
              <h3 className="font-extrabold text-[#064E3B] text-xl tracking-tight leading-tight uppercase font-sans">
                {selectedProduct.name}
              </h3>
              
              <span className="font-mono font-black text-amber-600 bg-amber-500/10 border border-amber-300 text-xs px-3 py-1 rounded-full mt-2">
                ${selectedProduct.price} MXN
              </span>
            </div>

            {/* List Components content */}
            <div className="p-6 space-y-4">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest font-mono">Detalle del paquete:</span>
              
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <ol className="space-y-3">
                  {selectedProduct.items.map((line, index) => (
                    <li key={index} className="flex gap-3 items-start text-sm text-gray-700 font-medium">
                      <span className="w-6 h-6 bg-emerald-100 text-[#166534] rounded-full flex items-center justify-center text-xs font-black shrink-0 font-mono">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 leading-snug">{line}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border bg-gray-50 border-gray-100">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-mono">Estatus actual:</span>
                <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold ${
                  selectedProduct.isActive 
                    ? 'bg-emerald-50 text-[#166534] border border-emerald-200' 
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}>
                  {selectedProduct.isActive ? 'Listo para la venta' : 'No disponible'}
                </span>
              </div>

              {/* Control Action footer */}
              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => {
                    setIsOpenView(false);
                    handleOpenEditForm(selectedProduct);
                  }}
                  className="flex-1 bg-gray-50/80 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl py-2.5 font-bold transition text-xs flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => setIsOpenView(false)}
                  className="flex-1 bg-[#064E3B] text-white hover:bg-[#065F46] rounded-xl py-2.5 font-bold transition text-xs flex items-center justify-center"
                >
                  Regresar
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
