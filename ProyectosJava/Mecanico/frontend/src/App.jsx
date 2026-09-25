import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PublicServices from './components/PublicServices';
import TurnoModal from './components/TurnoModal';
import AIAgentWidget from './components/AIAgentWidget';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('servicios');
  const [selectedService, setSelectedService] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setActiveTab('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setActiveTab('servicios');
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setActiveTab('turno');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Navegación Superior */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        token={token} 
        onLogout={handleLogout} 
      />

      {/* Contenido Principal */}
      <main className="flex-1">
        {activeTab === 'servicios' && (
          <PublicServices 
            onSelectService={handleSelectService} 
            onOpenIA={() => {}} 
          />
        )}

        {activeTab === 'turno' && (
          <TurnoModal 
            selectedService={selectedService} 
            onClose={() => setActiveTab('servicios')} 
          />
        )}

        {activeTab === 'login' && !token && (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        )}

        {activeTab === 'admin' && token && (
          <AdminDashboard token={token} />
        )}
      </main>

      {/* Burbuja Flotante del Asistente de IA (Presente en la vista de clientes) */}
      <AIAgentWidget onBookTurno={() => setActiveTab('turno')} />

      {/* Footer con Acceso Discreto para Administrador */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 Taller Mecánico - Servicio Técnico Integral</p>
        
        <div className="pt-1 flex justify-center items-center space-x-2">
          {!token ? (
            <button
              onClick={() => setActiveTab('login')}
              className="text-slate-600 hover:text-slate-400 text-[11px] flex items-center space-x-1 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso Administrativo Privado</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('admin')}
              className="text-emerald-500 hover:text-emerald-400 font-semibold text-[11px] transition-colors"
            >
              • Sesión Admin Activa (Ir al Panel)
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
