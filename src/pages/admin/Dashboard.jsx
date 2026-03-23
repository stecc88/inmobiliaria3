import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, LogOut, 
  Home, DollarSign, MapPin, LayoutDashboard,
  CheckCircle, MessageSquare, Settings, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propsRes, inqsRes] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('is_read', false)
      ]);

      if (propsRes.error) throw propsRes.error;
      setProperties(propsRes.data || []);
      setInquiriesCount(inqsRes.count || 0);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setProperties(properties.map(p => 
        p.id === id ? { ...p, is_published: !currentStatus } : p
      ));
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta propiedad?')) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Home className="text-primary" />
            <span>Admin Panel</span>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary rounded-xl text-white">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/admin/consultas')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition relative"
          >
            <MessageSquare size={20} />
            Consultas
            {inquiriesCount > 0 && (
              <span className="absolute right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {inquiriesCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => navigate('/admin/ajustes')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition"
          >
            <Settings size={20} />
            Ajustes
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl transition"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Propiedades</h1>
            <p className="text-gray-500 mt-1">Administra tus publicaciones actuales</p>
          </div>
          <button 
            onClick={() => navigate('/admin/nueva')}
            className="bg-primary hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition"
          >
            <Plus size={20} />
            Agregar Propiedad
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{properties.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-green-500 text-[10px] font-black uppercase tracking-widest">Disponibles</p>
            <p className="text-2xl font-black text-green-600 mt-1">
              {properties.filter(p => p.status === 'disponible').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Reservadas</p>
            <p className="text-2xl font-black text-orange-600 mt-1">
              {properties.filter(p => p.status === 'reservado').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Vendidas</p>
            <p className="text-2xl font-black text-blue-600 mt-1">
              {properties.filter(p => p.status === 'vendido').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest">Alquiladas</p>
            <p className="text-2xl font-black text-purple-600 mt-1">
              {properties.filter(p => p.status === 'alquilado').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative">
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Consultas</p>
            <p className="text-2xl font-black text-red-600 mt-1">{inquiriesCount}</p>
            {inquiriesCount > 0 && <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}
          </div>
        </div>

        {/* Properties Table/List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">Propiedad</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">Tipo/Operación</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">Precio</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">Estado</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Cargando propiedades...
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No hay propiedades registradas aún.
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={property.images?.[0] || 'https://via.placeholder.com/150'} 
                          className="w-16 h-16 rounded-lg object-cover"
                          alt=""
                        />
                        <div>
                          <p className="font-bold text-gray-900">{property.title}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin size={12} />
                            {property.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
                          {property.type}
                        </span>
                        <span className="block text-xs text-gray-500 capitalize">
                          {property.operation}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {property.currency} {property.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {property.is_published ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                          <Eye size={16} /> Publicado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600 text-sm font-semibold">
                          <EyeOff size={16} /> Oculto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleTogglePublished(property.id, property.is_published)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition"
                        title={property.is_published ? "Ocultar" : "Publicar"}
                      >
                        {property.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/editar/${property.id}`)}
                        className="p-2 text-gray-400 hover:text-secondary hover:bg-gray-100 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(property.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
