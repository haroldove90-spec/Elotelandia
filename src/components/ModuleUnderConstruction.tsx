import { ModuleId } from '../types';
import { Construction } from 'lucide-react';
import { motion } from 'motion/react';

interface ModuleUnderConstructionProps {
  id: ModuleId;
  key?: string;
}

export default function ModuleUnderConstruction({ id }: ModuleUnderConstructionProps) {
  const getModuleTitle = (modId: ModuleId) => {
    switch (modId) {
      case 'metricas':
        return 'Métricas';
      case 'productos':
        return 'Productos';
      case 'empleados':
        return 'Empleados';
      case 'perfil':
        return 'Perfil del usuario';
      default:
        return 'Módulo';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full flex-1 flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="text-center space-y-6 max-w-md">
        {/* Simple prominent construction icon styled with brand identity */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-elote-cream border-2 border-elote-yellow text-elote-yellow shadow-inner animate-pulse">
          <Construction className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          {/* Module Title */}
          <h2 className="text-3xl font-extrabold tracking-tight text-elote-dark">
            {getModuleTitle(id)}
          </h2>
          {/* Simplest under construction notice as requested */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-sm font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#92400E] animate-ping"></span>
            En construcción
          </div>
        </div>
      </div>
    </motion.div>
  );
}
