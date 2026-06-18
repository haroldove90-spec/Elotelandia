import React from 'react';
import { 
  X, 
  Smartphone, 
  Monitor, 
  Compass, 
  Download, 
  ArrowUpFromLine, 
  PlusSquare, 
  MoreVertical,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall: () => void;
  isNativeSupported: boolean;
}

export default function InstallPwaModal({ 
  isOpen, 
  onClose, 
  onNativeInstall, 
  isNativeSupported 
}: InstallPwaModalProps) {
  if (!isOpen) return null;

  const appIconUrl = 'https://appdesignproyectos.com/Elotelandia.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border border-[#E5E7EB] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative"
      >
        {/* Header decoration */}
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 -translate-x-6 translate-y-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-gray-100 bg-white shadow-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 md:p-8 space-y-6 relative z-10">
          
          {/* Brand Presentation */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3.5 bg-amber-50 rounded-3xl border border-amber-200/50 shadow-sm relative">
              <img 
                src={appIconUrl} 
                alt="Elotelandia Logo" 
                className="w-16 h-16 object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs">
                <Sparkles className="w-3 h-3 animate-pulse" />
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#064E3B] tracking-tight">
                Instalar Elotelandia
              </h3>
              <p className="text-xs text-gray-400 font-mono tracking-wider uppercase">
                Versión Digital Web App (PWA)
              </p>
            </div>

            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
              Disfruta de un acceso rápido desde tu pantalla de inicio, menor consumo de datos y funcionamiento fluido offline.
            </p>
          </div>

          {/* Quick Actions depending on status */}
          {isNativeSupported ? (
            <div className="space-y-3 bg-[#EEF2F6]/50 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <p className="text-xs font-bold text-blue-800">¡Tu navegador es 100% compatible!</p>
              </div>
              <button
                onClick={onNativeInstall}
                className="w-full py-3 bg-[#064E3B] hover:bg-[#053F30] text-white font-serif font-black uppercase text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Instalar Directamente</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  Instrucciones Manuales de Instalación
                </h4>
                
                <div className="space-y-3">
                  
                  {/* Step iOS */}
                  <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/50 flex items-center justify-center text-amber-700 shrink-0">
                      <Smartphone className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-gray-800">Para iPhone & iPad (Safari)</p>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        Presiona el botón de <strong className="text-gray-700">Compartir</strong> <ArrowUpFromLine className="w-3.5 h-3.5 inline text-blue-500" /> en la barra inferior, desliza y selecciona <strong className="text-gray-700">Agregar a inicio</strong> <PlusSquare className="w-3.5 h-3.5 inline text-gray-600" />.
                      </p>
                    </div>
                  </div>

                  {/* Step Android */}
                  <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/50 flex items-center justify-center text-emerald-700 shrink-0">
                      <Smartphone className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-gray-800">Para Android (Chrome / Edge)</p>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        Presiona los <strong className="text-gray-700">tres puntos</strong> <MoreVertical className="w-3.5 h-3.5 inline text-gray-600" /> arriba a la derecha y pulsa <strong className="text-medium text-gray-700">Instalar aplicación</strong> o <strong className="text-gray-700">Instalar Elotelandia</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Step PC */}
                  <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/50 flex items-center justify-center text-indigo-700 shrink-0">
                      <Monitor className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-gray-800">Para Computadoras (Chrome / Edge)</p>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        Busca el icono de <strong className="text-gray-700">Monitor + Flecha</strong> en la barra de direcciones de tu navegador y haz clic.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Value Prop Benefits */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[#064E3B] font-semibold text-[10px] uppercase font-mono tracking-wider">
            <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100/55">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sin Usar Tienda</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-110/55">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Súper Ligera</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
