import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/layout/Layout';
import { 
  MapPin, BedDouble, Bath, Square, 
  Calendar, Share2, Phone, Mail, 
  ChevronLeft, ChevronRight, PlayCircle,
  Car, Trees, Waves, Sofa, CreditCard, Ruler,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProperty(data);
      setActiveImage(data.main_image_index || 0);
      fetchSimilar(data.type, data.id);
    } catch (error) {
      console.error('Error:', error.message);
      navigate('/catalogo');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilar = async (type, currentId) => {
    try {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('type', type)
        .neq('id', currentId)
        .limit(3);
      setSimilar(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          property_id: id,
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          message: inquiryForm.message
        }]);

      if (error) throw error;
      alert('Consulta enviada correctamente. Nos contactaremos a la brevedad.');
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      alert('Error al enviar consulta: ' + error.message);
    }
  };

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <p className="mt-6 text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Cargando detalles</p>
      </div>
    </Layout>
  );

  if (!property) return null;

  const whatsappMessage = encodeURIComponent(`Hola, estoy interesado en la propiedad: ${property.title} (${window.location.href})`);

  return (
    <Layout>
      <div className="bg-white min-h-screen pb-32">
        {/* Gallery Section */}
        <section className="relative h-[60vh] md:h-[85vh] bg-gray-950 overflow-hidden">
          <img 
            src={property.images?.[activeImage] || 'https://via.placeholder.com/1200x800'} 
            className="w-full h-full object-cover opacity-60 animate-fade-in"
            alt={property.title}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>

          <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">
            <button 
              onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : property.images.length - 1)}
              className="p-4 bg-white/10 backdrop-blur-xl text-white rounded-full hover:bg-white/20 transition-all shadow-2xl border border-white/10"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={() => setActiveImage(prev => prev < property.images.length - 1 ? prev + 1 : 0)}
              className="p-4 bg-white/10 backdrop-blur-xl text-white rounded-full hover:bg-white/20 transition-all shadow-2xl border border-white/10"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-full px-4 no-scrollbar">
            {property.images?.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${idx === activeImage ? 'border-primary scale-110 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-50">
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="bg-primary text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    {property.operation}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                    {property.type}
                  </span>
                  {property.status !== 'disponible' && (
                    <span className="bg-red-50 text-red-600 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <AlertCircle size={14} /> {property.status}
                    </span>
                  )}
                </div>
                
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">
                  {property.title}
                </h1>
                
                <div className="flex items-center gap-3 text-gray-400 mb-12">
                  <MapPin size={24} className="text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest">
                    {property.neighborhood ? `${property.neighborhood}, ` : ''}
                    {property.city}, {property.province}
                  </span>
                </div>

                {property.address && (
                  <p className="text-gray-500 font-bold text-sm mb-8 -mt-8 flex items-center gap-2">
                    <MapPin size={16} /> {property.address}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-gray-50">
                  <div className="flex flex-col items-center gap-3">
                    <BedDouble size={32} className="text-primary/60" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Dormitorios</span>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Bath size={32} className="text-primary/60" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Baños</span>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">{property.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Car size={32} className="text-primary/60" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Cocheras</span>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">{property.garage || 0}</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Square size={32} className="text-primary/60" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sup. Total</span>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">{property.area_total}m²</span>
                  </div>
                </div>

                <div className="mt-12 space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tighter">Detalles Adicionales</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Ruler className="text-primary" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Medidas Lote</p>
                        <p className="text-sm font-bold text-gray-900">
                          {property.lot_dimensions_text || 
                           (property.lot_front && property.lot_depth ? `${property.lot_front} x ${property.lot_depth}m` : 'No espec.')}
                        </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Calendar className="text-primary" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Antigüedad</p>
                          <p className="text-sm font-bold text-gray-900">{property.age ? `${property.age} años` : 'A estrenar'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Square className="text-primary" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Sup. Cubierta</p>
                          <p className="text-sm font-bold text-gray-900">{property.area_covered || '0'}m²</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { show: property.has_patio, label: 'Patio', icon: <Trees size={16} /> },
                      { show: property.has_pool, label: 'Pileta', icon: <Waves size={16} /> },
                      { show: property.is_furnished, label: 'Amoblado', icon: <Sofa size={16} /> },
                      { show: property.credit_ready, label: 'Apto Crédito', icon: <CreditCard size={16} /> },
                    ].filter(item => item.show).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-6 py-4 bg-primary/5 text-primary rounded-2xl border border-primary/10">
                        {item.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tighter">Descripción</h3>
                    <p className="text-gray-500 leading-relaxed whitespace-pre-line text-lg font-medium">
                      {property.description}
                    </p>
                  </div>

                  {property.services?.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tighter">Servicios</h3>
                      <div className="flex flex-wrap gap-3">
                        {property.services.map((service, idx) => (
                          <span key={idx} className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {property.video_url && (
                    <div className="pt-12 border-t border-gray-50">
                      <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 tracking-tighter">
                        <PlayCircle className="text-red-600" size={32} />
                        Video Tour
                      </h3>
                      <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-50">
                        <iframe 
                          className="w-full h-full"
                          src={property.video_url.replace('watch?v=', 'embed/')}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Properties */}
              {similar.length > 0 && (
                <div className="space-y-10">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Propiedades Similares</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {similar.map(prop => (
                      <Link key={prop.id} to={`/propiedad/${prop.id}`} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                        <div className="aspect-video overflow-hidden">
                          <img src={prop.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                        </div>
                        <div className="p-6">
                          <h4 className="font-black text-gray-900 line-clamp-1 tracking-tighter">{prop.title}</h4>
                          <p className="text-primary font-black mt-2">{prop.currency} {prop.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Contact Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="bg-gray-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Precio de {property.operation}</p>
                    <div className="text-5xl font-black mb-10 tracking-tighter">
                      <span className="text-2xl mr-1 text-primary">{property.currency}</span>
                      {property.price.toLocaleString()}
                    </div>

                    <div className="space-y-4">
                      <a 
                        href={`https://wa.me/5491112345678?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/20 transition-all active:scale-95"
                      >
                        <FaWhatsapp size={20} />
                        WhatsApp Directo
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-gray-50">
                  <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tighter">Consultar por esta propiedad</h3>
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Nombre completo"
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700"
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm({...inquiryForm, name: e.target.value})}
                    />
                    <input 
                      type="email" 
                      placeholder="Correo electrónico"
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700"
                      value={inquiryForm.email}
                      onChange={e => setInquiryForm({...inquiryForm, email: e.target.value})}
                    />
                    <input 
                      type="tel" 
                      placeholder="Teléfono"
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700"
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm({...inquiryForm, phone: e.target.value})}
                    />
                    <textarea 
                      placeholder="¿En qué podemos ayudarte?"
                      rows="4"
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-gray-700"
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm({...inquiryForm, message: e.target.value})}
                    ></textarea>
                    <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl shadow-gray-200">
                      Enviar Consulta
                    </button>
                  </form>
                </div>

                <button className="w-full bg-white border border-gray-100 text-gray-400 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm">
                  <Share2 size={18} />
                  Compartir propiedad
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
