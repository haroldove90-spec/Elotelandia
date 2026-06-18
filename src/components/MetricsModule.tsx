import React from 'react';
import { Product, Employee } from '../types';
import { 
  Building2, 
  BarChart3, 
  ShoppingBag, 
  Users2, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Construction
} from 'lucide-react';
import { motion } from 'motion/react';

interface MetricsModuleProps {
  products: Product[];
  employees: Employee[];
}

export default function MetricsModule({ products, employees }: MetricsModuleProps) {
  // Calculated stats from state
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const inactiveProducts = totalProducts - activeProducts;

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Activo').length;
  const inactiveEmployees = totalEmployees - activeEmployees;

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
              Panel Administrativo de Elotelandia
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xl">
              Monitoreo en tiempo real de los recursos y productos de la sucursal. Los datos se actualizan dinámicamente al registrar o editar elementos.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-center text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Datos en tiempo real</span>
          </div>
        </div>
      </div>

      {/* Main KPI Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* KPI Card 1: Número de productos */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs relative overflow-hidden"
        >
          {/* Subtle logo coloring backing */}
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/5 rounded-full blur-xl"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/50 flex items-center justify-center shadow-2xs shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Número de Productos</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight mt-1">{totalProducts}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-gray-100 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">Activos para la Venta</span>
              <span className="text-emerald-700 font-extrabold text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {activeProducts} combos
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">Inactivos / Pausados</span>
              <span className="text-amber-700 font-extrabold text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {inactiveProducts} combos
              </span>
            </div>
          </div>
        </motion.div>

        {/* KPI Card 2: Número de empleados */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs relative overflow-hidden"
        >
          {/* Subtle logo coloring backing */}
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-600/5 rounded-full blur-xl"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#166534] border border-emerald-200/50 flex items-center justify-center shadow-2xs shrink-0">
              <Users2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Número de Empleados</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight mt-1">{totalEmployees}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-gray-100 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">Personal de Alta</span>
              <span className="text-emerald-700 font-extrabold text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {activeEmployees} activos
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 font-semibold block">Baja Temporal</span>
              <span className="text-red-700 font-extrabold text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {inactiveEmployees} inactivos
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Additional Stats Section Under Construction message */}
      <div className="bg-[#FEFCE8]/50 border border-amber-200/40 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-amber-800 shrink-0">
          <Construction className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-[#92400E] text-sm">Próximos tableros (En Construcción)</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Estamos diseñando métricas adicionales avanzadas: ventas diarias, consumo por sucursal, horas de mayor tráfico de clientes y mermas de insumos. Muy pronto se activarán de forma sincronizada.
          </p>
        </div>
      </div>

    </div>
  );
}
