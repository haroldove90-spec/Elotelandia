import { useState, useEffect } from 'react';
import { ModuleId, Product, Employee, UserProfile, Sale } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import MetricsModule from './components/MetricsModule';
import ProductsModule from './components/ProductsModule';
import EmployeesModule from './components/EmployeesModule';
import UserProfileModule from './components/UserProfileModule';
import AttendanceModule from './components/AttendanceModule';
import VentasModule from './components/VentasModule';
import InstallPwaModal from './components/InstallPwaModal';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Coins, Sparkles } from 'lucide-react';


export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('metricas');

  // PWA states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('beforeinstallprompt event triggered & saved');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if ya standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User installation finished with outcome: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsPwaModalOpen(false);
    }
  };


  // Shared state: products
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'PAQUETE AFICIONADO',
      price: 350,
      isActive: true,
      items: [
        '1 Charola de elote desgranado',
        '16 costillas cortas de elote',
        '1 charola de rodajas de elote',
        '3 sabritas a elegir',
        '3 refrescos de 400ml (Sabor a elegir)'
      ]
    },
    {
      id: '2',
      name: 'PAQUETE CAMPEÓN',
      price: 450,
      isActive: true,
      items: [
        '3 Maruchaskas (Sabor de maruchan y sabritas a elegir)',
        '3 Elotes empanizados (Sabritas a elegir)',
        '3 Refrescos de 400ml (Sabor a elegir)'
      ]
    },
    {
      id: '3',
      name: 'PAQUETE REPECHAJE',
      price: 350,
      isActive: true,
      items: [
        '10 Tostadas',
        '1/2 kg de trompa curtida',
        '1/2 kg de cuero curtido',
        '1 lts de salsa jerezana',
        '1 charola de rodajas de elote',
        '3 refrescos de 400ml (Sabor a elegir)'
      ]
    },
    {
      id: '4',
      name: 'PAQUETE FANÁTICO',
      price: 360,
      isActive: true,
      items: [
        '1 charola de elote con arrachera',
        '1 charola de elote con champiñones',
        '1 charola de elote con rajas',
        '3 refrescos de 400ml (Sabor a elegir)'
      ]
    }
  ]);

  // Shared state: employees (10 samples as requested)
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Mateo González',
      role: 'Maestro Elotero',
      phone: '492 101 2030',
      email: 'mateo@elotelandia.com',
      branch: 'Sucursal Vialidad Guadalupe',
      status: 'Activo'
    },
    {
      id: '2',
      name: 'Sofía Ruiz',
      role: 'Cajera Principal',
      phone: '492 102 4455',
      email: 'sofia.ruiz@elotelandia.com',
      branch: 'Sucursal Vialidad Guadalupe',
      status: 'Activo'
    },
    {
      id: '3',
      name: 'Diego Hernández',
      role: 'Preparador de Esquites',
      phone: '492 103 4488',
      email: 'diego@elotelandia.com',
      branch: 'Sucursal Centro Histórico',
      status: 'Activo'
    },
    {
      id: '4',
      name: 'Valentina Ortega',
      role: 'Control de Calidad',
      phone: '492 104 1122',
      email: 'valentina@elotelandia.com',
      branch: 'Sucursal Centro Histórico',
      status: 'Activo'
    },
    {
      id: '5',
      name: 'Sebastian Morales',
      role: 'Repartidor Moto',
      phone: '492 105 5566',
      email: 'sebastian@elotelandia.com',
      branch: 'Sucursal Vialidad Guadalupe',
      status: 'Activo'
    },
    {
      id: '6',
      name: 'Camila Luján',
      role: 'Maestra Elotera',
      phone: '492 106 7788',
      email: 'camila@elotelandia.com',
      branch: 'Sucursal Arroyo de Plata',
      status: 'Activo'
    },
    {
      id: '7',
      name: 'Joaquín Castro',
      role: 'Supervisor de Carritos',
      phone: '492 107 9900',
      email: 'joaquin@elotelandia.com',
      branch: 'Sucursal Arroyo de Plata',
      status: 'Activo'
    },
    {
      id: '8',
      name: 'Regina Flores',
      role: 'Atención al Cliente',
      phone: '492 108 2233',
      email: 'regina@elotelandia.com',
      branch: 'Sucursal Centro Histórico',
      status: 'Activo'
    },
    {
      id: '9',
      name: 'Emiliano Torres',
      role: 'Bodeguero e Insumos',
      phone: '492 109 4400',
      email: 'emiliano@elotelandia.com',
      branch: 'Sucursal Arroyo de Plata',
      status: 'Activo'
    },
    {
      id: '10',
      name: 'Andrea Peñalosa',
      role: 'Auxiliar Cocina',
      phone: '492 110 5511',
      email: 'andrea@elotelandia.com',
      branch: 'Sucursal Vialidad Guadalupe',
      status: 'Inactivo'
    }
  ]);

  // Sales list
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('elotelandia_sales');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Return pristine seed sales
    return [
      {
        id: 'TKT-108A',
        date: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
        items: [
          { productId: '1', productName: 'PAQUETE AFICIONADO', quantity: 2, price: 350 },
          { productId: '2', productName: 'PAQUETE CAMPEÓN', quantity: 1, price: 450 }
        ],
        total: 1150,
        cashierName: 'Sofía Ruiz'
      },
      {
        id: 'TKT-995X',
        date: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
        items: [
          { productId: '3', productName: 'PAQUETE REPECHAJE', quantity: 3, price: 350 }
        ],
        total: 1050,
        cashierName: 'Mateo González'
      },
      {
        id: 'TKT-441F',
        date: new Date().toISOString(), // Just now
        items: [
          { productId: '4', productName: 'PAQUETE FANÁTICO', quantity: 1, price: 360 }
        ],
        total: 360,
        cashierName: 'Sofía Ruiz'
      }
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('elotelandia_sales', JSON.stringify(sales));
  }, [sales]);

  const handleAddSale = (newSale: Sale) => {
    setSales(prev => [newSale, ...prev]);
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('elotelandia_is_logged') === 'true';
  });

  // Shared state: logged user profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('elotelandia_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Administrador General',
      email: 'admin@elotelandia.com',
      phone: '492 100 9001',
      role: 'Administrador General',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      branch: 'Sucursal Vialidad Guadalupe'
    };
  });

  // Sync profile & login state to localStorage
  useEffect(() => {
    localStorage.setItem('elotelandia_user_profile', JSON.stringify(profile));
    localStorage.setItem('elotelandia_is_logged', String(isLoggedIn));
  }, [profile, isLoggedIn]);

  const handleSelectRole = (role: 'Administrador' | 'Cajero') => {
    if (role === 'Administrador') {
      const adminProfile: UserProfile = {
        name: 'Administrador General',
        email: 'admin@elotelandia.com',
        phone: '492 100 9001',
        role: 'Administrador General',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        branch: 'Sucursal Vialidad Guadalupe'
      };
      setProfile(adminProfile);
      setActiveModule('metricas');
    } else {
      const cashierProfile: UserProfile = {
        name: 'Cajero de Turno',
        email: 'cajero@elotelandia.com',
        phone: '492 110 5511',
        role: 'Cajero',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
        branch: 'Sucursal Vialidad Guadalupe'
      };
      setProfile(cashierProfile);
      setActiveModule('ventas'); // Go straight to POS
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'metricas':
        return <MetricsModule products={products} employees={employees} sales={sales} />;
      case 'ventas':
        return <VentasModule products={products} onAddSale={handleAddSale} cashierName={profile.name} />;
      case 'productos':
        return <ProductsModule products={products} setProducts={setProducts} />;
      case 'empleados':
        return <EmployeesModule employees={employees} setEmployees={setEmployees} />;
      case 'perfil':
        return <UserProfileModule profile={profile} setProfile={setProfile} />;
      case 'asistencia':
        return <AttendanceModule employees={employees} profile={profile} />;
      default:
        return <MetricsModule products={products} employees={employees} sales={sales} />;
    }
  };

  if (!isLoggedIn) {
    const logoUrl = 'https://appdesignproyectos.com/Elotelandia.jpg';
    return (
      <div className="min-h-screen bg-[#FEFCE8]/80 flex items-center justify-center p-4 relative overflow-hidden text-elote-dark select-none">
        
        {/* Background designs */}
        <div className="absolute top-0 right-0 -translate-x-10 translate-y-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-x-10 -translate-y-10 w-[450px] h-[450px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center space-y-8 relative"
        >
          {/* Circular styled logo in the center */}
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md animate-pulse"></div>
            <img 
              src={logoUrl} 
              alt="Elotelandia Logo" 
              className="relative w-32 h-32 md:w-36 md:h-36 object-cover rounded-full border-4 border-[#064E3B] hover:scale-105 transition-all duration-300 shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-3.5xl font-black text-[#064E3B] tracking-tight font-serif select-none">
              Elotelandia
            </h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest font-mono select-none">
              Sistema de Gestión y POS
            </p>
          </div>

          <div className="w-full space-y-4">
            <p className="text-[11px] text-gray-400 font-extrabold uppercase tracking-widest">
              Selecciona tu rol de acceso:
            </p>

            <div className="grid grid-cols-1 gap-4">
              
              {/* Option 1: Administrador */}
              <button
                onClick={() => handleSelectRole('Administrador')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#FEFCE8]/45 hover:bg-[#FEFCE8] border border-amber-200/50 hover:border-amber-400 hover:shadow-xs text-left group transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#92400E] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-amber-950">Administrador General</p>
                  <p className="text-[10px] text-[#92400E]/70 font-bold leading-normal">Control total de inventario, métricas, personal y control de asistencia.</p>
                </div>
              </button>

              {/* Option 2: Cajero */}
              <button
                onClick={() => handleSelectRole('Cajero')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/45 hover:bg-emerald-50 border border-emerald-200/50 hover:border-emerald-500 hover:shadow-xs text-left group transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <Coins className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-emerald-950">Cajero / Operario POS</p>
                  <p className="text-[10px] text-emerald-800/70 font-bold leading-normal">Venta rápida de paquetes, cobro ágil en caja y estatus de perfil.</p>
                </div>
              </button>

            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse animate-duration-1000" />
            <span>Elotelandia v1.6.0</span>
          </div>

        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elote-cream/40 flex flex-row text-elote-dark antialiased selection:bg-elote-yellow/40 selection:text-elote-dark">
      
      {/* 1. Sidebar Navigation */}
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} profile={profile} onLogout={handleLogout} />

      {/* 2. Main content container */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden pb-16 md:pb-0">
        
        {/* 3. Top Header with PWA installation callback */}
        <Header activeModule={activeModule} profile={profile} onInstallClick={() => setIsPwaModalOpen(true)} onLogout={handleLogout} />

        {/* 4. Active Module Space */}
        <main className="flex-grow flex flex-col py-8 px-4 md:px-8 items-center">
          <div className="w-full max-w-4xl">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderActiveModule()}
              </motion.div>
            </AnimatePresence>

          </div>
        </main>

        {/* 5. Mobile Bottom Navbar */}
        <MobileBottomNav activeModule={activeModule} setActiveModule={setActiveModule} profile={profile} />

      </div>

      {/* 6. PWA Installation Instruction & Prompt Modal */}
      <AnimatePresence>
        {isPwaModalOpen && (
          <InstallPwaModal 
            isOpen={isPwaModalOpen}
            onClose={() => setIsPwaModalOpen(false)}
            onNativeInstall={handleNativeInstall}
            isNativeSupported={!!deferredPrompt}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

