import { ModuleId, UserProfile } from '../types';
import { BarChart3, ShoppingCart, ShoppingBag, Users, UserCheck, User, ClipboardList, Package } from 'lucide-react';

interface MobileBottomNavProps {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
  profile: UserProfile;
}

export default function MobileBottomNav({ activeModule, setActiveModule, profile }: MobileBottomNavProps) {
  const rawMenuItems = [
    { id: 'metricas' as ModuleId, label: 'Métricas', icon: BarChart3, color: 'text-elote-yellow' },
    { id: 'ventas' as ModuleId, label: 'Ventas', icon: ShoppingCart, color: 'text-emerald-500' },
    { id: 'clientes' as ModuleId, label: 'Clientes', icon: Users, color: 'text-blue-400' },
    { id: 'productos' as ModuleId, label: 'Productos', icon: ShoppingBag, color: 'text-elote-green' },
    { id: 'inventario' as ModuleId, label: 'Inventario', icon: Package, color: 'text-amber-400' },
    { id: 'empleados' as ModuleId, label: 'Empleados', icon: Users, color: 'text-elote-red' },
    { id: 'asistencia' as ModuleId, label: 'Asistencia', icon: UserCheck, color: 'text-emerald-400' },
    { id: 'corte' as ModuleId, label: 'Corte', icon: ClipboardList, color: 'text-amber-500' },
    { id: 'perfil' as ModuleId, label: 'Perfil', icon: User, color: 'text-elote-gold' },
  ];

  const menuItems = rawMenuItems.filter(item => {
    if (profile.role === 'Cajero') {
      // Vendedor (Cajero) only gets POS, Corte de Caja, Perfil
      return ['ventas', 'perfil', 'corte'].includes(item.id);
    }
    // Admin gets all modules except 'asistencia' and 'ventas' (Punto de Venta)
    return item.id !== 'asistencia' && item.id !== 'ventas';
  });


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-elote-dark text-white border-t border-white/10 z-30 md:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.3)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 relative text-xs transition-all duration-200"
            >
              {/* Highlight background or line indicator for active status */}
              {isActive && (
                <span className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-elote-yellow to-elote-gold rounded-full"></span>
              )}

              <div className={`p-1 rounded-lg transition-transform duration-200 ${
                isActive ? 'scale-110' : 'text-[#D1FAE5]/40'
              }`}>
                <Icon className={`w-5 h-5 ${
                  isActive ? 'text-[#FCD34D]' : 'text-[#D1FAE5]/50'
                }`} />
              </div>

              <span className={`text-[10px] font-medium tracking-wide transition-colors duration-150 ${
                isActive ? 'text-[#FCD34D] font-bold' : 'text-[#D1FAE5]/60'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
