export type ModuleId = 'metricas' | 'productos' | 'empleados' | 'asistencia' | 'perfil';

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
  role: 'Administrador General' | 'Gerente de Sucursal';
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

