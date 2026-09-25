import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertTriangle, DollarSign, Wrench, CheckCircle } from 'lucide-react';

export default function AIAgentChat({ onBookTurno }) {
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Encabezado del Agente */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-500/20 p-4 rounded-2xl border border-indigo-500/40 glow-orange">
            <Bot className="w-10 h-10 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inteligencia Artificial Mecánica Integrada</span>
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-white tracking-wide">
              DIAGNÓSTICO RÁPIDO & ASESORAMIENTO IA
            </h2>
            <p className="text-slate-300 text-sm">
              Describe los ruidos, fallas o comportamiento anómalo de tu auto y recibe un informe preliminar con costos estimados.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de Consulta */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <form onSubmit={handleConsultar} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Modelo / Año de Auto</label>
              <input
                type="text"
                placeholder="Ej. Chevrolet Onix 2021"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Describe la Falla o Síntoma *</label>
              <input
                type="text"
                required
                placeholder="Ej. Hace un chillido agudo al frenar fuerte o tirones al acelerar..."
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>ANALIZANDO SÍNTOMAS...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ANALIZAR CON AGENTE IA</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Resultado de la Consulta */}
      {respuesta && (
        <div className="bg-slate-800/90 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
          <div className="border-b border-slate-700 pb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold font-heading text-indigo-300 flex items-center space-x-2">
              <Wrench className="w-6 h-6 text-indigo-400" />
              <span>RESULTADO DEL PRE-DIAGNÓSTICO</span>
            </h3>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full border border-indigo-500/30">
              Evaluación Técnica IA
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
              <h4 className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-1">Diagnóstico Estimado</h4>
              <p className="text-white text-base font-medium">{respuesta.diagnostico}</p>
            </div>

            {respuesta.posiblesCausas && respuesta.posiblesCausas.length > 0 && (
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <h4 className="text-xs uppercase text-slate-400 font-semibold tracking-wider flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Posibles Causas Identificadas</span>
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {respuesta.posiblesCausas.map((causa, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{causa}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                <h4 className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-1">Recomendación</h4>
                <p className="text-sm text-slate-300">{respuesta.recomendacion}</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                <h4 className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-1 flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Costo Aproximado de Reparación</span>
                </h4>
                <p className="text-lg font-bold text-emerald-400 font-heading tracking-wide">
                  {respuesta.estimadoPrecio}
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => onBookTurno()}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all"
              >
                <span>AGENDAR TURNO CON ESTE DIAGNÓSTICO</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
