import { ModuleId, UserProfile } from '../types';
import { Calendar, Globe2, User, ChevronRight, Download } from 'lucide-react';

interface HeaderProps {
  activeModule: ModuleId;
  profile: UserProfile;
  onInstallClick: () => void;
}

export default function Header({ activeModule, profile, onInstallClick }: HeaderProps) {
  const logoUrl = 'https://appdesignproyectos.com/Elotelandia.jpg';

  const getModuleTitle = (modId: ModuleId) => {
    switch (modId) {
      case 'metricas':
        return 'Panel de Métricas';
      case 'productos':
        return 'Gestión de Productos';
      case 'empleados':
        return 'Control de Empleados';
      case 'asistencia':
        return 'Control de Asistencia';
      case 'perfil':
        return 'Mi perfil de usuario';
      default:
        return 'Administración';
    }
  };

  // Obtain current date for realistic display without static hardcoded mock details
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-elote-dark/5 px-4 md:px-6 py-3 sticky top-0 z-40 shadow-xs">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Logo and dynamic module paths */}
        <div className="flex items-center gap-3">
          {/* Logo prominently displayed, un-encapsulated for full visibility */}
          <img 
            src={logoUrl} 
            alt="Elotelandia Logo" 
            className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-full shrink-0 transition duration-200 select-none"
            referrerPolicy="no-referrer"
          />
          
          <div className="flex flex-col">
            {/* Title for fullscreen and tablet */}
            <div className="hidden sm:block">
              <h1 className="font-sans font-extrabold text-base md:text-lg text-[#064E3B] tracking-tight leading-none">
                Elotelandia <span className="text-amber-500 font-light">|</span> <span className="font-medium text-gray-500 text-sm">Panel Principal</span>
              </h1>
              <div className="flex items-center text-[10px] text-gray-400 gap-1 mt-1 font-mono uppercase tracking-wider">
                <span>{profile.role}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#166534] font-bold">{getModuleTitle(activeModule)}</span>
              </div>
            </div>
            {/* Title for mobile viewport */}
            <div className="sm:hidden">
              <h1 className="font-serif font-black text-sm text-elote-dark leading-none">
                Elotelandia
              </h1>
              <p className="text-[9px] text-elote-green font-semibold font-sans mt-0.5">
                {getModuleTitle(activeModule)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Global indicators & Admin Status Pill */}
        <div className="flex items-center gap-4">
          {/* Dynamic real-time date indicator - clean & elegant */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-elote-dark/60 font-sans border-r border-elote-dark/5 pr-4">
            <Calendar className="w-4 h-4 text-elote-green" />
            <span className="first-letter:uppercase">{formattedDate}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-elote-dark/60 font-sans border-r border-elote-dark/5 pr-4">
            <Globe2 className="w-4 h-4 text-elote-yellow" />
            <span>México</span>
          </div>

          {/* PWA Install Button */}
          <button
            onClick={onInstallClick}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-xs hover:shadow-sm transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            style={{ contentVisibility: 'auto' }}
            title="Instalar Elotelandia en tu pantalla de inicio"
          >
            <Download className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden xs:inline">Instalar App</span>
            <span className="xs:hidden">Instalar</span>
          </button>

          {/* Active Admin session pill */}
          <div className="flex items-center gap-2 self-center bg-elote-cream border border-elote-dark/10 rounded-full px-3 py-1.5 font-semibold">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                className="w-5 h-5 rounded-full object-cover border border-[#064E3B]/20" 
                alt="Mini Profile"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-elote-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-elote-green"></span>
              </span>
            )}
            <span className="text-xs text-elote-dark tracking-tight font-mono">
              {profile.name.toLowerCase().replace(/\s+/g, '_')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
