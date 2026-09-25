import React, { useState, useEffect } from 'react';
import { Clock, CalendarPlus, Sparkles, Wrench, Image as ImageIcon } from 'lucide-react';

export default function PublicServices({ onSelectService, onOpenIA }) {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/publico/servicios')
      .then(res => res.json())
      .then(data => {
        setServicios(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar servicios:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner Principal Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-8 sm:p-12 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
          <Wrench className="w-96 h-96 text-amber-500" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Servicio Técnico Profesional & Garantizado</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-white tracking-wide leading-none">
            POTENCIA Y PRECISIÓN PARA TU VEHÍCULO
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Mantenimiento preventivo, diagnóstico computarizado y reparación especializada. Reserva tu turno de forma rápida y sencilla sin necesidad de registrarte.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onSelectService(null)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>RESERVAR TURNO AHORA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grilla de Servicios con Imágenes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold font-heading tracking-wider text-white">NUESTROS SERVICIOS ESPECIALIZADOS</h2>
            <p className="text-slate-400 text-sm">Selecciona un servicio para agendar tu turno directamente</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Cargando servicios del taller...</p>
          </div>
        ) : servicios.length === 0 ? (
          <div className="bg-slate-800/50 rounded-2xl p-8 text-center text-slate-400 border border-slate-700/50">
            No hay servicios disponibles actualmente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((s) => (
              <div 
                key={s.id} 
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl transition-all group hover:shadow-2xl"
              >
                {/* Imagen del Servicio */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  {s.imagenUrl ? (
                    <img 
                      src={s.imagenUrl} 
                      alt={s.nombre} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
                      <Wrench className="w-16 h-16 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-3 py-1 rounded-xl">
                    <span className="text-xl font-extrabold text-amber-400 font-heading tracking-wider">
                      ${Number(s.precio).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold font-heading text-white tracking-wide group-hover:text-amber-400 transition-colors">
                      {s.nombre}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {s.descripcion}
                    </p>
                    {s.tiempoEstimadoMinutos && (
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Tiempo estimado: {s.tiempoEstimadoMinutos} min</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-700/50 mt-4">
                    <button
                      onClick={() => onSelectService(s)}
                      className="w-full bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/30 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      <span>SOLICITAR ESTE SERVICIO</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
