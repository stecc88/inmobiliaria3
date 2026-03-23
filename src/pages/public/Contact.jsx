import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useSettings } from '../../hooks/useSettings';

const Contact = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensaje enviado. Nos pondremos en contacto pronto.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="bg-gray-900 py-24 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-6">Contactanos</h1>
            <p className="text-gray-400 text-xl font-medium max-w-2xl">Estamos para ayudarte a encontrar tu próximo hogar. Consultanos cualquier duda.</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Información de contacto</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {settings?.phone && (
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 group hover:bg-primary transition-all duration-500">
                      <Phone className="text-primary group-hover:text-white mb-6 transition" size={32} />
                      <p className="text-[10px] font-black text-gray-400 group-hover:text-white/60 uppercase tracking-widest mb-1">Llamanos</p>
                      <p className="text-lg font-black text-gray-900 group-hover:text-white transition">{settings.phone}</p>
                    </div>
                  )}
                  {settings?.email && (
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 group hover:bg-primary transition-all duration-500">
                      <Mail className="text-primary group-hover:text-white mb-6 transition" size={32} />
                      <p className="text-[10px] font-black text-gray-400 group-hover:text-white/60 uppercase tracking-widest mb-1">Escribinos</p>
                      <p className="text-lg font-black text-gray-900 group-hover:text-white transition">{settings.email}</p>
                    </div>
                  )}
                  {settings?.address && (
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 group hover:bg-primary transition-all duration-500 sm:col-span-2">
                      <MapPin className="text-primary group-hover:text-white mb-6 transition" size={32} />
                      <p className="text-[10px] font-black text-gray-400 group-hover:text-white/60 uppercase tracking-widest mb-1">Visitanos</p>
                      <p className="text-lg font-black text-gray-900 group-hover:text-white transition">{settings.address}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Horarios de atención</h2>
                <div className="flex items-center gap-6 p-8 bg-gray-900 text-white rounded-[2.5rem] shadow-2xl">
                  <Clock className="text-primary" size={40} />
                  <div>
                    <p className="text-lg font-bold">Lunes a Viernes: 09:00 - 18:00</p>
                    <p className="text-gray-400 font-medium italic">Sábados: 09:00 - 13:00</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Nuestras redes</h3>
                <div className="flex gap-4">
                  {settings?.instagram_url && (
                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 hover:bg-primary hover:text-white transition shadow-sm">
                      <FaInstagram size={24} />
                    </a>
                  )}
                  {settings?.facebook_url && (
                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 hover:bg-primary hover:text-white transition shadow-sm">
                      <FaFacebook size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-50">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-10">Envianos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nombre completo</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-primary/10 font-bold text-gray-700 transition"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Teléfono</label>
                    <input 
                      type="tel" 
                      className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-primary/10 font-bold text-gray-700 transition"
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Correo electrónico</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-primary/10 font-bold text-gray-700 transition"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Tu mensaje</label>
                  <textarea 
                    rows="6"
                    required
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-primary/10 font-bold text-gray-700 transition"
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-xl shadow-gray-200 active:scale-95">
                  <Send size={18} />
                  Enviar mensaje ahora
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <section className="h-[500px] bg-gray-100 grayscale hover:grayscale-0 transition-all duration-1000">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016713276846!2d-58.38375908477038!3d-34.603738880459406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x110a749f99341!2sObelisco!5e0!3m2!1ses-419!2sar!4v1625123456789!5m2!1ses-419!2sar" 
            className="w-full h-full border-none"
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
