import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, Save, Upload, X, Plus, 
  Home, MapPin, DollarSign, Ruler, Bed, Bath, Video,
  CheckCircle
} from 'lucide-react';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'casa',
    operation: 'venta',
    price: '',
    currency: 'USD',
    province: '',
    city: '',
    neighborhood: '',
    address: '',
    area_total: '',
    area_covered: '',
    lot_front: '',
    lot_depth: '',
    lot_dimensions_text: '',
    bedrooms: 0,
    bathrooms: 0,
    rooms: 0,
    garage: 0,
    age: '',
    has_patio: false,
    has_garden: false,
    has_pool: false,
    has_terrace: false,
    has_balcony: false,
    has_quincho: false,
    is_furnished: false,
    credit_ready: false,
    status: 'disponible',
    services: [],
    main_image_index: 0,
    video_url: '',
    is_published: true,
    is_featured: false,
    images: []
  });

  const availableServices = ['Agua', 'Luz', 'Gas', 'Cloacas', 'Internet', 'Seguridad', 'Cable', 'Teléfono'];

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (error) {
      alert('Error al cargar la propiedad');
      navigate('/admin');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      const newImages = [...formData.images];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      setFormData(prev => ({ ...prev, images: newImages }));
    } catch (error) {
      alert('Error al subir imágenes: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('properties')
          .update(formData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([formData]);
        if (error) throw error;
      }
      navigate('/admin');
    } catch (error) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Home className="text-primary" />
              Información Básica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Título de la publicación</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Hermosa Casa Quinta con Pileta"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Inmueble</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="terreno">Terreno</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Operación</label>
                <select 
                  name="operation"
                  value={formData.operation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                  <option value="alquiler">Alquilado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ambientes</label>
                <input 
                  type="number" 
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleInputChange}
                  placeholder="Ej: 3"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Antigüedad (años)</label>
                <input 
                  type="number" 
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Ej: 5"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Provincia</label>
                  <input 
                    type="text" 
                    name="province"
                    required
                    value={formData.province}
                    onChange={handleInputChange}
                    placeholder="Ej: Buenos Aires"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ej: CABA"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Barrio / Zona</label>
                  <input 
                    type="text" 
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Ej: Palermo"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Ej: Av. Santa Fe 1234"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea 
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe detalladamente las características del inmueble..."
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="text-primary" />
              Precio y Medidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Moneda</label>
                <select 
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
                <input 
                  type="number" 
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sup. Total (m²)</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    name="area_total"
                    value={formData.area_total}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sup. Cubierta (m²)</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    name="area_covered"
                    value={formData.area_covered}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Habitaciones</label>
                <div className="relative">
                  <Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Baños</label>
                <div className="relative">
                  <Bath className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Frente (m)</label>
                  <input 
                    type="number" 
                    name="lot_front"
                    value={formData.lot_front}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fondo (m)</label>
                  <input 
                    type="number" 
                    name="lot_depth"
                    value={formData.lot_depth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">O texto</label>
                  <input 
                    type="text" 
                    name="lot_dimensions_text"
                    value={formData.lot_dimensions_text}
                    onChange={handleInputChange}
                    placeholder="10x30"
                    className="w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cocheras</label>
                <div className="relative">
                  <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    name="garage"
                    value={formData.garage}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input 
                  type="checkbox" 
                  name="has_patio"
                  checked={formData.has_patio}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-tighter">Patio</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input 
                  type="checkbox" 
                  name="has_pool"
                  checked={formData.has_pool}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-tighter">Pileta</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input 
                  type="checkbox" 
                  name="has_garden"
                  checked={formData.has_garden}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-tighter">Jardín</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input 
                  type="checkbox" 
                  name="has_terrace"
                  checked={formData.has_terrace}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-tighter">Terraza</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input 
                  type="checkbox" 
                  name="has_balcony"
                  checked={formData.has_balcony}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-tighter">Balcón</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input 
                  type="checkbox" 
                  name="has_quincho"
                  checked={formData.has_quincho}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-tighter">Quincho</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input 
                  type="checkbox" 
                  name="is_furnished"
                  checked={formData.is_furnished}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-tighter">Amoblado</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input 
                  type="checkbox" 
                  name="credit_ready"
                  checked={formData.credit_ready}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-[10px] font-black uppercase text-gray-700 tracking-tighter">Apto Crédito</span>
              </label>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Servicios Disponibles</label>
              <div className="flex flex-wrap gap-2">
                {availableServices.map(service => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                      formData.services.includes(service)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="text-primary" />
              Multimedia
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center border-2 border-dashed border-gray-200 rounded-xl py-12 hover:border-primary transition cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-gray-400" size={32} />
                    <span className="text-gray-500">Haz clic para subir fotos</span>
                    <span className="text-xs text-gray-400">JPG, PNG (Máx 5MB)</span>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden" 
                    disabled={uploading}
                  />
                </label>
              </div>

              {uploading && (
                <p className="text-center text-primary font-semibold animate-pulse">Subiendo imágenes...</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className={`relative aspect-square rounded-xl overflow-hidden group border-4 transition ${formData.main_image_index === index ? 'border-primary' : 'border-transparent'}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, main_image_index: index})}
                        className={`p-2 rounded-full transition ${formData.main_image_index === index ? 'bg-primary text-white' : 'bg-white text-gray-900 hover:bg-primary hover:text-white'}`}
                        title="Usar como principal"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                        title="Eliminar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {formData.main_image_index === index && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase px-2 py-1 rounded-lg shadow-lg">
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL del Video (YouTube / Vimeo)</label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="url" 
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="w-6 h-6 rounded-lg border-gray-300 text-primary focus:ring-primary transition"
                />
                <span className="text-gray-700 font-black uppercase tracking-widest text-xs group-hover:text-primary">Publicar inmueble</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-6 h-6 rounded-lg border-gray-300 text-orange-500 focus:ring-orange-500 transition"
                />
                <span className="text-gray-700 font-black uppercase tracking-widest text-xs group-hover:text-orange-500">Marcar como Destacada</span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading || uploading}
              className="bg-primary hover:bg-blue-800 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-xl transition disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : (id ? 'Actualizar Propiedad' : 'Crear Propiedad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
