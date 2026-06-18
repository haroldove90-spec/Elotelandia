import React, { useState } from 'react';
import { Employee, AttendanceRecord, UserProfile } from '../types';
import { 
  Clock, 
  Calendar, 
  UserCheck, 
  UserX, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Users, 
  PlusCircle, 
  FileCheck, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Trash2,
  CalendarCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AttendanceModuleProps {
  employees: Employee[];
  profile: UserProfile;
}

export default function AttendanceModule({ employees, profile }: AttendanceModuleProps) {
  // Filter active employees for registration list
  const activeEmployees = employees.filter(e => e.status === 'Activo');

  // Initial Sample Attendance Records for simulation
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([
    {
      id: 'att-1',
      employeeId: '1',
      employeeName: 'Mateo González',
      date: new Date().toISOString().split('T')[0],
      checkIn: '08:45',
      checkOut: '17:02',
      status: 'Puntual',
      notes: 'Llegó temprano para preparar el carbón.'
    },
    {
      id: 'att-2',
      employeeId: '2',
      employeeName: 'Sofía Ruiz',
      date: new Date().toISOString().split('T')[0],
      checkIn: '08:52',
      checkOut: '17:05',
      status: 'Puntual',
      notes: 'Corte de caja matutino listo.'
    },
    {
      id: 'att-3',
      employeeId: '3',
      employeeName: 'Diego Hernández',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:12',
      checkOut: null,
      status: 'Retardo',
      notes: 'Tráfico denso en Boulevard.'
    },
    {
      id: 'att-4',
      employeeId: '4',
      employeeName: 'Valentina Ortega',
      date: new Date().toISOString().split('T')[0],
      checkIn: '08:58',
      checkOut: '17:00',
      status: 'Puntual',
      notes: 'Control de higiene inicial superado.'
    },
    {
      id: 'att-5',
      employeeId: '5',
      employeeName: 'Sebastian Morales',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:25',
      checkOut: null,
      status: 'Retardo',
      notes: 'Problema mecánico menor con la motocicleta.'
    },
    {
      id: 'att-6',
      employeeId: '6',
      employeeName: 'Camila Luján',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Ayer
      checkIn: '08:35',
      checkOut: '16:55',
      status: 'Puntual',
      notes: 'Estación limpia.'
    },
    {
      id: 'att-7',
      employeeId: '7',
      employeeName: 'Joaquín Castro',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Ayer
      checkIn: '09:05',
      checkOut: '17:15',
      status: 'Retardo',
      notes: 'Reunión externa con proveedor de elotes.'
    },
    {
      id: 'att-8',
      employeeId: '8',
      employeeName: 'Regina Flores',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Ayer
      checkIn: '08:50',
      checkOut: '17:00',
      status: 'Puntual'
    }
  ]);

  // Form States
  const [selectedEmpId, setSelectedEmpId] = useState<string>(activeEmployees[0]?.id || '');
  const [customTime, setCustomTime] = useState<string>(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
  const [customDate, setCustomDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [customStatus, setCustomStatus] = useState<'Puntual' | 'Retardo' | 'Falta' | 'Justificado'>('Puntual');
  const [attendanceNotes, setAttendanceNotes] = useState<string>('');
  const [autoCalculateStatus, setAutoCalculateStatus] = useState<boolean>(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [dateFilter, setDateFilter] = useState<string>('todos'); // 'todos' | 'hoy' | 'ayer'

  // Toast feedback
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'info' | 'danger' } | null>(null);

  const showAlert = (message: string, type: 'success' | 'info' | 'danger' = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3500);
  };

  // Status limits (e.g. Workday starts at 09:00 AM)
  const isLate = (timeStr: string): boolean => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (hours > 9) return true;
    if (hours === 9 && minutes > 0) return true;
    return false;
  };

  // Handlers
  const handleRegisterCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) return;

    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    // Check if they already checked in today/or selected customDate
    const alreadyExists = attendanceLogs.find(log => log.employeeId === selectedEmpId && log.date === customDate);
    if (alreadyExists) {
      showAlert(`El empleado ${emp.name} ya tiene un registro de ENTRADA para el día ${customDate}. Puede editarlo o registrar su salida.`, 'danger');
      return;
    }

    // Determine status
    let statusEntry = customStatus;
    if (autoCalculateStatus) {
      statusEntry = isLate(customTime) ? 'Retardo' : 'Puntual';
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      date: customDate,
      checkIn: customTime,
      checkOut: null,
      status: statusEntry,
      notes: attendanceNotes.trim() ? attendanceNotes.trim() : undefined
    };

    setAttendanceLogs(prev => [newRecord, ...prev]);
    setAttendanceNotes('');
    showAlert(`¡Entrada registrada correctamente para ${emp.name} (${statusEntry})!`, 'success');
  };

  const handleRegisterCheckOut = (employeeId: string) => {
    const logIdx = attendanceLogs.findIndex(log => log.employeeId === employeeId && log.checkOut === null);
    if (logIdx === -1) {
      // Create a checkout based on date
      showAlert('No se encontró un registro de entrada inicial activo para registrar la salida.', 'danger');
      return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeNow = `${hours}:${minutes}`;

    setAttendanceLogs(prev => {
      const copy = [...prev];
      copy[logIdx] = {
        ...copy[logIdx],
        checkOut: timeNow,
        notes: (copy[logIdx].notes ? copy[logIdx].notes + ' | ' : '') + `Salida registrada voluntariamente a las ${timeNow}.`
      };
      return copy;
    });

    showAlert(`¡Salida registrada con éxito a las ${timeNow}!`, 'success');
  };

  const handleDeleteRecord = (id: string) => {
    setAttendanceLogs(prev => prev.filter(log => log.id !== id));
    showAlert('Registro de asistencia eliminado con éxito.', 'info');
  };

  // Mass simulation function requested
  const handleMassSimulation = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Reset and mock multiple entries for today
    const mockTodayRecords: AttendanceRecord[] = activeEmployees.map((emp, index) => {
      // Alternate early and late and checkout status
      const isShortName = emp.name.length % 2 === 0;
      const hour = isShortName ? '08' : '09';
      const min = String((index * 7) % 60).padStart(2, '0');
      const timeIn = `${hour}:${min}`;
      
      const isLateStatus = isLate(timeIn);
      const isAbsent = index === activeEmployees.length - 1; // Mark last one as absent

      if (isAbsent) {
        return {
          id: `sim-abs-${emp.id}-${Date.now()}`,
          employeeId: emp.id,
          employeeName: emp.name,
          date: todayStr,
          checkIn: '--:--',
          checkOut: null,
          status: 'Falta' as const,
          notes: 'No reportó asistencia ni presentó justificación médica.'
        };
      }

      return {
        id: `sim-att-${emp.id}-${Date.now()}`,
        employeeId: emp.id,
        employeeName: emp.name,
        date: todayStr,
        checkIn: timeIn,
        checkOut: isShortName ? '17:00' : null,
        status: (isLateStatus ? 'Retardo' : 'Puntual') as any,
        notes: isLateStatus ? 'Tráfico en la calzada de ingreso sucursal.' : 'Ingresó puntualmente con uniforme completo.'
      };
    });

    // Also inject some yesterday records to make the logs super rich!
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const mockYesterdayRecords: AttendanceRecord[] = activeEmployees.slice(0, 5).map((emp, index) => {
      return {
        id: `sim-yesterday-${emp.id}-${Date.now()}`,
        employeeId: emp.id,
        employeeName: emp.name,
        date: yesterdayStr,
        checkIn: '08:50',
        checkOut: '17:05',
        status: 'Puntual',
        notes: 'Turno de tarde completado con éxito.'
      };
    });

    setAttendanceLogs([...mockTodayRecords, ...mockYesterdayRecords]);
    showAlert(`¡Simulación exitosa! Se inyectaron ${mockTodayRecords.length + mockYesterdayRecords.length} registros enriquecidos para hoy y ayer.`, 'success');
  };

  // Calculated Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const logsHoy = attendanceLogs.filter(log => log.date === todayStr);
  const totalActivosHoy = activeEmployees.length;
  
  const totalPuntualesHoy = logsHoy.filter(log => log.status === 'Puntual').length;
  const totalRetardosHoy = logsHoy.filter(log => log.status === 'Retardo').length;
  const totalFaltasHoy = logsHoy.filter(log => log.status === 'Falta').length;
  const presentHoy = logsHoy.filter(log => log.status !== 'Falta').length;
  
  const attendanceProgress = totalActivosHoy > 0 
    ? Math.round((presentHoy / totalActivosHoy) * 100) 
    : 0;

  // Filter logs for displaying in table
  const filteredLogs = attendanceLogs.filter(log => {
    // Search query matches employee name or notes
    const matchesSearch = log.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status Filter
    const matchesStatus = statusFilter === 'todos' || log.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Date Filter
    let matchesDate = true;
    if (dateFilter === 'hoy') {
      matchesDate = log.date === todayStr;
    } else if (dateFilter === 'ayer') {
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      matchesDate = log.date === yesterdayStr;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border text-sm font-semibold max-w-sm ${
              alert.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              alert.type === 'info' ? 'bg-amber-50 border-amber-200 text-amber-800' :
              'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
            {alert.type === 'info' && <Clock className="w-5 h-5 text-amber-600 shrink-0" />}
            {alert.type === 'danger' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
            <p className="flex-1 leading-snug">{alert.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro Header & Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-widest">
              <CalendarCheck className="w-3.5 h-3.5" /> Asistencia de Sucursal
            </span>
            <h2 className="text-2xl font-black text-[#064E3B] tracking-tight mt-1.5">
              Control de Asistencia Biométrico
            </h2>
            <p className="text-xs text-gray-500 max-w-xl">
              Modulo exclusivo para el <strong className="text-gray-700 font-semibold">{profile.role}</strong>. Registra entradas y salidas, evalúa retardos matutinos de forma automatizada y audita la puntualidad del personal en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={handleMassSimulation}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simular Registro Masivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Shift KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Attendance Index */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Presentismo Hoy</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 tracking-tight">{attendanceProgress}%</span>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${attendanceProgress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-1.5 font-sans">
              {presentHoy} de {totalActivosHoy} empleados activos asistieron hoy.
            </p>
          </div>
        </div>

        {/* Punctual entries */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Llegadas Puntuales</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-teal-800 tracking-tight">{totalPuntualesHoy}</span>
            <p className="text-xs font-medium text-teal-700 font-sans mt-1">Registrados a tiempo</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1 font-sans">Antes del límite de las 09:00 AM.</p>
          </div>
        </div>

        {/* Late arrivals */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Retardos Acumulados</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-600 tracking-tight">{totalRetardosHoy}</span>
            <p className="text-xs font-medium text-amber-700 font-sans mt-1">Llegaron después de hora</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1 font-sans">Sujeto a descuento de bono semanal.</p>
          </div>
        </div>

        {/* Absences today */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Faltas Registradas</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-rose-700 tracking-tight">{totalFaltasHoy}</span>
            <p className="text-xs font-medium text-rose-700 font-sans mt-1">Ausencias injustificadas</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1 font-sans">Requiere contacto administrativo.</p>
          </div>
        </div>

      </div>

      {/* Two Grid Layout: Register panel and Active shift Check-outs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registration Form Panel */}
        <div className="lg:col-span-1 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs h-fit space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-2">
            <PlusCircle className="w-5 h-5 text-[#064E3B]" />
            <h3 className="font-serif font-extrabold text-[#064E3B] text-base">
              Registrar Asistencia
            </h3>
          </div>

          <form onSubmit={handleRegisterCheckIn} className="space-y-4 text-xs">
            
            {/* Operator Selection */}
            <div className="space-y-1">
              <label className="block font-bold text-gray-500 uppercase tracking-wider">Colaborador Activo</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-800 font-semibold focus:outline-none focus:border-[#064E3B]"
                required
              >
                {activeEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Date & Time row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-gray-500 uppercase tracking-wider">Fecha</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-800 font-semibold focus:outline-none focus:border-[#064E3B]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-500 uppercase tracking-wider">Hora Marcada</label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-800 font-semibold focus:outline-none focus:border-[#064E3B]"
                />
              </div>
            </div>

            {/* Automated vs Manual status check */}
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-600 select-none">
                <input
                  type="checkbox"
                  checked={autoCalculateStatus}
                  onChange={(e) => setAutoCalculateStatus(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4.5 h-4.5"
                />
                <span>Cálculo Automático por Límitadora</span>
              </label>
              <p className="text-[10px] text-gray-400 pl-6">
                Marca como &quot;Retardo&quot; la entrada después de las 09:00 AM de forma inteligente.
              </p>

              {!autoCalculateStatus && (
                <div className="space-y-1 pt-1.5 pl-6">
                  <label className="block font-bold text-gray-500 uppercase tracking-wider">Elegir Estado Forzado</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Puntual', 'Retardo', 'Falta', 'Justificado'].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setCustomStatus(st as any)}
                        className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all text-center uppercase tracking-wide tracking-wider ${
                          customStatus === st 
                            ? 'bg-emerald-600 text-white border-transparent shadow-xs'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes / Incidents */}
            <div className="space-y-1">
              <label className="block font-bold text-gray-500 uppercase tracking-wider">Notas / Observaciones de Incio</label>
              <textarea
                placeholder="Ej. Entregó justificante médico o demoras de transporte..."
                rows={2}
                value={attendanceNotes}
                onChange={(e) => setAttendanceNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:border-[#064E3B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#064E3B] text-white hover:bg-[#065F46] hover:scale-[1.01] active:scale-[0.98] transition-all font-serif font-black uppercase text-xs rounded-xl shadow-xs"
            >
              Registrar Entrada
            </button>
          </form>
        </div>

        {/* Quick Check-Out Sim / Active Shift Employees */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 text-xs font-serif font-extrabold text-[#064E3B]">
            <span className="flex items-center gap-2 text-base">
              <FileCheck className="w-5 h-5 text-[#064E3B]" />
              Colaboradores Trabajando Hoy ({presentHoy})
            </span>
            <span className="font-mono text-xs uppercase text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
              Turno En Curso
            </span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[340px] overflow-y-auto pr-1">
            {logsHoy.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-2">
                <Clock className="w-10 h-10 mx-auto text-gray-300 animate-pulse" />
                <p className="text-xs font-semibold">No hay colaboradores activos en el turno de hoy.</p>
                <p className="text-[10px] text-gray-400">Seleccione un empleado y registre su entrada en el panel de la izquierda, o cargue la simulación masiva.</p>
              </div>
            ) : (
              logsHoy.map(log => {
                const checkedOut = log.checkOut !== null;
                const isAbsent = log.status === 'Falta';

                return (
                  <div key={log.id} className="flex items-center justify-between py-3.5 gap-4">
                    <div className="space-y-1">
                      <span className="font-extrabold text-sm text-gray-800 block leading-tight">{log.employeeName}</span>
                      <div className="flex items-center flex-wrap gap-2 text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                          log.status === 'Puntual' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          log.status === 'Retardo' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          log.status === 'Falta' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {log.status}
                        </span>
                        
                        {!isAbsent && (
                          <span className="text-gray-400 font-medium font-mono">
                            Entrada: <strong className="text-gray-600 font-semibold">{log.checkIn}</strong>
                          </span>
                        )}

                        {checkedOut ? (
                          <span className="text-gray-400 font-medium font-mono">
                            Salida: <strong className="text-emerald-700 font-bold">{log.checkOut}</strong>
                          </span>
                        ) : !isAbsent ? (
                          <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold text-[9px] animate-pulse">
                            En Sucursal
                          </span>
                        ) : null}
                      </div>

                      {log.notes && (
                        <p className="text-[10px] text-gray-500 italic max-w-md block mt-1">
                          Nota: &quot;{log.notes}&quot;
                        </p>
                      )}
                    </div>

                    <div>
                      {!checkedOut && !isAbsent ? (
                        <button
                          onClick={() => handleRegisterCheckOut(log.employeeId)}
                          className="bg-emerald-50 hover:bg-[#064E3B] text-[#064E3B] hover:text-white border border-[#064E3B]/20 hover:border-transparent font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Registrar Salida</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : checkedOut ? (
                        <span className="text-gray-400 font-extrabold text-[10px] uppercase border border-gray-100 bg-gray-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                          Completado ✓
                        </span>
                      ) : (
                        <span className="text-rose-600 font-extrabold text-[10px] uppercase border border-rose-100 bg-rose-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                          Inasistencia
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Main Audit History Logs Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif font-black text-[#064E3B]">
                Historial General de Asistencia
              </h3>
              <p className="text-[11px] text-gray-400">
                Audita y filtra registros históricos, corrige estados de inasistencia y descarga informes financieros.
              </p>
            </div>

            <div className="flex items-center gap-2 max-w-sm w-full bg-white px-3 py-2 rounded-xl border border-gray-300">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar por colaborador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] font-mono">Filtros Avanzados:</span>
            </div>

            {/* Status Selector */}
            <div className="flex gap-1.5">
              {['todos', 'Puntual', 'Retardo', 'Falta', 'Justificado'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase transition-all tracking-wider ${
                    statusFilter === st
                      ? 'bg-[#064E3B] text-white border-transparent'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Date range helpers */}
            <div className="flex gap-1.5 sm:ml-auto">
              <button
                onClick={() => setDateFilter('todos')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${
                  dateFilter === 'todos' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                Todas las fechas
              </button>
              <button
                onClick={() => setDateFilter('hoy')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${
                  dateFilter === 'hoy' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                Sólo Hoy
              </button>
              <button
                onClick={() => setDateFilter('ayer')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${
                  dateFilter === 'ayer' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                Ayer
              </button>
            </div>
          </div>
        </div>

        {/* Data list table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-[#064E3B] font-mono text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-6">Colaborador</th>
                <th className="py-3 px-6">Fecha</th>
                <th className="py-3 px-6">Entrada / Salida</th>
                <th className="py-3 px-6 text-center">Estado</th>
                <th className="py-3 px-6">Observaciones de Incidencias</th>
                <th className="py-3 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-semibold italic">
                    No se encontraron registros de asistencia con los filtros seleccionados actualmente.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  return (
                    <tr key={log.id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="py-4 px-6 font-extrabold text-gray-900">{log.employeeName}</td>
                      <td className="py-4 px-6 text-gray-500 font-mono font-medium">
                        {new Date(log.date + 'T00:00:00').toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6 text-gray-800 font-mono font-bold">
                        {log.checkIn} → <span className={log.checkOut ? 'text-[#064E3B]' : 'text-gray-400'}>{log.checkOut || '--:--'}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-extrabold uppercase text-[9px] tracking-wider tracking-widest inline-block ${
                          log.status === 'Puntual' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          log.status === 'Retardo' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          log.status === 'Falta' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                          'bg-indigo-50 text-indigo-800 border border-indigo-200'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 max-w-xs truncate">
                        {log.notes || <span className="text-gray-300 font-serif italic">Ninguna</span>}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteRecord(log.id)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center"
                          title="Eliminar Registro"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Total stats summary */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100 text-xs">
          <span className="text-gray-400 font-medium">
            Mostrando <strong className="text-gray-700 font-bold">{filteredLogs.length}</strong> de <strong className="text-gray-700 font-bold">{attendanceLogs.length}</strong> registros en base de datos local.
          </span>

          <span className="text-gray-400 font-mono uppercase text-[9px] font-bold tracking-widest">
            Sincronización Segura
          </span>
        </div>

      </div>

    </div>
  );
}
