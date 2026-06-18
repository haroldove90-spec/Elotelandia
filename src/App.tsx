import { useState, useEffect } from 'react';
import { ModuleId, Product, Employee, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import MetricsModule from './components/MetricsModule';
import ProductsModule from './components/ProductsModule';
import EmployeesModule from './components/EmployeesModule';
import UserProfileModule from './components/UserProfileModule';
import AttendanceModule from './components/AttendanceModule';
import InstallPwaModal from './components/InstallPwaModal';
import { motion, AnimatePresence } from 'motion/react';

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

  // Shared state: logged user profile
  const [profile, setProfile] = useState<UserProfile>({
    name: 'admin_elotelandia',
    email: 'admin@elotelandia.com',
    phone: '492 100 9001',
    role: 'Administrador General',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    branch: 'Sucursal Vialidad Guadalupe'
  });

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'metricas':
        return <MetricsModule products={products} employees={employees} />;
      case 'productos':
        return <ProductsModule products={products} setProducts={setProducts} />;
      case 'empleados':
        return <EmployeesModule employees={employees} setEmployees={setEmployees} />;
      case 'perfil':
        return <UserProfileModule profile={profile} setProfile={setProfile} />;
      case 'asistencia':
        return <AttendanceModule employees={employees} profile={profile} />;
      default:
        return <MetricsModule products={products} employees={employees} />;
    }
  };

  return (
    <div className="min-h-screen bg-elote-cream/40 flex flex-row text-elote-dark antialiased selection:bg-elote-yellow/40 selection:text-elote-dark">
      
      {/* 1. Sidebar Navigation */}
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} profile={profile} />

      {/* 2. Main content container */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden pb-16 md:pb-0">
        
        {/* 3. Top Header with PWA installation callback */}
        <Header activeModule={activeModule} profile={profile} onInstallClick={() => setIsPwaModalOpen(true)} />

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
        <MobileBottomNav activeModule={activeModule} setActiveModule={setActiveModule} />

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
