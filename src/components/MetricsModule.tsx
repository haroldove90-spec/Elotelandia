import { Product, Employee, Sale } from '../types';
import { 
  BarChart3, 
  ShoppingBag, 
  Users2, 
  TrendingUp, 
  Clock, 
  Award,
  CalendarDays,
  Gem,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { motion } from 'motion/react';

interface MetricsModuleProps {
  products: Product[];
  employees: Employee[];
  sales: Sale[];
}

export default function MetricsModule({ products, employees, sales = [] }: MetricsModuleProps) {
  // Calculated stats from state
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Activo').length;

  // 1. Vetnas Globales
  const ventasGlobalesAmount = sales.reduce((sum, s) => sum + s.total, 0);
  const totalVentasCount = sales.length;

  // 2. Ventas del Día
  const todayStr = new Date().toISOString().split('T')[0];
  const salesToday = sales.filter(s => s.date.includes(todayStr));
  const ventasDiaAmount = salesToday.reduce((sum, s) => sum + s.total, 0);
  const ventasDiaCount = salesToday.length;

  // 3. Productos más vendidos
  const productSalesMap: { [name: string]: { qty: number; revenue: number } } = {};
  
  // Seed initial values to make sure everything exhibits nicely even with few items
  products.forEach(p => {
    productSalesMap[p.name] = { qty: 0, revenue: 0 };
  });

  // Aggregate with current sales
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSalesMap[item.productName]) {
        productSalesMap[item.productName] = { qty: 0, revenue: 0 };
      }
      productSalesMap[item.productName].qty += item.quantity;
      productSalesMap[item.productName].revenue += (item.quantity * item.price);
    });
  });

  const sortedBestSellers = Object.entries(productSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.qty - a.qty);

  const maxQty = Math.max(...sortedBestSellers.map(s => s.qty), 1);

  return (
    <div className="w-full space-y-8">
      
      {/* Banner / Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" /> Métricas & Rendimiento
            </span>
            <h2 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
              Métricas de Elotelandia
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xl">
              Monitoreo unificado y en tiempo real de transacciones, comandas y desempeño. Los datos reflejan tanto cambios en el administrador como el flujo del punto de venta (POS).
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-center text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Datos en tiempo real</span>
          </div>
        </div>
      </div>

      {/* Main KPI Stats grid (Ventas Globales & Ventas del Día) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* KPI Card 1: Ventas del Día */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/5 rounded-full blur-xl"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] flex items-center justify-center shadow-2xs shrink-0">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Ventas del Día</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
                  ${ventasDiaAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-0.5 text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-lg">
                <ArrowUpRight className="w-3.5 h-3.5" /> Activo
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-gray-100 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">Transacciones Hoy</span>
              <span className="text-emerald-700 font-extrabold text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {ventasDiaCount} cobradas
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">Ticket Promedio Hoy</span>
              <span className="text-amber-700 font-extrabold text-sm font-mono">
                ${ventasDiaCount > 0 ? (ventasDiaAmount / ventasDiaCount).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* KPI Card 2: Ventas Globales */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-600/5 rounded-full blur-xl"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/50 flex items-center justify-center shadow-2xs shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Ventas Globales</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
                  ${ventasGlobalesAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-gray-100 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">Pedidos Registrados</span>
              <span className="text-emerald-700 font-extrabold text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {totalVentasCount} órdenes
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">Estatus de Caja</span>
              <span className="text-emerald-800 font-extrabold text-sm bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                Abierta y Cuadrada
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Grid: Productos más vendidos (Bento Box Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Productos más vendidos (Col de 8) */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-black text-[#064E3B] tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500 animate-bounce" /> Paquetes Más Vendidos
              </h3>
              <p className="text-xs text-gray-500 font-medium">Clasificación según la cantidad de unidades vendidas.</p>
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/50 px-2.5 py-1 rounded-full font-mono font-black uppercase tracking-wider">
              En Demanda
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {sortedBestSellers.slice(0, 5).map((item, index) => {
              const percentage = Math.round((item.qty / maxQty) * 100) || 5;
              const placeColors = [
                { bg: 'bg-amber-100/80', text: 'text-amber-800 border-amber-300' },
                { bg: 'bg-slate-100', text: 'text-slate-700 border-slate-300' },
                { bg: 'bg-orange-100', text: 'text-orange-900 border-orange-200' },
                { bg: 'bg-gray-50', text: 'text-gray-500 border-gray-100' },
                { bg: 'bg-gray-50', text: 'text-gray-500 border-gray-100' }
              ];
              const badgeStyle = placeColors[index] || { bg: 'bg-gray-50', text: 'text-gray-500 border-gray-100' };

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] border ${badgeStyle.bg} ${badgeStyle.text} shrink-0`}>
                        {index + 1}
                      </span>
                      <span className="font-extrabold text-gray-800 truncate select-none">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-right shrink-0">
                      <span className="text-emerald-700 font-extrabold">{item.qty} u.</span>
                      <span className="text-gray-400 text-[10px] font-semibold">${item.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar representational chart */}
                  <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden border border-gray-100/50 flex">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`h-full rounded-full ${
                        index === 0 
                          ? 'bg-amber-500' 
                          : index === 1 
                            ? 'bg-emerald-600' 
                            : index === 2 
                              ? 'bg-[#064E3B]' 
                              : 'bg-gray-400'
                      }`}
                    ></motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen Operativo de Sucursal (Col de 4) */}
        <div className="lg:col-span-4 bg-[#FEFCE8]/40 border border-amber-200/40 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
              <Gem className="w-3.5 h-3.5" /> Estado de Operación
            </span>
            <div className="space-y-1">
              <h4 className="font-black text-[#064E3B] text-base">Inventario & Personal</h4>
              <p className="text-[11px] text-amber-900/80 leading-relaxed font-sans mt-1">
                La sucursal se encuentra operando al 100% con un total de <strong>{totalEmployees}</strong> integrantes y un portafolio de <strong>{totalProducts}</strong> paquetes registrados para la comanda de clientes.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-amber-200/30">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-500 font-sans">Productos Activos</span>
              <span className="font-bold text-[#064E3B]">{activeProducts} / {totalProducts}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-500 font-sans">Personal Activo</span>
              <span className="font-bold text-emerald-700">{activeEmployees} / {totalEmployees}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
