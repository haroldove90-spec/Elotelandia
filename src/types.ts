export type ModuleId = 'metricas' | 'ventas' | 'productos' | 'empleados' | 'asistencia' | 'perfil' | 'corte';

export interface NavigationItem {
  id: ModuleId;
  label: string;
  icon: string; // Icon name from lucide-react represented as string
}

export interface Product {
  id: string;
  name: string;
  price: number;
  items: string[];
  isActive: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  branch: string;
  status: 'Activo' | 'Inactivo';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: 'Administrador General' | 'Gerente de Sucursal' | 'Cajero';
  photoUrl: string;
  branch: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'Puntual' | 'Retardo' | 'Falta' | 'Justificado';
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  date: string; // ISO String
  items: SaleItem[];
  total: number;
  cashierName: string;
  paymentMethod?: 'efectivo' | 'tarjeta';
}

export interface CorteDeCaja {
  id: string;
  date: string; // ISO String
  cashierName: string;
  totalCash: number;
  totalCard: number;
  totalSales: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  notes?: string;
  status: 'Aprobado' | 'Pendiente' | 'Rechazado';
}


