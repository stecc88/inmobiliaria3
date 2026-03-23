import React from 'react';
import { Home, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Home size={28} className="text-accent" />
              <span>Inmobiliaria</span>
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
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>+54 9 11 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>info@inmobiliaria.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Av. Libertador 1234, CABA</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-accent transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-accent transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-accent transition">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Inmobiliaria Profesional. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
