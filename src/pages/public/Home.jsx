import React, { useState, useEffect } from 'react';
import { Search, Home as HomeIcon, Key, Building, MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    operation: '',
    type: ''
  });

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_published', true)
        .limit(3);
      if (error) throw error;
      setFeatured(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/catalogo?${query}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <span className="inline-block px-4 py-1.5 bg-accent text-white text-xs font-black uppercase tracking-[0.2em] rounded-full mb-6 animate-fade-in">
            Líderes en el Mercado Inmobiliario
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter drop-shadow-2xl">
            Encontrá el lugar donde <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">querés vivir.</span>
          </h1>
          
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-2xl p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 items-center border border-white/20">
            <div className="flex-1 w-full relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={20} />
              <input 
                type="text" 
                placeholder="Ciudad, Barrio o Calle" 
                className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder:text-white/60 focus:outline-none rounded-2xl"
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              />
            </div>
            <div className="h-10 w-px bg-white/20 hidden md:block"></div>
            <select 
              className="w-full md:w-48 py-4 px-4 bg-transparent text-white focus:outline-none appearance-none cursor-pointer"
              value={searchParams.operation}
              onChange={(e) => setSearchParams({...searchParams, operation: e.target.value})}
            >
              <option value="" className="text-gray-900">Operación</option>
              <option value="venta" className="text-gray-900">Venta</option>
              <option value="alquiler" className="text-gray-900">Alquiler</option>
            </select>
            <div className="h-10 w-px bg-white/20 hidden md:block"></div>
            <select 
              className="w-full md:w-48 py-4 px-4 bg-transparent text-white focus:outline-none appearance-none cursor-pointer"
              value={searchParams.type}
              onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
            >
              <option value="" className="text-gray-900">Tipo de Inmueble</option>
              <option value="casa" className="text-gray-900">Casa</option>
              <option value="departamento" className="text-gray-900">Departamento</option>
              <option value="terreno" className="text-gray-900">Terreno</option>
            </select>
            <button type="submit" className="w-full md:w-auto bg-primary hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95">
              BUSCAR
            </button>
          </form>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Explorá nuestras categorías</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: 'Casas en Venta', icon: <HomeIcon />, op: 'venta', type: 'casa', color: 'bg-blue-50 text-blue-600' },
              { label: 'Casas en Alquiler', icon: <Key />, op: 'alquiler', type: 'casa', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Deptos en Venta', icon: <Building />, op: 'venta', type: 'departamento', color: 'bg-purple-50 text-purple-600' },
              { label: 'Deptos en Alquiler', icon: <Key />, op: 'alquiler', type: 'departamento', color: 'bg-orange-50 text-orange-600' },
              { label: 'Terrenos en Venta', icon: <MapPin />, op: 'venta', type: 'terreno', color: 'bg-amber-50 text-amber-600' },
            ].map((item, idx) => (
              <Link 
                key={idx}
                to={`/catalogo?operation=${item.op}&type=${item.type}`}
                className="flex flex-col items-center p-8 rounded-3xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 group"
              >
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-500 shadow-sm`}>
                  {item.icon}
                </div>
                <span className="font-bold text-gray-800 text-center text-sm uppercase tracking-wider">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Propiedades Destacadas</h2>
              <p className="text-gray-500 font-medium">Seleccionamos lo mejor para vos.</p>
            </div>
            <Link to="/catalogo" className="hidden md:block text-primary font-black uppercase tracking-widest text-sm hover:underline">
              Ver todo el catálogo →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {featured.map((prop) => (
                <Link 
                  key={prop.id} 
                  to={`/propiedad/${prop.id}`}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80'} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary/90 backdrop-blur-md text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                        {prop.operation}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight group-hover:text-primary transition line-clamp-1">{prop.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mb-6">
                      <MapPin size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">{prop.location}</span>
                    </div>
                    <div className="text-3xl font-black text-gray-900">
                      <span className="text-sm font-bold text-primary mr-1">{prop.currency}</span>
                      {prop.price.toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" 
              className="rounded-[3rem] shadow-2xl relative z-10"
              alt="Office"
            />
            <div className="absolute -bottom-10 -right-10 bg-primary text-white p-10 rounded-[2.5rem] shadow-2xl z-20 hidden md:block">
              <p className="text-5xl font-black mb-1 tracking-tighter">15+</p>
              <p className="text-xs font-black uppercase tracking-widest opacity-80 leading-relaxed">Años de <br />Experiencia</p>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
              Más que una inmobiliaria, <br />
              <span className="text-primary">somos tus aliados.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              Contamos con un equipo de profesionales dedicados a brindarte la mejor asesoría en la compra, venta o alquiler de tu propiedad. Nuestra trayectoria avala nuestro compromiso con la transparencia y la satisfacción de nuestros clientes.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <p className="text-2xl font-black text-gray-900 tracking-tighter">1200+</p>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Propiedades Vendidas</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-gray-900 tracking-tighter">98%</p>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Clientes Satisfechos</p>
              </div>
            </div>
            <Link 
              to="/contacto" 
              className="inline-block bg-gray-900 text-white px-10 py-5 rounded-2xl font-black tracking-widest text-xs hover:bg-primary transition shadow-xl uppercase"
            >
              Contactanos ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Quick Section */}
      <section className="py-24 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <h2 className="text-5xl font-black tracking-tighter">¿Tenés alguna consulta?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
              <Phone className="mx-auto mb-6 text-primary" size={40} />
              <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Llamanos</p>
              <p className="text-xl font-bold">+54 9 11 1234 5678</p>
            </div>
            <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
              <Mail className="mx-auto mb-6 text-primary" size={40} />
              <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Escribinos</p>
              <p className="text-xl font-bold">info@inmobiliaria.com</p>
            </div>
            <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
              <FaInstagram className="mx-auto mb-6 text-primary" size={40} />
              <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Seguinos</p>
              <p className="text-xl font-bold">@inmobiliaria_prof</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
