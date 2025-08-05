-- Verificar si la tabla existe
DO $$
BEGIN
    -- Verificar si la columna description existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'pricing' 
        AND column_name = 'description'
    ) THEN
        -- Añadir la columna description si no existe
        ALTER TABLE pricing ADD COLUMN description TEXT;
        RAISE NOTICE 'Columna description añadida a la tabla pricing';
    ELSE
        RAISE NOTICE 'La columna description ya existe en la tabla pricing';
    END IF;
END $$;

-- Insertar o actualizar precios iniciales para impresión
INSERT INTO pricing (service_type, option_key, option_value, price, description) VALUES
-- Precios por tipo de impresión
('printing', 'print_type', 'bw', 0.02, 'Precio por página en blanco y negro'),
('printing', 'print_type', 'color', 0.06, 'Precio por página a color'),

-- Descuentos por tipo de impresión
('printing', 'print_form', 'doubleSided', -0.005, 'Descuento por impresión a doble cara'),
('printing', 'print_form', 'oneSided', 0.00, 'Sin descuento para impresión a una cara'),

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

-- Crear índices para mejorar el rendimiento si no existen
CREATE INDEX IF NOT EXISTS idx_pricing_service_type ON pricing(service_type);
CREATE INDEX IF NOT EXISTS idx_pricing_option_key ON pricing(option_key);
CREATE INDEX IF NOT EXISTS idx_pricing_lookup ON pricing(service_type, option_key, option_value);

-- Verificar que los datos se insertaron correctamente
SELECT * FROM pricing ORDER BY service_type, option_key, option_value;
