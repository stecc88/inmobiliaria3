import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Phone, User } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

const Navbar = () => {
  const { settings } = useSettings();

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 text-gray-900 font-black text-2xl tracking-tighter group">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="h-12 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center group-hover:rotate-6 transition duration-500 shadow-lg shadow-primary/20">
                  <Home size={20} />
                </div>
              )}
              <span className="hidden sm:block uppercase">{settings?.name || 'INMOBILIARIA'}</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition">Inicio</Link>
            <Link to="/catalogo" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition">Propiedades</Link>
            <Link to="/contacto" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition">Contacto</Link>
            <Link to="/admin" className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition shadow-xl active:scale-95">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
