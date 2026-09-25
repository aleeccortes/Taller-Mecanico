import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Car, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function TurnoModal({ selectedService, onClose }) {
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    clienteNombre: '',
    clienteTelefono: '',
    clienteEmail: '',
    vehiculoModelo: '',
    vehiculoPatente: '',
    servicioId: selectedService ? selectedService.id : '',
    fechaHora: '',
    notas: ''
  });

  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/publico/servicios')
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    fetch('/api/publico/turnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        servicioId: Number(formData.servicioId)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Complete todos los campos obligatorios.");
        return res.json();
      })
      .then(data => {
        setLoading(false);
        setExito(true);
      })
      .catch(err => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="border-b border-slate-700 pb-4">
          <h2 className="text-3xl font-bold font-heading text-white tracking-wide flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-amber-500" />
            <span>SOLICITUD DE TURNO EN LÍNEA</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Sin necesidad de iniciar sesión. Completa tus datos y confirmamos tu turno de inmediato.
          </p>
        </div>

        {exito ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-3xl font-extrabold font-heading text-emerald-400">¡TURNO RESERVADO CON ÉXITO!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Hemos registrado correctamente tu solicitud. Nuestro equipo técnico revisará el horario asignado y se pondrá en contacto contigo.
            </p>
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md"
            >
              VOLVER AL INICIO
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center space-x-3 text-rose-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Datos Personales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400 border-b border-slate-700 pb-2">1. Datos del Cliente</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Nombre Completo *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={formData.clienteNombre}
                      onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Teléfono de Contacto *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. 11-4455-6677"
                      value={formData.clienteTelefono}
                      onChange={(e) => setFormData({ ...formData, clienteTelefono: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Email (Opcional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="cliente@email.com"
                      value={formData.clienteEmail}
                      onChange={(e) => setFormData({ ...formData, clienteEmail: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Datos del Vehículo y Servicio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400 border-b border-slate-700 pb-2">2. Vehículo y Servicio Requerido</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Modelo del Vehículo *</label>
                  <div className="relative">
                    <Car className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. VW Gol Trend 2019"
                      value={formData.vehiculoModelo}
                      onChange={(e) => setFormData({ ...formData, vehiculoModelo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Patente / Dominio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. AA123CD"
                    value={formData.vehiculoPatente}
                    onChange={(e) => setFormData({ ...formData, vehiculoPatente: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Servicio *</label>
                  <select
                    required
                    value={formData.servicioId}
                    onChange={(e) => setFormData({ ...formData, servicioId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Seleccionar Servicio --</option>
                    {servicios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} (${Number(s.precio).toLocaleString('es-AR')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Fecha y Hora Solicitada *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.fechaHora}
                    onChange={(e) => setFormData({ ...formData, fechaHora: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Observaciones o Síntomas</label>
                  <textarea
                    rows="3"
                    placeholder="Describa si nota algún ruido, falla específica o preferencia de horario..."
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>PROCESANDO...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>CONFIRMAR Y SOLICITAR TURNO</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
