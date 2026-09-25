import React, { useState, useEffect } from 'react';
import { Calendar, Wrench, Users, DollarSign, Plus, Trash2, CheckCircle, Clock, XCircle, Search, TrendingUp, TrendingDown, Wallet, KeyRound, Filter, AlertCircle, Send, MessageSquare, Mail } from 'lucide-react';

export default function AdminDashboard({ token }) {
  const [subTab, setSubTab] = useState('turnos');
  const [turnos, setTurnos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensajeNotificacion, setMensajeNotificacion] = useState(null);

  // Filtros de Facturación Mensual
  const fechaActual = new Date();
  const [filtroAnio, setFiltroAnio] = useState(fechaActual.getFullYear());
  const [filtroMes, setFiltroMes] = useState(fechaActual.getMonth() + 1);

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'servicio', 'mecanico', 'factura', 'clave'
  const [formServicio, setFormServicio] = useState({ nombre: '', descripcion: '', precio: '', tiempoEstimadoMinutos: 45, imagenUrl: '' });
  const [formMecanico, setFormMecanico] = useState({ nombre: '', especialidad: '', telefono: '', email: '' });
  const [formFactura, setFormFactura] = useState({ tipo: 'INGRESO', concepto: '', monto: '', metodoPago: 'Efectivo', detalles: '' });
  const [formClave, setFormClave] = useState({ claveActual: '', claveNueva: '' });
  const [mensajeClave, setMensajeClave] = useState(null);
  const [errorClave, setErrorClave] = useState(null);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const cargarFacturasMensuales = (anio, mes) => {
    let urlFacturas = '/api/admin/facturas';
    let urlResumen = '/api/admin/facturas/resumen';
    if (anio && mes) {
      urlFacturas += `?anio=${anio}&mes=${mes}`;
      urlResumen += `?anio=${anio}&mes=${mes}`;
    }

    fetch(urlFacturas, { headers: authHeaders }).then(r => r.json()).then(d => Array.isArray(d) && setFacturas(d)).catch(console.error);
    fetch(urlResumen, { headers: authHeaders }).then(r => r.json()).then(d => setResumen(d)).catch(console.error);
  };

  const cargarDatos = () => {
    fetch('/api/admin/turnos', { headers: authHeaders }).then(r => r.json()).then(d => Array.isArray(d) && setTurnos(d)).catch(console.error);
    fetch('/api/admin/servicios', { headers: authHeaders }).then(r => r.json()).then(d => Array.isArray(d) && setServicios(d)).catch(console.error);
    fetch('/api/admin/mecanicos', { headers: authHeaders }).then(r => r.json()).then(d => Array.isArray(d) && setMecanicos(d)).catch(console.error);
    cargarFacturasMensuales(filtroAnio, filtroMes);
  };

  useEffect(() => {
    cargarDatos();
  }, [token]);

  useEffect(() => {
    if (subTab === 'facturas') {
      cargarFacturasMensuales(filtroAnio, filtroMes);
    }
  }, [filtroAnio, filtroMes]);

  const cambiarEstadoTurno = (id, nuevoEstado) => {
    fetch(`/api/admin/turnos/${id}/estado?estado=${nuevoEstado}`, {
      method: 'PATCH',
      headers: authHeaders
    }).then(() => cargarDatos());
  };

  const enviarRecordatorioManual = (id) => {
    fetch(`/api/admin/turnos/${id}/recordatorio`, {
      method: 'POST',
      headers: authHeaders
    })
      .then(res => res.json())
      .then(data => {
        setMensajeNotificacion(data.mensaje);
        cargarDatos();
        setTimeout(() => setMensajeNotificacion(null), 3000);
      })
      .catch(console.error);
  };

  const eliminarTurno = (id) => {
    if (confirm("¿Eliminar este turno?")) {
      fetch(`/api/admin/turnos/${id}`, { method: 'DELETE', headers: authHeaders }).then(() => cargarDatos());
    }
  };

  const guardarServicio = (e) => {
    e.preventDefault();
    fetch('/api/admin/servicios', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ ...formServicio, precio: Number(formServicio.precio), tiempoEstimadoMinutos: Number(formServicio.tiempoEstimadoMinutos) })
    }).then(() => { setShowModal(false); cargarDatos(); });
  };

  const eliminarServicio = (id) => {
    if (confirm("¿Eliminar servicio?")) fetch(`/api/admin/servicios/${id}`, { method: 'DELETE', headers: authHeaders }).then(() => cargarDatos());
  };

  const guardarMecanico = (e) => {
    e.preventDefault();
    fetch('/api/admin/mecanicos', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(formMecanico)
    }).then(() => { setShowModal(false); cargarDatos(); });
  };

  const eliminarMecanico = (id) => {
    if (confirm("¿Eliminar mecánico?")) fetch(`/api/admin/mecanicos/${id}`, { method: 'DELETE', headers: authHeaders }).then(() => cargarDatos());
  };

  const guardarFactura = (e) => {
    e.preventDefault();
    fetch('/api/admin/facturas', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ ...formFactura, monto: Number(formFactura.monto) })
    }).then(() => { setShowModal(false); cargarDatos(); });
  };

  const eliminarFactura = (id) => {
    if (confirm("¿Eliminar registro financiero?")) fetch(`/api/admin/facturas/${id}`, { method: 'DELETE', headers: authHeaders }).then(() => cargarDatos());
  };

  const guardarNuevaClave = (e) => {
    e.preventDefault();
    setMensajeClave(null);
    setErrorClave(null);

    fetch('/api/admin/auth/cambiar-clave', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(formClave)
    })
      .then(res => {
        if (!res.ok) throw new Error("Contraseña actual incorrecta");
        return res.json();
      })
      .then(data => {
        setMensajeClave("¡Contraseña modificada correctamente!");
        setFormClave({ claveActual: '', claveNueva: '' });
        setTimeout(() => setShowModal(false), 1500);
      })
      .catch(err => setErrorClave(err.message));
  };

  const turnosFiltrados = turnos.filter(t => 
    t.clienteNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.vehiculoPatente?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const meses = [
    { num: 1, nombre: 'Enero' }, { num: 2, nombre: 'Febrero' }, { num: 3, nombre: 'Marzo' },
    { num: 4, nombre: 'Abril' }, { num: 5, nombre: 'Mayo' }, { num: 6, nombre: 'Junio' },
    { num: 7, nombre: 'Julio' }, { num: 8, nombre: 'Agosto' }, { num: 9, nombre: 'Septiembre' },
    { num: 10, nombre: 'Octubre' }, { num: 11, nombre: 'Noviembre' }, { num: 12, nombre: 'Diciembre' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header del Admin con botón de cambiar clave */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-white tracking-wide">PANEL DE CONTROL ADMINISTRATIVO</h1>
          <p className="text-slate-400 text-xs">Gestión integral del taller, turnos, recordatorios y balance financiero</p>
        </div>
        <button
          onClick={() => { setModalType('clave'); setMensajeClave(null); setErrorClave(null); setShowModal(true); }}
          className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-md"
        >
          <KeyRound className="w-4 h-4" />
          <span>CAMBIAR CONTRASEÑA</span>
        </button>
      </div>

      {mensajeNotificacion && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center space-x-3 text-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{mensajeNotificacion}</span>
        </div>
      )}

      {/* Resumen Financiero Top Cards */}
      {resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Ingresos ({meses.find(m => m.num === Number(filtroMes))?.nombre})</p>
              <h3 className="text-3xl font-extrabold font-heading text-emerald-400">
                ${Number(resumen.totalIngresos).toLocaleString('es-AR')}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Gastos ({meses.find(m => m.num === Number(filtroMes))?.nombre})</p>
              <h3 className="text-3xl font-extrabold font-heading text-rose-400">
                ${Number(resumen.totalGastos).toLocaleString('es-AR')}
              </h3>
            </div>
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Balance Neto ({meses.find(m => m.num === Number(filtroMes))?.nombre})</p>
              <h3 className={`text-3xl font-extrabold font-heading ${Number(resumen.balanceNeto) >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                ${Number(resumen.balanceNeto).toLocaleString('es-AR')}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Sub Navegación Admin */}
      <div className="flex flex-wrap border-b border-slate-700 gap-2">
        <button
          onClick={() => setSubTab('turnos')}
          className={`px-5 py-3 font-heading font-bold text-lg tracking-wider border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'turnos' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>GESTIÓN DE TURNOS ({turnos.length})</span>
        </button>

        <button
          onClick={() => setSubTab('servicios')}
          className={`px-5 py-3 font-heading font-bold text-lg tracking-wider border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'servicios' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span>SERVICIOS ({servicios.length})</span>
        </button>

        <button
          onClick={() => setSubTab('mecanicos')}
          className={`px-5 py-3 font-heading font-bold text-lg tracking-wider border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'mecanicos' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>MECÁNICOS ({mecanicos.length})</span>
        </button>

        <button
          onClick={() => setSubTab('facturas')}
          className={`px-5 py-3 font-heading font-bold text-lg tracking-wider border-b-2 transition-all flex items-center space-x-2 ${
            subTab === 'facturas' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          <span>FACTURACIÓN MENSUAL ({facturas.length})</span>
        </button>
      </div>

      {/* VISTA 1: TURNOS Y RECORDATORIOS */}
      {subTab === 'turnos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por cliente o patente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-xs text-amber-400 font-semibold uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-4">Cliente / Contacto</th>
                    <th className="p-4">Vehículo / Patente</th>
                    <th className="p-4">Servicio</th>
                    <th className="p-4">Fecha y Hora</th>
                    <th className="p-4">Estado / Recordatorios</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {turnosFiltrados.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-750 transition-colors">
                      <td className="p-4 font-medium text-white">
                        <div>{t.clienteNombre}</div>
                        <div className="text-xs text-slate-400">{t.clienteTelefono}</div>
                        {t.clienteEmail && <div className="text-[11px] text-slate-500">{t.clienteEmail}</div>}
                      </td>
                      <td className="p-4">
                        <div>{t.vehiculoModelo}</div>
                        <span className="inline-block bg-slate-900 px-2 py-0.5 rounded text-xs font-mono text-amber-400 border border-slate-700">
                          {t.vehiculoPatente}
                        </span>
                      </td>
                      <td className="p-4">{t.servicioNombre}</td>
                      <td className="p-4 text-xs text-slate-300">
                        {t.fechaHora ? new Date(t.fechaHora).toLocaleString('es-AR') : '-'}
                      </td>
                      <td className="p-4 space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          t.estado === 'PENDIENTE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          t.estado === 'EN_PROCESO' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          t.estado === 'FINALIZADO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {t.estado}
                        </span>
                        <div className="flex items-center space-x-1.5 text-[10px]">
                          <span className={`px-1.5 py-0.5 rounded ${t.recordatorioEmailEnviado ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                            ✉ Email {t.recordatorioEmailEnviado ? '✓' : '—'}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded ${t.recordatorioWhatsappEnviado ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                            💬 WA {t.recordatorioWhatsappEnviado ? '✓' : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => enviarRecordatorioManual(t.id)}
                          title="Enviar Recordatorio (Email & WhatsApp)"
                          className="p-1.5 bg-indigo-900/60 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-colors border border-indigo-500/30"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => cambiarEstadoTurno(t.id, 'EN_PROCESO')}
                          title="Iniciar Trabajo"
                          className="p-1.5 bg-slate-900 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => cambiarEstadoTurno(t.id, 'FINALIZADO')}
                          title="Finalizar Turno"
                          className="p-1.5 bg-slate-900 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => cambiarEstadoTurno(t.id, 'CANCELADO')}
                          title="Cancelar Turno"
                          className="p-1.5 bg-slate-900 hover:bg-amber-600 text-amber-400 hover:text-white rounded-lg transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarTurno(t.id)}
                          title="Eliminar Turno"
                          className="p-1.5 bg-slate-900 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: SERVICIOS CON IMÁGENES */}
      {subTab === 'servicios' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setFormServicio({ nombre: '', descripcion: '', precio: '', tiempoEstimadoMinutos: 45, imagenUrl: '' }); setModalType('servicio'); setShowModal(true); }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm flex items-center space-x-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>NUEVO SERVICIO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((s) => (
              <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
                {s.imagenUrl && (
                  <div className="h-40 w-full overflow-hidden bg-slate-900 relative">
                    <img src={s.imagenUrl} alt={s.nombre} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold font-heading text-white">{s.nombre}</h3>
                      <span className="text-xl font-extrabold text-amber-400 font-heading">
                        ${Number(s.precio).toLocaleString('es-AR')}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">{s.descripcion}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-700 flex justify-end">
                    <button
                      onClick={() => eliminarServicio(s.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 3: MECÁNICOS */}
      {subTab === 'mecanicos' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setModalType('mecanico'); setShowModal(true); }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm flex items-center space-x-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>NUEVO MECÁNICO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mecanicos.map((m) => (
              <div key={m.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3 shadow-xl">
                <h3 className="text-xl font-bold font-heading text-white">{m.nombre}</h3>
                <p className="text-amber-400 text-xs uppercase font-semibold">{m.especialidad}</p>
                <p className="text-slate-300 text-sm">Tel: {m.telefono}</p>
                <p className="text-slate-400 text-xs">{m.email}</p>
                <div className="pt-3 border-t border-slate-700 flex justify-end">
                  <button
                    onClick={() => eliminarMecanico(m.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 4: FACTURACIÓN Y CONTROL DE GASTOS POR MES */}
      {subTab === 'facturas' && (
        <div className="space-y-6">
          {/* Selector de Mes y Año */}
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold font-heading uppercase text-white">FILTRAR FACTURACIÓN POR MES:</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <select
                value={filtroMes}
                onChange={(e) => setFiltroMes(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {meses.map(m => (
                  <option key={m.num} value={m.num}>{m.nombre}</option>
                ))}
              </select>

              <select
                value={filtroAnio}
                onChange={(e) => setFiltroAnio(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>

              <button
                onClick={() => { setModalType('factura'); setShowModal(true); }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm flex items-center space-x-2 shadow-md whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>NUEVA FACTURA / GASTO</span>
              </button>
            </div>
          </div>

          {/* Tabla de Facturas del Mes Seleccionado */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-xs text-amber-400 font-semibold uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Concepto</th>
                    <th className="p-4">Monto</th>
                    <th className="p-4">Método de Pago</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {facturas.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">
                        No hay facturas ni gastos registrados para este mes.
                      </td>
                    </tr>
                  ) : (
                    facturas.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-750">
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            f.tipo === 'INGRESO' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {f.tipo}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-white">{f.concepto}</td>
                        <td className={`p-4 font-extrabold font-heading text-lg ${f.tipo === 'INGRESO' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${Number(f.monto).toLocaleString('es-AR')}
                        </td>
                        <td className="p-4 text-xs">{f.metodoPago || '-'}</td>
                        <td className="p-4 text-xs text-slate-400">{f.fecha ? new Date(f.fecha).toLocaleDateString('es-AR') : '-'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => eliminarFactura(f.id)}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GENÉRICO Y CAMBIO DE CONTRASEÑA */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-2xl font-bold font-heading text-white uppercase">
              {modalType === 'clave' ? 'CAMBIAR CONTRASEÑA' : `NUEVO REGISTRO (${modalType})`}
            </h3>
            
            {modalType === 'clave' && (
              <form onSubmit={guardarNuevaClave} className="space-y-4">
                {mensajeClave && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs">
                    {mensajeClave}
                  </div>
                )}
                {errorClave && (
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorClave}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Contraseña Actual</label>
                  <input required type="password" placeholder="••••••••" value={formClave.claveActual} onChange={e => setFormClave({...formClave, claveActual: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Nueva Contraseña</label>
                  <input required type="password" placeholder="••••••••" value={formClave.claveNueva} onChange={e => setFormClave({...formClave, claveNueva: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-300">Cancelar</button>
                  <button type="submit" className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm">Actualizar</button>
                </div>
              </form>
            )}

            {modalType === 'servicio' && (
              <form onSubmit={guardarServicio} className="space-y-3">
                <input required placeholder="Nombre del Servicio" value={formServicio.nombre} onChange={e => setFormServicio({...formServicio, nombre: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <textarea placeholder="Descripción" value={formServicio.descripcion} onChange={e => setFormServicio({...formServicio, descripcion: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <input required type="number" step="0.01" placeholder="Precio ($ ARS)" value={formServicio.precio} onChange={e => setFormServicio({...formServicio, precio: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <input placeholder="URL de la imagen (ej. https://images.unsplash.com/...)" value={formServicio.imagenUrl || ''} onChange={e => setFormServicio({...formServicio, imagenUrl: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-300">Cancelar</button>
                  <button type="submit" className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm">Guardar</button>
                </div>
              </form>
            )}

            {modalType === 'mecanico' && (
              <form onSubmit={guardarMecanico} className="space-y-3">
                <input required placeholder="Nombre Completo" value={formMecanico.nombre} onChange={e => setFormMecanico({...formMecanico, nombre: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <input placeholder="Especialidad" value={formMecanico.especialidad} onChange={e => setFormMecanico({...formMecanico, especialidad: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <input placeholder="Teléfono" value={formMecanico.telefono} onChange={e => setFormMecanico({...formMecanico, telefono: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-300">Cancelar</button>
                  <button type="submit" className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm">Guardar</button>
                </div>
              </form>
            )}

            {modalType === 'factura' && (
              <form onSubmit={guardarFactura} className="space-y-3">
                <select value={formFactura.tipo} onChange={e => setFormFactura({...formFactura, tipo: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white">
                  <option value="INGRESO">INGRESO</option>
                  <option value="GASTO">GASTO</option>
                </select>
                <input required placeholder="Concepto / Detalle" value={formFactura.concepto} onChange={e => setFormFactura({...formFactura, concepto: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <input required type="number" step="0.01" placeholder="Monto ($ ARS)" value={formFactura.monto} onChange={e => setFormFactura({...formFactura, monto: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <input placeholder="Método de Pago" value={formFactura.metodoPago} onChange={e => setFormFactura({...formFactura, metodoPago: e.target.value})} className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-sm text-white" />
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-300">Cancelar</button>
                  <button type="submit" className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm">Guardar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
