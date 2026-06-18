import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { 
  User, 
  Upload, 
  KeyRound, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserProfileModuleProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function UserProfileModule({ profile, setProfile }: UserProfileModuleProps) {
  // Input form states
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [branch, setBranch] = useState(profile.branch);
  const [role, setRole] = useState<'Administrador General' | 'Gerente de Sucursal'>(profile.role);
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);

  // Password & Security form states
  const [currentPassword, setCurrentPassword] = useState('*********');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // UI States
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerNotification = (message: string, type: 'success' | 'danger' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Simulate Photo Upload with FileReader Base64 conversion
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerNotification('Por favor carga un archivo de imagen válido (JPG, PNG, WEBP).', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        setProfile(prev => ({ ...prev, photoUrl: reader.result as string }));
        triggerNotification('¡Foto de perfil actualizada correctamente!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Profile Information Changes
  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingInfo(true);
    setErrorMessage('');

    setTimeout(() => {
      if (!name.trim()) {
        setErrorMessage('El nombre de administrador no puede estar vacío.');
        setIsUpdatingInfo(false);
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Por favor proporciona un formato de correo institucional correcto.');
        setIsUpdatingInfo(false);
        return;
      }

      const updated = {
        ...profile,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        branch,
        role: role
      };
      setProfile(updated);
      setIsUpdatingInfo(false);
      triggerNotification('¡Datos de contacto guardados con éxito!', 'success');
    }, 600);
  };

  // Submit Security Password Changes
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPass(true);
    setErrorMessage('');

    setTimeout(() => {
      if (!newPassword) {
        setErrorMessage('Introduce el nuevo PIN o contraseña de acceso.');
        setIsUpdatingPass(false);
        return;
      }
      if (newPassword.length < 6) {
        setErrorMessage('La contraseña debe poseer al menos 6 caracteres por seguridad.');
        setIsUpdatingPass(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('La confirmación de la contraseña no coincide.');
        setIsUpdatingPass(false);
        return;
      }

      triggerNotification('¡Llave de seguridad actualizada de forma segura!', 'success');
      setNewPassword('');
      setConfirmPassword('');
      setIsUpdatingPass(false);
    }, 800);
  };

  const handleSelectPresetAvatar = (url: string) => {
    setPhotoUrl(url);
    setProfile(prev => ({ ...prev, photoUrl: url }));
    triggerNotification('¡Avatar corporativo seleccionado con éxito!', 'success');
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  ];

  return (
    <div className="w-full space-y-6">

      {/* Notifications Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border text-sm font-semibold max-w-sm ${
              notification.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="flex-1">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Avatar simulation card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs flex flex-col items-center text-center">
            
            <div className="relative group cursor-pointer inline-block" onClick={() => fileInputRef.current?.click()}>
              {/* Animated outer ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-elote-yellow via-emerald-600 to-amber-500 rounded-full opacity-60 group-hover:opacity-100 blur-xs transition duration-300"></div>
              
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-gray-100 shadow-md">
                <img 
                  src={photoUrl} 
                  alt="Admin Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay hover effect */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Upload className="w-6 h-6 text-white" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider mt-1">Cargar Foto</span>
                </div>
              </div>
            </div>

            {/* Hidden Input for file upload */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            <h3 className="font-extrabold text-[#064E3B] text-lg mt-4 leading-tight">
              {profile.name}
            </h3>
            <p className="text-xs font-bold text-[#92400E] font-mono uppercase tracking-wider mt-0.5">
              {profile.role}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-[#166534] border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold uppercase mt-2.5">
              Sesión Activa
            </span>

            {/* Preset Avatars Selection */}
            <div className="mt-6 w-full text-left space-y-2 border-t border-gray-100 pt-5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Seleccionar Avatar Previo:</span>
              <div className="flex gap-2 justify-center">
                {presetAvatars.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(preset)}
                    className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 hover:border-amber-500 transition-colors shrink-0"
                  >
                    <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Security Tip info */}
            <div className="mt-6 p-4 bg-[#FEFCE8] border border-amber-200/50 rounded-xl text-left">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 leading-none">
                <ShieldCheck className="w-4 h-4 text-[#166534]" /> Nivel de Privacidad
              </span>
              <p className="text-[11px] text-amber-900/80 leading-relaxed mt-1.5 font-sans">
                Tu información está localmente encriptada y protegida por políticas de seguridad de Elotelandia. Nadie externo tiene acceso a este hash.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tab forms (Info and credentials) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Form Option 1: Personal Data */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-6">
              <User className="w-5 h-5 text-[#064E3B]" />
              <h3 className="font-extrabold text-[#064E3B] text-base font-serif">
                Configuración del Perfil Administrativo
              </h3>
            </div>

            <form onSubmit={handleUpdateInfo} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Nombre del Administrador</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-sm text-[#111827] font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Rol Jerárquico</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'Administrador General' | 'Gerente de Sucursal')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-sm text-[#111827] font-semibold bg-white"
                  >
                    <option value="Administrador General">🏷️ Administrador General</option>
                    <option value="Gerente de Sucursal">🧑‍💼 Gerente de Sucursal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">E-mail de Contacto</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-sm text-[#111827] font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Teléfono Directo</label>
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-sm text-[#111827] font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Sucursal de Asignación Física</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-[#111827] text-sm font-semibold bg-white"
                >
                  <option value="Sucursal Vialidad Guadalupe">Sucursal Vialidad Guadalupe</option>
                  <option value="Sucursal Centro Histórico">Sucursal Centro Histórico</option>
                  <option value="Sucursal Arroyo de Plata">Sucursal Arroyo de Plata</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingInfo}
                  className="bg-[#064E3B] text-white hover:bg-[#065F46] font-bold text-sm px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isUpdatingInfo ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>

          {/* Form Option 2: Security & Password */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-6">
              <KeyRound className="w-5 h-5 text-[#064E3B]" />
              <h3 className="font-extrabold text-[#064E3B] text-base font-serif">
                Llave de Seguridad & Contraseña
              </h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Contraseña de Acceso Actual</label>
                <input 
                  type="text"
                  value={currentPassword}
                  disabled
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-400 font-bold cursor-not-allowed select-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Nueva Contraseña</label>
                  <div className="relative">
                    <input 
                      type={showPass ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-sm text-[#111827] font-semibold"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Confirmar Nueva Contraseña</label>
                  <input 
                    type={showPass ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#064E3B] text-sm text-[#111827] font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPass}
                  className="bg-[#064E3B] text-white hover:bg-[#065F46] font-bold text-sm px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isUpdatingPass ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  <span>Modificar Contraseña</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
