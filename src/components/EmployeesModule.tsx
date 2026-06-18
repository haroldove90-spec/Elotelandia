import React, { useState } from 'react';
import { Employee } from '../types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Check, 
  ChevronsUpDown,
  User,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmployeesModuleProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export default function EmployeesModule({ employees, setEmployees }: EmployeesModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Form States
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form input fields
  const [formId, setFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Maestro Elotero');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBranch, setFormBranch] = useState('Sucursal Vialidad Guadalupe');
  const [formStatus, setFormStatus] = useState<'Activo' | 'Inactivo'>('Activo');
  const [formError, setFormError] = useState('');

  // Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Switch form to Add Mode
  const handleOpenAddForm = () => {
    setFormId(null);
    setFormName('');
    setFormRole('Maestro Elotero');
    setFormPhone('');
    setFormEmail('');
    setFormBranch('Sucursal Vialidad Guadalupe');
    setFormStatus('Activo');
    setFormError('');
    setIsOpenForm(true);
  };

  // Switch form to Edit Mode
  const handleOpenEditForm = (emp: Employee) => {
    setFormId(emp.id);
    setFormName(emp.name);
    setFormRole(emp.role);
    setFormPhone(emp.phone);
    setFormEmail(emp.email);
    setFormBranch(emp.branch);
    setFormStatus(emp.status);
    setFormError('');
    setIsOpenForm(true);
  };

  // Save/Submit Form (handles both Create and Update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Por favor introduce el nombre completo del empleado.');
      return;
    }
    if (!formPhone.trim()) {
      setFormError('Introduce un teléfono de contacto.');
      return;
    }

    if (formId) {
      // Edit mode
      setEmployees(employees.map(e => e.id === formId ? {
        id: formId,
        name: formName.trim(),
        role: formRole,
        phone: formPhone.trim(),
        email: formEmail.trim() || `${formName.trim().toLowerCase().replace(/\s+/g, '')}@elotelandia.com`,
        branch: formBranch,
        status: formStatus
      } : e));
      triggerNotification(`¡Información de "${formName}" actualizada con éxito!`, 'success');
    } else {
      // Add mode
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: formName.trim(),
        role: formRole,
        phone: formPhone.trim(),
        email: formEmail.trim() || `${formName.trim().toLowerCase().replace(/\s+/g, '')}@elotelandia.com`,
        branch: formBranch,
        status: formStatus
      };
      setEmployees([...employees, newEmployee]);
      triggerNotification(`¡Empleado "${newEmployee.name}" registrado con éxito en el sistema!`, 'success');
    }

    setIsOpenForm(false);
  };

  // Toggle active / inactive status
  const handleToggleStatus = (id: string) => {
    setEmployees(employees.map(e => {
      if (e.id === id) {
        const nextStatus: 'Activo' | 'Inactivo' = e.status === 'Activo' ? 'Inactivo' : 'Activo';
        triggerNotification(
          `Estado de "${e.name}" cambiado a ${nextStatus.toUpperCase()}`,
          nextStatus === 'Activo' ? 'success' : 'info'
        );
        return { ...e, status: nextStatus };
      }
      return e;
    }));
  };

  // Delete employee
  const handleDeleteEmployee = (id: string, name: string) => {
    setEmployees(employees.filter(e => e.id !== id));
    triggerNotification(`Se eliminó al empleado "${name}" del registro.`, 'danger');
  };

  // View Details
  const handleViewDetails = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsOpenView(true);
  };

  // Filter employees by search query
  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      
      {/* Action Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border text-sm font-semibold max-w-sm ${
              notification.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : notification.type === 'danger'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="flex-1">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with register action */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" /> Recursos Humanos
          </span>
          <h2 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
            Gestión de Empleados
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Registra y administra el fabuloso equipo de Elotelandia. Modifica roles, teléfonos, sucursales de asignación o suspende temporalmente el estatus de sus actividades.
          </p>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="bg-[#064E3B] text-white hover:bg-[#065F46] font-bold text-sm px-5 py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 self-start md:self-center shadow-md active:scale-95 shrink-0"
        >
          <UserPlus className="w-4.5 h-4.5" />
          Registrar Empleado
        </button>
      </div>

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input 
            type="text"
            placeholder="Buscar por nombre, cargo o sucursal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] text-[#111827] placeholder:text-gray-400 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:bg-gray-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2.5 self-start sm:self-auto flex items-center gap-3">
          <span>Total Filtrados: <strong>{filteredEmployees.length}</strong></span>
          <span className="w-1.5 h-4 border-r border-gray-200"></span>
          <span>Activos: <strong className="text-emerald-700">{filteredEmployees.filter(e => e.status === 'Activo').length}</strong></span>
        </div>
      </div>

      {/* Employees Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full bg-white/80 border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500/60" />
            <h3 className="font-bold text-gray-700">No se encontraron empleados</h3>
            <p className="text-xs mt-1">Intenta ajustando el filtro de búsqueda o registra un nuevo talento.</p>
          </div>
        ) : (
          filteredEmployees.map((emp) => (
            <motion.div
              layout
              key={emp.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between gap-4 ${
                emp.status === 'Activo' ? 'border-gray-200' : 'border-gray-200 bg-gray-50/50 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-[#064E3B] text-base leading-snug">
                      {emp.name}
                    </h3>
                    <p className="text-xs font-bold text-[#92400E] mt-0.5 font-mono uppercase tracking-wider">
                      {emp.role}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <button 
                    onClick={() => handleToggleStatus(emp.id)}
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border transition-colors ${
                      emp.status === 'Activo' 
                        ? 'bg-emerald-50 text-[#166534] border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                    }`}
                    title="Alternar estado contractual"
                  >
                    {emp.status}
                  </button>
                </div>

                {/* Info Lines */}
                <div className="mt-4 space-y-2 text-xs font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{emp.branch}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="border-t border-gray-100 pt-3.5 flex items-center justify-end gap-2 text-xs">
                {/* VER */}
                <button
                  onClick={() => handleViewDetails(emp)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  Ver
                </button>

                {/* EDITAR */}
                <button
                  onClick={() => handleOpenEditForm(emp)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-[#064E3B] hover:bg-emerald-50/50 font-bold transition flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar
                </button>

                {/* ELIMINAR */}
                <button
                  onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                  className="px-3 py-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 font-bold transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Borrar
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* REGISTER / EDIT MODAL FORM */}
      {isOpenForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-lg w-full"
          >
            {/* Header */}
            <div className="bg-[#064E3B] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold font-serif text-lg">
                  {formId ? 'Editar Información General' : 'Registrar Nuevo Empleado'}
                </h3>
              </div>
              <button 
                onClick={() => setIsOpenForm(false)}
                className="p-1 rounded-full text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields container */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-600" />
                  <p>{formError}</p>
                </div>
              )}

              {/* Employee Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Nombre Completo</label>
                <input 
                  type="text"
                  placeholder="Eje: Mateo González"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm font-semibold"
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Cargo / Puesto</label>
                <select 
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm font-semibold bg-white"
                >
                  <option value="Maestro Elotero">Maestro Elotero</option>
                  <option value="Preparador de Esquites">Preparador de Esquites</option>
                  <option value="Cajera Principal">Cajera Principal</option>
                  <option value="Atención al Cliente">Atención al Cliente</option>
                  <option value="Repartidor Moto">Repartidor Moto</option>
                  <option value="Supervisor de Carritos">Supervisor de Carritos</option>
                  <option value="Control de Calidad">Control de Calidad</option>
                  <option value="Bodeguero e Insumos">Bodeguero e Insumos</option>
                  <option value="Auxiliar Cocina">Auxiliar Cocina</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Teléfono</label>
                  <input 
                    type="tel"
                    placeholder="492 123 4567"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm font-semibold"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Correo Electrónico</label>
                  <input 
                    type="email"
                    placeholder="mateo@elotelandia.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Branch */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Sucursal de Asignación</label>
                  <select 
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm font-semibold bg-white"
                  >
                    <option value="Sucursal Vialidad Guadalupe">Sucursal Vialidad Guadalupe</option>
                    <option value="Sucursal Centro Histórico">Sucursal Centro Histórico</option>
                    <option value="Sucursal Arroyo de Plata">Sucursal Arroyo de Plata</option>
                  </select>
                </div>

                {/* Estatus */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Estado Inicial</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Activo' | 'Inactivo')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm font-semibold bg-white"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpenForm(false)}
                  className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-100 rounded-xl py-3 font-semibold transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#064E3B] text-white hover:bg-[#065F46] rounded-xl py-3 font-bold transition text-sm shadow-md"
                >
                  {formId ? 'Guardar Ajustes' : 'Dar de Alta'}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

      {/* DETAILS VIEW MODAL */}
      {isOpenView && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-md w-full"
          >
            {/* Header branding */}
            <div className="bg-[#FEFCE8] p-6 border-b border-gray-100 flex flex-col items-center text-center relative">
              <button 
                onClick={() => setIsOpenView(false)}
                className="absolute right-4 top-4 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-[#064E3B] border border-emerald-200 shadow-xs mb-3 text-lg font-bold">
                {selectedEmployee.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              
              <h3 className="font-extrabold text-[#064E3B] text-xl tracking-tight leading-tight">
                {selectedEmployee.name}
              </h3>
              
              <span className="text-xs font-bold text-[#92400E] mt-1 font-mono uppercase tracking-widest">
                {selectedEmployee.role}
              </span>
            </div>

            {/* List Details */}
            <div className="p-6 space-y-4">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest font-mono">Ficha Técnica Laboral:</span>
              
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                  <span className="text-gray-400 font-semibold text-xs">ID de Empleado</span>
                  <span className="font-mono text-gray-800 font-bold">{selectedEmployee.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                  <span className="text-gray-400 font-semibold text-xs">Contacto</span>
                  <span className="text-gray-800 font-bold">{selectedEmployee.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                  <span className="text-gray-400 font-semibold text-xs">E-mail</span>
                  <span className="text-gray-800 font-bold select-all truncate max-w-[200px]">{selectedEmployee.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                  <span className="text-gray-400 font-semibold text-xs">Sucursal</span>
                  <span className="text-gray-800 font-bold">{selectedEmployee.branch}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400 font-semibold text-xs">Estatus Laboral</span>
                  <span className={`font-bold text-xs ${selectedEmployee.status === 'Activo' ? 'text-emerald-700' : 'text-red-700'}`}>{selectedEmployee.status}</span>
                </div>
              </div>

              {/* Control buttons */}
              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => {
                    setIsOpenView(false);
                    handleOpenEditForm(selectedEmployee);
                  }}
                  className="flex-1 bg-gray-50/80 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl py-2.5 font-bold transition text-xs flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Datos
                </button>
                <button
                  onClick={() => setIsOpenView(false)}
                  className="flex-1 bg-[#064E3B] text-white hover:bg-[#065F46] rounded-xl py-2.5 font-bold transition text-xs flex items-center justify-center"
                >
                  Regresar
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
