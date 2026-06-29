import { Product, Employee, Sale, Insumo, CorteDeCaja } from '../types';
import { 
  BarChart3, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Award,
  CalendarDays,
  ArrowUpRight,
  Download,
  AlertTriangle,
  Coins,
  Receipt,
  UserCheck,
  Scale
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface MetricsModuleProps {
  products: Product[];
  employees: Employee[];
  sales: Sale[];
  insumos?: Insumo[];
  cortes?: CorteDeCaja[];
}

export default function MetricsModule({ 
  products, 
  employees, 
  sales = [], 
  insumos = [], 
  cortes = [] 
}: MetricsModuleProps) {
  const [selectedReportTab, setSelectedReportTab] = useState<'ventas' | 'inventario' | 'cortes'>('ventas');

  // Calculated base stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Activo').length;

  // 1. Global Revenue (Ventas Globales)
  const ventasGlobalesAmount = sales.reduce((sum, s) => sum + s.total, 0);
  const totalVentasCount = sales.length;

  // 2. Today's Revenue (Ventas del Día)
  const todayStr = new Date().toISOString().split('T')[0];
  const salesToday = sales.filter(s => s.date.includes(todayStr));
  const ventasDiaAmount = salesToday.reduce((sum, s) => sum + s.total, 0);
  const ventasDiaCount = salesToday.length;

  // ==========================================
  // COGS & PROFIT MARGINS (COGS + UTILITY)
  // ==========================================
  // Function to calculate exact COGS (Costo de los Insumos Vendidos) for a single sale item
  const getSaleItemCOGS = (productId: string, quantity: number, originalPrice: number): number => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return (originalPrice * 0.3) * quantity; // default fallback 30% of price

    const recipe = prod.recipe;
    if (!recipe || recipe.length === 0) {
      // Fallback: use product price times an assumed 30% ingredient cost margin
      return (prod.price * 0.3) * quantity;
    }

    // Calculate sum of ingredients cost
    const recipeCostSum = recipe.reduce((costSum, recipeItem) => {
      const ins = insumos.find(i => i.id === recipeItem.insumoId);
      if (!ins) return costSum;
      return costSum + (ins.cost * recipeItem.quantity);
    }, 0);

    return recipeCostSum * quantity;
  };

  // Calculate COGS across all sales
  const totalCOGSGlobal = sales.reduce((totalCogs, sale) => {
    const saleCogsSum = sale.items.reduce((itemCogsSum, item) => {
      return itemCogsSum + getSaleItemCOGS(item.productId, item.quantity, item.price);
    }, 0);
    return totalCogs + saleCogsSum;
  }, 0);

  // Today's COGS
  const totalCOGSToday = salesToday.reduce((totalCogs, sale) => {
    const saleCogsSum = sale.items.reduce((itemCogsSum, item) => {
      return itemCogsSum + getSaleItemCOGS(item.productId, item.quantity, item.price);
    }, 0);
    return totalCogs + saleCogsSum;
  }, 0);

  // Profit margins
  const profitGlobal = Math.max(0, ventasGlobalesAmount - totalCOGSGlobal);
  const profitMarginGlobalPercent = ventasGlobalesAmount > 0 ? (profitGlobal / ventasGlobalesAmount) * 100 : 0;

  const profitToday = Math.max(0, ventasDiaAmount - totalCOGSToday);
  const profitMarginTodayPercent = ventasDiaAmount > 0 ? (profitToday / ventasDiaAmount) * 100 : 0;

  // ==========================================
  // HOURLY SALES DISTRIBUTION (PEAK HOURS)
  // ==========================================
  // Aggregate sales by hour
  const hourlySalesMap: { [hour: number]: { amount: number; count: number } } = {};
  
  // Initialize typical operating hours 11:00 to 23:00
  for (let h = 11; h <= 23; h++) {
    hourlySalesMap[h] = { amount: 0, count: 0 };
  }

  // Populate data from sales
  sales.forEach(sale => {
    const d = new Date(sale.date);
    const hour = d.getHours();
    
    if (hourlySalesMap[hour] !== undefined) {
      hourlySalesMap[hour].amount += sale.total;
      hourlySalesMap[hour].count += 1;
    } else {
      // Out of bounds operating hour
      hourlySalesMap[hour] = { amount: sale.total, count: 1 };
    }
  });

  const hourlyData = Object.entries(hourlySalesMap).map(([hourStr, data]) => ({
    hour: parseInt(hourStr),
    label: `${hourStr.padStart(2, '0')}:00`,
    amount: data.amount,
    count: data.count
  })).sort((a, b) => a.hour - b.hour);

  // Find Peak Hour
  const peakHourItem = [...hourlyData].sort((a, b) => b.amount - a.amount)[0];
  const maxHourlyAmount = Math.max(...hourlyData.map(h => h.amount), 1);

  // ==========================================
  // BEST SELLERS
  // ==========================================
  const productSalesMap: { [name: string]: { qty: number; revenue: number } } = {};
  
  products.forEach(p => {
    productSalesMap[p.name] = { qty: 0, revenue: 0 };
  });

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

  const maxBestSellerQty = Math.max(...sortedBestSellers.map(s => s.qty), 1);

  // ==========================================
  // EXPORT REPORT HELPER (CSV ENGINE)
  // ==========================================
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSales = () => {
    let csv = "ID Ticket,Fecha,Cajero,Metodo Pago,Monto Cobrado,Costo Insumos (COGS),Ganancia Neta,Cliente CRM,Ingredientes Vendidos\n";
    
    sales.forEach(s => {
      const saleCOGS = s.items.reduce((sum, item) => sum + getSaleItemCOGS(item.productId, item.quantity, item.price), 0);
      const profit = s.total - saleCOGS;
      const itemsDetail = s.items.map(item => `${item.quantity}x ${item.productName}`).join('; ');
      
      const row = [
        s.id,
        new Date(s.date).toISOString().replace('T', ' ').substring(0, 19),
        `"${s.cashierName.replace(/"/g, '""')}"`,
        s.paymentMethod || 'efectivo',
        s.total.toFixed(2),
        saleCOGS.toFixed(2),
        profit.toFixed(2),
        s.customerName ? `"${s.customerName.replace(/"/g, '""')}"` : 'Venta General',
        `"${itemsDetail.replace(/"/g, '""')}"`
      ];
      csv += row.join(",") + "\n";
    });

    downloadCSV(csv, `Elotelandia_Reporte_Ventas_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportInventory = () => {
    let csv = "ID Insumo,Nombre Insumo,Stock Actual,Unidad,Stock Minimo Alerta,Costo Unitario,Valuacion de Inventario,Estatus Alerta\n";
    
    insumos.forEach(i => {
      const val = i.stock * i.cost;
      const status = i.stock <= i.minStock ? "BAJO STOCK - REABASTECER" : "STOCK SEGURO";
      const row = [
        i.id,
        `"${i.name.replace(/"/g, '""')}"`,
        i.stock,
        i.unit,
        i.minStock,
        i.cost.toFixed(2),
        val.toFixed(2),
        status
      ];
      csv += row.join(",") + "\n";
    });

    downloadCSV(csv, `Elotelandia_Reporte_Inventarios_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportAudits = () => {
    let csv = "ID Corte,Fecha,Cajero,Efectivo Registrado,Efectivo Fisico Real,Diferencia de Caja,Estatus Conciliacion,Notas\n";
    
    cortes.forEach(c => {
      const row = [
        c.id,
        new Date(c.date).toISOString().replace('T', ' ').substring(0, 19),
        `"${c.cashierName.replace(/"/g, '""')}"`,
        c.expectedCash.toFixed(2),
        c.actualCash.toFixed(2),
        c.difference.toFixed(2),
        c.status,
        c.notes ? `"${c.notes.replace(/"/g, '""')}"` : 'Sin comentarios'
      ];
      csv += row.join(",") + "\n";
    });

    downloadCSV(csv, `Elotelandia_Reporte_Auditorias_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="w-full space-y-8 select-none text-elote-dark animate-fade-in">
      
      {/* Banner / Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 animate-pulse" /> Inteligencia Comercial
            </span>
            <h2 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
              Métricas Estratégicas y COGS de Insumos
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl font-medium leading-relaxed">
              Consulte el margen de utilidad real restando el costo de insumos (COGS), analice las horas pico exactas para eficientar el personal de eloteros, y descargue reportes detallados.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-center text-xs font-mono text-[#064E3B] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Actualización automática</span>
          </div>
        </div>
      </div>

      {/* Main KPI Stats grid (Ventas, COGS, Margen de Utilidad) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI Card 1: Ingresos Globales */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/50 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Ingresos Totales</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
                  ${ventasGlobalesAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Ticket Promedio</span>
            <span className="font-bold text-[#064E3B] font-mono">
              ${totalVentasCount > 0 ? (ventasGlobalesAmount / totalVentasCount).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        {/* KPI Card 2: Costo de lo Vendido (COGS) */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-800 border border-orange-200/50 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Costo Insumos (COGS)</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
                  ${totalCOGSGlobal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Eficacia Costo</span>
            <span className="font-bold text-orange-700 font-mono">
              {ventasGlobalesAmount > 0 ? ((totalCOGSGlobal / ventasGlobalesAmount) * 100).toFixed(1) : '0.0'}% de ventas
            </span>
          </div>
        </div>

        {/* KPI Card 3: Utilidad Real */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-lg"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Utilidad Neta Real</p>
                <h3 className="text-2xl font-black text-emerald-950 tracking-tight mt-1">
                  ${profitGlobal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono font-bold px-2 py-0.5 rounded-md shrink-0">
              {profitMarginGlobalPercent.toFixed(1)}% margen
            </span>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Utilidad Hoy</span>
            <span className="font-extrabold text-emerald-700 font-mono">
              +${profitToday.toFixed(2)} ({profitMarginTodayPercent.toFixed(0)}%)
            </span>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* HOURLY SALES DISTRIBUTION & BEST SELLERS   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfica de Ventas por Horas (Col 8) */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-black text-[#064E3B] tracking-tight flex items-center gap-1.5">
                <Clock className="w-4.5 h-4.5 text-amber-500" /> Distribución de Ventas por Horas
              </h3>
              <p className="text-xs text-gray-400 font-medium">Histórico acumulado de ingresos por hora para planificar turnos del personal.</p>
            </div>

            {peakHourItem && peakHourItem.amount > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] px-2.5 py-1 rounded-full font-mono font-bold select-none">
                <Award className="w-3 h-3 text-amber-500 animate-bounce" /> HORA PICO: {peakHourItem.label}
              </span>
            )}
          </div>

          {/* Visual SVG Bar Chart */}
          <div className="pt-4">
            <div className="relative h-64 flex items-end justify-between gap-1 border-b border-gray-100 pb-1.5 w-full">
              {hourlyData.map((hData) => {
                const heightPercent = maxHourlyAmount > 0 ? (hData.amount / maxHourlyAmount) * 85 : 0;
                const isPeak = peakHourItem && peakHourItem.hour === hData.hour && hData.amount > 0;
                
                return (
                  <div key={hData.hour} className="flex-1 flex flex-col items-center group relative cursor-pointer h-full justify-end">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-gray-900 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-mono leading-tight shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-28 text-center">
                      <p className="font-sans font-extrabold text-[#FCD34D]">{hData.label}</p>
                      <p className="font-bold mt-0.5">${hData.amount.toFixed(0)} MXN</p>
                      <p className="text-[9px] text-gray-300 font-medium mt-0.5">{hData.count} tickets</p>
                    </div>

                    {/* Bar Container */}
                    <div className="w-full px-0.5 flex flex-col items-center">
                      {hData.amount > 0 && (
                        <span className="text-[9px] font-bold font-mono text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          ${hData.amount.toFixed(0)}
                        </span>
                      )}
                      
                      <div 
                        style={{ height: `${Math.max(4, heightPercent)}%` }}
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isPeak 
                            ? 'bg-gradient-to-t from-amber-600 to-amber-400 hover:to-amber-300 shadow-md shadow-amber-500/10' 
                            : hData.amount > 0 
                              ? 'bg-gradient-to-t from-emerald-800 to-emerald-600 hover:to-emerald-500' 
                              : 'bg-gray-100'
                        }`}
                      ></div>
                    </div>

                    {/* Hour Label */}
                    <span className="text-[10px] font-mono font-bold text-gray-400 mt-2 shrink-0 group-hover:text-gray-900 transition-colors">
                      {hData.hour}h
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium pt-3.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span> Ventas Ordinarias
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Hora de Mayor Demanda (Pico)
              </span>
            </div>
          </div>
        </div>

        {/* Resumen Operativo / Top Sellers (Col 4) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="space-y-0.5 border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-[#064E3B]">Paquetes más Demandados</h3>
            <p className="text-xs text-gray-400 font-medium">Volumen de ventas ordenado de mayor a menor</p>
          </div>

          <div className="space-y-4 pt-2 max-h-[220px] overflow-y-auto pr-1">
            {sortedBestSellers.slice(0, 4).map((item, index) => {
              const widthPct = Math.round((item.qty / maxBestSellerQty) * 100) || 5;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-800 font-extrabold truncate max-w-[140px]">{item.name}</span>
                    <span className="font-mono text-emerald-800 text-[11px] font-black">{item.qty} u.</span>
                  </div>
                  
                  <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden flex">
                    <div 
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded-full ${
                        index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-emerald-600' : 'bg-gray-400'
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* EXPORT REPORTS PANEL (CENTRAL CLOSURE)      */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-[#064E3B] tracking-tight flex items-center gap-1.5">
              <Download className="w-4.5 h-4.5 text-blue-500" /> Exportación de Reportes Financieros y Auditorías
            </h3>
            <p className="text-xs text-gray-400 font-medium">Descargue bases de datos consolidadas en formato CSV universales para conciliaciones externas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card Reporte 1: Ventas */}
          <div className="p-5 bg-emerald-50/20 border border-emerald-100 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md font-mono uppercase">Ventas Ledger</span>
              <h4 className="text-xs font-extrabold text-gray-900 pt-1">Reporte de Ventas General</h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed pt-0.5">Detallado por ticket, cajero, desglose de recetas, montos, COGS calculado y utilidad neta.</p>
            </div>
            
            <button
              onClick={handleExportSales}
              className="w-full bg-[#064E3B] hover:bg-emerald-800 text-white font-black text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Descargar CSV
            </button>
          </div>

          {/* Card Reporte 2: Inventarios */}
          <div className="p-5 bg-amber-50/20 border border-amber-200/50 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md font-mono uppercase">Insumos & Stock</span>
              <h4 className="text-xs font-extrabold text-gray-900 pt-1">Auditoría de Inventarios</h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed pt-0.5">Lista de materia prima, stock físico actual en gramos/mililitros, alertas de stock mínimo y costo valorado.</p>
            </div>
            
            <button
              onClick={handleExportInventory}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Descargar CSV
            </button>
          </div>

          {/* Card Reporte 3: Cortes de Caja */}
          <div className="p-5 bg-blue-50/15 border border-blue-100 rounded-2xl flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md font-mono uppercase">Arqueos de Caja</span>
              <h4 className="text-xs font-extrabold text-gray-900 pt-1">Reporte de Auditorías</h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed pt-0.5">Historial de arqueos de caja del personal, diferencias encontradas, fondos iniciales, notas y estatus.</p>
            </div>
            
            <button
              onClick={handleExportAudits}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Descargar CSV
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
