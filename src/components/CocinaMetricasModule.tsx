import React from 'react';
import { ComandaCocina, Product, Insumo } from '../types';
import { 
  Flame, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  Timer,
  Check,
  Utensils,
  TrendingDown,
  Percent
} from 'lucide-react';
import { motion } from 'motion/react';

interface CocinaMetricasModuleProps {
  comandas: ComandaCocina[];
  products: Product[];
  insumos: Insumo[];
}

export default function CocinaMetricasModule({ 
  comandas = [], 
  products = [], 
  insumos = [] 
}: CocinaMetricasModuleProps) {

  // 1. Basic Stats
  const totalComandas = comandas.length;
  const completedComandas = comandas.filter(c => c.status === 'Listo' || c.status === 'Entregado');
  const activeComandasCount = comandas.filter(c => c.status === 'Recibido' || c.status === 'Preparando').length;

  // 2. Average Times calculations
  // Wait Time: creation (date) -> preparation finished (tiempoFin)
  // Prep Time: prep started (tiempoInicio) -> preparation finished (tiempoFin)
  let totalWaitTimeMs = 0;
  let waitCount = 0;
  let totalPrepTimeMs = 0;
  let prepCount = 0;

  // Track SLA: orders under 7 minutes (420 seconds)
  let ordersUnder7Min = 0;

  completedComandas.forEach(c => {
    if (c.tiempoFin) {
      const startWait = new Date(c.date).getTime();
      const endPrep = new Date(c.tiempoFin).getTime();
      const waitDiff = endPrep - startWait;
      
      if (waitDiff > 0) {
        totalWaitTimeMs += waitDiff;
        waitCount++;
        
        // SLA check
        const waitSecs = waitDiff / 1000;
        if (waitSecs <= 420) {
          ordersUnder7Min++;
        }
      }

      if (c.tiempoInicio) {
        const startPrep = new Date(c.tiempoInicio).getTime();
        const prepDiff = endPrep - startPrep;
        if (prepDiff > 0) {
          totalPrepTimeMs += prepDiff;
          prepCount++;
        }
      }
    }
  });

  const avgWaitMin = waitCount > 0 ? (totalWaitTimeMs / 1000 / 60) / waitCount : 0;
  const avgPrepMin = prepCount > 0 ? (totalPrepTimeMs / 1000 / 60) / prepCount : 0;
  const slaPercentage = waitCount > 0 ? (ordersUnder7Min / waitCount) * 100 : 0;

  // 3. Top prepared products
  const productCountMap: Record<string, number> = {};
  comandas.forEach(c => {
    c.items.forEach(item => {
      productCountMap[item.productName] = (productCountMap[item.productName] || 0) + item.quantity;
    });
  });

  const sortedProducts = Object.entries(productCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxProductCount = sortedProducts.length > 0 ? Math.max(...sortedProducts.map(p => p.count)) : 1;

  // 4. Critical Ingredients inside kitchen recipes
  // Gather all ingredient ids listed in active product recipes
  const kitchenInsumoIds = new Set<string>();
  products.forEach(p => {
    if (p.recipe) {
      p.recipe.forEach(r => kitchenInsumoIds.add(r.insumoId));
    }
  });

  const criticalKitchenInsumos = insumos.filter(ins => 
    kitchenInsumoIds.has(ins.id) && ins.stock <= ins.minStock
  );

  return (
    <div className="w-full space-y-8 select-none text-elote-dark animate-fade-in font-semibold text-xs">
      
      {/* Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-44 h-44 bg-orange-500/5 rounded-full blur-2xl"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 border border-orange-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 animate-pulse" /> Operaciones de Cocina
            </span>
            <h2 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
              Rendimiento y Eficiencia de Preparación
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl font-medium leading-relaxed">
              Monitoree los tiempos de respuesta del personal de cocina, controle los cuellos de botella en preparación, asegure el cumplimiento de los tiempos de entrega (SLA) y prevenga quiebres de inventario.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Core Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Tiempo Promedio de Espera */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/50 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Espera Promedio Total</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-1 font-mono">
                  {avgWaitMin.toFixed(1)} <span className="text-xs font-normal">min</span>
                </h3>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Meta de Servicio</span>
            <span className="font-bold text-emerald-600 font-mono">
              &lt; 7.0 min
            </span>
          </div>
        </div>

        {/* KPI 2: Tiempo de Cocción / Preparado */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50 flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Tiempo de Preparación Activa</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-1 font-mono">
                  {avgPrepMin.toFixed(1)} <span className="text-xs font-normal">min</span>
                </h3>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Suma de Actividad</span>
            <span className="font-bold text-gray-700 font-mono">
              {prepCount} comandas medidoras
            </span>
          </div>
        </div>

        {/* KPI 3: Cumplimiento de SLA */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/50 flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Cumplimiento de Tiempo (&lt; 7 min)</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-1 font-mono">
                  {slaPercentage.toFixed(1)}%
                </h3>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Tasa de Éxito en Mesa</span>
            <span className={`font-black font-mono ${slaPercentage >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {ordersUnder7Min} de {waitCount} listadas
            </span>
          </div>
        </div>

      </div>

      {/* Grid of details: Top prepared vs Critical Stock warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Product demand in kitchen */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
              🍳 Platillos Más Preparados en Cocina
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">Volúmenes</span>
          </div>

          <div className="space-y-4 pt-2">
            {sortedProducts.map((p, idx) => {
              const widthPct = (p.count / maxProductCount) * 100;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>{idx + 1}. {p.name}</span>
                    <span className="font-mono text-[#064E3B]">{p.count} preparados</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="bg-amber-500 h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}

            {sortedProducts.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Utensils className="w-10 h-10 mx-auto opacity-30 mb-2" />
                <p>No se han procesado comandas suficientes para graficar volúmenes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Kitchen Critical Insumos Alert */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
              ⚠️ Insumos Críticos de Cocina
            </h3>
            <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full uppercase">Alerta de Stock</span>
          </div>

          <div className="space-y-3 pt-2">
            {criticalKitchenInsumos.map((ins, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs leading-none">{ins.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">Stock mínimo: {ins.minStock} {ins.unit}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-mono font-black text-red-600 block text-xs">
                    {ins.stock} {ins.unit}
                  </span>
                  <span className="text-[9px] text-red-700 font-black uppercase bg-red-100 px-1.5 py-0.5 rounded leading-none">
                    Reabastecer
                  </span>
                </div>
              </div>
            ))}

            {criticalKitchenInsumos.length === 0 && (
              <div className="text-center py-12 text-emerald-800 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                <Check className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
                <p className="font-black text-xs uppercase tracking-wider">¡Ingredientes Seguros!</p>
                <p className="text-[11px] text-emerald-700/80 font-medium mt-1">Todos los insumos requeridos por las recetas de cocina están por encima de su stock de alerta.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* General summary recommendations */}
      <div className="bg-[#FEFCE8]/80 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <Clock className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-black text-[#92400E] uppercase tracking-wide">Consejo del Sistema (Eficiencia Operativa)</h4>
          <p className="text-[11px] text-[#78350F] leading-relaxed">
            {avgWaitMin > 7 
              ? 'El tiempo promedio de espera supera la meta de 7 minutos. Considere delegar un ayudante de cocina extra durante las horas de alta demanda o pre-calentar los elotes desgranados en charolas térmicas.'
              : 'La eficiencia de la cocina actual cumple de manera óptima con los estándares. Siga manteniendo los insumos picados y preparados antes del inicio del turno para mantener el ritmo rápido.'}
          </p>
        </div>
      </div>

    </div>
  );
}
