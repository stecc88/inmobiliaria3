-- Tabla de Propiedades
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('casa', 'departamento', 'terreno')) NOT NULL,
  operation TEXT CHECK (operation IN ('alquiler', 'venta')) NOT NULL,
  type TEXT CHECK (type IN ('casa', 'departamento', 'terreno')) NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  location TEXT, -- Campo combinado para búsqueda rápida
  area_total NUMERIC,
  area_covered NUMERIC,
  lot_front NUMERIC,
  lot_depth NUMERIC,
  lot_dimensions_text TEXT,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  rooms INTEGER DEFAULT 0,
  garage INTEGER DEFAULT 0,
  age INTEGER,
  has_patio BOOLEAN DEFAULT false,
  has_garden BOOLEAN DEFAULT false,
  has_pool BOOLEAN DEFAULT false,
  has_terrace BOOLEAN DEFAULT false,
  has_balcony BOOLEAN DEFAULT false,
  has_quincho BOOLEAN DEFAULT false,
  is_furnished BOOLEAN DEFAULT false,
  credit_ready BOOLEAN DEFAULT false,
  services TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('disponible', 'reservado', 'vendido', 'alquilado')) DEFAULT 'disponible',
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  main_image_index INTEGER DEFAULT 0,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Consultas
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Configuración de la Inmobiliaria
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'Inmobiliaria Profesional',
  logo_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  general_text_home TEXT,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insertar configuración inicial
INSERT INTO settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Políticas de Seguridad (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Consultas: Solo el admin puede verlas, pero cualquiera puede crearlas
CREATE POLICY "Permitir inserción pública de consultas" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Solo admins ven consultas" ON inquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Solo admins actualizan consultas" ON inquiries FOR UPDATE TO authenticated USING (true);

-- Configuración: Lectura pública, escritura admin
CREATE POLICY "Lectura pública de settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Escritura admin de settings" ON settings FOR ALL TO authenticated USING (true);

-- Lectura pública para todos
CREATE POLICY "Permitir lectura pública" ON properties
  FOR SELECT USING (true);

-- Escritura solo para usuarios autenticados (administrador)
CREATE POLICY "Permitir todo a admins" ON properties
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Configuración de Storage
-- Debes crear un bucket llamado 'property-images' en Supabase Storage
-- y configurar políticas similares para que sea público en lectura
-- y privado en escritura.
