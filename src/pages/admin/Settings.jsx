import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, Save, Globe, Phone, Mail, 
  MapPin, Image as ImageIcon
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    general_text_home: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (error) {
      console.error('Error fetching settings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { error } = await supabase
        .from('settings')
        .update(formData)
        .eq('id', 1);

      if (error) throw error;
      alert('Configuración actualizada correctamente');
    } catch (error) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition"
        >
          <ArrowLeft size={20} />
          Volver al Dashboard
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Ajustes Generales</h1>
              <p className="text-gray-500 font-medium">Configura la información de tu inmobiliaria</p>
            </div>
            <button 
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 space-y-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tighter flex items-center gap-3 mb-4">
                <Globe className="text-primary" /> Información Básica
              </h3>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nombre de la Inmobiliaria</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Logo URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Texto General Inicio</label>
                <textarea 
                  name="general_text_home"
                  rows="4"
                  value={formData.general_text_home}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                ></textarea>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 space-y-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tighter flex items-center gap-3 mb-4">
                <Phone className="text-primary" /> Contacto
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Teléfono</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">WhatsApp</label>
                  <input 
                    type="text" 
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Público</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Dirección Física</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 space-y-6 lg:col-span-2">
              <h3 className="text-xl font-black text-gray-900 tracking-tighter flex items-center gap-3 mb-4">
                <FaInstagram className="text-primary" /> Redes Sociales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Instagram URL</label>
                  <div className="relative">
                    <FaInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={20} />
                    <input 
                      type="text" 
                      name="instagram_url"
                      value={formData.instagram_url}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Facebook URL</label>
                  <div className="relative">
                    <FaFacebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
                    <input 
                      type="text" 
                      name="facebook_url"
                      value={formData.facebook_url}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Twitter URL</label>
                  <div className="relative">
                    <FaTwitter className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                    <input 
                      type="text" 
                      name="twitter_url"
                      value={formData.twitter_url}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
