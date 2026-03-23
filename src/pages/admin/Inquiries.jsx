import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, Mail, Phone, Calendar, 
  Trash2, Eye, CheckCircle, Clock, ExternalLink
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inquiries')
        .select('*, properties(title, images)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ is_read: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setInquiries(inquiries.map(inq => 
        inq.id === id ? { ...inq, is_read: !currentStatus } : inq
      ));
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta consulta?')) return;
    
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInquiries(inquiries.filter(inq => inq.id !== id));
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition"
        >
          <ArrowLeft size={20} />
          Volver al Dashboard
        </button>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Consultas Recibidas</h1>
            <p className="text-gray-500 font-medium mt-1">Mensajes de clientes interesados</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Sin leer</span>
              <span className="text-sm font-black text-gray-900">{inquiries.filter(i => !i.is_read).length}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-400 font-black uppercase tracking-widest text-[10px]">Cargando consultas</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
            <Mail className="mx-auto text-gray-200 mb-6" size={64} />
            <p className="text-gray-400 font-bold">No hay consultas registradas aún.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((inquiry) => (
              <div 
                key={inquiry.id} 
                className={`bg-white rounded-[2.5rem] shadow-sm border-l-[12px] transition-all overflow-hidden ${inquiry.is_read ? 'border-gray-100 opacity-80' : 'border-primary shadow-xl scale-[1.01]'}`}
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Property Preview */}
                    <div className="lg:w-1/4">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        Propiedad consultada
                      </div>
                      {inquiry.properties ? (
                        <Link 
                          to={`/propiedad/${inquiry.property_id}`} 
                          target="_blank"
                          className="group block relative aspect-video rounded-2xl overflow-hidden"
                        >
                          <img 
                            src={inquiry.properties.images?.[0] || 'https://via.placeholder.com/300'} 
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                            alt="" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <ExternalLink className="text-white" size={24} />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white text-[10px] font-bold line-clamp-1">{inquiry.properties.title}</p>
                          </div>
                        </Link>
                      ) : (
                        <div className="bg-gray-50 rounded-2xl aspect-video flex items-center justify-center border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Propiedad eliminada</p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{inquiry.name}</h3>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Mail size={14} className="text-primary" />
                              <span className="text-xs font-bold">{inquiry.email}</span>
                            </div>
                            {inquiry.phone && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <Phone size={14} className="text-emerald-500" />
                                <span className="text-xs font-bold">{inquiry.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-xl h-fit self-start">
                          <Clock size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                          {inquiry.message}
                        </p>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button 
                          onClick={() => toggleRead(inquiry.id, inquiry.is_read)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition shadow-sm ${inquiry.is_read ? 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50' : 'bg-primary text-white shadow-primary/20 hover:bg-blue-700'}`}
                        >
                          {inquiry.is_read ? (
                            <>
                              <EyeOff size={16} /> Marcar como pendiente
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} /> Marcar como leída
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-white text-red-400 border border-red-50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition shadow-sm"
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquiries;
