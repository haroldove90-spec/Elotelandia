export type ModuleId = 'metricas' | 'ventas' | 'productos' | 'empleados' | 'asistencia' | 'perfil' | 'corte' | 'inventario' | 'clientes';

export interface NavigationItem {
  id: ModuleId;
  label: string;
  icon: string; // Icon name from lucide-react represented as string
}

export interface RecetaItem {
  insumoId: string;
  quantity: number; // Quantity in unit
}

export interface Product {
  id: string;
  name: string;
  price: number;
  items: string[];
  isActive: boolean;
  recipe?: RecetaItem[]; // Ingredients recipe mapping
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

export interface ModifierItem {
  name: string;
  priceDelta: number; // Positive extra charge, or 0
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  modifiers?: ModifierItem[]; // e.g., + Queso ($10), Sin Chile ($0)
  itemDiscount?: {
    type: 'fixed' | 'percent';
    value: number;
    amount: number;
  };
  notes?: string;
}

export interface Sale {
  id: string;
  date: string; // ISO String
  items: SaleItem[];
  total: number;
  cashierName: string;
  paymentMethod?: 'efectivo' | 'tarjeta';
  customerId?: string; // Linked CRM customer ID
  customerName?: string; // Cache customer name
  discountAmount?: number; // Total direct discount on whole ticket
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  points: number; // Accumulated reward points ($10 spent = 1 pt)
  notes?: string;
  visitCount: number;
  totalSpent: number;
  lastVisit?: string; // ISO string
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

export interface Insumo {
  id: string;
  name: string;
  stock: number; // Current physical quantity
  unit: 'g' | 'ml' | 'pzs' | 'kg' | 'l'; // grams, milliliters, pieces, kilograms, liters
  minStock: number; // Minimum stock before low stock alert
  cost: number; // Cost per unit
  supplierId?: string; // ID of the supplier
}

export interface Proveedor {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface OrdenCompraItem {
  insumoId: string;
  insumoName: string;
  quantity: number;
  cost: number; // cost per unit in this purchase
}

export interface OrdenCompra {
  id: string;
  date: string; // ISO string
  supplierId: string;
  supplierName: string;
  items: OrdenCompraItem[];
  total: number;
  status: 'Pendiente' | 'Recibido' | 'Cancelado';
}


