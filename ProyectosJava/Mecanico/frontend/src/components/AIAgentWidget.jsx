import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, AlertTriangle, DollarSign, Wrench, CheckCircle, MessageSquare } from 'lucide-react';

export default function AIAgentWidget({ onBookTurno }) {
  const [isOpen, setIsOpen] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [modelo, setModelo] = useState('');
  const [loading, setLoading] = useState(false);
  const [respuesta, setRespuesta] = useState(null);

  const handleConsultar = (e) => {
    e.preventDefault();
    if (!consulta.trim()) return;
    setLoading(true);
    setRespuesta(null);

    fetch('/api/ia/consultar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consulta: consulta,
        modeloVehiculo: modelo
      })
    })
      .then(res => res.json())
      .then(data => {
        setRespuesta(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Burbuja Flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold p-4 rounded-full shadow-2xl flex items-center space-x-3 transition-all transform hover:scale-105 group border border-indigo-400/40 glow-orange"
        >
          <div className="relative">
            <Bot className="w-7 h-7 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
          </div>
          <span className="hidden sm:inline font-heading tracking-wider text-sm text-slate-950 font-extrabold pr-1">
            ASISTENTE DE IA MECÁNICA
          </span>
        </button>
      )}

      {/* Ventana Desplegable del Chatbot */}
      {isOpen && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-80 sm:w-96 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
          {/* Header del Chat */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 border-b border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/40">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-white tracking-wide">ASISTENTE IA DE TALLER</h3>
                <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span>Diagnóstico Técnico en Línea</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo del Chat / Formulario y Respuestas */}
          <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1">
              <p className="text-slate-300">
                👋 <strong>¡Hola!</strong> Describe la falla o ruido de tu vehículo y te daré un pre-diagnóstico inmediato.
              </p>
            </div>

            <form onSubmit={handleConsultar} className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Modelo de Auto</label>
                <input
                  type="text"
                  placeholder="Ej. Ford Focus 2018"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Síntoma o Ruido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ruido al frenar, humo en escape..."
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <span>ANALIZANDO SÍNTOMAS...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>CONSULTAR IA</span>
                  </>
                )}
              </button>
            </form>

            {/* Resultado de Diagnóstico */}
            {respuesta && (
              <div className="bg-slate-800 border border-indigo-500/40 rounded-2xl p-3.5 space-y-3">
                <div>
                  <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-wider">Diagnóstico IA</span>
                  <p className="text-white text-xs font-medium mt-0.5">{respuesta.diagnostico}</p>
                </div>

                {respuesta.posiblesCausas && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">Posibles Causas</span>
                    <ul className="space-y-1">
                      {respuesta.posiblesCausas.map((c, i) => (
                        <li key={i} className="text-[11px] text-slate-300 flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] uppercase text-emerald-400 font-bold block">Costo Estimado</span>
                  <span className="text-sm font-bold font-heading text-emerald-400">{respuesta.estimadoPrecio}</span>
                </div>

                <button
                  onClick={() => { setIsOpen(false); onBookTurno(); }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-xs transition-all shadow-md"
                >
                  SOLICITAR TURNO CON ESTE DIAGNÓSTICO
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
