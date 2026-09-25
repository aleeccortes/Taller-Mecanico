import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, KeyRound } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) throw new Error("Credenciales inválidas. Verifique usuario y contraseña.");
        return res.json();
      })
      .then(data => {
        setLoading(false);
        onLoginSuccess(data.token, data.username);
      })
      .catch(err => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold font-heading text-white tracking-wide">ACCESO ADMINISTRADOR</h2>
          <p className="text-slate-400 text-xs">Ingrese sus credenciales para gestionar turnos y facturación</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-center space-x-3 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Usuario</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 uppercase font-semibold mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-amber-400 flex items-center space-x-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Credenciales por defecto:</span>
            </p>
            <p>Usuario: <code className="text-white font-mono">admin</code> | Clave: <code className="text-white font-mono">admin123</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'VERIFICANDO...' : 'INGRESAR AL PANEL'}
          </button>
        </form>
      </div>
    </div>
  );
}
