import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Search, Filter, MapPin, BedDouble, Bath, Square, X, 
  Car, Trees, Waves, Sofa, CreditCard, Ruler 
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const Catalog = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados de los filtros sincronizados con URL
  const [filters, setFilters] = useState({
    search: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    operation: searchParams.get('operation') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    garage: '',
    has_patio: false,
    has_pool: false,
    is_furnished: false,
    credit_ready: false,
    status: 'disponible'
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_published', true);

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,province.ilike.%${filters.search}%,city.ilike.%${filters.search}%,neighborhood.ilike.%${filters.search}%`);
      }
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.operation) query = query.eq('operation', filters.operation);
      if (filters.minPrice) query = query.gte('price', filters.minPrice);
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
      if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms);
      if (filters.bathrooms) query = query.gte('bathrooms', filters.bathrooms);
      if (filters.garage) query = query.gte('garage', filters.garage);
      if (filters.has_patio) query = query.eq('has_patio', true);
      if (filters.has_pool) query = query.eq('has_pool', true);
      if (filters.is_furnished) query = query.eq('is_furnished', true);
      if (filters.credit_ready) query = query.eq('credit_ready', true);
      if (filters.status) query = query.eq('status', filters.status);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      operation: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      garage: '',
      has_patio: false,
      has_pool: false,
      is_furnished: false,
      credit_ready: false,
      status: 'disponible'
    });
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Main Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">Catálogo</h1>
            <p className="text-gray-500 font-medium">Encontrá tu lugar ideal entre {properties.length} opciones.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition" size={20} />
              <input 
                type="text" 
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Barrio, ciudad o calle..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl ${showFilters ? 'bg-primary text-white scale-105' : 'bg-white text-gray-700 border border-gray-100 hover:bg-gray-50'}`}
            >
              <Filter size={18} />
              Filtros
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl mb-16 border border-gray-50 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-50">
              <h3 className="font-black text-2xl text-gray-900 tracking-tighter">Búsqueda Avanzada</h3>
              <button onClick={clearFilters} className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                <X size={16} /> Limpiar todo
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Selects Row */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tipo de Propiedad</label>
                  <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700">
                    <option value="">Todos los tipos</option>
                    <option value="casa">Casas</option>
                    <option value="departamento">Departamentos</option>
                    <option value="terreno">Terrenos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Operación</label>
                  <select name="operation" value={filters.operation} onChange={handleFilterChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700">
                    <option value="">Cualquiera</option>
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>
              </div>

              {/* Price Row */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Precio Mínimo</label>
                  <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="USD 0" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Precio Máximo</label>
                  <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Sin límite" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700" />
                </div>
              </div>

              {/* Rooms Row */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Dormitorios</label>
                    <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700">
                      <option value="">0+</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Baños</label>
                    <select name="bathrooms" value={filters.bathrooms} onChange={handleFilterChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700">
                      <option value="">0+</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Cocheras</label>
                  <select name="garage" value={filters.garage} onChange={handleFilterChange} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700">
                    <option value="">Cualquiera</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes Row */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'has_patio', label: 'Patio', icon: <Trees size={14} /> },
                  { name: 'has_pool', label: 'Pileta', icon: <Waves size={14} /> },
                  { name: 'is_furnished', label: 'Amoblado', icon: <Sofa size={14} /> },
                  { name: 'credit_ready', label: 'Crédito', icon: <CreditCard size={14} /> },
                ].map((item) => (
                  <label key={item.name} className={`flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${filters[item.name] ? 'bg-primary/5 border-primary text-primary shadow-inner' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'}`}>
                    <input type="checkbox" name={item.name} checked={filters[item.name]} onChange={handleFilterChange} className="hidden" />
                    <div className="mb-2">{item.icon}</div>
                    <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            <p className="mt-8 text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Cargando resultados</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-gray-100">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="text-gray-300" size={40} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">No encontramos lo que buscás</h3>
            <p className="text-gray-500 font-medium mb-10">Intentá ajustando los filtros o reiniciando la búsqueda.</p>
            <button onClick={clearFilters} className="bg-primary text-white px-12 py-5 rounded-3xl font-black tracking-widest text-xs hover:bg-blue-700 transition shadow-2xl uppercase">
              Ver todas las propiedades
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {properties.map((prop) => (
              <Link 
                key={prop.id} 
                to={`/propiedad/${prop.id}`}
                className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group border border-gray-100 flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={prop.images?.[prop.main_image_index || 0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80'} 
                    alt={prop.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                  />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-primary/95 backdrop-blur-md text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                      {prop.operation}
                    </span>
                    <span className="bg-white/95 backdrop-blur-md text-gray-900 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                      {prop.type}
                    </span>
                  </div>
                  {prop.status !== 'disponible' && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-white text-gray-900 px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-[0.3em] shadow-2xl">
                        {prop.status}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight group-hover:text-primary transition line-clamp-2 tracking-tighter">{prop.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 mb-8">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-wider truncate">
                      {prop.neighborhood ? `${prop.neighborhood}, ` : ''}{prop.city}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-10">
                    <div className="flex flex-col items-center gap-1 p-4 rounded-[1.5rem] bg-gray-50 group-hover:bg-blue-50 transition duration-500">
                      <BedDouble size={20} className="text-primary/70" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Dorm</span>
                      <span className="text-sm font-black text-gray-900">{prop.bedrooms}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-4 rounded-[1.5rem] bg-gray-50 group-hover:bg-blue-50 transition duration-500">
                      <Square size={20} className="text-primary/70" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Sup m²</span>
                      <span className="text-sm font-black text-gray-900">{prop.area_total}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-4 rounded-[1.5rem] bg-gray-50 group-hover:bg-blue-50 transition duration-500">
                      <Ruler size={20} className="text-primary/70" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Lote</span>
                      <span className="text-[10px] font-black text-gray-900 truncate w-full text-center">
                        {prop.lot_dimensions_text || (prop.lot_front && prop.lot_depth ? `${prop.lot_front}x${prop.lot_depth}` : 'N/A')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-3xl font-black text-gray-900 tracking-tighter">
                      <span className="text-sm font-bold text-primary mr-1">{prop.currency}</span>
                      {prop.price.toLocaleString()}
                    </div>
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-xl group-hover:translate-x-1">
                      <Filter size={20} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
