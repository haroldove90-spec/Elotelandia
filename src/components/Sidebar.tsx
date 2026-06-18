import { ModuleId, UserProfile } from '../types';
import { BarChart3, ShoppingBag, Users, UserCheck, User } from 'lucide-react';

interface SidebarProps {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
  profile: UserProfile;
}

export default function Sidebar({ activeModule, setActiveModule, profile }: SidebarProps) {
  const logoUrl = 'https://appdesignproyectos.com/Elotelandia.jpg';

  const menuItems = [
    { id: 'metricas' as ModuleId, label: 'Métricas', icon: BarChart3, color: 'text-elote-yellow' },
    { id: 'productos' as ModuleId, label: 'Productos', icon: ShoppingBag, color: 'text-elote-green' },
    { id: 'empleados' as ModuleId, label: 'Empleados', icon: Users, color: 'text-elote-red' },
    { id: 'asistencia' as ModuleId, label: 'Control de Asistencia', icon: UserCheck, color: 'text-emerald-400' },
    { id: 'perfil' as ModuleId, label: 'Perfil del usuario', icon: User, color: 'text-elote-gold' },
  ];

  return (
    <aside className="w-64 bg-elote-dark text-white flex-col h-screen sticky top-0 left-0 hidden md:flex border-r border-white/5 z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex flex-col items-center justify-center gap-3">
        <div className="relative group flex items-center justify-center">
          <img 
            src={logoUrl} 
            alt="Elotelandia Logo" 
            className="w-24 h-24 object-cover rounded-full border-2 border-elote-yellow/40 relative z-10 transition duration-300 hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center mt-2">
          <h2 className="font-serif font-black text-xl text-white tracking-wide leading-tight">
            Elotelandia
          </h2>
          <span className="text-[10px] text-elote-yellow/80 tracking-widest font-mono uppercase">
            Panel de Control
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">
          MENÚ PRINCIPAL
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-200 relative group text-left ${
                isActive 
                  ? 'bg-elote-bg-hover text-[#FCD34D] font-bold border-r-4 border-[#FCD34D]' 
                  : 'text-[#D1FAE5] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-[#FCD34D]' : 'text-[#D1FAE5]/60 group-hover:text-white'
              }`} />
              
              <span className="truncate">{item.label}</span>

              {/* Minimal dot to show hover states */}
              {!isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer with system metadata information */}
      <div className="p-4 border-t border-white/5 bg-black/10">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
          {profile.photoUrl ? (
            <img 
              src={profile.photoUrl} 
              className="w-8 h-8 rounded-full object-cover border border-[#FCD34D]/25 shrink-0" 
              alt="User"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-elote-yellow to-elote-gold flex items-center justify-center text-xs font-bold text-elote-dark shrink-0">
              {profile.name?.split(' ').map(n=>n[0]).slice(0, 2).join('').toUpperCase() || 'AD'}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{profile.name}</h4>
            <p className="text-[10px] text-white/45 truncate">{profile.role}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-elote-green shadow-sm shadow-elote-green/50 animate-pulse"></div>
        </div>
      </div>
    </aside>
  );
}
