import { useState, useEffect } from 'react';
import { ModuleId, Product, Employee, UserProfile, Sale, CorteDeCaja, Insumo, Proveedor, OrdenCompra } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import MetricsModule from './components/MetricsModule';
import ProductsModule from './components/ProductsModule';
import EmployeesModule from './components/EmployeesModule';
import UserProfileModule from './components/UserProfileModule';
import AttendanceModule from './components/AttendanceModule';
import VentasModule from './components/VentasModule';
import CorteModule from './components/CorteModule';
import InventarioModule from './components/InventarioModule';
import ClientesModule from './components/ClientesModule';
import InstallPwaModal from './components/InstallPwaModal';
import CocinaOrdenesModule from './components/CocinaOrdenesModule';
import CocinaMetricasModule from './components/CocinaMetricasModule';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Coins, Sparkles, ChefHat } from 'lucide-react';
import { Customer, ComandaCocina } from './types';


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


  // Shared state: Customers (CRM Base)
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('elotelandia_customers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 'CRM-A91B3', name: 'Karla Mendoza', phone: '4921004523', email: 'karla.m@gmail.com', points: 145, visitCount: 8, totalSpent: 1450, lastVisit: new Date(Date.now() - 3600000 * 48).toISOString(), notes: 'Le encanta elote empanizado con Cheetos Flamin Hot, doble limón.' },
      { id: 'CRM-C22X8', name: 'Diego Torres Ruiz', phone: '4921085522', email: 'diego_torres@hotmail.com', points: 80, visitCount: 4, totalSpent: 800, lastVisit: new Date(Date.now() - 3600000 * 120).toISOString(), notes: 'Pide comanda para llevar los viernes por la tarde.' },
      { id: 'CRM-X56Y1', name: 'Brenda Escobedo', phone: '4921102040', email: 'brend_esc@outlook.com', points: 210, visitCount: 12, totalSpent: 2100, lastVisit: new Date(Date.now() - 3600000 * 3).toISOString(), notes: 'Cliente frecuente VIP. Prefiere salsa jerezana extra.' },
      { id: 'CRM-P90L4', name: 'Alejandro Carrillo', phone: '4921021199', points: 35, visitCount: 2, totalSpent: 350, lastVisit: new Date(Date.now() - 3600000 * 12).toISOString(), notes: 'Prefiere pagar con tarjeta de crédito.' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('elotelandia_customers', JSON.stringify(customers));
  }, [customers]);

  // Shared state: products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('elotelandia_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
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
        ],
        recipe: [
          { insumoId: 'ins-1', quantity: 300 }, // 300g elote
          { insumoId: 'ins-2', quantity: 60 },  // 60ml mayonesa
          { insumoId: 'ins-3', quantity: 40 },  // 40g queso
          { insumoId: 'ins-4', quantity: 1 },   // 1 vaso unicel
          { insumoId: 'ins-5', quantity: 1 },   // 1 cuchara
          { insumoId: 'ins-8', quantity: 3 },   // 3 refrescos
          { insumoId: 'ins-10', quantity: 3 }   // 3 sabritas
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
        ],
        recipe: [
          { insumoId: 'ins-1', quantity: 450 }, // 450g elote
          { insumoId: 'ins-2', quantity: 90 },  // 90ml mayonesa
          { insumoId: 'ins-3', quantity: 60 },  // 60g queso
          { insumoId: 'ins-5', quantity: 3 },   // 3 cucharas
          { insumoId: 'ins-8', quantity: 3 },   // 3 refrescos
          { insumoId: 'ins-9', quantity: 3 },   // 3 maruchans
          { insumoId: 'ins-10', quantity: 3 }   // 3 sabritas
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
        ],
        recipe: [
          { insumoId: 'ins-1', quantity: 300 }, // 300g elote
          { insumoId: 'ins-5', quantity: 1 },   // 1 cuchara
          { insumoId: 'ins-8', quantity: 3 }    // 3 refrescos
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
        ],
        recipe: [
          { insumoId: 'ins-1', quantity: 600 }, // 600g elote
          { insumoId: 'ins-2', quantity: 120 }, // 120ml mayonesa
          { insumoId: 'ins-3', quantity: 80 },  // 80g queso
          { insumoId: 'ins-5', quantity: 3 },   // 3 cucharas
          { insumoId: 'ins-8', quantity: 3 }    // 3 refrescos
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('elotelandia_products', JSON.stringify(products));
  }, [products]);

  // Shared state: Insumos (Supplies)
  const [insumos, setInsumos] = useState<Insumo[]>(() => {
    const saved = localStorage.getItem('elotelandia_insumos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 'ins-1', name: 'Elote Desgranado', stock: 15000, unit: 'g', minStock: 3000, cost: 0.05, supplierId: 'prov-1' }, // 15kg
      { id: 'ins-2', name: 'Mayonesa Elotera', stock: 5000, unit: 'ml', minStock: 1000, cost: 0.08, supplierId: 'prov-2' }, // 5L
      { id: 'ins-3', name: 'Queso Cotija Rallado', stock: 4000, unit: 'g', minStock: 800, cost: 0.12, supplierId: 'prov-1' }, // 4kg
      { id: 'ins-4', name: 'Vasos Térmicos Unicel 8oz', stock: 250, unit: 'pzs', minStock: 50, cost: 1.5, supplierId: 'prov-3' },
      { id: 'ins-5', name: 'Cucharas de Plástico', stock: 300, unit: 'pzs', minStock: 50, cost: 0.3, supplierId: 'prov-3' },
      { id: 'ins-6', name: 'Mantequilla Premium', stock: 2000, unit: 'g', minStock: 500, cost: 0.15, supplierId: 'prov-2' },
      { id: 'ins-7', name: 'Chile en Polvo (Tajín/Flamin)', stock: 1500, unit: 'g', minStock: 300, cost: 0.09, supplierId: 'prov-1' },
      { id: 'ins-8', name: 'Refrescos Surtidos 400ml', stock: 120, unit: 'pzs', minStock: 30, cost: 12.0, supplierId: 'prov-4' },
      { id: 'ins-9', name: 'Sopa Maruchan Instantánea', stock: 80, unit: 'pzs', minStock: 20, cost: 15.0, supplierId: 'prov-4' },
      { id: 'ins-10', name: 'Papas Sabritas Surtidas', stock: 100, unit: 'pzs', minStock: 25, cost: 14.0, supplierId: 'prov-4' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('elotelandia_insumos', JSON.stringify(insumos));
  }, [insumos]);

  // Shared state: Proveedores (Suppliers CRM)
  const [proveedores, setProveedores] = useState<Proveedor[]>(() => {
    const saved = localStorage.getItem('elotelandia_proveedores');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 'prov-1', name: 'Distribuidora Agrícola del Bajío', contactName: 'Ing. Ramón Ruiz', phone: '492 555 0192', email: 'ventas@agrobajio.mx', address: 'Central de Abastos Bodega 45, Zacatecas' },
      { id: 'prov-2', name: 'Lácteos y Cremerías de Jerez', contactName: 'Patricia Escobedo', phone: '494 924 1122', email: 'contacto@cremeria-jerez.com', address: 'Av. Constituyentes 402, Jerez, Zacatecas' },
      { id: 'prov-3', name: 'Desechables Biodegradables del Norte', contactName: 'Carlos Alaniz', phone: '818 340 5000', email: 'pedidos@desechablesnorte.com', address: 'Parque Industrial Apodaca, NL' },
      { id: 'prov-4', name: 'Comercializadora de Bebidas y Botanas', contactName: 'Marisela Gómez', phone: '492 120 4040', email: 'mgomez@bebidasbotanas.com', address: 'Calzada Héroes de Chapultepec, Zacatecas' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('elotelandia_proveedores', JSON.stringify(proveedores));
  }, [proveedores]);

  // Shared state: Órdenes de compra (Purchase Orders Ledger)
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>(() => {
    const saved = localStorage.getItem('elotelandia_ordenes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'OC-1002',
        date: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
        supplierId: 'prov-1',
        supplierName: 'Distribuidora Agrícola del Bajío',
        items: [
          { insumoId: 'ins-1', insumoName: 'Elote Desgranado', quantity: 20000, cost: 0.05 },
          { insumoId: 'ins-3', insumoName: 'Queso Cotija Rallado', quantity: 5000, cost: 0.12 }
        ],
        total: 1600,
        status: 'Recibido'
      },
      {
        id: 'OC-1003',
        date: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        supplierId: 'prov-4',
        supplierName: 'Comercializadora de Bebidas y Botanas',
        items: [
          { insumoId: 'ins-8', insumoName: 'Refrescos Surtidos 400ml', quantity: 50, cost: 12.0 },
          { insumoId: 'ins-10', insumoName: 'Papas Sabritas Surtidas', quantity: 40, cost: 14.0 }
        ],
        total: 1160,
        status: 'Pendiente'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('elotelandia_ordenes', JSON.stringify(ordenesCompra));
  }, [ordenesCompra]);

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

    // Dispatch to Kitchen Comanda (perfect integration loop)
    const comandaId = 'COM-' + (newSale.id.includes('-') ? newSale.id.split('-')[1] : newSale.id);
    const newComanda: ComandaCocina = {
      id: comandaId,
      saleId: newSale.id,
      orderName: newSale.customerName || 'Cliente General',
      date: newSale.date,
      items: newSale.items,
      status: 'Recibido',
      notes: newSale.items.map(it => it.notes).filter(Boolean).join('. ') || undefined
    };
    setComandas(prev => [newComanda, ...prev]);

    // Update customer CRM statistics if linked
    if (newSale.customerId) {
      setCustomers(prevCust => prevCust.map(c => {
        if (c.id === newSale.customerId) {
          const pointsEarned = Math.floor(newSale.total / 10);
          return {
            ...c,
            points: c.points + pointsEarned,
            visitCount: c.visitCount + 1,
            totalSpent: c.totalSpent + newSale.total,
            lastVisit: newSale.date
          };
        }
        return c;
      }));
    }

    // Real-time Stock Deduction: Automatically discount raw materials based on recipes
    setInsumos(prevInsumos => {
      return prevInsumos.map(insumo => {
        let deductedQuantity = 0;
        newSale.items.forEach(saleItem => {
          const matchedProduct = products.find(p => p.id === saleItem.productId);
          if (matchedProduct && matchedProduct.recipe) {
            const recipeItem = matchedProduct.recipe.find(r => r.insumoId === insumo.id);
            if (recipeItem) {
              deductedQuantity += recipeItem.quantity * saleItem.quantity;
            }
          }
        });

        if (deductedQuantity > 0) {
          return {
            ...insumo,
            stock: Math.max(0, insumo.stock - deductedQuantity)
          };
        }
        return insumo;
      });
    });
  };

  // State: Cortes de caja/Arqueos
  const [cortes, setCortes] = useState<CorteDeCaja[]>(() => {
    const saved = localStorage.getItem('elotelandia_cortes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'CRT-A92B1',
        date: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
        cashierName: 'Sofía Ruiz',
        totalCash: 700,
        totalCard: 450,
        totalSales: 1150,
        expectedCash: 700,
        actualCash: 700,
        difference: 0,
        notes: 'Todo en orden en la sucursal de Vialidad Guadalupe. Cuadro de caja exacto.',
        status: 'Aprobado'
      },
      {
        id: 'CRT-G67X3',
        date: new Date(Date.now() - 3600000 * 48).toISOString(), // 48 hours ago
        cashierName: 'Mateo González',
        totalCash: 1050,
        totalCard: 0,
        totalSales: 1050,
        expectedCash: 1050,
        actualCash: 1040,
        difference: -10,
        notes: 'Faltó cambiar monedas de $10 pesos al inicio del turno, reporte de diferencia.',
        status: 'Aprobado'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('elotelandia_cortes', JSON.stringify(cortes));
  }, [cortes]);

  const handleAddCorte = (newCorte: CorteDeCaja) => {
    setCortes(prev => [newCorte, ...prev]);
  };

  const handleUpdateCorteStatus = (corteId: string, status: 'Aprobado' | 'Rechazado') => {
    setCortes(prev => prev.map(c => c.id === corteId ? { ...c, status } : c));
  };

  // State for Kitchen Comandas
  const [comandas, setComandas] = useState<ComandaCocina[]>(() => {
    const saved = localStorage.getItem('elotelandia_comandas');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    const now = Date.now();
    return [
      {
        id: 'COM-108A',
        saleId: 'TKT-108A',
        orderName: 'Mesa 4 (Sofía Ruiz)',
        date: new Date(now - 3600000 * 3).toISOString(), // 3 hours ago
        items: [
          { productId: '1', productName: 'PAQUETE AFICIONADO', quantity: 2, price: 350 },
          { productId: '2', productName: 'PAQUETE CAMPEÓN', quantity: 1, price: 450 }
        ],
        status: 'Entregado',
        tiempoInicio: new Date(now - 3600000 * 3).toISOString(),
        tiempoFin: new Date(now - 3600000 * 3 + 300000).toISOString() // 5 min preparation
      },
      {
        id: 'COM-441F',
        saleId: 'TKT-441F',
        orderName: 'Mesa 2 (Diego Torres)',
        date: new Date(now - 600000).toISOString(), // 10 minutes ago
        items: [
          { 
            productId: '4', 
            productName: 'PAQUETE FANÁTICO', 
            quantity: 1, 
            price: 360,
            modifiers: [
              { name: 'Sin Chile', priceDelta: 0 },
              { name: '+ Queso Cotija Extra', priceDelta: 10 }
            ],
            notes: 'Pide chile del que no pica aparte por favor.'
          }
        ],
        status: 'Listo',
        tiempoInicio: new Date(now - 550000).toISOString(),
        tiempoFin: new Date(now - 200000).toISOString()
      },
      {
        id: 'COM-A23F',
        orderName: 'Para Llevar - Brenda Escobedo',
        date: new Date(now - 240000).toISOString(), // 4 minutes ago
        items: [
          { 
            productId: '2', 
            productName: 'PAQUETE CAMPEÓN', 
            quantity: 1, 
            price: 450,
            modifiers: [
              { name: 'Extra Salsa Jerezana', priceDelta: 0 }
            ]
          }
        ],
        status: 'Preparando',
        tiempoInicio: new Date(now - 180000).toISOString()
      },
      {
        id: 'COM-B55T',
        orderName: 'Mesa 6 - Karla Mendoza',
        date: new Date(now - 60000).toISOString(), // 1 minute ago
        items: [
          { productId: '3', productName: 'PAQUETE REPECHAJE', quantity: 1, price: 350 }
        ],
        status: 'Recibido'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('elotelandia_comandas', JSON.stringify(comandas));
  }, [comandas]);

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

  const handleSelectRole = (role: 'Administrador' | 'Cajero' | 'Cocina') => {
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
    } else if (role === 'Cajero') {
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
    } else if (role === 'Cocina') {
      const cocinaProfile: UserProfile = {
        name: 'Maestro de Cocina (Chef)',
        email: 'cocina@elotelandia.com',
        phone: '492 111 2233',
        role: 'Cocina',
        photoUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=150',
        branch: 'Sucursal Vialidad Guadalupe'
      };
      setProfile(cocinaProfile);
      setActiveModule('cocina_ordenes'); // Go straight to kitchen
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'metricas':
        return <MetricsModule products={products} employees={employees} sales={sales} insumos={insumos} cortes={cortes} />;
      case 'ventas':
        return (
          <VentasModule 
            products={products} 
            onAddSale={handleAddSale} 
            cashierName={profile.name} 
            customers={customers} 
            setCustomers={setCustomers} 
          />
        );
      case 'clientes':
        return <ClientesModule customers={customers} setCustomers={setCustomers} sales={sales} />;
      case 'productos':
        return <ProductsModule products={products} setProducts={setProducts} />;
      case 'empleados':
        return <EmployeesModule employees={employees} setEmployees={setEmployees} />;
      case 'perfil':
        return <UserProfileModule profile={profile} setProfile={setProfile} />;
      case 'asistencia':
        return <AttendanceModule employees={employees} profile={profile} />;
      case 'corte':
        return (
          <CorteModule 
            sales={sales} 
            cortes={cortes} 
            role={profile.role} 
            cashierName={profile.name} 
            onAddCorte={handleAddCorte} 
            onUpdateCorteStatus={handleUpdateCorteStatus} 
          />
        );
      case 'inventario':
        return (
          <InventarioModule 
            products={products}
            setProducts={setProducts}
            insumos={insumos}
            setInsumos={setInsumos}
            proveedores={proveedores}
            setProveedores={setProveedores}
            ordenesCompra={ordenesCompra}
            setOrdenesCompra={setOrdenesCompra}
          />
        );
      case 'cocina_ordenes':
        return (
          <CocinaOrdenesModule 
            comandas={comandas} 
            setComandas={setComandas} 
            products={products} 
            insumos={insumos} 
          />
        );
      case 'cocina_metricas':
        return (
          <CocinaMetricasModule 
            comandas={comandas} 
            products={products} 
            insumos={insumos} 
          />
        );
      default:
        return <MetricsModule products={products} employees={employees} sales={sales} insumos={insumos} cortes={cortes} />;
    }
  };

  if (!isLoggedIn) {
    const logoUrl = 'https://appdesignproyectos.com/Elotelandia.jpg';
    return (
      <div className="min-h-screen bg-[#FEFCE8]/80 flex flex-col items-center justify-center p-6 relative overflow-hidden text-elote-dark select-none">
        
        {/* Background designs */}
        <div className="absolute top-0 right-0 -translate-x-10 translate-y-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-x-10 -translate-y-10 w-[450px] h-[450px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl flex flex-col items-center text-center space-y-10 relative"
        >
          {/* Circular styled logo in the center */}
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/15 rounded-full blur-md animate-pulse"></div>
            <img 
              src={logoUrl} 
              alt="Elotelandia Logo" 
              className="relative w-36 h-36 object-cover rounded-full border-4 border-[#064E3B] shadow-sm hover:scale-102 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="w-full space-y-6">
            <div className="grid grid-cols-3 gap-3">
              
              {/* Option 1: Administrador */}
              <button
                onClick={() => handleSelectRole('Administrador')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200/50 hover:border-amber-400 transition-all duration-250 group cursor-pointer text-center space-y-3 shadow-2xs"
              >
                <div className="w-12 h-12 rounded-full bg-[#064E3B] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-250">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#064E3B] tracking-tight uppercase">
                  Admin
                </span>
              </button>

              {/* Option 2: Vendedor */}
              <button
                onClick={() => handleSelectRole('Cajero')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/60 hover:border-emerald-500 transition-all duration-250 group cursor-pointer text-center space-y-3 shadow-2xs"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-250">
                  <Coins className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#064E3B] tracking-tight uppercase">
                  Vendedor
                </span>
              </button>

              {/* Option 3: Cocina */}
              <button
                onClick={() => handleSelectRole('Cocina')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-100/50 border border-amber-100 hover:border-amber-500 transition-all duration-250 group cursor-pointer text-center space-y-3 shadow-2xs"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-250">
                  <ChefHat className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#064E3B] tracking-tight uppercase">
                  Cocina
                </span>
              </button>

            </div>
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

