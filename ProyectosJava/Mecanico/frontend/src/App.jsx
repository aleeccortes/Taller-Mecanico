import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PublicServices from './components/PublicServices';
import TurnoModal from './components/TurnoModal';
import AIAgentChat from './components/AIAgentChat';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        token={token} 
        onLogout={handleLogout} 
      />

      <main className="flex-1">
        {activeTab === 'servicios' && (
          <PublicServices 
            onSelectService={handleSelectService} 
            onOpenIA={() => setActiveTab('ia')} 
          />
        )}

        {activeTab === 'turno' && (
          <TurnoModal 
            selectedService={selectedService} 
            onClose={() => setActiveTab('servicios')} 
          />
        )}

        {activeTab === 'ia' && (
          <AIAgentChat 
            onBookTurno={() => setActiveTab('turno')} 
          />
        )}

        {activeTab === 'login' && !token && (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        )}

        {activeTab === 'admin' && token && (
          <AdminDashboard token={token} />
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 Taller Mecánico - Sistema Integral de Turnos, Facturación & IA Agent</p>
        <p>Desarrollado en Spring Boot + React.js + MySQL</p>
      </footer>
    </div>
  );
}
