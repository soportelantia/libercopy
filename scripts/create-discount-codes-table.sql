-- Crear tabla de códigos de descuento
CREATE TABLE IF NOT EXISTS discount_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar códigos de ejemplo
INSERT INTO discount_codes (code, percentage, start_date, end_date, max_uses) VALUES
('WELCOME10', 10.00, NOW(), NOW() + INTERVAL '1 year', 1000),
('STUDENT15', 15.00, NOW(), NOW() + INTERVAL '6 months', 500),
('SAVE20', 20.00, NOW(), NOW() + INTERVAL '3 months', 100)
ON CONFLICT (code) DO NOTHING;

-- Habilitar RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública de códigos activos
CREATE POLICY "Allow public read of active discount codes" ON discount_codes
  FOR SELECT USING (is_active = true AND NOW() BETWEEN start_date AND end_date);

-- Política para permitir acceso completo al service role
CREATE POLICY "Allow service role full access to discount codes" ON discount_codes
  FOR ALL USING (auth.role() = 'service_role');

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_discount_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON discount_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_discount_codes_updated_at();
