-- Crear tabla de precios
CREATE TABLE IF NOT EXISTS pricing (
  id SERIAL PRIMARY KEY,
  service_type VARCHAR(50) NOT NULL,
  option_key VARCHAR(50) NOT NULL,
  option_value VARCHAR(50) NOT NULL,
  price DECIMAL(10, 4) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(service_type, option_key, option_value)
);

-- Insertar precios iniciales para impresión
INSERT INTO pricing (service_type, option_key, option_value, price, description) VALUES
-- Precios por tipo de impresión
('printing', 'print_type', 'bw', 0.02, 'Precio por página en blanco y negro'),
('printing', 'print_type', 'color', 0.06, 'Precio por página a color'),

-- Descuentos por tipo de impresión
('printing', 'print_form', 'doubleSided', -0.005, 'Descuento por impresión a doble cara'),

-- Precios de acabados
('printing', 'finishing', 'none', 0.00, 'Sin acabado'),
('printing', 'finishing', 'stapled', 0.50, 'Grapado'),
('printing', 'finishing', 'twoHoles', 0.25, 'Dos taladros'),
('printing', 'finishing', 'fourHoles', 0.35, 'Cuatro taladros'),
('printing', 'finishing', 'laminated', 2.00, 'Plastificado'),
('printing', 'finishing', 'bound', 3.50, 'Encuadernado')

ON CONFLICT (service_type, option_key, option_value) 
DO UPDATE SET 
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_pricing_service_type ON pricing(service_type);
CREATE INDEX IF NOT EXISTS idx_pricing_option_key ON pricing(option_key);
CREATE INDEX IF NOT EXISTS idx_pricing_lookup ON pricing(service_type, option_key, option_value);

-- Verificar que los datos se insertaron correctamente
SELECT * FROM pricing ORDER BY service_type, option_key, option_value;
