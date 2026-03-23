import React from 'react';
import { Home, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useSettings } from '../../hooks/useSettings';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <Home size={28} className="text-accent" />
              )}
              <span>{settings?.name || 'Inmobiliaria'}</span>
            </div>
            <p className="text-gray-400">
              Encontrá la casa de tus sueños con nosotros. Experiencia y profesionalismo en el mercado inmobiliario.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition">Inicio</a></li>
              <li><a href="/catalogo" className="text-gray-400 hover:text-white transition">Propiedades</a></li>
              <li><a href="/contacto" className="text-gray-400 hover:text-white transition">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-gray-400">
              {settings?.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={18} />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{settings.email}</span>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
            <div className="flex space-x-4">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-accent transition">
                  <FaFacebook size={20} />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-accent transition">
                  <FaInstagram size={20} />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-accent transition">
                  <FaTwitter size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {settings?.name || 'Inmobiliaria Profesional'}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
