import React from 'react';
import { Wrench, Calendar, Bot, ShieldCheck, LogOut, Car } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, token, onLogout }) {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Taller */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('servicios')}
          >
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
              <Wrench className="h-7 w-7 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-3xl font-extrabold font-heading tracking-wider bg-gradient-to-r from-white via-slate-200 to-amber-500 bg-clip-text text-transparent">
                TALLER MECÁNICO
              </span>
              <p className="text-xs text-amber-500 font-semibold tracking-widest uppercase -mt-1">
                Servicio Integral & Diagnóstico IA
              </p>
            </div>
          </div>

          {/* Menú de Navegación */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab('servicios')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'servicios' 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Servicios</span>
            </button>

            <button
              onClick={() => setActiveTab('turno')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'turno' 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Sacar Turno</span>
            </button>

            <button
              onClick={() => setActiveTab('ia')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'ia' 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 glow-orange' 
                  : 'text-indigo-300 hover:bg-slate-800 hover:text-indigo-200'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="font-semibold">Asistente IA</span>
            </button>

            {token ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-700">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'admin' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Panel Admin</span>
                </button>

                <button
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm shadow-md hover:shadow-orange-500/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Acceso Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
